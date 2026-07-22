<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '#imports'
import type { Transfer } from '~/types/transfer'
import BaseBadge from '~/components/ui/BaseBadge.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  transfer: Transfer
}>()

const { locale } = useI18n()

// Localized Title & Description
const title = computed(() => {
  return locale.value === 'ru' ? props.transfer.ruTitle : props.transfer.enTitle
})

const shortDescription = computed(() => {
  return locale.value === 'ru' ? props.transfer.ruDescription : props.transfer.enDescription
})

const longDescription = computed(() => {
  return locale.value === 'ru' ? props.transfer.ruLongDescription : props.transfer.enLongDescription
})

// Parsed Entrance Fees list
const parsedEntranceFees = computed(() => {
  if (!props.transfer.entranceFees) return []
  if (typeof props.transfer.entranceFees === 'string') {
    try {
      return JSON.parse(props.transfer.entranceFees)
    } catch {
      return []
    }
  }
  return props.transfer.entranceFees
})
</script>

<template>
  <div class="bg-white border border-zinc-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
    <!-- Header: Title and Route Badges -->
    <div class="space-y-3">
      <div class="flex flex-wrap gap-2">
        <BaseBadge
          v-for="tag in transfer.tags"
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

    <!-- Route details: From & To -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-100">
      <div class="flex items-start gap-3">
        <div class="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
          <BaseIcon name="map-pin" size="xs" />
        </div>
        <div>
          <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {{ $t('transfers.departure') }}
          </span>
          <span class="text-sm font-semibold text-zinc-800">
            {{ transfer.fromAddressText }}
          </span>
        </div>
      </div>

      <div class="flex items-start gap-3">
        <div class="p-2.5 rounded-xl bg-secondary/15 text-secondary shrink-0 mt-0.5">
          <BaseIcon name="map-pin" size="xs" />
        </div>
        <div>
          <span class="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            {{ $t('transfers.destination') }}
          </span>
          <span class="text-sm font-semibold text-zinc-800">
            {{ transfer.toAddressText }}
          </span>
        </div>
      </div>
    </div>

    <!-- Price and Distance Grid -->
    <div class="grid grid-cols-2 gap-6 border-y border-zinc-100 py-6">
      <div class="space-y-1">
        <span class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('transfers.cost') }}
        </span>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-zinc-900 font-sans">${{ transfer.minimumPrice }}</span>
          <span class="text-xs font-medium text-zinc-500">
            {{ $t('transfers.for3People') }}
          </span>
        </div>
      </div>

      <div v-if="transfer.distanceFromYerevan" class="space-y-1">
        <span class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {{ $t('transfers.distance') }}
        </span>
        <div class="flex items-baseline gap-1">
          <span class="text-3xl font-black text-zinc-900 font-sans">{{ transfer.distanceFromYerevan }}</span>
          <span class="text-xs font-medium text-zinc-500">
            {{ $t('km') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="space-y-4">
      <h2 class="text-sm font-bold text-zinc-800 uppercase tracking-wider">
        {{ $t('transfers.transferDetail') }}
      </h2>
      <p v-if="shortDescription" class="text-zinc-600 text-sm leading-relaxed font-medium">
        {{ shortDescription }}
      </p>
      <div
        v-if="longDescription"
        class="prose prose-zinc max-w-none text-sm text-zinc-600 leading-relaxed font-normal"
        v-html="longDescription"
      ></div>
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
