import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users.api'
import type { CreateUserPayload, UpdateUserPayload } from '@/types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  active: () => [...userKeys.all, 'active'] as const,
}

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => usersApi.getAll(),
  })
}

export function useActiveUsersQuery() {
  return useQuery({
    queryKey: userKeys.active(),
    queryFn: () => usersApi.getActive(),
    staleTime: 60_000,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.lists() }),
  })
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}
