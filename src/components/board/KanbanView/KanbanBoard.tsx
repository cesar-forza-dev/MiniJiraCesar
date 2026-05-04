import { useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  pointerWithin,
} from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { StatusBadge } from '@/components/ticket/StatusBadge'
import { TICKET_STATUSES, KANBAN_PAGE_SIZE } from '@/lib/constants'
import { useTicketsQuery } from '@/queries'
import { useBoardStore } from '@/stores/boardStore'
import { useUIStore } from '@/stores/uiStore'
import { useDndBoard } from '@/hooks/useDndBoard'
import type { TicketStatus, TicketFilters, TicketSummary } from '@/types'
import type { OptimisticMove } from '@/hooks/useDndBoard'

/**
 * KanbanBoard — orquestador de dominio.
 * Único componente con acceso a stores y queries del Kanban.
 * Gestiona el DnD context y distribuye el estado optimista a cada columna.
 */
export function KanbanBoard() {
  const { filters, activeDragId } = useBoardStore()
  const { sensors, optimisticMoves, activeTicket, handleDragStart, handleDragEnd } = useDndBoard()

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start gap-4 overflow-x-auto pb-4 min-h-[480px]">
        {TICKET_STATUSES.map((status) => (
          <KanbanColumnContainer
            key={status}
            status={status}
            filters={filters}
            optimisticMoves={optimisticMoves}
            activeDragId={activeDragId}
          />
        ))}
      </div>

      {/* Ghost card que sigue al cursor mientras se arrastra */}
      <DragOverlay dropAnimation={null}>
        {activeTicket ? (
          <TaskCard
            id={activeTicket.id}
            title={activeTicket.title}
            priority={activeTicket.priority}
            labels={activeTicket.labels}
            assignee={activeTicket.assignedTo}
            createdAt={activeTicket.createdAt}
            className="rotate-1 opacity-90 shadow-lg pointer-events-none"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

interface KanbanColumnContainerProps {
  status: TicketStatus
  filters: TicketFilters
  optimisticMoves: OptimisticMove[]
  activeDragId: string | null
}

function KanbanColumnContainer({
  status,
  filters,
  optimisticMoves,
  activeDragId,
}: KanbanColumnContainerProps) {
  const openTicketModal = useUIStore((s) => s.openTicketModal)

  const { data, isLoading } = useTicketsQuery({
    ...filters,
    status: [status],
    pageSize: KANBAN_PAGE_SIZE,
    page: 1,
  })

  const realTickets: TicketSummary[] = data?.data ?? []

  // Aplicar overrides optimistas:
  // - Quitar los tickets que han salido de esta columna por drag
  // - Añadir los tickets que han entrado a esta columna por drag (al principio)
  const optimisticTickets = useMemo(() => {
    const movedOut = new Set(
      optimisticMoves
        .filter((m) => m.fromStatus === status)
        .map((m) => m.ticketId),
    )
    const movedIn = optimisticMoves
      .filter((m) => m.toStatus === status)
      .map((m) => m.ticket)

    return [...movedIn, ...realTickets.filter((t) => !movedOut.has(t.id))]
  }, [realTickets, optimisticMoves, status])

  // useDroppable hace que esta columna sea un drop target
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div ref={setNodeRef} className="flex flex-col">
      <KanbanColumn
        title={<StatusBadge status={status} />}
        count={isLoading ? '…' : optimisticTickets.length}
        isLoading={isLoading}
        isOver={isOver}
      >
        {optimisticTickets.map((ticket) => (
          <TaskCard
            key={ticket.id}
            id={ticket.id}
            title={ticket.title}
            priority={ticket.priority}
            labels={ticket.labels}
            assignee={ticket.assignedTo}
            createdAt={ticket.createdAt}
            status={status}
            ticket={ticket}
            isDragging={activeDragId === ticket.id}
            onClick={(id) => openTicketModal('view', id)}
          />
        ))}
      </KanbanColumn>
    </div>
  )
}

