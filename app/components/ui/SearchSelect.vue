<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useI18n } from '#imports'
import { useSearch } from '~/composables/useSearch'
import type { SearchResult } from '~/types/search'

const router = useRouter()
const { locale } = useI18n()

// Retrieve search state and methods from the composable
const { query, results, loading, loadMore } = useSearch({ limit: 10 })

const isOpen = ref(false)
const focusedIndex = ref(-1)
const searchSelectRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)

// Selection handler
const selectItem = (item: SearchResult) => {
  isOpen.value = false
  focusedIndex.value = -1
  
  // Navigate to the dynamic detail page: /type/id/slug
  router.push(`/${item.type}/${item.id}/${item.slug}`)
}

// Global search submit handler
const onSearchSubmit = () => {
  if (focusedIndex.value >= 0 && results.value[focusedIndex.value]) {
    selectItem(results.value[focusedIndex.value])
  } else {
    // If no specific item is highlighted, go to /tours with query
    if (query.value.trim()) {
      isOpen.value = false
      router.push({
        path: '/tours',
        query: { q: query.value.trim() }
      })
    }
  }
}

// Keyboard Navigation handlers
const onKeyDown = () => {
  if (results.value.length === 0) return
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  focusedIndex.value = (focusedIndex.value + 1) % results.value.length
  scrollToHighlighted()
}

const onKeyUp = () => {
  if (results.value.length === 0) return
  if (!isOpen.value) {
    isOpen.value = true
    return
  }
  focusedIndex.value = (focusedIndex.value - 1 + results.value.length) % results.value.length
  scrollToHighlighted()
}

const onKeyEnter = () => {
  onSearchSubmit()
}

const onKeyEsc = () => {
  isOpen.value = false
  focusedIndex.value = -1
}

// Scroll list to align with highlighted item
const scrollToHighlighted = () => {
  nextTick(() => {
    if (!listRef.value) return
    const listEl = listRef.value
    const items = listEl.querySelectorAll('.search-item')
    const itemEl = items[focusedIndex.value] as HTMLElement
    if (!itemEl) return

    const listTop = listEl.scrollTop
    const listBottom = listTop + listEl.clientHeight
    const itemTop = itemEl.offsetTop
    const itemBottom = itemTop + itemEl.clientHeight

    if (itemTop < listTop) {
      listEl.scrollTop = itemTop
    } else if (itemBottom > listBottom) {
      listEl.scrollTop = itemBottom - listEl.clientHeight
    }
  })
}

