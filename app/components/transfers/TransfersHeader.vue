<script setup lang="ts">
import BaseBadge from '~/components/ui/BaseBadge.vue'
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-8 sm:mb-12 gap-6 relative">
    <div class="text-left max-w-2xl space-y-4">
      <BaseBadge 
        variant="primary" 
        size="sm" 
        pulse 
        pulse-color="secondary" 
        class="tracking-[0.2em] text-primary uppercase font-bold"
      >
        {{ $t('transfers.badge') }}
      </BaseBadge>
      
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight font-serif leading-tight">
        {{ $t('transfers.titlePart1') }} <span class="text-primary">{{ $t('transfers.titlePart2') }}</span>
      </h1>
      
      <p class="text-sm sm:text-base text-zinc-500 leading-relaxed">
        {{ $t('transfers.description') }}
      </p>
    </div>
  </div>
</template>
