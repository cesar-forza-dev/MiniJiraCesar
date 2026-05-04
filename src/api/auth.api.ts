import { apiClient } from './client'
import type { LoginPayload, LoginResponse } from '@/types'
import { mockLogin } from '@/mocks/mockAuth'

const IS_MOCK = import.meta.env.VITE_MOCK_AUTH === 'true'

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    if (IS_MOCK) return mockLogin(payload.email, payload.password)
    const { data } = await apiClient.post<LoginResponse>('/auth/login', payload)
    return data
  },
  logout: async (): Promise<void> => {
    if (IS_MOCK) return
    await apiClient.post('/auth/logout')
  },
}
