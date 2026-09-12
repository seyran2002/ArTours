import type { Location } from '~/types/location'

export function useLocations() {
  const { public: { apiUrl } } = useRuntimeConfig()
  
  // Ensure we have a clean base URL
  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
  const locationsUrl = `${baseUrl}locations`

  const { data, pending, error, refresh } = useFetch<Location[]>(locationsUrl, {
    key: 'locations-fetch',
    server: true,
    lazy: false,
    transform: (locations) => {
      // Any necessary data post-processing can go here
      return locations || []
    }
  })

  const locations = computed(() => data.value || [])

  return {
    locations,
    loading: pending,
    error,
    refresh
  }
}
