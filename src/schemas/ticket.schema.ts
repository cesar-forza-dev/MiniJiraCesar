import { z } from 'zod'
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@/lib/constants'

export const ticketSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es obligatorio')
    .max(120, 'El título no puede superar los 120 caracteres'),
  description: z
    .string()
    .min(1, 'La descripción es obligatoria'),
  status: z.enum(TICKET_STATUSES as [string, ...string[]]),
  priority: z.enum(TICKET_PRIORITIES as [string, ...string[]]),
  assignedToId: z.string().uuid().optional().or(z.literal('')),
  labels: z
    .array(z.string())
    .max(5, 'Máximo 5 etiquetas por ticket')
    .optional(),
})

export type TicketFormValues = z.infer<typeof ticketSchema>
