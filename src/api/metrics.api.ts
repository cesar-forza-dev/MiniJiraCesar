import { apiClient } from './client'
import type { DashboardMetrics } from '@/types'

export const metricsApi = {
  getDashboard: async (): Promise<DashboardMetrics> => {
    const { data } = await apiClient.get<DashboardMetrics>('/metrics/dashboard')
    return data
  },
}
