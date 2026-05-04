import { create } from 'zustand'
import type { TicketFilters } from '@/types'

interface BoardStore {
  view: 'kanban' | 'list'
  filters: TicketFilters
  /** ID del ticket que está siendo arrastrado en este momento (null si no hay drag activo) */
  activeDragId: string | null
  setView: (view: 'kanban' | 'list') => void
  setFilters: (filters: Partial<TicketFilters>) => void
  resetFilters: () => void
  setActiveDragId: (id: string | null) => void
}

const DEFAULT_FILTERS: TicketFilters = {
  page: 1,
  pageSize: 20,
}

export const useBoardStore = create<BoardStore>((set) => ({
  view: 'kanban',
  filters: DEFAULT_FILTERS,
  activeDragId: null,

  setView: (view) => set({ view }),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 },
    })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  setActiveDragId: (id) => set({ activeDragId: id }),
}))
