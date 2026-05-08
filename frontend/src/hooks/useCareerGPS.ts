import type { CareerGPSData } from "../services/careerGps.service";

export function useCareerGPS(_options?: { studentId: string | null; targetRoleId: string | null }) {
  return {
    data: null as CareerGPSData | null,
    loading: false,
    error: null as string | null,
    save: async () => undefined
  };
}
