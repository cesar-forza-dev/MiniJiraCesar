import { Link, useRouterState } from '@tanstack/react-router'
import { LayoutGrid, BarChart2, Users, Archive, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { to: '/board', icon: <LayoutGrid className="h-4 w-4" />, label: 'Board' },
  { to: '/dashboard', icon: <BarChart2 className="h-4 w-4" />, label: 'Dashboard' },
  { to: '/users', icon: <Users className="h-4 w-4" />, label: 'Usuarios', adminOnly: true },
  { to: '/archived', icon: <Archive className="h-4 w-4" />, label: 'Archivados', adminOnly: true },
]

export function Sidebar() {
  const { isAdmin } = useAuth()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const publicItems = navItems.filter((item) => !item.adminOnly)
  const adminItems = navItems.filter((item) => item.adminOnly)

  return (
    <aside className="fixed left-0 top-0 h-full w-56 border-r border-border bg-sidebar flex flex-col z-30">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 px-4 border-b border-border">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-primary">
          <Layers className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight">Mini Jira</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {publicItems.map((item) => (
          <NavLink key={item.to} item={item} currentPath={currentPath} />
        ))}

        {isAdmin() && adminItems.length > 0 && (
          <>
            <div className="pt-3 pb-1 px-3">
              <span className="text-xs font-medium tracking-[0.05em] uppercase text-muted-foreground/60">
                Admin
              </span>
            </div>
            {adminItems.map((item) => (
              <NavLink key={item.to} item={item} currentPath={currentPath} />
            ))}
          </>
        )}
      </nav>
    </aside>
  )
}

function NavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const isActive = currentPath.startsWith(item.to)
  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors duration-150',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {item.icon}
      {item.label}
    </Link>
  )
}
