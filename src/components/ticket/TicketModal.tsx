import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TicketForm } from './TicketForm'
import { TicketDetail } from './TicketDetail'
import { useTicketQuery } from '@/queries'

interface TicketModalProps {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  ticketId?: string
  onClose: () => void
}

function LoadingState() {
  return (
    <div className="space-y-4 p-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={`${i === 1 ? 'h-24' : 'h-10'} rounded bg-muted animate-pulse`} />
      ))}
    </div>
  )
}

export function TicketModal({ open, mode, ticketId, onClose }: TicketModalProps) {
  const needsTicket = mode === 'edit' || mode === 'view'
  const { data: ticket, isLoading } = useTicketQuery(ticketId ?? '', open && needsTicket)

  const [localMode, setLocalMode] = useState<'create' | 'edit' | 'view'>(mode)

  useEffect(() => { setLocalMode(mode) }, [mode, open])

  const titles: Record<typeof localMode, string> = {
    create: 'Nuevo ticket',
    edit: 'Editar ticket',
    view: ticket?.title ?? 'Detalle del ticket',
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0 shrink-0">
          <DialogTitle className="text-base font-semibold">{titles[localMode]}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="px-6 pb-6 pt-4">
            {localMode === 'create' && (
              <TicketForm mode="create" onSuccess={onClose} onCancel={onClose} />
            )}
            {(localMode === 'edit' || localMode === 'view') && (
              isLoading || !ticket
                ? <LoadingState />
                : localMode === 'view'
                  ? (
                    <TicketDetail
                      ticket={ticket}
                      onEdit={() => setLocalMode('edit')}
                      onClose={onClose}
                    />
                  )
                  : (
                    <TicketForm
                      mode="edit"
                      ticket={ticket}
                      onSuccess={onClose}
                      onCancel={() => setLocalMode('view')}
                    />
                  )
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
