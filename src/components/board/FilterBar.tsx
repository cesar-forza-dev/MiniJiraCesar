import { X, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Separator } from '@/components/ui/separator'
import { SearchInput } from './SearchInput'
import { useBoardStore } from '@/stores/boardStore'
import { useActiveUsersQuery } from '@/queries'
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface MultiSelectFilterProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

function MultiSelectFilter({ label, options, selected, onToggle, onClear }: MultiSelectFilterProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 text-sm">
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="rounded-full px-1.5 text-xs font-normal">
              {selected.length}
            </Badge>
          )}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar ${label.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem key={opt.value} onSelect={() => onToggle(opt.value)}>
                  <div className={cn('mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary', selected.includes(opt.value) ? 'bg-primary text-primary-foreground' : 'opacity-50')}>
                    {selected.includes(opt.value) && <Check className="h-3 w-3" />}
                  </div>
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {selected.length > 0 && (
              <>
                <Separator />
                <CommandGroup>
                  <CommandItem onSelect={onClear} className="justify-center text-sm text-muted-foreground">
                    Limpiar filtro
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function FilterBar() {
  const { filters, setFilters, resetFilters } = useBoardStore()
  const { data: activeUsers = [] } = useActiveUsersQuery()

  const hasActiveFilters =
    (filters.status?.length ?? 0) > 0 ||
    (filters.priority?.length ?? 0) > 0 ||
    (filters.assignedToId?.length ?? 0) > 0 ||
    (filters.labels?.length ?? 0) > 0 ||
    !!filters.search

  const toggleFilter = <K extends 'status' | 'priority' | 'assignedToId' | 'labels'>(
    key: K,
    value: string
  ) => {
    const current = (filters[key] as string[] | undefined) ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setFilters({ [key]: next.length > 0 ? next : undefined })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={filters.search ?? ''}
        onChange={(search) => setFilters({ search: search || undefined })}
        className="w-64"
      />

      <MultiSelectFilter
        label="Estado"
        options={TICKET_STATUSES.map((s) => ({ value: s, label: s }))}
        selected={filters.status ?? []}
        onToggle={(v) => toggleFilter('status', v)}
        onClear={() => setFilters({ status: undefined })}
      />

      <MultiSelectFilter
        label="Prioridad"
        options={TICKET_PRIORITIES.map((p) => ({ value: p, label: p }))}
        selected={filters.priority ?? []}
        onToggle={(v) => toggleFilter('priority', v)}
        onClear={() => setFilters({ priority: undefined })}
      />

      <MultiSelectFilter
        label="Asignado"
        options={activeUsers.map((u) => ({ value: u.id, label: u.username }))}
        selected={filters.assignedToId ?? []}
        onToggle={(v) => toggleFilter('assignedToId', v)}
        onClear={() => setFilters({ assignedToId: undefined })}
      />

      {hasActiveFilters && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Button
            variant="ghost"
            size="sm"
            className="h-9 px-2 text-muted-foreground"
            onClick={resetFilters}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Limpiar filtros
          </Button>
        </>
      )}
    </div>
  )
}
