import { apiClient } from './client'
import type { Comment, CreateCommentPayload, PaginatedResponse } from '@/types'

export const commentsApi = {
  getByTicket: async (
    ticketId: string,
    page = 1,
    pageSize = 50
  ): Promise<PaginatedResponse<Comment>> => {
    const { data } = await apiClient.get<PaginatedResponse<Comment>>(
      `/tickets/${ticketId}/comments`,
      { params: { page, pageSize } }
    )
    return data
  },
  create: async (ticketId: string, payload: CreateCommentPayload): Promise<Comment> => {
    const { data } = await apiClient.post<Comment>(
      `/tickets/${ticketId}/comments`,
      payload
    )
    return data
  },
}
