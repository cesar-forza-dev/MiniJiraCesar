export interface MonthlyCount {
  month: string
  count: number
}

export interface StatusCount {
  status: import('./ticket.types').TicketStatus
  count: number
}

export interface TeamMemberMetrics {
  user: { id: string; username: string }
  created: number
  closed: number
}

export interface DashboardMetrics {
  ticketsClosedByMonth: MonthlyCount[]
  ticketsByStatus: StatusCount[]
  teamMetrics: TeamMemberMetrics[]
}
