import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBoardStore } from '@/stores/boardStore'
import { cn } from '@/lib/utils'

export function ViewToggle() {
  const { view, setView } = useBoardStore()
  return (
    <div className="flex rounded border border-border overflow-hidden shrink-0">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'rounded-none h-8 px-3 gap-1.5 transition-colors duration-150',
          view === 'kanban'
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => setView('kanban')}
        aria-pressed={view === 'kanban'}
        aria-label="Vista Kanban"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Kanban</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          'rounded-none h-8 px-3 gap-1.5 border-l border-border transition-colors duration-150',
          view === 'list'
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
        onClick={() => setView('list')}
        aria-pressed={view === 'list'}
        aria-label="Vista Lista"
      >
        <List className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Lista</span>
      </Button>
    </div>
  )
}
