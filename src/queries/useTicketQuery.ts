import { useQuery } from '@tanstack/react-query'
import { ticketsApi } from '@/api/tickets.api'
import { ticketKeys } from './useTicketsQuery'

export function useTicketQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketsApi.getById(id),
    enabled: enabled && !!id,
  })
}
