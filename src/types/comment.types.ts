export interface Comment {
  id: string
  ticketId: string
  author: { id: string; username: string }
  content: string
  createdAt: string
}

export interface CreateCommentPayload {
  content: string
}
