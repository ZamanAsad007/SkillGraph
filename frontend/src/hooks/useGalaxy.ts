import type { GalaxyData, GalaxyNode } from "../services/graph.service";

export function useGalaxy(_options?: { studentId?: string; handle?: string }) {
  const nodes: GalaxyNode[] = [];
  const links: GalaxyData["links"] = [];

  return { nodes, links, error: null as string | null, refresh: async () => undefined };
}
