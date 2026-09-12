<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import type { Location } from '~/types/location'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  Location: Location
}>()

const { locale } = useI18n()

const title = computed(() => {
  return locale.value === 'ru' ? props.Location.ruTitle : props.Location.enTitle
})

const description = computed(() => {
  return locale.value === 'ru' ? props.Location.ruDescription : props.Location.enDescription
})

const longDescription = computed(() => {
  return locale.value === 'ru' ? props.Location.ruLongDescription : props.Location.enLongDescription
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header info -->
    <div class="flex items-start gap-4">
      <div v-if="Location.mainImage" class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-zinc-100">
        <img :src="Location.mainImage" class="w-full h-full object-cover" alt="" />
      </div>
      <div class="space-y-2">
        <h4 class="text-lg font-bold text-zinc-900 leading-snug">{{ title }}</h4>
        <div v-if="Location.distanceFromYerevan != null" class="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
          <BaseIcon name="map-pin" size="xs" />
          <span>{{ Location.distanceFromYerevan }} km Երևանից</span>
        </div>
      </div>
    </div>

    <!-- Route details -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
      <div class="space-y-1">
        <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">From Location</span>
        <span class="text-sm font-semibold text-zinc-700">{{ Location.fromAddressText || '—' }}</span>
      </div>
      <div class="space-y-1">
        <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">To Location</span>
        <span class="text-sm font-semibold text-zinc-700">{{ Location.toAddressText || '—' }}</span>
      </div>
    </div>

    <!-- Description -->
    <div v-if="description || longDescription" class="space-y-2">
      <h5 class="text-xs font-bold text-zinc-500 uppercase tracking-wider">Նկարագրություն / Description</h5>
      <div 
        v-if="longDescription" 
        class="prose prose-zinc max-w-none text-sm text-zinc-600 leading-relaxed font-normal whitespace-pre-line"
        v-html="longDescription"
      />
      <p v-else class="text-sm text-zinc-600 leading-relaxed font-normal whitespace-pre-line">{{ description }}</p>
    </div>
  </div>
</template>
