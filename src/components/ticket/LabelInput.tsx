import { useState, useRef, type KeyboardEvent } from 'react'
import { X, Tag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LabelInputProps {
  value: string[]
  onChange: (labels: string[]) => void
  disabled?: boolean
}

export function LabelInput({ value, onChange, disabled }: LabelInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addLabel = () => {
    const trimmed = input.trim().toLowerCase()
    if (!trimmed || value.includes(trimmed) || value.length >= 5) return
    onChange([...value, trimmed])
    setInput('')
  }

  const removeLabel = (label: string) => {
    onChange(value.filter((l) => l !== label))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addLabel()
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeLabel(value[value.length - 1])
    }
  }

  return (
    <div
      className={cn(
        'min-h-9 flex flex-wrap gap-1.5 items-center rounded-md border border-input bg-background px-3 py-1.5',
        'focus-within:ring-2 focus-within:ring-ring',
        disabled && 'opacity-50 pointer-events-none'
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((label) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded bg-secondary text-secondary-foreground text-xs px-2 py-0.5"
        >
          <Tag className="h-2.5 w-2.5" />
          {label}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeLabel(label) }}
              className="hover:text-destructive"
              aria-label={`Eliminar etiqueta ${label}`}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </span>
      ))}
      {!disabled && value.length < 5 && (
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addLabel}
          placeholder={value.length === 0 ? 'Agregar etiqueta (Enter para confirmar)...' : ''}
          className="flex-1 min-w-20 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          disabled={disabled}
        />
      )}
      {value.length >= 5 && !disabled && (
        <span className="text-xs text-muted-foreground">Máximo 5 etiquetas</span>
      )}
    </div>
  )
}
