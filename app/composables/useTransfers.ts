import type { Transfer } from '~/types/transfer'

export function useTransfers() {
  const { public: { apiUrl } } = useRuntimeConfig()
  
  // Ensure we have a clean base URL
  const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
  const transfersUrl = `${baseUrl}transfers`

  const { data, pending, error, refresh } = useFetch<Transfer[]>(transfersUrl, {
    key: 'transfers-fetch',
    server: true,
    lazy: false,
    transform: (transfers) => {
      // Any necessary data post-processing can go here
      return transfers || []
    }
  })

  const transfers = computed(() => data.value || [])

  return {
    transfers,
    loading: pending,
    error,
    refresh
  }
}
