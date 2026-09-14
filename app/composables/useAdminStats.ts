import { ref } from 'vue'
import { useApiClient } from '~/services/api'

export interface DashboardStats {
  activeBookings: number
  locationsCount: number
  toursCount: number
  transfersCount: number
}

export function useAdminStats() {
  const api = useApiClient()
  const stats = ref<DashboardStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStats(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      stats.value = await api.get<DashboardStats>('admin/stats')
    } catch (err: any) {
      error.value = err?.data?.message ?? err?.message ?? 'Failed to load stats'
    } finally {
      loading.value = false
    }
  }

  return { stats, loading, error, fetchStats }
}
