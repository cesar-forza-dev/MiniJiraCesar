export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: import('./ticket.types').AuthUser
}

export interface CreateUserPayload {
  username: string
  email: string
  password: string
  role: import('./ticket.types').UserRole
}

export interface UpdateUserPayload {
  username?: string
  email?: string
  role?: import('./ticket.types').UserRole
  isActive?: boolean
}
