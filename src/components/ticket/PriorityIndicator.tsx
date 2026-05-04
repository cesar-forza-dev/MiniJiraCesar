import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react'
import { PRIORITY_COLORS } from '@/lib/constants'
import type { TicketPriority } from '@/types'
import { cn } from '@/lib/utils'

interface PriorityIndicatorProps {
  priority: TicketPriority
  showLabel?: boolean
  className?: string
}

const ICONS: Record<TicketPriority, React.ReactNode> = {
  Alta: <ArrowUp className="h-3.5 w-3.5" />,
  Media: <ArrowRight className="h-3.5 w-3.5" />,
  Baja: <ArrowDown className="h-3.5 w-3.5" />,
}

export function PriorityIndicator({ priority, showLabel = false, className }: PriorityIndicatorProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1 text-xs font-medium', PRIORITY_COLORS[priority], className)}
      aria-label={`Prioridad: ${priority}`}
    >
      {ICONS[priority]}
      {showLabel && priority}
    </span>
  )
}
