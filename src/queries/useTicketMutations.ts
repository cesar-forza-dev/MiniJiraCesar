import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ticketsApi } from '@/api/tickets.api'
import { ticketKeys } from './useTicketsQuery'
import type { CreateTicketPayload, UpdateTicketPayload } from '@/types'

export function useCreateTicket() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => ticketsApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ticketKeys.lists() }),
  })
}

export function useUpdateTicket(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateTicketPayload) => ticketsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) })
      qc.invalidateQueries({ queryKey: ticketKeys.lists() })
    },
  })
}

export function useArchiveTicket(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (version: number) => ticketsApi.archive(id, version),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) })
      qc.invalidateQueries({ queryKey: ticketKeys.lists() })
    },
  })
}

export function useRestoreTicket(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (version: number) => ticketsApi.restore(id, version),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) })
      qc.invalidateQueries({ queryKey: ticketKeys.lists() })
    },
  })
}
