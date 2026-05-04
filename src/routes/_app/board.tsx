import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TicketBoard } from '@/components/board/TicketBoard'
import { useUIStore } from '@/stores/uiStore'

export const Route = createFileRoute('/_app/board')({
  component: BoardPage,
})

function BoardPage() {
  const openTicketModal = useUIStore((s) => s.openTicketModal)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold leading-snug tracking-[-0.01em] text-foreground">
            Board
          </h1>
          <p className="text-sm text-muted-foreground">Gestión de tickets del equipo</p>
        </div>
        <Button onClick={() => openTicketModal('create')}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo ticket
        </Button>
      </div>
      <TicketBoard />
    </div>
  )
}
