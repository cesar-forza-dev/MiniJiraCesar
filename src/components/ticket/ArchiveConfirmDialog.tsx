import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface ArchiveConfirmDialogProps {
  open: boolean
  ticketTitle: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function ArchiveConfirmDialog({
  open,
  ticketTitle,
  onConfirm,
  onCancel,
  isLoading,
}: ArchiveConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Eliminar ticket
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar <strong>"{ticketTitle}"</strong>?
            El ticket no se borrará permanentemente y podrá ser restaurado por un Administrador.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
