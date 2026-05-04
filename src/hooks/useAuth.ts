import { useAuthStore } from '@/stores/authStore'
import type { Ticket } from '@/types'

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore()

  const isAdmin = () => user?.role === 'Admin'

  const isOwner = (ticket: Pick<Ticket, 'createdBy'>) =>
    user?.id === ticket.createdBy.id

  const isAssigned = (ticket: Pick<Ticket, 'assignedTo'>) =>
    ticket.assignedTo?.id === user?.id

  const canEdit = (ticket: Pick<Ticket, 'createdBy' | 'assignedTo'>) =>
    isAdmin() || isOwner(ticket) || isAssigned(ticket)

  const canArchive = (ticket: Pick<Ticket, 'createdBy' | 'assignedTo'>) =>
    isAdmin() || isOwner(ticket)

  const canChangeAssignee = (ticket: Pick<Ticket, 'createdBy'>) =>
    isAdmin() || isOwner(ticket)

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    isOwner,
    isAssigned,
    canEdit,
    canArchive,
    canChangeAssignee,
  }
}
