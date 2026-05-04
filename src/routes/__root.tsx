import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuthStore } from '@/stores/authStore'

export const Route = createRootRoute({
  beforeLoad: () => {
    useAuthStore.getState().initFromStorage()
  },
  component: () => (
    <>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  ),
})
