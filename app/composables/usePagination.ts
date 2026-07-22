import { ref, computed, watch, type Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]>, initialSize = 8) {
  const pageSize = ref(initialSize)
  const visibleCount = ref(initialSize)

  // Reset visible count when items change (e.g. searching/filtering)
  watch(items, () => {
    visibleCount.value = initialSize
  }, { deep: false })

  const paginatedItems = computed(() => {
    return items.value.slice(0, visibleCount.value)
  })

  const hasMore = computed(() => {
    return visibleCount.value < items.value.length
  })

  const loadMore = () => {
    if (hasMore.value) {
      visibleCount.value += pageSize.value
    }
  }

  return {
    pageSize,
    visibleCount,
    paginatedItems,
    hasMore,
    loadMore
  }
}
