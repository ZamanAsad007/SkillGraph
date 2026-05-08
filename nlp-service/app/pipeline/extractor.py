"""
NLP extraction pipeline orchestrator.

Steps:
  1. Text normalization  (normalizer.py)
  2. spaCy tokenization + POS tagging  (en_core_web_sm)
  3. Dependency parsing filter  (NOUN/PROPN + dobj/pobj/nsubj/compound)
  4. EntityRuler gazetteer matching  (gazetteer.py)
  5. Confidence scoring + deduplication
"""

from collections import defaultdict
from typing import Optional

try:
    import spacy
    from spacy.language import Language as SpacyLanguage
    from spacy.pipeline import EntityRuler
    _SPACY_AVAILABLE = True
except ImportError:
    spacy = None  # type: ignore[assignment]
    SpacyLanguage = None  # type: ignore[assignment]
    EntityRuler = None  # type: ignore[assignment]
    _SPACY_AVAILABLE = False

from app.pipeline.gazetteer import all_skill_aliases, load_terms
from app.pipeline.normalizer import normalize_repository_text

# ---------------------------------------------------------------------------
# Step 2: Load spaCy model at module import time (not per-request).
# Step 4: Inject EntityRuler with gazetteer patterns before NER.
# ---------------------------------------------------------------------------

_NLP_MODEL: Optional[object] = None  # will be SpacyLanguage when loaded
_NLP_LOAD_ERROR: Optional[str] = None

if _SPACY_AVAILABLE:
    try:
        _NLP_MODEL = spacy.load("en_core_web_sm")

        # Step 4: Inject EntityRuler with gazetteer patterns
        # Create patterns for exact and case-insensitive matching
        gazetteer_data = load_terms()
        patterns = []

        for skill in gazetteer_data["skills"]:
            skill_name = skill["name"]
            # Exact match pattern (case-sensitive)
            patterns.append({"label": "TECH_SKILL", "pattern": skill_name})
            # Case-insensitive pattern
            patterns.append({"label": "TECH_SKILL", "pattern": skill_name.lower()})

            # Add alias patterns
            for alias in skill.get("aliases", []):
                patterns.append({"label": "TECH_SKILL", "pattern": alias})
                patterns.append({"label": "TECH_SKILL", "pattern": alias.lower()})

        # Add EntityRuler before NER in the pipeline
        if "entity_ruler" not in _NLP_MODEL.pipe_names:
            ruler = _NLP_MODEL.add_pipe("entity_ruler", before="ner")
            ruler.add_patterns(patterns)

    except OSError as exc:
        _NLP_LOAD_ERROR = (
            f"spaCy model 'en_core_web_sm' is not installed. "
            f"Run: python -m spacy download en_core_web_sm  ({exc})"
        )
else:
    _NLP_LOAD_ERROR = (
        "spaCy is not installed. Install it with: pip install spacy"
    )


def get_nlp_model() -> object:
    """
    Return the loaded spaCy model.

    Raises:
        RuntimeError: if the model could not be loaded, with a descriptive message
                      suitable for returning as HTTP 503.
    """
    if _NLP_MODEL is None:
        raise RuntimeError(_NLP_LOAD_ERROR or "spaCy model unavailable.")
    return _NLP_MODEL


# ---------------------------------------------------------------------------
# Step 3: Dependency parsing filter
# ---------------------------------------------------------------------------

# POS tags that qualify a token as a skill candidate
_CANDIDATE_POS = {"NOUN", "PROPN"}

# Dependency relations that qualify a token as a skill candidate
_CANDIDATE_DEPS = {"dobj", "pobj", "nsubj", "compound"}


def filter_candidates(doc) -> list[str]:
    """
    Step 3: Keep only tokens whose POS tag is NOUN or PROPN AND whose
    dependency relation is one of {dobj, pobj, nsubj, compound}.

    Args:
        doc: A spaCy Doc object produced by the loaded model.

    Returns:
        A list of candidate token strings (lowercased).
    """
    return [
        token.text.lower()
        for token in doc
        if token.pos_ in _CANDIDATE_POS and token.dep_ in _CANDIDATE_DEPS
    ]


# ---------------------------------------------------------------------------
# Full pipeline: extract_skills
# ---------------------------------------------------------------------------

def extract_skills(student_id: str, repositories: list[dict]) -> dict:
    """
    Run the full 5-step NLP extraction pipeline over a list of repositories.

    Steps 1–3 are implemented here; Steps 4–5 use the gazetteer alias lookup
    and confidence scoring.

    Args:
        student_id: The student's UUID string.
        repositories: List of repository dicts with keys:
                      name, description, readme, commits.

    Returns:
        Dict with keys:
          - student_id: str
          - extracted_skills: list of {skill_name, confidence, source_repos}
    """
    nlp = get_nlp_model()

    aliases = all_skill_aliases()
    mentions: dict[str, int] = defaultdict(int)
    source_repos: dict[str, set[str]] = defaultdict(set)
    entity_hits: dict[str, int] = defaultdict(int)

    for repository in repositories:
        repo_name = repository.get("name", "unknown")

        # ------------------------------------------------------------------
        # Step 1: Text normalization
        # ------------------------------------------------------------------
        normalized_text, _code_blocks = normalize_repository_text(repository)

        # Truncate to 100 000 chars to avoid excessive memory usage
        truncated = normalized_text[:100_000]

        # ------------------------------------------------------------------
        # Step 2: Tokenization + POS tagging
        # ------------------------------------------------------------------
        doc = nlp(truncated)  # type: ignore[operator]

        # ------------------------------------------------------------------
        # Step 3: Dependency parsing filter
        # ------------------------------------------------------------------
        candidate_tokens = set(filter_candidates(doc))

        # Full lowercased text for substring matching (Steps 4–5)
        full_text = truncated.lower()

        # Named entities from spaCy (used as additional signal)
        entities = {ent.text.lower() for ent in doc.ents}

        # ------------------------------------------------------------------
        # Steps 4–5: Gazetteer matching + confidence scoring
        # ------------------------------------------------------------------
        for skill_name, skill_aliases in aliases.items():
            # Primary match: alias appears in the dependency-filtered candidates
            # or anywhere in the full text (for broad coverage)
            alias_in_text = any(alias in full_text for alias in skill_aliases)
            alias_in_candidates = bool(candidate_tokens.intersection(skill_aliases))

            if alias_in_text or alias_in_candidates:
                count = sum(full_text.count(alias) for alias in skill_aliases)
                mentions[skill_name] += count
                source_repos[skill_name].add(repo_name)

            # Entity hit: spaCy NER recognised the skill name
            if entities.intersection(skill_aliases):
                entity_hits[skill_name] += 1
                source_repos[skill_name].add(repo_name)

    # Build output — deduplicated by skill_name (one entry per skill)
    extracted_skills = []
    seen_skills = set()  # Track seen skill names for deduplication

    for skill_name, count in mentions.items():
        # Deduplication: skip if we've already added this skill
        if skill_name in seen_skills:
            continue
        seen_skills.add(skill_name)

        repo_spread = len(source_repos[skill_name])
        # Step 5: Confidence formula: min(1.0, 0.5 + 0.05×occurrences + 0.1×repoCount)
        confidence = min(1.0, 0.5 + (0.05 * count) + (0.1 * repo_spread))
        extracted_skills.append(
            {
                "skill_name": skill_name,
                "confidence": round(confidence, 2),
                "source_repos": sorted(source_repos[skill_name]),
            }
        )

    return {"student_id": student_id, "extracted_skills": extracted_skills}
