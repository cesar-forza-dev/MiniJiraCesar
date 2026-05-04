import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { LayoutGrid, BarChart2, Users, Archive, Plus } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useUIStore } from '@/stores/uiStore'
import { useAuth } from '@/hooks/useAuth'

export function CommandPalette() {
  const { commandPaletteOpen, openCommandPalette, closeCommandPalette, openTicketModal } = useUIStore()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        commandPaletteOpen ? closeCommandPalette() : openCommandPalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [commandPaletteOpen, openCommandPalette, closeCommandPalette])

  const runAndClose = (fn: () => void) => {
    fn()
    closeCommandPalette()
  }

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={(open) => !open && closeCommandPalette()}>
      <CommandInput placeholder="Buscar o ir a..." />
      <CommandList>
        <CommandEmpty>Sin resultados.</CommandEmpty>
        <CommandGroup heading="Navegación">
          <CommandItem onSelect={() => runAndClose(() => navigate({ to: '/board' }))}>
            <LayoutGrid className="mr-2 h-4 w-4" /> Board
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(() => navigate({ to: '/dashboard' }))}>
            <BarChart2 className="mr-2 h-4 w-4" /> Dashboard
          </CommandItem>
          {isAdmin() && (
            <>
              <CommandItem onSelect={() => runAndClose(() => navigate({ to: '/users' }))}>
                <Users className="mr-2 h-4 w-4" /> Usuarios
              </CommandItem>
              <CommandItem onSelect={() => runAndClose(() => navigate({ to: '/archived' }))}>
                <Archive className="mr-2 h-4 w-4" /> Archivados
              </CommandItem>
            </>
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Acciones">
          <CommandItem onSelect={() => runAndClose(() => openTicketModal('create'))}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo ticket
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
