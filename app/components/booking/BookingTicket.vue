<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import type { Booking } from '~/types/booking';
import { useShowDuration } from '~/composables/useShowDuration'
import { canCancelBooking } from '~/composables/useCancelBooking'

const props = defineProps<{
  booking: Booking
  /** Raw ISO travel date string from API, used for the 48-hour cancellation guard */
  rawTravelDate?: string
}>()

const emit = defineEmits<{
  downloadPdf: []
  emailReceipt: []
  'cancel-requested': []
}>()

const { locale } = useI18n()
const { formattedDuration } = useShowDuration(() => props.booking.duration)

const eligibleForCancellation = computed(() =>
  canCancelBooking(props.booking, props.rawTravelDate ?? '')
)
</script>

<template>
  <div class="space-y-6">
    <!-- Stylized Ticket Card -->
    <div class="bg-gradient-to-br from-primary to-emerald-950 text-white rounded-[32px] overflow-hidden relative shadow-lg">
      
      <!-- Ticket Punching Circles (Blend into layout background) -->
      <div class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3.5 w-7 h-7 bg-[#fafafa] rounded-full border-r border-zinc-200/20 z-20 pointer-events-none" />
      <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3.5 w-7 h-7 bg-[#fafafa] rounded-full border-l border-zinc-200/20 z-20 pointer-events-none" />

      <div class="p-6 sm:p-8 space-y-6">
        
        <!-- Ticket Header -->
        <div class="flex justify-between items-start gap-4">
          <div class="space-y-1">
            <span class="text-[9px] tracking-[0.2em] text-teal-200 uppercase font-extrabold block">{{ $t('booking.ticketTitle') }}</span>
            <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold font-serif leading-tight text-white">{{ props.booking[`${locale}Title` as keyof Booking] }}</h3>
          </div>
          <div class="text-4xl text-teal-200/20 font-serif select-none shrink-0">✈</div>
        </div>

        <!-- Ticket Divider Line -->
        <div class="border-b border-dashed border-white/20 relative" />

        <!-- Grid Fields -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
          <div class="space-y-1">
            <span class="text-[9px] tracking-wider text-teal-200/70 uppercase font-bold block">{{ $t('booking.reference') }}</span>
            <span class="font-extrabold text-sm sm:text-base tracking-tight text-white">{{ booking.ref }}</span>
          </div>
          <div class="space-y-1" v-if="booking.location">
            <span class="text-[9px] tracking-wider text-teal-200/70 uppercase font-bold block">{{ $t('booking.destination') }}</span>
            <span class="font-bold text-sm sm:text-base text-white">{{ booking.location }}</span>
          </div>
          <div class="space-y-1" v-if="booking.duration">
            <span class="text-[9px] tracking-wider text-teal-200/70 uppercase font-bold block">{{ $t('booking.form.summary.duration') }}</span>
            <span class="font-bold text-sm sm:text-base text-white">{{ formattedDuration }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] tracking-wider text-teal-200/70 uppercase font-bold block">{{ $t('booking.form.summary.travelDate') }}</span>
            <span class="font-bold text-sm sm:text-base text-white">{{ booking[`${locale}TravelDate` as keyof Booking] || booking.date }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-[9px] tracking-wider text-teal-200/70 uppercase font-bold block">{{ $t('booking.form.summary.totalAmount') }}</span>
            <span class="font-extrabold text-sm sm:text-base text-secondary">${{ booking.amount }}</span>
          </div>
        </div>

        <!-- Extra details row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
          <div class="flex items-center gap-2.5 text-xs text-teal-100">
            <span class="opacity-60 font-semibold uppercase tracking-wider">{{ $t('booking.form.summary.travelers') }}:</span>
            <span class="font-bold text-white bg-white/10 px-2.5 py-0.5 rounded-full">{{ booking.travellers }} {{$t('booking.form.summary.pax')}}</span>
          </div>
          <div class="flex items-center gap-2.5 text-xs text-teal-100 sm:justify-end">
            <span class="opacity-60 font-semibold uppercase tracking-wider">{{ $t('booking.form.summary.payment') }}:</span>
            <span class="font-bold text-white bg-white/10 px-3 py-0.5 rounded-full">{{ $t(`booking.form.summary.${booking.paymentMethod}`) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Free Cancellation Notice + Cancel Button -->
  <Transition name="cancel-fade">
    <div v-if="eligibleForCancellation" class="space-y-3">
      <!-- Free cancellation info strip -->
      <div class="flex items-start gap-2.5 bg-teal-50/70 border border-teal-100 rounded-2xl px-4 py-3">
        <span class="text-sm shrink-0 select-none mt-0.5">🛡️</span>
        <p class="text-xs text-teal-800 font-medium leading-snug">
          <span class="font-bold">{{ $t('booking.freeCancelInfo1') }}</span> {{ $t('booking.freeCancelInfo2') }}
        </p>
      </div>

      <!-- Cancel booking button -->
      <div class="flex justify-end">
        <button
          id="cancel-booking-btn"
          type="button"
          class="
            inline-flex items-center gap-2
            px-5 py-2.5 text-xs font-semibold rounded-full
            border border-red-200 bg-red-50 text-red-600
            hover:bg-red-100 hover:border-red-300 hover:text-red-700
            active:scale-[0.98] transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:ring-offset-1
          "
          @click="emit('cancel-requested')"
        >
          <span class="text-xs select-none">✕</span>
          {{ $t('booking.cancelBooking') }}
        </button>
      </div>
    </div>
  </Transition>
</template>
