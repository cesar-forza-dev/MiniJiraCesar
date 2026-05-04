import type { AuthUser, LoginResponse } from '@/types'

// ---------------------------------------------------------------------------
// Fake JWT helpers
// ---------------------------------------------------------------------------

function b64(obj: unknown) {
  return btoa(JSON.stringify(obj))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function makeFakeJwt(payload: AuthUser): string {
  const header = b64({ alg: 'HS256', typ: 'JWT' })
  const body = b64(payload)
  return `${header}.${body}.mock-signature`
}

// ---------------------------------------------------------------------------
// Mock users (password: "password" para todos)
// ---------------------------------------------------------------------------

export interface MockUser {
  email: string
  password: string
  label: string
  user: AuthUser
}

const EXP_1_YEAR = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365

export const MOCK_USERS: MockUser[] = [
  {
    email: 'admin@minijira.io',
    password: 'password',
    label: 'Admin — Ana López',
    user: {
      id: 'user-1',
      username: 'ana.lopez',
      email: 'admin@minijira.io',
      role: 'Admin',
      exp: EXP_1_YEAR,
    },
  },
  {
    email: 'dev@minijira.io',
    password: 'password',
    label: 'User — Carlos Ruiz',
    user: {
      id: 'user-2',
      username: 'carlos.ruiz',
      email: 'dev@minijira.io',
      role: 'User',
      exp: EXP_1_YEAR,
    },
  },
  {
    email: 'qa@minijira.io',
    password: 'password',
    label: 'User — María Torres',
    user: {
      id: 'user-3',
      username: 'maria.torres',
      email: 'qa@minijira.io',
      role: 'User',
      exp: EXP_1_YEAR,
    },
  },
]

// ---------------------------------------------------------------------------
// mockLogin: simula la respuesta del backend con ~400ms de latencia
// ---------------------------------------------------------------------------

export async function mockLogin(
  email: string,
  password: string,
): Promise<LoginResponse> {
  await new Promise((r) => setTimeout(r, 400))

  const match = MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  )

  if (!match) {
    throw new Error('Credenciales inválidas')
  }

  const token = makeFakeJwt(match.user)
  return { token, user: match.user }
}
