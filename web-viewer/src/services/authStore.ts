import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  login: (email: string, name: string, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      login: (email, name, token) =>
        set({
          isAuthenticated: true,
          user: { email, name },
          accessToken: token,
        }),
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
