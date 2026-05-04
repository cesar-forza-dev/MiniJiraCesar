import { useState, useRef, useCallback } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useActiveUsersQuery } from '@/queries'
import { cn } from '@/lib/utils'

interface MentionInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  error?: boolean
}

export function MentionInput({
  value,
  onChange,
  disabled,
  placeholder = 'Escribe un comentario... usa @ para mencionar',
  error,
}: MentionInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionStart, setMentionStart] = useState(0)
  const { data: users = [] } = useActiveUsersQuery()

  const filteredUsers =
    mentionQuery !== null
      ? users.filter((u) => u.username.toLowerCase().startsWith(mentionQuery.toLowerCase()))
      : []

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    const cursor = e.target.selectionStart
    onChange(val)

    const textBeforeCursor = val.slice(0, cursor)
    const match = textBeforeCursor.match(/@(\w*)$/)
    if (match) {
      setMentionQuery(match[1])
      setMentionStart(cursor - match[0].length)
    } else {
      setMentionQuery(null)
    }
  }

  const insertMention = useCallback(
    (username: string) => {
      const cursorPos = textareaRef.current?.selectionStart ?? mentionStart + (mentionQuery?.length ?? 0) + 1
      const before = value.slice(0, mentionStart)
      const after = value.slice(cursorPos)
      onChange(`${before}@${username} ${after}`)
      setMentionQuery(null)
      setTimeout(() => textareaRef.current?.focus(), 0)
    },
    [value, mentionStart, mentionQuery, onChange]
  )

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        rows={3}
        className={cn(
          'w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none',
          'focus:outline-none focus:ring-2 focus:ring-ring',
          'placeholder:text-muted-foreground disabled:opacity-50',
          error && 'ring-2 ring-destructive'
        )}
      />
      {mentionQuery !== null && filteredUsers.length > 0 && (
        <div className="absolute z-50 bottom-full mb-1 left-0 w-56 rounded-md border bg-popover shadow-md overflow-hidden">
          {filteredUsers.map((u) => (
            <button
              key={u.id}
              type="button"
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
              onMouseDown={(e) => {
                e.preventDefault()
                insertMention(u.username)
              }}
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">{u.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              @{u.username}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
