<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tag } from '~/types/tag'
import type { Tour } from '~/types/tour'
import { useTours } from '~/composables/useTours'
import { usePagination } from '~/composables/usePagination'
import { useTag } from '~/composables/useTag'
import { useI18n } from '#imports'
import ToursHeader from '~/components/tours/ToursHeader.vue'
import ToursSearch from '~/components/tours/ToursSearch.vue'
import ToursFilters from '~/components/tours/ToursFilters.vue'
import ToursGrid from '~/components/tours/ToursGrid.vue'
const { locale, t } = useI18n()

useHead({
  title: locale.value === 'ru' ? 'Туры — ArTours | Экскурсии и приключения' : 'Tours — ArTours | Curated Excursions & Adventures',
  meta: [
    {
      name: 'description',
      content: locale.value === 'ru'
        ? 'Авторские маршруты, разработанные экспертами. От осенних туров до адреналиновых приключений — найдите идеальную экскурсию.'
        : 'Explore handcrafted tour itineraries designed by destination experts. From autumn specials to adrenaline-fueled adventures — find your perfect excursion.'
    }
  ]
})

// Data Fetching
const { tours, loading } = useTours()
const tag = useTag()
const { public: { apiUrl } } = useRuntimeConfig()
const route = useRoute();

// Initialize Tags
const tagsUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}tags`
const { data: fetchedTags } = await useFetch<Tag[]>(tagsUrl, { key: 'tour-tag-fetch', server: true })

// Search & Filtering State
const searchQuery = ref('')
const activeCategory = ref('all')

if (fetchedTags.value) {
  tag.tags.value = fetchedTags.value;
  activeCategory.value = route.query.tag as string || 'all';
}
const tags = computed(() => tag.tags.value)


const setSearchQuery = (query: string) => {
  searchQuery.value = query
}

// Client-side Filtering Logic
const filteredTours = computed(() => {
  let result = tours.value

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    const titleKey = `${locale.value}Title` as keyof Tour
    const descKey = `${locale.value}Description` as keyof Tour

    result = result.filter(t =>
      (t[titleKey] as string)?.toLowerCase().includes(q) ||
      (t[descKey] as string)?.toLowerCase().includes(q)
    )
  }

  // Category filter
  if (activeCategory.value !== 'all') {
    result = result.filter(t =>
      t.tags?.some(tag => tag.id === activeCategory.value)
    )
  }

  return result
})

// Pagination Logic
const {
  paginatedItems: visibleTours,
  hasMore,
  visibleCount,
  loadMore
} = usePagination(filteredTours, 8)

</script>

<template>
  <section class="relative pt-[120px] pb-12 sm:pt-[136px] sm:pb-16 md:pt-[160px] md:pb-20 overflow-hidden">
    <!-- Ambient Decorative Blobs -->
    <div class="absolute inset-0 pointer-events-none -z-10">
      <div class="absolute top-20 -right-20 sm:right-4 md:right-30 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] bg-primary/30 lg:bg-secondary/20 rounded-full blur-3xl" />
      <div class="absolute bottom-[15%] -left-20 sm:left-4 md:left-1/3 lg:left-20 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] bg-secondary/20 lg:bg-primary/30 rounded-full blur-3xl" />
    </div>

    <div class="max-w-[1440px] mx-auto px-6 lg:px-8">
      <!-- Header -->
      <ToursHeader />

      <!-- Search & Filters Bar -->
      <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-start mb-8 sm:mb-10">
        <div class="w-full sm:max-w-sm">
          <ToursSearch
            :model-value="searchQuery"
            @update:model-value="setSearchQuery"
          />
        </div>

        <div class="flex-1 flex items-center sm:pt-1">
          <ToursFilters
            :tags="tags"
            :active-category="activeCategory"
            @update:active-category="activeCategory = $event"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !tours.length" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <!-- Tours Grid -->
      <ToursGrid v-else :tours="visibleTours" />

      <!-- Load More -->
      <LazyToursLoadMore
        :has-more="hasMore"
        :total-filtered="filteredTours.length"
        :visible-count="visibleCount"
        @load-more="loadMore"
      />
    </div>
  </section>
</template>
