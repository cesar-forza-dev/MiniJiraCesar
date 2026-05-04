import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ConflictModalProps {
  open: boolean
  conflictingUser?: string
  onReload: () => void
  onClose: () => void
}

export function ConflictModal({ open, conflictingUser, onReload, onClose }: ConflictModalProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Conflicto de edición
          </DialogTitle>
          <DialogDescription>
            {conflictingUser
              ? `Este ticket fue modificado por ${conflictingUser} mientras lo editabas.`
              : 'Este ticket fue modificado mientras lo editabas.'}{' '}
            Recarga para ver los cambios.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { onReload(); onClose() }}>Recargar ticket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
