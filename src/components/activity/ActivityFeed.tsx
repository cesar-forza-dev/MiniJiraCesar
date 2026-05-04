import { CommentSection } from '@/components/comments/CommentSection'

interface ActivityFeedProps {
  ticketId: string
  archived?: boolean
}

export function ActivityFeed({ ticketId, archived }: ActivityFeedProps) {
  return (
    <div className="border-t pt-4 mt-4">
      <CommentSection ticketId={ticketId} archived={archived} />
    </div>
  )
}
