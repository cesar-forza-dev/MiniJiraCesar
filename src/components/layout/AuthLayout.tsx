import { Outlet } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Outlet />
      <Toaster position="top-right" />
    </div>
  )
}
