import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_app/archived')({
  beforeLoad: () => {
    const { user } = useAuthStore.getState()
    if (user?.role !== 'Admin') throw redirect({ to: '/board' })
  },
  component: ArchivedPage,
})

function ArchivedPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Archivados</h1>
        <p className="text-sm text-muted-foreground">Tickets archivados — solo Admin puede restaurar</p>
      </div>
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed text-muted-foreground">
        Tickets archivados — en desarrollo
      </div>
    </div>
  )
}
