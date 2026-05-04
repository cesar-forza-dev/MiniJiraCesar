import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_app/users')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user?.role !== 'Admin') throw redirect({ to: '/board' })
  },
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Usuarios</h1>
        <p className="text-sm text-muted-foreground">Gestión de miembros del equipo</p>
      </div>
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed text-muted-foreground">
        Gestión de usuarios — en desarrollo
      </div>
    </div>
  )
}
