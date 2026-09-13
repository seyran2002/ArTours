import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import type { Tour, TourType } from '~/types/tour'

export function useTours(type?: MaybeRefOrGetter<TourType | undefined>) {
  const { public: { apiUrl } } = useRuntimeConfig()

  // Ensure we have a clean base URL
  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
  const resolvedType = computed(() => toValue(type))

  const toursUrl = computed(() => {
    if (resolvedType.value) {
      return `${baseUrl}tours/type/${resolvedType.value}`
    }
    return `${baseUrl}tours`
  })

  const { data, pending, error, refresh } = useFetch<Tour[]>(toursUrl, {
    key: computed(() => `tours-fetch-${resolvedType.value || 'all'}`),
    server: true,
    lazy: false,
    transform: (tours) => {
      // Any necessary data post-processing can go here
      return tours || []
    }
  })

  const tours = computed(() => data.value || [])

  return {
    tours,
    loading: pending,
    error,
    refresh
  }
}

/**
 * Convenience helper to fetch tours by type (e.g. 'TOUR' or 'TRANSFER')
 */
export function findByType(type: MaybeRefOrGetter<TourType>) {
  return useTours(type)
}

export function useTransfers() {
  return useTours('TRANSFER')
}
