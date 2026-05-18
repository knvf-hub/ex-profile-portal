import { create } from 'zustand';
import { me } from '../api/auth.api';
import type { User } from '../types/auth.type';

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;

  setUser: (user: User | null) => void;
  hydrateAuth: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isAuthReady: true,
    }),

  hydrateAuth: async () => {
    try {
      const response = await me();
      set({
        user: response.data.user,
        isAuthenticated: true,
        isAuthReady: true,
      });
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isAuthReady: true,
      });
    }
  },

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      isAuthReady: true,
    }),
}));
