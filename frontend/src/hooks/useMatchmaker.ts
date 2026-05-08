import { useState } from "react";
import type { MatchScope, MatchmakerCandidate, MatchmakerResult } from "../services/matchmaker.service";

export function useMatchmaker() {
  const [candidates, setCandidates] = useState<MatchmakerCandidate[]>([]);

  const findCandidates = async (_params: { requiredSkills: string[]; scope: MatchScope }) => {
    setCandidates([] as MatchmakerCandidate[]);
    return { scope: _params.scope, requiredSkills: _params.requiredSkills, candidates: [] as MatchmakerCandidate[] } satisfies MatchmakerResult;
  };

  const invite = async (_params: { candidateId: string; projectName: string; requiredSkills: string[]; message?: string }) => undefined;

  return { candidates, loading: false, error: null as string | null, findCandidates, invite };
}
