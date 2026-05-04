import { Badge } from '@/components/ui/badge'
import { STATUS_COLORS } from '@/lib/constants'
import type { TicketStatus } from '@/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: TicketStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        'border-transparent font-medium text-xs',
        STATUS_COLORS[status],
        className
      )}
      aria-label={`Estado: ${status}`}
    >
      {status}
    </Badge>
  )
}
