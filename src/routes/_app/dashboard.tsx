import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Métricas del equipo — últimos 6 meses</p>
      </div>
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed text-muted-foreground">
        Dashboard — componentes en desarrollo
      </div>
    </div>
  )
}
