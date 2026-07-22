<script setup lang="ts">
import type { Tour } from '~/types/tour'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import { useLocalePath } from '#imports'

defineProps<{
  popularTours?: Tour[]
  loading?: boolean
}>()

const localePath = useLocalePath()
</script>

<template>
  <section class="max-w-[1440px] mx-auto px-6 lg:px-8 relative">
    <!-- Ambient Backdrop Decorative Lights -->
    <div class="absolute inset-0 overflow-hidden lg:overflow-visible pointer-events-none -z-10">
      <div class="absolute top-[15%] md:top-1/4 -left-20 sm:left-4 md:left-10 w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] bg-primary/15 rounded-full blur-3xl" />
    </div>

    <!-- Section Header -->
    <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-6 md:mb-10 gap-6 relative">
      <div class="text-left max-w-2xl space-y-4">
        <BaseBadge 
          variant="primary" 
          size="sm" 
          pulse 
          pulse-color="secondary" 
          class="tracking-[0.2em] text-primary uppercase font-bold"
        >
          Exclusive Offerings
        </BaseBadge>
        
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
          Discover Our <span class="text-primary">Premium Excursions</span>
        </h2>
        
        <p class="text-sm sm:text-base text-zinc-500 leading-relaxed">
          Handcrafted luxury itineraries designed by destination experts to combine historic heritage, private access, and breathtaking mountain vistas.
        </p>
      </div>

      <!-- Top Right Corner CTA (visible on tablet/desktop, hidden on mobile) -->
      <div class="hidden md:block shrink-0 pb-2">
        <BaseButton 
          :to="localePath('/tours')" 
          variant="text" 
          class="font-bold group flex items-center transition-colors"
        >
          <span class="mr-2">Explore All Journeys</span>
          <BaseIcon 
            name="arrow-right" 
            size="sm" 
            custom-class="text-primary transition-colors transform group-hover:translate-x-1 duration-300" 
          />
        </BaseButton>
      </div>
    </div>

    <!-- Tours Responsive Grid / Scroll -->
    <div class="flex overflow-x-auto scroll-smooth snap-mandatory gap-6 pb-6 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:snap-none lg:grid-cols-4 lg:gap-6">
      <template v-if="loading">
        <div 
          v-for="n in 4" 
          :key="n"
          class="w-80 sm:w-96 shrink-0 snap-start md:w-auto h-full"
        >
          <LazyTourCard loading />
        </div>
      </template>
      <template v-else>
        <div 
          v-for="tour in popularTours" 
          :key="tour.id"
          class="w-80 sm:w-96 shrink-0 snap-start md:w-auto h-full"
        >
          <LazyTourCard :tour="tour" />
        </div>
      </template>
    </div>

    <!-- Section-wide CTA (visible on mobile only) -->
    <div class="text-center pt-8 md:hidden">
      <BaseButton 
        :to="localePath('/tours')" 
        variant="secondary" 
        size="md" 
        class="group w-full sm:w-auto"
      >
        <span class="mr-2">Explore All Journeys</span>
        <BaseIcon 
          name="arrow-right" 
          size="sm" 
          custom-class="text-secondary/70 group-hover:text-secondary transition-colors transform group-hover:translate-x-1 duration-300" 
        />
      </BaseButton>
    </div>
  </section>
</template>