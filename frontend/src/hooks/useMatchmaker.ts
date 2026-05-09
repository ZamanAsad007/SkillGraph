import { useCallback, useState } from "react";
import {
  findMatchmakerCandidates,
  sendMatchInvite,
  type MatchScope,
  type MatchmakerCandidate,
  type MatchmakerResult
} from "../services/matchmaker.service";

export function useMatchmaker() {
  const [candidates, setCandidates] = useState<MatchmakerCandidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findCandidates = useCallback(async (params: { requiredSkills: string[]; scope: MatchScope }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await findMatchmakerCandidates(params);
      setCandidates(result.candidates ?? []);
      return result;
    } catch (fetchError) {
      setCandidates([]);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to find candidates");
      return {
        scope: params.scope,
        requiredSkills: params.requiredSkills,
        candidates: []
      } satisfies MatchmakerResult;
    } finally {
      setLoading(false);
    }
  }, []);

  const invite = useCallback(async (params: {
    candidateId: string;
    projectName: string;
    requiredSkills: string[];
    message?: string;
  }) => {
    setError(null);

    try {
      await sendMatchInvite(params);
    } catch (inviteError) {
      const message = inviteError instanceof Error ? inviteError.message : "Failed to send invitation";
      setError(message);
      throw new Error(message);
    }
  }, []);

  return { candidates, loading, error, findCandidates, invite };
}
