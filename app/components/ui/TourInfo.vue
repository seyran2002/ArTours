<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import type { Tour } from '~/types/tour'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import TourItinerary from '~/components/ui/TourItinerary.vue'
import { useShowDuration } from '~/composables/useShowDuration'

const props = defineProps<{
  tour: Tour
}>()

const { locale } = useI18n()

// Localized Title & Description
const title = computed(() => {
  return locale.value === 'ru' ? props.tour.ruTitle : props.tour.enTitle
})

const shortDescription = computed(() => {
  return locale.value === 'ru' ? props.tour.ruDescription : props.tour.enDescription
})

// Parsed Entrance Fees list
const parsedEntranceFees = computed(() => {
  if (!props.tour.entranceFees) return []
  if (typeof props.tour.entranceFees === 'string') {
    try {
      return JSON.parse(props.tour.entranceFees)
    } catch {
      return []
    }
  }
  return props.tour.entranceFees
})

const { formattedDuration } = useShowDuration(() => props.tour.duration)

const parsedMealOptions = computed(() => {
  if (!props.tour.mealOptions) return { breakfast: false, lunch: false, dinner: false }
  return typeof props.tour.mealOptions === 'string'
    ? JSON.parse(props.tour.mealOptions)
    : props.tour.mealOptions
})

const hasMeals = computed(() => {
  const meals = parsedMealOptions.value
  return meals.breakfast || meals.lunch || meals.dinner
})
</script>

<template>
  <div class="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
    <!-- Header: Title and Route Badges -->
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <BaseBadge
          v-for="tag in tour.tags"
          :key="tag.id"
          class="bg-primary/10 text-primary border-none text-xs font-semibold px-3 py-1 rounded-full"
        >
          {{ tag[`${locale}Name`] }}
        </BaseBadge>
      </div>
      
      <h1 class="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight leading-tight">
        {{ title }}
      </h1>
    </div>

    <!-- Duration, Locations & Price Grid -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 border-y border-zinc-100 py-6">
      <div class="space-y-1">
        <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('tours.pricingFrom') }}
        </span>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-zinc-900 font-sans">${{ tour.minimumPrice }}</span>
          <span class="text-xs font-medium text-zinc-500">
            / {{ $t('tours.for3People') }}
          </span>
        </div>
      </div>

      <div v-if="formattedDuration" class="space-y-1">
        <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('tours.duration') }}
        </span>
        <div class="flex items-baseline gap-1">
          <span class="text-base sm:text-xl font-bold text-zinc-950 tracking-tight pt-1">
            {{ formattedDuration }}
          </span>
        </div>
      </div>

      <div v-if="tour.transfers?.length" class="space-y-1 col-span-2 md:col-span-1">
        <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          {{ tour.transfers.length === 1 ? $t('tours.location') : $t('tours.locations') }}
        </span>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-zinc-900 font-sans">
            {{ tour.transfers.length }}
          </span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-4">
      <h2 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
        {{ $t('tours.tourDetail') }}
      </h2>
      <p v-if="shortDescription" class="text-zinc-600 text-sm leading-relaxed font-medium">
        {{ shortDescription }}
      </p>
    </div>

    <!-- Hotel & Meals Details Section (Only if overnight) -->
    <div v-if="tour.isOvernight" class="border-t border-zinc-100 pt-6 space-y-4">
      <h2 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
        {{ $t('tour.hotel') }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-zinc-200/60 rounded-3xl bg-zinc-50/20">
        <!-- Hotel rating -->
        <div class="flex flex-col justify-center space-y-2">
          <span class="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            {{ $t('tour.starRating') }}
          </span>
          <div class="flex items-center gap-1">
            <span v-if="tour.starRating" class="flex gap-1">
              <BaseIcon
                v-for="star in 5"
                :key="star"
                name="star"
                :size="20"
                :custom-class="star <= tour.starRating ? 'text-amber-500 fill-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.2)]' : 'text-zinc-200'"
              />
            </span>
            <span v-else class="text-xs text-zinc-400 italic">No star rating specified</span>
          </div>
        </div>

        <!-- Meals -->
        <div class="flex flex-col space-y-2">
          <span class="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            {{ $t('tour.mealOptions') }}
          </span>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="meal in (['breakfast', 'lunch', 'dinner'] as const)"
              :key="meal"
              class="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200"
              :class="[
                parsedMealOptions[meal]
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100/60'
                  : 'bg-zinc-50 text-zinc-400 border-zinc-200/40 opacity-60'
              ]"
            >
              <BaseIcon
                :name="parsedMealOptions[meal] ? 'check' : 'x'"
                size="xs"
                :custom-class="parsedMealOptions[meal] ? 'text-emerald-600' : 'text-zinc-400'"
              />
              <span>{{ $t(`tour.${meal}`) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Itinerary Timeline Component -->
    <div class="border-t border-zinc-100 pt-6">
      <TourItinerary :transfers="tour.transfers" />
    </div>

    <!-- Optional Entrance Fees -->
    <div v-if="parsedEntranceFees.length > 0" class="space-y-4 border-t border-zinc-100 pt-6">
      <h2 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
        {{ $t('transfers.entranceFees') }}
      </h2>
      <div class="space-y-2.5">
        <div
          v-for="(fee, index) in parsedEntranceFees"
          :key="index"
          class="flex items-center justify-between p-3.5 bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-100 rounded-xl transition-colors duration-200"
        >
          <span class="text-xs font-semibold text-zinc-700">
            {{ fee[`${locale}Name`] }}
          </span>
          <span class="text-xs font-bold text-zinc-900 font-sans">֏{{ fee.fee }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
