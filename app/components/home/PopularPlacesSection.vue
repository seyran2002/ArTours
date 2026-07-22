<script setup lang="ts">
import type { Transfer } from '~/types/transfer';

defineProps<{
  popularTransfers?: Transfer[]
  loading?: boolean
}>()
</script>

<template>
  <section class="max-w-[1440px] mx-auto px-6 lg:px-8 relative">
    <!-- Ambient Backdrop Decorative Lights (Alternating warm/cool pattern) -->
    <div class="absolute inset-0 overflow-hidden lg:overflow-visible pointer-events-none -z-10">
      <div class="absolute bottom-[10%] lg:bottom-[5%] -right-20 sm:right-4 md:right-10 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-secondary/15 rounded-full blur-3xl" />
    </div>

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
          <LazyTransferCard loading />
        </div>
      </template>
      <template v-else>
        <div 
          v-for="place in popularTransfers" 
          :key="place.id"
          class="w-80 sm:w-96 shrink-0 snap-start md:w-auto h-full"
        >
          <LazyTransferCard :transfer="place" />
        </div>
      </template>
    </div>
  </section>
</template>