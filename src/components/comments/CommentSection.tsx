import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CommentItem } from './CommentItem'
import { MentionInput } from './MentionInput'
import { commentSchema, type CommentFormValues } from '@/schemas/comment.schema'
import { useCommentsQuery, useCreateComment } from '@/queries'
import { SendHorizonal } from 'lucide-react'

interface CommentSectionProps {
  ticketId: string
  archived?: boolean
}

export function CommentSection({ ticketId, archived = false }: CommentSectionProps) {
  const { data, isLoading } = useCommentsQuery(ticketId)
  const createComment = useCreateComment(ticketId)

  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: '' },
  })

  const onSubmit = async (values: CommentFormValues) => {
    try {
      await createComment.mutateAsync(values)
      reset()
    } catch {
      toast.error('Error al publicar el comentario')
    }
  }

  const comments = data?.data ?? []

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-foreground">
        Comentarios{' '}
        {comments.length > 0 && (
          <span className="text-muted-foreground font-normal">({comments.length})</span>
        )}
      </h3>

      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-muted animate-pulse" />
            ))
          : comments.length === 0
            ? <p className="text-sm text-muted-foreground">Sin comentarios aún. ¡Sé el primero!</p>
            : comments.map((c) => <CommentItem key={c.id} comment={c} />)}
      </div>

      {archived ? (
        <p className="text-xs text-muted-foreground border rounded-md px-3 py-2 bg-muted">
          Este ticket está archivado. No se pueden agregar nuevos comentarios.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <Controller
            control={control}
            name="content"
            render={({ field }) => (
              <MentionInput
                value={field.value}
                onChange={field.onChange}
                error={!!errors.content}
              />
            )}
          />
          {errors.content && (
            <p className="text-xs text-destructive">{errors.content.message}</p>
          )}
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={isSubmitting}>
              <SendHorizonal className="mr-2 h-3.5 w-3.5" />
              {isSubmitting ? 'Publicando...' : 'Comentar'}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
