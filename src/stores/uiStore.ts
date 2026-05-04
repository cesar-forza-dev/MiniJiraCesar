import { create } from 'zustand'

type TicketModalMode = 'create' | 'edit' | 'view'

interface UIStore {
  commandPaletteOpen: boolean
  ticketModalOpen: boolean
  ticketModalMode: TicketModalMode
  selectedTicketId: string | null
  openCommandPalette: () => void
  closeCommandPalette: () => void
  openTicketModal: (mode: TicketModalMode, ticketId?: string) => void
  closeTicketModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  commandPaletteOpen: false,
  ticketModalOpen: false,
  ticketModalMode: 'create',
  selectedTicketId: null,

  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),

  openTicketModal: (mode, ticketId) =>
    set({ ticketModalOpen: true, ticketModalMode: mode, selectedTicketId: ticketId ?? null }),

  closeTicketModal: () =>
    set({ ticketModalOpen: false, selectedTicketId: null }),
}))
