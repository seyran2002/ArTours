<script setup lang="ts">
import type { Location } from '~/types/location';

defineProps<{
  popularLocations?: Location[]
  loading?: boolean
}>()
</script>

<template>
  <section class="max-w-[1440px] mx-auto px-6 lg:px-8 relative">
    <!-- Section Header -->
    <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-12 gap-6 relative">
      <div class="text-left max-w-3xl space-y-4">
        <LazyBaseBadge 
          variant="primary" 
          size="sm" 
          pulse 
          pulse-color="secondary" 
          class="tracking-[0.2em] text-primary uppercase font-bold"
        >
          {{ $t('home.popularDestinations.badge') }}
        </LazyBaseBadge>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
          {{ $t('home.popularDestinations.titlePart1') }} <span class="text-primary">{{ $t('home.popularDestinations.titlePart2') }}</span>
        </h2>
        
        <p class="text-sm sm:text-base text-zinc-500 leading-relaxed">{{ $t('home.popularDestinations.description') }}</p>
      </div>
    </div>

    <!-- Places Responsive Grid / Scroll -->
    <div class="flex overflow-x-auto scroll-smooth snap-mandatory gap-6 pb-6 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:snap-none lg:grid-cols-4 lg:gap-6">
      <template v-if="loading">
        <div 
          v-for="n in 4" 
          :key="n"
          class="w-80 sm:w-96 shrink-0 snap-start md:w-auto h-full"
        >
          <LazyLocationCard loading />
        </div>
      </template>
      <template v-else>
        <div 
          v-for="place in popularLocations" 
          :key="place.id"
          class="w-80 sm:w-96 shrink-0 snap-start md:w-auto h-full"
        >
          <LazyLocationCard :Location="place" />
        </div>
      </template>
    </div>
  </section>
</template>