import { api } from "./api";

export async function getStudentSkills(studentId: string) {
  const response = await api.get(`/graph/student/${studentId}/skills`);
  return response.data.data;
}
