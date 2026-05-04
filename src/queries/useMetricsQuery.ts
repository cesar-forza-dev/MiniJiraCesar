import { useQuery } from '@tanstack/react-query'
import { metricsApi } from '@/api/metrics.api'

export const metricsKeys = {
  dashboard: ['metrics', 'dashboard'] as const,
}

export function useMetricsQuery() {
  return useQuery({
    queryKey: metricsKeys.dashboard,
    queryFn: () => metricsApi.getDashboard(),
    staleTime: 60_000,
  })
}
