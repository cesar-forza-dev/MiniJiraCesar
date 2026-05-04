import { useUIStore } from '@/stores/uiStore'
import { StatusBadge } from '@/components/ticket/StatusBadge'
import { PriorityIndicator } from '@/components/ticket/PriorityIndicator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { TicketSummary } from '@/types'

interface TicketRowProps {
  ticket: TicketSummary
}

export function TicketRow({ ticket }: TicketRowProps) {
  const openTicketModal = useUIStore((s) => s.openTicketModal)

  return (
    <tr
      onClick={() => openTicketModal('view', ticket.id)}
      className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
      role="row"
      aria-label={`Ticket: ${ticket.title}`}
    >
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-foreground">{ticket.title}</span>
        {ticket.labels.length > 0 && (
          <div className="flex gap-1 mt-0.5 flex-wrap">
            {ticket.labels.map((l) => (
              <span key={l} className="text-xs text-muted-foreground bg-muted rounded px-1.5 py-0.5">{l}</span>
            ))}
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <StatusBadge status={ticket.status} />
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <PriorityIndicator priority={ticket.priority} showLabel />
      </td>
      <td className="px-4 py-3">
        {ticket.assignedTo ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">
                {ticket.assignedTo.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{ticket.assignedTo.username}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
        {new Date(ticket.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
      </td>
    </tr>
  )
}
