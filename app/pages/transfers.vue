<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Tag } from '~/types/tag'
import { useTransfers } from '~/composables/useTransfers'
import { usePagination } from '~/composables/usePagination'
import { useTag } from '~/composables/useTag'
import { useI18n } from '#imports'
import TransfersHeader from '~/components/transfers/TransfersHeader.vue'
import TransfersSearch from '~/components/transfers/TransfersSearch.vue'
import TransfersFilters from '~/components/transfers/TransfersFilters.vue'
import TransfersGrid from '~/components/transfers/TransfersGrid.vue'
import TransfersLoadMore from '~/components/transfers/TransfersLoadMore.vue'
import type { Transfer } from '~/types/transfer'

const { locale } = useI18n()
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo({
  titleKey: 'seo.transfers.title',
  descriptionKey: 'seo.transfers.description',
  keywordsKey: 'seo.transfers.keywords',
  ogTitleKey: 'seo.transfers.ogTitle',
  ogDescriptionKey: 'seo.transfers.ogDescription',
  siteNameKey: 'seo.transfers.siteName',
  schemas: ['Organization', 'WebSite']
})

// Data Fetching
const { transfers, loading } = useTransfers()
const tag = useTag()
const { public: { apiUrl } } = useRuntimeConfig()

// Initialize Tags
const tagsUrl = `${apiUrl.endsWith('/') ? apiUrl : apiUrl + '/'}tags`
const { data: fetchedTags } = await useFetch<Tag[]>(tagsUrl, { key: 'tag-fetch', server: true })

if (fetchedTags.value) {
  tag.tags.value = fetchedTags.value
}
const tags = computed(() => tag.tags.value)

// Search & Filtering State
const searchQuery = ref('')
const activeCategory = ref('all')

const setSearchQuery = (query: string) => {
  searchQuery.value = query
}

// Client-side Filtering Logic
const filteredTransfers = computed(() => {
  let result = transfers.value

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    const titleKey = `${locale.value}Title` as keyof Transfer;
    const descKey = `${locale.value}Description` as keyof Transfer;

    result = result.filter(t => 
      (t[titleKey] as string)?.toLowerCase().includes(q) || 
      (t[descKey] as string)?.toLowerCase().includes(q)
    )
    console.log(result)
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
  paginatedItems: visibleTransfers, 
  hasMore, 
  visibleCount, 
  loadMore 
} = usePagination(filteredTransfers, 8)

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
      <TransfersHeader />

      <!-- Search & Filters Bar -->
      <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-start mb-8 sm:mb-10">
        <div class="w-full sm:max-w-sm">
          <TransfersSearch
            :model-value="searchQuery"
            @update:model-value="setSearchQuery"
          />
        </div>

        <div class="flex-1 flex items-center sm:pt-1">
          <TransfersFilters
            :tags="tags"
            :active-category="activeCategory"
            @update:active-category="activeCategory = $event"
          />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !transfers.length" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>

      <!-- Transfers Grid -->
      <TransfersGrid v-else :transfers="visibleTransfers" />

      <!-- Load More -->
      <TransfersLoadMore
        :has-more="hasMore"
        :total-filtered="filteredTransfers.length"
        :visible-count="visibleCount"
        @load-more="loadMore"
      />
    </div>
  </section>
</template>