import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface KanbanColumnProps {
  /** Encabezado de la columna — acepta cualquier ReactNode (ej: <StatusBadge />) */
  title: React.ReactNode
  /** Número de ítems o '…' mientras carga */
  count: number | '…'
  /** Activa la animación de skeleton en lugar de los children */
  isLoading?: boolean
  /** Cuántos skeletons mostrar mientras carga (default: 3) */
  skeletonCount?: number
  /** Mensaje cuando no hay items (default: "Sin tickets") */
  emptyMessage?: string
  /** Override del max-height del área de scroll */
  maxHeight?: string
  /** Indica que hay un elemento arrastrado sobre esta columna */
  isOver?: boolean
  /** Cards u otros items — renderizados por el componente padre */
  children?: React.ReactNode
  className?: string
}

/**
 * KanbanColumn — columna genérica reutilizable.
 * No sabe qué tipo de ítem renderiza: recibe children del padre.
 * El padre (KanbanBoard) decide qué poner en cada columna.
 */
export function KanbanColumn({
  title,
  count,
  isLoading = false,
  skeletonCount = 3,
  emptyMessage = 'Sin tickets',
  maxHeight = 'calc(100vh - 240px)',
  isOver = false,
  children,
  className,
}: KanbanColumnProps) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : children != null

  return (
    <div
      className={cn(
        'flex flex-col min-w-[272px] max-w-[272px]',
        'rounded-lg bg-muted/50 border border-border',
        'transition-colors duration-150',
        isOver && 'ring-2 ring-primary/40 bg-primary/5 border-primary/30',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          {title}
        </div>
        <span
          className={cn(
            'text-xs font-medium text-muted-foreground',
            'bg-background border border-border',
            'rounded-full px-2 py-0.5 shrink-0 tabular-nums'
          )}
          aria-label={`${count} tickets`}
        >
          {count}
        </span>
      </div>

      {/* Body */}
      <ScrollArea style={{ maxHeight }} className="flex-1">
        <div className="p-2 space-y-2">
          {isLoading ? (
            // Skeletons de carga
            Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-lg bg-muted animate-pulse"
                aria-hidden
              />
            ))
          ) : !hasChildren ? (
            // Estado vacío
            <div className="flex items-center justify-center py-8">
              <p className="text-xs text-muted-foreground/60 select-none">
                {emptyMessage}
              </p>
            </div>
          ) : (
            // Children renderizados por el padre
            children
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

