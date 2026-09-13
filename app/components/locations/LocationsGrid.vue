<script setup lang="ts">
import type { Location } from '~/types/location'
import LocationCard from '~/components/ui/LocationCard.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import { useI18n } from '#imports'

const { locale } = useI18n()

defineProps<{
  locations: Location[]
}>()
</script>

<template>
  <!-- locations Grid -->
  <div
    v-if="locations.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6"
  >
    <div
      v-for="(loc, index) in locations"
      :key="loc.id"
      class="animate-fade-in-up"
      :style="{ animationDelay: `${(index % 8) * 60}ms` }"
    >
      <LocationCard
        :location="loc"
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
      {{ locale === 'ru' ? 'Локации не найдены' : locale === 'hy' ? 'Ուղղություններ չեն գտնվել' : 'No locations found' }}
    </h3>
    <p class="text-sm text-zinc-400 max-w-sm leading-relaxed">
      {{ locale === 'ru' ? 'Мы не смогли найти локации, соответствующие вашим критериям. Попробуйте изменить поиск или фильтры.' : locale === 'hy' ? 'Ձեր չափանիշներին համապատասխան վայրեր չեն գտնվել: Փորձեք փոխել որոնումը կամ զտիչները:' : "We couldn't find any locations matching your criteria. Try adjusting your search or filters." }}
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
