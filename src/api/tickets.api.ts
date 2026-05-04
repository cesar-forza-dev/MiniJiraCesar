import { apiClient } from './client'
import type {
  Ticket,
  TicketSummary,
  TicketFilters,
  CreateTicketPayload,
  UpdateTicketPayload,
  PaginatedResponse,
} from '@/types'

export const ticketsApi = {
  getAll: async (filters: TicketFilters): Promise<PaginatedResponse<TicketSummary>> => {
    const { data } = await apiClient.get<PaginatedResponse<TicketSummary>>('/tickets', {
      params: filters,
    })
    return data
  },
  getById: async (id: string): Promise<Ticket> => {
    const { data } = await apiClient.get<Ticket>(`/tickets/${id}`)
    return data
  },
  create: async (payload: CreateTicketPayload): Promise<Ticket> => {
    const { data } = await apiClient.post<Ticket>('/tickets', payload)
    return data
  },
  update: async (id: string, payload: UpdateTicketPayload): Promise<Ticket> => {
    const { data } = await apiClient.patch<Ticket>(`/tickets/${id}`, payload)
    return data
  },
  archive: async (id: string, version: number): Promise<Ticket> => {
    const { data } = await apiClient.post<Ticket>(`/tickets/${id}/archive`, { version })
    return data
  },
  restore: async (id: string, version: number): Promise<Ticket> => {
    const { data } = await apiClient.post<Ticket>(`/tickets/${id}/restore`, { version })
    return data
  },
}
