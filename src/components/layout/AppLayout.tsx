import { Outlet } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { Toaster } from '@/components/ui/sonner'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main className="ml-56 pt-14 min-h-screen">
        <div className="px-6 py-6 max-w-[1280px]">
          <Outlet />
        </div>
      </main>
      <CommandPalette />
      <Toaster position="top-right" richColors />
    </div>
  )
}
