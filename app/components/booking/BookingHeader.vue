<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useLocalePath } from '#imports'

const localePath = useLocalePath()
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-8 md:mb-12 gap-6 relative">
    <div class="text-left max-w-2xl space-y-4">
      <BaseBadge 
        variant="primary" 
        size="sm" 
        pulse 
        pulse-color="secondary" 
        class="tracking-[0.2em] text-primary uppercase font-bold"
      >
        {{ $t('booking.badge') }}
      </BaseBadge>
      
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
        {{ $t('booking.title1') }} <span class="text-primary">{{ $t('booking.title2') }}</span>
      </h1>
      
      <p class="text-sm sm:text-base text-zinc-500 leading-relaxed">
        {{ $t('booking.description') }}
      </p>
    </div>

    <!-- Back to tours button on the right for tablet/desktop -->
    <div class="hidden md:block shrink-0 pb-2">
      <NuxtLink 
        :to="localePath('/tours')" 
        class="font-bold group flex items-center transition-colors text-primary hover:text-teal-950 text-sm"
      >
        <span class="mr-2">{{ $t('booking.exploreButton') }}</span>
        <BaseIcon 
          name="arrow-right" 
          size="sm" 
          custom-class="text-primary transition-colors transform group-hover:translate-x-1 duration-300" 
        />
      </NuxtLink>
    </div>
  </div>
</template>
