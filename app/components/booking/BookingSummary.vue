<script setup lang="ts">
import type { BookingType, PriceBreakdown } from '~/types/booking'

defineProps<{
  type: BookingType
  entityTitle: string
  peopleCount: number
  breakdown: PriceBreakdown
  /** Optional formatted travel date to display (e.g. "Fri, August 15, 2026") */
  travelDate?: string
}>()  
</script>

<template>
  <div class="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-3xl p-6 text-white space-y-5 shadow-2xl">
    <!-- Header -->
    <div>
      <span class="text-[9px] tracking-[0.2em] text-teal-300 uppercase font-extrabold block mb-1">
        {{ type === 'TOUR' ? $t('booking.form.summary.tourTitle') : $t('booking.form.summary.transferTitle') }}
      </span>
      <h4 class="text-base font-bold leading-snug text-white">{{ entityTitle }}</h4>
    </div>

    <div class="border-t border-white/10" />

    <!-- People -->
    <div class="flex items-center justify-between text-sm">
      <span class="text-zinc-400 font-medium">{{ $t('booking.form.summary.travelers') }}</span>
      <span class="font-bold text-white bg-white/10 px-3 py-0.5 rounded-full">
        {{ peopleCount }} {{ $t('booking.form.summary.pax') }}
      </span>
    </div>

    <!-- Travel Date -->
    <div v-if="travelDate" class="flex items-center justify-between text-sm">
      <span class="text-zinc-400 font-medium">{{ $t('booking.form.summary.travelDate') }}</span>
      <span class="font-bold text-teal-300 flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {{ travelDate }}
      </span>
    </div>

    <!-- Group discount badge -->
    <div
      v-if="breakdown.groupTierApplied"
      class="flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-xl px-3 py-2 text-xs font-semibold text-secondary"
    >
      <span>🏷</span>
      <span>{{ $t('booking.form.summary.discountStr') }}</span>
    </div>

    <!-- Price Breakdown -->
    <div class="space-y-2 text-sm">
      <div class="flex justify-between text-zinc-400">
        <span>{{ $t('booking.form.summary.subtotal') }}</span>
        <span class="font-semibold text-white">${{ breakdown.original.toFixed(2) }}</span>
      </div>
      <div v-if="breakdown.groupTierApplied" class="flex justify-between text-emerald-400">
        <span>10% {{ $t('booking.form.summary.discount') }}</span>
        <span class="font-semibold">−${{ breakdown.discountAmount.toFixed(2) }}</span>
      </div>
      <div class="border-t border-white/10 pt-3 flex justify-between">
        <span class="font-bold text-white text-base">{{ $t('booking.form.summary.total') }}</span>
        <span class="font-black text-secondary text-xl">${{ breakdown.discounted.toFixed(2) }}</span>
      </div>
    </div>

    <div class="border-t border-white/10" />

    <!-- Payment & Booking type -->
    <div class="space-y-3 text-xs">
      <div class="flex items-center justify-between">
        <span class="text-zinc-400 uppercase tracking-wider font-bold">{{ $t('booking.form.summary.payment') }}</span>
        <span class="font-bold text-white bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
          💵 {{ $t('booking.form.summary.cash') }}
        </span>
      </div>
      <div class="flex items-center justify-between">
        <span class="text-zinc-400 uppercase tracking-wider font-bold">{{ $t('booking.form.summary.type') }}</span>
        <span
          :class="[
            'font-bold px-3 py-1 rounded-full text-xs',
            type === 'TOUR'
              ? 'bg-primary/20 text-teal-300 border border-primary/30'
              : 'bg-secondary/20 text-secondary border border-secondary/30'
          ]"
        >
          {{ type === 'TOUR' ?  $t('booking.form.summary.tour')  : $t('booking.form.summary.transfer') }}
        </span>
      </div>
    </div>

    <!-- Reassurance note -->
    <div class="bg-white/5 rounded-2xl p-3 text-xs text-zinc-400 leading-relaxed">
      ✅ {{ $t('booking.form.summary.cancellationStr') }}
    </div>
  </div>
</template>
