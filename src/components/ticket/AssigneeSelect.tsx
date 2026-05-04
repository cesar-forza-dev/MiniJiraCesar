import { useState } from 'react'
import { Check, ChevronsUpDown, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useActiveUsersQuery } from '@/queries'

interface AssigneeSelectProps {
  value: string | undefined
  onChange: (id: string | undefined) => void
  disabled?: boolean
}

export function AssigneeSelect({ value, onChange, disabled }: AssigneeSelectProps) {
  const [open, setOpen] = useState(false)
  const { data: users = [] } = useActiveUsersQuery()
  const selected = users.find((u) => u.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 font-normal"
          disabled={disabled}
        >
          {selected ? (
            <span className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {selected.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {selected.username}
            </span>
          ) : (
            <span className="text-muted-foreground flex items-center gap-2">
              <UserX className="h-4 w-4" /> Sin asignar
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Buscar usuario..." />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => { onChange(undefined); setOpen(false) }}
                className="text-muted-foreground"
              >
                <UserX className="mr-2 h-4 w-4" />
                Sin asignar
                {!value && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => { onChange(user.id); setOpen(false) }}
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarFallback className="text-[10px]">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user.username}
                  {value === user.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
