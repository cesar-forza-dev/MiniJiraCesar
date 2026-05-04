import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '@/api/tickets.api'
import type { TicketFilters } from '@/types'

export const ticketKeys = {
  all: ['tickets'] as const,
  lists: () => [...ticketKeys.all, 'list'] as const,
  list: (filters: TicketFilters) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, 'detail'] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  comments: (id: string) => [...ticketKeys.detail(id), 'comments'] as const,
}

export function useTicketsQuery(filters: TicketFilters) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => ticketsApi.getAll(filters),
  })
}
