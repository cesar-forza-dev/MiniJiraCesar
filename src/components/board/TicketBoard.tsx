import { FilterBar } from './FilterBar'
import { ViewToggle } from './ViewToggle'
import { KanbanBoard } from './KanbanView/KanbanBoard'
import { TicketTable } from './ListView/TicketTable'
import { TicketModal } from '@/components/ticket/TicketModal'
import { useBoardStore } from '@/stores/boardStore'
import { useUIStore } from '@/stores/uiStore'

export function TicketBoard() {
  const view = useBoardStore((s) => s.view)
  const { ticketModalOpen, ticketModalMode, selectedTicketId, closeTicketModal } = useUIStore()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterBar />
        <ViewToggle />
      </div>

      {view === 'kanban' ? <KanbanBoard /> : <TicketTable />}

      <TicketModal
        open={ticketModalOpen}
        mode={ticketModalMode}
        ticketId={selectedTicketId ?? undefined}
        onClose={closeTicketModal}
      />
    </div>
  )
}
