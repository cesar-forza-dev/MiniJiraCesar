import type { TicketStatus, TicketPriority } from '@/types'

export const TICKET_STATUSES: TicketStatus[] = [
  'Por hacer',
  'En progreso',
  'En revisión',
  'Listo',
]

export const TICKET_PRIORITIES: TicketPriority[] = ['Baja', 'Media', 'Alta']

export const STATUS_COLORS: Record<TicketStatus, string> = {
  'Por hacer': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'En progreso': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'En revisión': 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  'Listo': 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

export const PRIORITY_COLORS: Record<TicketPriority, string> = {
  'Baja': 'text-slate-400',
  'Media': 'text-amber-500',
  'Alta': 'text-red-500',
}

export const PAGE_SIZE = 20
export const KANBAN_PAGE_SIZE = 50
export const COMMENTS_PAGE_SIZE = 50
export const SEARCH_DEBOUNCE_MS = 300

export const LOCAL_STORAGE_TOKEN_KEY = 'minijira-token'
export const LOCAL_STORAGE_THEME_KEY = 'minijira-theme'
