import { create } from "zustand";

type AuthState = {
  userId?: string;
  fullName?: string;
  avatarUrl?: string | null;
  publicHandle?: string;
  setUserId: (userId: string) => void;
  setUser: (user: { id?: string; fullName?: string; avatarUrl?: string | null; publicHandle?: string }) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  setUserId: (userId) => set({ userId }),
  setUser: (user) => set({
    userId: user.id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl ?? null,
    publicHandle: user.publicHandle
  }),
  clearUser: () => set({ userId: undefined, fullName: undefined, avatarUrl: undefined, publicHandle: undefined })
}));
