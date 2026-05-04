import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusBadge } from './StatusBadge'
import { PriorityIndicator } from './PriorityIndicator'
import { MarkdownEditor } from './MarkdownEditor'
import { ArchiveConfirmDialog } from './ArchiveConfirmDialog'
import { ActivityFeed } from '@/components/activity/ActivityFeed'
import { useAuth } from '@/hooks/useAuth'
import { useArchiveTicket, useRestoreTicket } from '@/queries'
import { Edit, ArchiveRestore, Tag } from 'lucide-react'
import type { Ticket } from '@/types'

interface TicketDetailProps {
  ticket: Ticket
  onEdit: () => void
  onClose: () => void
}

export function TicketDetail({ ticket, onEdit, onClose }: TicketDetailProps) {
  const [archiveOpen, setArchiveOpen] = useState(false)
  const { isAdmin, canEdit, canArchive } = useAuth()
  const archive = useArchiveTicket(ticket.id)
  const restore = useRestoreTicket(ticket.id)

  const handleArchive = async () => {
    try {
      await archive.mutateAsync(ticket.version)
      toast.success('Ticket eliminado')
      setArchiveOpen(false)
      onClose()
    } catch {
      toast.error('Error al eliminar el ticket')
    }
  }

  const handleRestore = async () => {
    try {
      await restore.mutateAsync(ticket.version)
      toast.success('Ticket restaurado')
      onClose()
    } catch {
      toast.error('Error al restaurar el ticket')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground leading-snug flex-1">
          {ticket.title}
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          {canEdit(ticket) && !ticket.archived && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-1.5 h-3.5 w-3.5" /> Editar
            </Button>
          )}
          {canArchive(ticket) && !ticket.archived && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setArchiveOpen(true)}
            >
              Eliminar
            </Button>
          )}
          {isAdmin() && ticket.archived && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestore}
              disabled={restore.isPending}
            >
              <ArchiveRestore className="mr-1.5 h-3.5 w-3.5" />
              {restore.isPending ? 'Restaurando...' : 'Restaurar'}
            </Button>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Estado</p>
          <StatusBadge status={ticket.status} />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Prioridad</p>
          <PriorityIndicator priority={ticket.priority} showLabel />
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Creado por</p>
          <div className="flex items-center gap-1.5">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-[10px]">
                {ticket.createdBy.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-foreground">{ticket.createdBy.username}</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Asignado a</p>
          {ticket.assignedTo ? (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {ticket.assignedTo.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground">{ticket.assignedTo.username}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Creado</p>
          <span className="text-foreground">
            {new Date(ticket.createdAt).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Actualizado</p>
          <span className="text-foreground">
            {new Date(ticket.updatedAt).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Etiquetas */}
      {ticket.labels.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1">
            <Tag className="h-3 w-3" /> Etiquetas
          </p>
          <div className="flex gap-1.5 flex-wrap">
            {ticket.labels.map((label) => (
              <Badge key={label} variant="secondary" className="font-normal">
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Descripción */}
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Descripción</p>
        <MarkdownEditor value={ticket.description} onChange={() => {}} readOnly />
      </div>

      <Separator />

      {/* Activity Feed */}
      <ActivityFeed ticketId={ticket.id} archived={ticket.archived} />

      <ArchiveConfirmDialog
        open={archiveOpen}
        ticketTitle={ticket.title}
        onConfirm={handleArchive}
        onCancel={() => setArchiveOpen(false)}
        isLoading={archive.isPending}
      />
    </div>
  )
}
