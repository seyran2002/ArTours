import type { Tour } from '~/types/tour'

export function useTours() {
  const { public: { apiUrl } } = useRuntimeConfig()

  // Ensure we have a clean base URL
  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
  const toursUrl = `${baseUrl}tours`

  const { data, pending, error, refresh } = useFetch<Tour[]>(toursUrl, {
    key: 'tours-fetch',
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
