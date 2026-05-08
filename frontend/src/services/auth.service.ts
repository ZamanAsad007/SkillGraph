import { api } from "./api";

export type EmailLoginInput = {
  email: string;
  password: string;
};

export type EmailRegistrationInput = {
  fullName: string;
  email: string;
  password: string;
};

export async function getCurrentUser() {
  const response = await api.get("/auth/me");
  return response.data.data;
}

export async function loginWithEmail(input: EmailLoginInput) {
  const response = await api.post("/auth/login", input);
  return response.data.data;
}

export async function registerWithEmail(input: EmailRegistrationInput) {
  const response = await api.post("/auth/register", input);
  return response.data.data as {
    id: string;
    email: string;
    emailVerificationRequired: boolean;
    verificationToken?: string;
  };
}

export async function verifyEmail(token: string) {
  const response = await api.post("/auth/verify-email", { token });
  return response.data.data;
}

export async function logout() {
  const response = await api.post("/auth/logout");
  return response.data.data;
}
