import { computed, type ComputedRef, type Ref } from 'vue'
import { useFetch, useRuntimeConfig } from '#app'
import type { Tour } from '~/types/tour'

export function useTour(id: string): {
  tour: ComputedRef<Tour | null>
  loading: Ref<boolean>
  error: Ref<any>
  refresh: () => Promise<void>
} {
  const { public: { apiUrl } } = useRuntimeConfig()
  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
  const tourUrl = `${baseUrl}tours/${id}`

  const { data, pending, error, refresh } = useFetch<Tour>(tourUrl, {
    key: `tour-fetch-${id}`,
    server: true,
    lazy: false
  })

  const tour = computed(() => data.value || null)

  return {
    tour,
    loading: pending,
    error,
    refresh
  }
}
