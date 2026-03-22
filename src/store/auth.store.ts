import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  userId: string
  email: string
  firstName?: string
}

interface AuthState {
  sessionToken: string | null
  user: AuthUser | null
  setSession: (token: string, user: AuthUser) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      sessionToken: null,
      user: null,
      setSession: (token, user) => set({ sessionToken: token, user }),
      clearSession: () => set({ sessionToken: null, user: null }),
    }),
    {
      name: 'hu-session',
      partialize: (s) => ({ sessionToken: s.sessionToken }),
    },
  ),
)
