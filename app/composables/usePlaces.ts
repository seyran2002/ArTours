import { ref, computed, watch, onUnmounted } from 'vue'
import type { Place } from '~/types/place'

const ITEMS_PER_PAGE = 8

export const usePlaces = () => {
  const { transfers } = useTransfersState()

  // Search state
  const searchQuery = ref('')
  const debouncedQuery = ref('')
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  // Category filter state
  const activeCategory = ref('All')

  // Pagination state
  const visibleCount = ref(ITEMS_PER_PAGE)

  // Extract unique categories from place data
  const categories = computed<string[]>(() => {
    const uniqueBadges = [...new Set(transfers.value.map(p => p.badge).filter(Boolean) as string[])]
    return ['All', ...uniqueBadges.sort()]
  })

  // Debounce search input
  const setSearchQuery = (value: string) => {
    searchQuery.value = value
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value
    }, 300)
  }

  // Filtered places: category + search
  const filteredPlaces = computed<Place[]>(() => {
    let result = transfers.value

    // Filter by category / tag ID
    if (activeCategory.value !== 'All') {
      result = result.filter(place => {
        const hasTag = place.tags && place.tags.includes(activeCategory.value)
        const matchesBadge = place.badge === activeCategory.value
        return hasTag || matchesBadge
      })
    }

    // Filter by search query (title, case-insensitive)
    const query = debouncedQuery.value.trim().toLowerCase()
    if (query) {
      result = result.filter(place =>
        place.title.toLowerCase().includes(query)
      )
    }

    return result
  })

  // Visible places (paginated slice)
  const visiblePlaces = computed<Place[]>(() => {
    return filteredPlaces.value.slice(0, visibleCount.value)
  })

  // Whether there are more places to show
  const hasMore = computed(() => {
    return visibleCount.value < filteredPlaces.value.length
  })

  // Load more places
  const loadMore = () => {
    visibleCount.value += ITEMS_PER_PAGE
  }

  // Reset visible count when filters change
  watch([activeCategory, debouncedQuery], () => {
    visibleCount.value = ITEMS_PER_PAGE
  })

  // Cleanup debounce timer
  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Category
    activeCategory,
    categories,

    // Places
    filteredPlaces,
    visiblePlaces,

    // Pagination
    hasMore,
    visibleCount,
    loadMore
  }
}
