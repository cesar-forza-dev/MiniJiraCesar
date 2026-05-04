import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Comment } from '@/types'

interface CommentItemProps {
  comment: Comment
}

function renderWithMentions(content: string) {
  const parts = content.split(/(@\w+)/g)
  return parts.map((part, i) =>
    /^@\w+/.test(part)
      ? <span key={i} className="text-primary font-medium">{part}</span>
      : <span key={i}>{part}</span>
  )
}

export function CommentItem({ comment }: CommentItemProps) {
  const date = new Date(comment.createdAt).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
  return (
    <div className="flex gap-3">
      <Avatar className="h-7 w-7 shrink-0 mt-0.5">
        <AvatarFallback className="text-xs">
          {comment.author.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">{comment.author.username}</span>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-foreground mt-0.5 whitespace-pre-wrap break-words leading-relaxed">
          {renderWithMentions(comment.content)}
        </p>
      </div>
    </div>
  )
}
