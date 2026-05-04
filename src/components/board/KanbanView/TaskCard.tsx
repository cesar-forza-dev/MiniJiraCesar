import { Tag } from 'lucide-react'
import { useDraggable } from '@dnd-kit/core'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PriorityIndicator } from '@/components/ticket/PriorityIndicator'
import type { TicketPriority, TicketStatus, TicketSummary } from '@/types'
import { cn } from '@/lib/utils'

export interface TaskCardProps {
  id: string
  title: string
  priority: TicketPriority
  labels?: string[]
  assignee?: { id: string; username: string } | null
  createdAt: string
  /** Estado actual de la columna — se pasa al data del draggable */
  status?: TicketStatus
  /** Datos completos del ticket — se pasan al data del draggable para el move handler */
  ticket?: TicketSummary
  /** true cuando ESTE ticket está siendo arrastrado (renderiza con opacidad reducida) */
  isDragging?: boolean
  onClick?: (id: string) => void
  className?: string
}

/** Borde izquierdo de color según prioridad — indicador visual rápido */
const PRIORITY_BORDER: Record<TicketPriority, string> = {
  Alta: 'border-l-red-400',
  Media: 'border-l-amber-400',
  Baja: 'border-l-slate-300 dark:border-l-slate-600',
}

/**
 * TaskCard — componente presentacional con capacidad de arrastre.
 * El comportamiento al hacer click se delega al padre vía `onClick`.
 * Los datos de drag (status + ticket) se pasan via useDraggable.data.current
 * para que handleDragEnd en useDndBoard pueda construir el move.
 */
export function TaskCard({
  id,
  title,
  priority,
  labels = [],
  assignee,
  createdAt,
  status,
  ticket,
  isDragging = false,
  onClick,
  className,
}: TaskCardProps) {
  const { setNodeRef, listeners, attributes, isDragging: dndIsDragging } = useDraggable({
    id,
    data: { status, ticket },
    // Si no hay status/ticket, la tarjeta no es draggable (ej: en el DragOverlay)
    disabled: !status || !ticket,
  })

  const isCurrentlyDragging = isDragging || dndIsDragging
  const createdDate = new Date(createdAt).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
  })

  const visibleLabels = labels.slice(0, 2)
  const extraLabels = labels.length - visibleLabels.length

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onClick?.(id)}
      className={cn(
        // Layout base
        'w-full text-left rounded-lg border border-border bg-card',
        'px-3 pt-3 pb-3 space-y-2',
        // Borde izquierdo de prioridad (border-l-2 sobrescribe el border general en el lado izq.)
        'border-l-2',
        PRIORITY_BORDER[priority],
        // Interacciones
        'hover:shadow-sm hover:border-primary/30 hover:border-l-2',
        'active:scale-[0.98]',
        'transition-all duration-150',
        // Cursor de arrastre
        'cursor-grab active:cursor-grabbing',
        // Estado de arrastre activo — se vuelve fantasma en su posición original
        isCurrentlyDragging && 'opacity-40 pointer-events-none',
        // Accesibilidad
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
        className
      )}
      aria-label={`Ver ticket: ${title}`}
      {...listeners}
      {...attributes}
    >
      {/* Título */}
      <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
        {title}
      </p>

      {/* Chips: prioridad + labels */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <PriorityIndicator priority={priority} />

        {visibleLabels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-0.5 text-xs text-muted-foreground"
          >
            <Tag className="h-2.5 w-2.5 shrink-0" aria-hidden />
            {label}
          </span>
        ))}

        {extraLabels > 0 && (
          <span className="text-xs text-muted-foreground">+{extraLabels}</span>
        )}
      </div>

      {/* Footer: fecha + avatar */}
      <div className="flex items-center justify-between pt-0.5">
        <time
          dateTime={createdAt}
          className="text-xs text-muted-foreground"
        >
          {createdDate}
        </time>

        {assignee && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
              {assignee.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </button>
  )
}
