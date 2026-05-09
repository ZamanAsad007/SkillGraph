import { useCallback, useEffect, useState } from "react";
import { getPublicGalaxy, getStudentGalaxy, type GalaxyData, type GalaxyNode } from "../services/graph.service";

export function useGalaxy(options?: { studentId?: string; handle?: string }) {
  const [data, setData] = useState<GalaxyData>({ nodes: [], links: [] });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const studentId = options?.studentId;
    const handle = options?.handle;

    if (!studentId && !handle) {
      setData({ nodes: [], links: [] });
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const galaxy = handle ? await getPublicGalaxy(handle) : await getStudentGalaxy(studentId!);
      setData({
        nodes: galaxy.nodes ?? [],
        links: galaxy.links ?? []
      });
    } catch (fetchError) {
      setData({ nodes: [], links: [] });
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load skill galaxy");
    } finally {
      setLoading(false);
    }
  }, [options?.handle, options?.studentId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { nodes: data.nodes as GalaxyNode[], links: data.links, error, loading, refresh };
}
