import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AssigneeSelect } from './AssigneeSelect'
import { LabelInput } from './LabelInput'
import { MarkdownEditor } from './MarkdownEditor'
import { ConflictModal } from './ConflictModal'
import { ticketSchema, type TicketFormValues } from '@/schemas/ticket.schema'
import { useCreateTicket, useUpdateTicket, useTicketQuery } from '@/queries'
import { TICKET_STATUSES, TICKET_PRIORITIES } from '@/lib/constants'
import type { Ticket, TicketStatus, TicketPriority } from '@/types'

interface TicketFormProps {
  mode: 'create' | 'edit'
  ticket?: Ticket
  onSuccess: () => void
  onCancel: () => void
}

export function TicketForm({ mode, ticket, onSuccess, onCancel }: TicketFormProps) {
  const [conflictOpen, setConflictOpen] = useState(false)
  const [conflictingUser, setConflictingUser] = useState<string | undefined>()

  const createTicket = useCreateTicket()
  const updateTicket = useUpdateTicket(ticket?.id ?? '')
  const { refetch } = useTicketQuery(ticket?.id ?? '', mode === 'edit')

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: ticket
      ? {
          title: ticket.title,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          assignedToId: ticket.assignedTo?.id ?? '',
          labels: ticket.labels,
        }
      : {
          status: 'Por hacer',
          priority: 'Media',
          labels: [],
        },
  })

  const titleValue = watch('title') ?? ''

  const onSubmit = async (values: TicketFormValues) => {
    try {
      if (mode === 'create') {
        await createTicket.mutateAsync({
          title: values.title,
          description: values.description,
          status: values.status as TicketStatus,
          priority: values.priority as TicketPriority,
          assignedToId: values.assignedToId || undefined,
          labels: values.labels,
        })
        toast.success('Ticket creado')
      } else {
        await updateTicket.mutateAsync({
          title: values.title,
          description: values.description,
          status: values.status as TicketStatus,
          priority: values.priority as TicketPriority,
          assignedToId: values.assignedToId || undefined,
          labels: values.labels,
          version: ticket!.version,
        })
        toast.success('Ticket actualizado')
      }
      onSuccess()
    } catch (err: unknown) {
      const httpErr = err as { response?: { status?: number; data?: { conflictingUser?: string } } }
      if (httpErr?.response?.status === 409) {
        setConflictingUser(httpErr?.response?.data?.conflictingUser)
        setConflictOpen(true)
      } else {
        toast.error('Error al guardar el ticket')
      }
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Título */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="title">Título <span className="text-destructive">*</span></Label>
            <span className={`text-xs ${titleValue.length > 110 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {titleValue.length}/120
            </span>
          </div>
          <Input
            id="title"
            {...register('title')}
            placeholder="Título del ticket"
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="space-y-1.5">
          <Label>Descripción <span className="text-destructive">*</span></Label>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <MarkdownEditor
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!errors.description}
                height={200}
              />
            )}
          />
          {errors.description && (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Estado y Prioridad */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Estado <span className="text-destructive">*</span></Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Prioridad <span className="text-destructive">*</span></Label>
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {TICKET_PRIORITIES.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Asignado a */}
        <div className="space-y-1.5">
          <Label>Asignado a</Label>
          <Controller
            control={control}
            name="assignedToId"
            render={({ field }) => (
              <AssigneeSelect
                value={field.value || undefined}
                onChange={(id) => field.onChange(id ?? '')}
              />
            )}
          />
        </div>

        {/* Etiquetas */}
        <div className="space-y-1.5">
          <Label>Etiquetas <span className="text-xs text-muted-foreground">(máx. 5)</span></Label>
          <Controller
            control={control}
            name="labels"
            render={({ field }) => (
              <LabelInput value={field.value ?? []} onChange={field.onChange} />
            )}
          />
          {errors.labels && (
            <p className="text-xs text-destructive">{errors.labels.message}</p>
          )}
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear ticket' : 'Guardar cambios'}
          </Button>
        </div>
      </form>

      <ConflictModal
        open={conflictOpen}
        conflictingUser={conflictingUser}
        onReload={() => refetch()}
        onClose={() => setConflictOpen(false)}
      />
    </>
  )
}
