<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import type { Tour } from '~/types/tour'

const props = defineProps<{
  locations: Tour['locations']
}>()

const { locale } = useI18n()

const sortedLocations = computed(() => {
  if (!props.locations) return []
  return [...props.locations].sort((a, b) => a.order - b.order)
})
</script>

<template>
  <div class="space-y-6">
    <h3 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
      {{ $t('tours.tourItinerary') }}
    </h3>
    
    <div v-if="sortedLocations.length === 0" class="text-sm text-zinc-500 italic">
      No itinerary steps available.
    </div>

    <div v-else class="relative border-l border-zinc-200/80 ml-4 pl-8 space-y-8">
      <div 
        v-for="(TourLocation, index) in sortedLocations" 
        :key="TourLocation.id || index"
        class="relative group"
      >
        <!-- Circle indicator on timeline line -->
        <span class="absolute -left-[48px] top-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold ring-4 ring-white shadow-sm transition-transform duration-300 group-hover:scale-110">
          {{ index + 1 }}
        </span>

        <div class="space-y-2">
          <!-- Step Title -->
          <h4 class="text-base font-bold text-zinc-800 transition-colors duration-250 group-hover:text-primary">
            {{ locale === 'ru' ? TourLocation.Location.ruTitle : TourLocation.Location.enTitle }}
          </h4>

          <!-- Step Long Description -->
          <div 
            v-if="locale === 'ru' ? TourLocation.Location.ruLongDescription : TourLocation.Location.enLongDescription"
            class="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal"
            v-html="locale === 'ru' ? TourLocation.Location.ruLongDescription : TourLocation.Location.enLongDescription"
          ></div>
          <p 
            v-else
            class="text-xs sm:text-sm text-zinc-500 italic"
          >
            {{ locale === 'ru' ? TourLocation.Location.ruDescription : TourLocation.Location.enDescription }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
