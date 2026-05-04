import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Buscar tickets...', className }: SearchInputProps) {
  const [local, setLocal] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => { setLocal(value) }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setLocal(val)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(val), SEARCH_DEBOUNCE_MS)
  }

  const handleClear = () => {
    setLocal('')
    onChange('')
  }

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-8 pr-8 h-9 bg-muted"
      />
      {local && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}
