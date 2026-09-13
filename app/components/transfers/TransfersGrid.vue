<script setup lang="ts">
import type { Tour } from '~/types/tour'
import TourCard from '~/components/ui/TourCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

defineProps<{
  transfers: Tour[]
}>()
</script>

<template>
  <!-- Transfers Grid -->
  <div
    v-if="transfers.length"
    class="grid gap-6 sm:gap-8 lg:gap-6"
    style="grid-template-columns: repeat(auto-fill, minmax(319px, 1fr));"
  >
    <div
      v-for="(transfer, index) in transfers"
      :key="transfer.id"
      class="animate-fade-in-up"
      :style="{ animationDelay: `${(index % 8) * 60}ms` }"
    >
      <TourCard
        :tour="transfer"
        :is-priority="index === 0"
      />
    </div>
  </div>

  <!-- Empty State -->
  <div
    v-else
    class="flex flex-col items-center justify-center py-20 sm:py-28 text-center"
  >
    <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
      <BaseIcon name="search" size="lg" custom-class="text-zinc-300" />
    </div>
    <h3 class="text-lg sm:text-xl font-bold text-zinc-800 font-serif mb-2">
      {{ $t('transfers.noTransfersFound') }}
    </h3>
    <p class="text-sm text-zinc-400 max-w-sm leading-relaxed">
      {{ $t('transfers.noTransfersDescription') }}
    </p>
  </div>
</template>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out both;
}
</style>
