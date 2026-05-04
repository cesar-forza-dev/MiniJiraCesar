import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_auth')({
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState()
    if (isAuthenticated) throw redirect({ to: '/board' })
  },
  component: AuthLayout,
})
