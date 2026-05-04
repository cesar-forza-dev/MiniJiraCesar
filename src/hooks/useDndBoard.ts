import { useOptimistic, startTransition, useState } from 'react'
import {
  useSensor,
  useSensors,
  MouseSensor,
  KeyboardSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ticketsApi } from '@/api/tickets.api'
import { ticketKeys } from '@/queries/useTicketsQuery'
import { useBoardStore } from '@/stores/boardStore'
import type { TicketStatus, TicketSummary } from '@/types'

export interface OptimisticMove {
  ticketId: string
  fromStatus: TicketStatus
  toStatus: TicketStatus
  /** Datos completos de la tarjeta para poder inyectarla en la columna destino */
  ticket: TicketSummary
}

/**
 * useDndBoard — hook central de arrastrar y soltar para el Kanban.
 *
 * Responsabilidades:
 * 1. Configura los sensores de @dnd-kit (mouse + teclado).
 * 2. Gestiona el estado optimista con useOptimistic de React 19.
 * 3. Simula un backend lento con setTimeout (800-1500ms).
 * 4. Simula un 20% de fallos de red para demostrar el rollback automático.
 * 5. Actualiza boardStore.activeDragId para feedback visual cross-componente.
 */
export function useDndBoard() {
  const qc = useQueryClient()
  const setActiveDragId = useBoardStore((s) => s.setActiveDragId)

  /** Datos del ticket que está siendo arrastrado — usado por el DragOverlay */
  const [activeTicket, setActiveTicket] = useState<TicketSummary | null>(null)

  // useOptimistic de React 19: acumula overrides de columna mientras el PATCH está en vuelo.
  // El reducer simplemente reemplaza el move previo del mismo ticket si existía.
  const [optimisticMoves, addOptimisticMove] = useOptimistic<OptimisticMove[], OptimisticMove>(
    [],
    (state, newMove) => [
      ...state.filter((m) => m.ticketId !== newMove.ticketId),
      newMove,
    ],
  )

  // Sensores: mouse (con umbral de 8px para evitar drags accidentales) + teclado
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Requiere que el usuario mueva el ratón al menos 8px antes de iniciar el drag,
      // evitando disparar accidentalmente al hacer clic.
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  )

  function handleDragStart(event: DragStartEvent) {
    setActiveDragId(String(event.active.id))
    setActiveTicket((event.active.data.current?.ticket as TicketSummary) ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragId(null)
    setActiveTicket(null)

    const { active, over } = event
    if (!over) return

    const fromStatus = active.data.current?.status as TicketStatus | undefined
    const toStatus = over.id as TicketStatus
    const ticket = active.data.current?.ticket as TicketSummary | undefined

    // No hacer nada si se soltó en la misma columna o faltan datos
    if (!fromStatus || !ticket || fromStatus === toStatus) return

    const move: OptimisticMove = {
      ticketId: ticket.id,
      fromStatus,
      toStatus,
      ticket: { ...ticket, status: toStatus },
    }

    // startTransition es OBLIGATORIO para que useOptimistic pueda hacer rollback automático.
    // React descarta el estado optimista cuando la transición termina con error.
    startTransition(async () => {
      // 1. Actualizar la UI instantáneamente
      addOptimisticMove(move)

      try {
        // 2. Simular latencia de red (800–1500ms)
        await new Promise<void>((res) => setTimeout(res, 800 + Math.random() * 700))

        // 3. Simular fallo de red con 20% de probabilidad
        if (Math.random() < 0.2) {
          throw new Error('Simulated network error: failed to save ticket move')
        }

        // 4. Llamada real al backend
        await ticketsApi.update(ticket.id, {
          status: toStatus,
          version: ticket.version,
        })

        // 5. Refrescar caché de TanStack Query para sincronizar el estado real
        await qc.invalidateQueries({ queryKey: ticketKeys.lists() })

        toast.success(`Ticket movido a "${toStatus}"`)
      } catch (err) {
        // Si el error es del backend (409 conflicto de versión, etc.) o del simulador,
        // useOptimistic revierte automáticamente al salir de la transición con error.
        const isSimulated =
          err instanceof Error && err.message.startsWith('Simulated')

        toast.error(
          isSimulated
            ? 'Error de red simulado. Cambio revertido.'
            : 'No se pudo mover el ticket. Cambio revertido.',
        )
      }
    })
  }

  return {
    sensors,
    optimisticMoves,
    activeTicket,
    handleDragStart,
    handleDragEnd,
  }
}
