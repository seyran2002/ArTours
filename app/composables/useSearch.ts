import { ref, computed, watch, onUnmounted } from 'vue'
import { useApiClient } from '~/services/api'
import type { SearchResult, SearchResponse } from '~/types/search'

export function useSearch(options: { limit?: number } = {}) {
  const client = useApiClient()
  const query = ref('')
  const results = ref<SearchResult[]>([])
  const loading = ref(false)
  // const error = ref<any>(null)

  const page = ref(1)
  const total = ref(0)
  const limit = ref(options.limit || 10)

  let abortController: AbortController | null = null
  let debounceTimeout: ReturnType<typeof setTimeout> | null = null

  const hasMore = computed(() => {
    // Stop loading if the results array has reached or exceeded the total count
    return results.value.length < total.value
  })

  // Performs the actual API request
  const fetchResults = async (targetPage: number, append: boolean = false) => {
    // If we already loaded all items, do not call API
    if (targetPage > 1 && results.value.length >= total.value) {
      return
    }

    // Cancel previous request if any
    if (abortController) {
      abortController.abort()
    }

    const currentController = new AbortController()
    abortController = currentController
    loading.value = true
    // error.value = null

    try {
      const response = await client.get<SearchResponse>('/search', {
        signal: currentController.signal,
        query: {
          q: query.value.trim(),
          page: targetPage,
          limit: limit.value
        }
      })

      // Only update state if this request wasn't superseded by a newer one
      if (abortController === currentController) {
        if (append) {
          results.value = [...results.value, ...response.data]
        } else {
          results.value = response.data
        }

        total.value = response.total
        page.value = response.page
      }
    } catch (err: any) {
      // if (abortController === currentController) {
      //   // Only set error if this was the active request and it wasn't cancelled
      //   // if (err.name !== 'AbortError' && !(err.message && err.message.includes('abort'))) {
      //   //   error.value = err
      //   // }
      // }
    } finally {
      if (abortController === currentController) {
        loading.value = false
      }
    }
  }

  const triggerSearch = () => {
    // Reset page and total counts when query changes
    page.value = 1
    total.value = 0

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    // Abort active in-flight request immediately on query change
    if (abortController) {
      abortController.abort()
      abortController = null
    }

    const trimmedQuery = query.value.trim()
    if (trimmedQuery.length < 2) {
      results.value = []
      loading.value = false
      return
    }

    // Show loading immediately to feel responsive
    loading.value = true
    debounceTimeout = setTimeout(() => {
      fetchResults(1, false)
    }, 300)
  }

  const loadMore = async () => {
    // Avoid duplicate requests or requesting past total limits
    if (loading.value || !hasMore.value) {
      return
    }

    const nextPage = page.value + 1
    await fetchResults(nextPage, true)
  }

  // const reset = () => {
  //   query.value = ''
  //   results.value = []
  //   page.value = 1
  //   total.value = 0
  //   loading.value = false
  //   error.value = null
  //   if (abortController) {
  //     abortController.abort()
  //     abortController = null
  //   }
  //   if (debounceTimeout) {
  //     clearTimeout(debounceTimeout)
  //     debounceTimeout = null
  //   }
  // }

  // Watch query changes and automatically trigger search
  watch(query, () => {
    triggerSearch()
  })

  onUnmounted(() => {
    if (abortController) abortController.abort()
    if (debounceTimeout) clearTimeout(debounceTimeout)
  })

  return {
    query,
    results,
    loading,
    // error,
    // hasMore,
    page,
    total,
    loadMore,
    // reset
  }
}
