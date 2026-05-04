export type TicketStatus = 'Por hacer' | 'En progreso' | 'En revisión' | 'Listo'
export type TicketPriority = 'Baja' | 'Media' | 'Alta'
export type UserRole = 'Admin' | 'User'
export type AppTheme = 'light' | 'dark' | 'system'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  role: UserRole
  exp: number
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo: User | null
  createdBy: User
  labels: string[]
  version: number
  archived: boolean
  archivedAt: string | null
  archivedBy: User | null
  createdAt: string
  updatedAt: string
}

export interface TicketSummary {
  id: string
  title: string
  status: TicketStatus
  priority: TicketPriority
  assignedTo: Pick<User, 'id' | 'username'> | null
  labels: string[]
  version: number
  createdAt: string
  updatedAt: string
}

export interface TicketFilters {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  assignedToId?: string[]
  labels?: string[]
  createdFrom?: string
  createdTo?: string
  search?: string
  page?: number
  pageSize?: number
}

export interface CreateTicketPayload {
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  assignedToId?: string
  labels?: string[]
}

export interface UpdateTicketPayload extends Partial<CreateTicketPayload> {
  version: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
