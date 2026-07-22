<script setup lang="ts">
import type { Transfer } from '~/types/transfer'
import TransferCard from '~/components/ui/TransferCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useI18n } from '#imports'

const { locale } = useI18n()

defineProps<{
  transfers: Transfer[]
}>()
</script>

<template>
  <!-- Transfers Grid -->
  <div
    v-if="transfers.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6"
  >
    <div
      v-for="(transfer, index) in transfers"
      :key="transfer.id"
      class="animate-fade-in-up"
      :style="{ animationDelay: `${(index % 8) * 60}ms` }"
    >
      <TransferCard
        :transfer="transfer"
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
      {{ locale === 'ru' ? 'Трансферы не найдены' : 'No transfers found' }}
    </h3>
    <p class="text-sm text-zinc-400 max-w-sm leading-relaxed">
      {{ locale === 'ru' ? 'Мы не смогли найти трансферы, соответствующие вашим критериям. Попробуйте изменить поиск или фильтры.' : "We couldn't find any transfers matching your criteria. Try adjusting your search or filters." }}
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
