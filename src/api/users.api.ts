import { apiClient } from './client'
import type { User, CreateUserPayload, UpdateUserPayload, PaginatedResponse } from '@/types'

export const usersApi = {
  getAll: async (): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/users')
    return data
  },
  getActive: async (): Promise<User[]> => {
    const { data } = await apiClient.get<User[]>('/users/active')
    return data
  },
  create: async (payload: CreateUserPayload): Promise<User> => {
    const { data } = await apiClient.post<User>('/users', payload)
    return data
  },
  update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
    const { data } = await apiClient.patch<User>(`/users/${id}`, payload)
    return data
  },
}
