import { z } from 'zod'

export const commentSchema = z.object({
  content: z.string().min(1, 'El comentario no puede estar vacío'),
})

export type CommentFormValues = z.infer<typeof commentSchema>
