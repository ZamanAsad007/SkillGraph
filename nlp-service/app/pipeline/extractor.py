from collections import defaultdict

from app.pipeline.gazetteer import all_skill_aliases
from app.pipeline.normalizer import normalize_repository_text


def extract_skills(student_id: str, repositories: list[dict]) -> dict:
    aliases = all_skill_aliases()
    mentions: dict[str, int] = defaultdict(int)
    source_repos: dict[str, set[str]] = defaultdict(set)

    for repository in repositories:
        repo_name = repository.get("name", "unknown")
        text = normalize_repository_text(repository).lower()

        for skill_name, candidates in aliases.items():
            if any(candidate in text for candidate in candidates):
                mentions[skill_name] += sum(text.count(candidate) for candidate in candidates)
                source_repos[skill_name].add(repo_name)

    extracted_skills = []
    for skill_name, count in mentions.items():
        repo_spread = len(source_repos[skill_name])
        confidence = min(0.99, 0.5 + (0.05 * count) + (0.1 * repo_spread))
        extracted_skills.append(
            {
                "skill_name": skill_name,
                "confidence": round(confidence, 2),
                "source_repos": sorted(source_repos[skill_name]),
            }
        )

    return {"student_id": student_id, "extracted_skills": extracted_skills}
