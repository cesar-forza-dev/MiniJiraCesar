import { create } from 'zustand'
import { LOCAL_STORAGE_TOKEN_KEY } from '@/lib/constants'
import type { AuthUser } from '@/types'

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (token: string, user: AuthUser) => void
  logout: () => void
  initFromStorage: () => void
}

function decodeJwt(token: string): AuthUser | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)) as AuthUser
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: (token, user) => {
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token)
    set({ token, user, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
    set({ token: null, user: null, isAuthenticated: false })
  },

  initFromStorage: () => {
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)
    if (!token) return
    const user = decodeJwt(token)
    if (!user) return
    if (user.exp * 1000 < Date.now()) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY)
      return
    }
    set({ token, user, isAuthenticated: true })
  },
}))
