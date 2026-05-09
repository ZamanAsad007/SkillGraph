import { create } from "zustand";

type AuthState = {
  userId?: string;
  githubHandle?: string;
  email?: string;
  emailVerified?: boolean;
  githubConnected?: boolean;
  googleConnected?: boolean;
  fullName?: string;
  publicHandle?: string;
  avatarUrl?: string;
  academicProfile?: {
    universityId?: string | null;
    universityName?: string | null;
    departmentId?: string | null;
    departmentName?: string | null;
    graduationYear?: number | null;
  } | null;
  setUserId: (userId: string) => void;
  clearUser: () => void;
  setUser: (user: {
    id: string;
    githubHandle?: string;
    email?: string;
    emailVerified?: boolean;
    githubConnected?: boolean;
    googleConnected?: boolean;
    fullName: string;
    publicHandle?: string;
    avatarUrl?: string;
    academicProfile?: {
      universityId?: string | null;
      universityName?: string | null;
      departmentId?: string | null;
      departmentName?: string | null;
      graduationYear?: number | null;
    } | null;
  }) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  setUserId: (userId) => set({ userId }),
  setUser: (user) => set({
    userId: user.id,
    githubHandle: user.githubHandle,
    email: user.email,
    emailVerified: user.emailVerified,
    githubConnected: user.githubConnected,
    googleConnected: user.googleConnected,
    fullName: user.fullName,
    publicHandle: user.publicHandle,
    avatarUrl: user.avatarUrl,
    academicProfile: user.academicProfile,
  }),
  clearUser: () => set({
    userId: undefined,
    githubHandle: undefined,
    email: undefined,
    emailVerified: undefined,
    githubConnected: undefined,
    googleConnected: undefined,
    fullName: undefined,
    publicHandle: undefined,
    avatarUrl: undefined,
    academicProfile: undefined,
  }),
}));
