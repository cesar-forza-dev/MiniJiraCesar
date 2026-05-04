import { Search, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useUIStore } from '@/stores/uiStore'

export function Topbar() {
  const { user, logout } = useAuth()
  const openCommandPalette = useUIStore((s) => s.openCommandPalette)

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??'

  return (
    <header className="fixed top-0 left-56 right-0 h-14 border-b border-border bg-background/70 backdrop-blur-xl flex items-center justify-between px-4 z-20">
      {/* Search trigger */}
      <Button
        variant="outline"
        className="h-8 w-64 justify-start gap-2 text-muted-foreground text-sm font-normal"
        onClick={openCommandPalette}
        aria-label="Abrir paleta de comandos (Ctrl+K)"
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span>Buscar...</span>
        <kbd className="ml-auto text-xs opacity-50 font-sans">⌘K</kbd>
      </Button>

      {/* Right controls */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">{user?.username}</p>
                {user?.role && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 rounded-full shrink-0">
                    {user.role}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive gap-2"
              onClick={logout}
            >
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
