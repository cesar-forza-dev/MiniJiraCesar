import { z } from 'zod'

export const createUserSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres').max(50),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  role: z.enum(['Admin', 'User']),
})

export const updateUserSchema = createUserSchema.partial().extend({
  isActive: z.boolean().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>
