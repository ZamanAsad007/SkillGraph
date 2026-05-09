import { useCallback, useEffect, useState } from "react";
import { getCareerGPS, saveCareerGPS, type CareerGPSData } from "../services/careerGps.service";

export function useCareerGPS(options?: { studentId: string | null; targetRoleId: string | null }) {
  const [data, setData] = useState<CareerGPSData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const studentId = options?.studentId;
    const targetRoleId = options?.targetRoleId;

    if (!studentId || !targetRoleId) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setData(await getCareerGPS(studentId, targetRoleId));
    } catch (fetchError) {
      setData(null);
      setError(fetchError instanceof Error ? fetchError.message : "Failed to generate Career GPS");
    } finally {
      setLoading(false);
    }
  }, [options?.studentId, options?.targetRoleId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const save = useCallback(async () => {
    if (!data) return;

    await saveCareerGPS({
      studentId: data.studentId,
      targetRoleId: data.targetRole.id,
      completionPercentage: data.completionPercentage,
      estimatedWeeks: data.estimatedWeeks,
      missingSkills: data.missingSkills,
      roadmap: data.roadmap
    });
  }, [data]);

  return { data, loading, error, refresh, save };
}
