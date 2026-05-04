import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentsApi } from '@/api/comments.api'
import { ticketKeys } from './useTicketsQuery'
import type { CreateCommentPayload } from '@/types'

export function useCommentsQuery(ticketId: string, enabled = true) {
  return useQuery({
    queryKey: ticketKeys.comments(ticketId),
    queryFn: () => commentsApi.getByTicket(ticketId),
    enabled: enabled && !!ticketId,
  })
}

export function useCreateComment(ticketId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentsApi.create(ticketId, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ticketKeys.comments(ticketId) }),
  })
}
