import { useBoardStore } from '@/stores/boardStore'
import { useTicketsQuery } from '@/queries'
import { TicketRow } from './TicketRow'
import { Pagination } from './Pagination'

export function TicketTable() {
  const { filters, setFilters } = useBoardStore()
  const { data, isLoading } = useTicketsQuery(filters)

  const page = filters.page ?? 1

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-lg border-2 border-dashed text-muted-foreground">
        No hay tickets que coincidan con los filtros.
      </div>
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Título</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Prioridad</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asignado a</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Creado</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((ticket) => (
            <TicketRow key={ticket.id} ticket={ticket} />
          ))}
        </tbody>
      </table>
      <Pagination
        page={page}
        totalPages={data.totalPages}
        onPageChange={(p) => setFilters({ page: p })}
      />
    </div>
  )
}
