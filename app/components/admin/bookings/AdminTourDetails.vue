<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import type { Tour } from '~/types/tour'
import { useShowDuration } from '~/composables/useShowDuration'
import TourItinerary from '~/components/ui/TourItinerary.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  tour: Tour
}>()

const { locale } = useI18n()

const title = computed(() => {
  return locale.value === 'ru' ? props.tour.ruTitle : props.tour.enTitle
})

const description = computed(() => {
  return locale.value === 'ru' ? props.tour.ruDescription : props.tour.enDescription
})

const { formattedDuration } = useShowDuration(() => props.tour.duration)
</script>

<template>
  <div class="space-y-6">
    <!-- Header info -->
    <div class="flex items-start gap-4">
      <div v-if="tour.mainImage" class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-zinc-100">
        <img :src="tour.mainImage" class="w-full h-full object-cover" alt="" />
      </div>
      <div class="space-y-2">
        <h4 class="text-lg font-bold text-zinc-900 leading-snug">{{ title }}</h4>
        <div v-if="formattedDuration" class="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
          <BaseIcon name="clock" size="xs" />
          <span>{{ formattedDuration }}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="description" class="space-y-2">
      <h5 class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Նկարագրություն / Description</h5>
      <p class="text-sm text-zinc-600 leading-relaxed font-normal whitespace-pre-line">{{ description }}</p>
    </div>

    <!-- Itinerary / Included Transfers -->
    <div class="border-t border-zinc-100 pt-6">
      <TourItinerary :transfers="tour.transfers" />
    </div>
  </div>
</template>