// Infinite scroll trigger
const onDropdownScroll = (event: Event) => {
  const target = event.target as HTMLElement
  
  // If the user scrolled to bottom (within 20px threshold), request next page
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 20) {
    loadMore()
  }
}

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (searchSelectRef.value && !searchSelectRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="searchSelectRef" class="relative z-50 w-full max-w-2xl mx-auto">
    <!-- Search Bar Form Wrapper -->
    <form @submit.prevent="onSearchSubmit" class="w-full">
      <div 
        class="flex items-center bg-white backdrop-blur-md rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 transition-all duration-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.25)] focus-within:ring-2 focus-within:ring-secondary/40 focus-within:shadow-[0_24px_60px_rgba(248,155,31,0.12)]"
      >
        <!-- Search Icon -->
        <div class="pl-5 sm:pl-6 flex items-center pointer-events-none text-zinc-400 shrink-0">
          <BaseIcon name="search" size="md" />
        </div>

        <!-- Input field -->
        <BaseInput
          v-model="query"
          :placeholder="$t('home.hero.searchPlaceholder')"
          size="lg"
          aria-label="Search destinations"
          class="flex-1 text-zinc-800 placeholder-zinc-400"
          @focus="isOpen = true"
          @keydown.down.prevent="onKeyDown"
          @keydown.up.prevent="onKeyUp"
          @keydown.enter.prevent="onKeyEnter"
          @keydown.esc="onKeyEsc"
        />

        <!-- Loading spinner and Search Button -->
        <div class="pr-2 py-2 shrink-0 flex items-center gap-2">
          <!-- Mini loading spinner inside input -->
          <div v-if="loading && results.length === 0" class="animate-spin text-primary mr-2" aria-hidden="true">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <BaseButton
            type="submit"
            variant="primary"
            size="md"
            aria-label="Search tours"
            class="rounded-full shadow-md hover:shadow-primary/25"
          >
            <span class="hidden sm:inline">{{ $t('home.hero.search') }}</span>
            <BaseIcon name="search" size="sm" custom-class="sm:hidden text-white" />
          </BaseButton>
        </div>
      </div>
    </form>

    <!-- Autocomplete Dropdown List -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="isOpen && query.trim().length >= 2"
        class="absolute left-0 right-0 mt-3 z-50 bg-white backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-zinc-100 overflow-hidden flex flex-col max-h-[380px]"
      >
        <!-- Dropdown Container -->
        <div
          ref="listRef"
          class="overflow-y-auto flex-1 divide-y divide-zinc-100"
          @scroll="onDropdownScroll"
        >
          <!-- 1. Centered initial loading indicator -->
          <div v-if="loading && results.length === 0" class="py-12 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <div class="animate-spin text-primary">
              <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span class="text-xs font-semibold uppercase tracking-wider text-zinc-400/80">{{$t('home.hero.searching')}}</span>
          </div>

          <!-- 2. Results list -->
          <div v-else-if="results.length > 0">
            <div
              v-for="(item, index) in results"
              :key="item.id"
              :class="[
                'search-item px-5 py-3.5 flex items-center gap-4 cursor-pointer transition-colors duration-150',
                index === focusedIndex ? 'bg-primary/5 text-primary' : 'hover:bg-zinc-50/80 text-zinc-800'
              ]"
              @click="selectItem(item)"
              @mouseenter="focusedIndex = index"
            >
              <!-- Thumbnail Image -->
              <div class="h-12 w-16 rounded-xl overflow-hidden shrink-0 bg-zinc-100 border border-zinc-200/50 shadow-sm">
                <img
                  v-if="item.image"
                  :src="item.image"
                  class="h-full w-full object-cover transition-transform duration-300"
                  alt=""
                />
                <div v-else class="h-full w-full flex items-center justify-center text-zinc-400 bg-zinc-50">
                  <BaseIcon :name="item.type === 'tour' ? 'tours' : 'transfer'" size="sm" />
                </div>
              </div>

              <!-- Title, Details & Badges -->
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-sm truncate leading-tight text-left text-zinc-900 group-hover:text-primary">
                  {{ item[`${locale}Title`] }}
                </h4>
                <div class="flex items-center gap-2 mt-1.5">
                  <span 
                    class="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full"
                    :class="item.type === 'tour' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'"
                  >
                    <span class="w-1 h-1 rounded-full" :class="item.type === 'tour' ? 'bg-emerald-500' : 'bg-amber-500'" />
                    {{ item.type === 'tour' ? 'Tour' : 'Transfer' }}
                  </span>
                </div>
              </div>

              <!-- Action Indicator -->
              <div 
                class="text-zinc-300 transition-transform duration-200"
                :class="index === focusedIndex ? 'translate-x-1 text-primary' : ''"
              >
                <BaseIcon name="arrow-right" size="sm" />
              </div>
            </div>
          </div>

          <!-- 3. No results state -->
          <div
            v-else-if="results.length === 0 && !loading"
            class="px-6 py-12 text-center text-zinc-400 flex flex-col items-center justify-center gap-2"
          >
            <BaseIcon name="alert-circle" size="lg" custom-class="text-zinc-300" />
            <span class="text-sm font-semibold tracking-wide mt-1">{{ $t('home.hero.noResults') }}</span>
          </div>

          <!-- 4. Loading indicator for infinite scroll (page 2+) -->
          <div
            v-if="loading && results.length > 0"
            class="py-4 border-t border-zinc-50 flex justify-center items-center gap-2 text-zinc-400 text-xs font-semibold"
          >
            <div class="animate-spin text-primary">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <span>{{ $t('transfers.loading') || 'Loading...' }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Custom scrollbar styles for search items list */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(18, 83, 78, 0.1);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(18, 83, 78, 0.25);
}
</style>
