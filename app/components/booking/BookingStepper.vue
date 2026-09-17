<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'

const props = defineProps<{
  status: BookingStatus
  email: string
}>()

const { t } = useI18n()

// 1. Milestone steps per booking status
const steps = computed(() => {
  switch (props.status) {
    case 'CANCELLED':
      return [
        { name: t('booking.steps.booking_received'), desc: t('booking.steps.reservation_entered'), status: 'complete' },
        { name: t('booking.steps.cancelled'), desc: t('booking.steps.booking_voided'), status: 'error' }
      ]
    case 'PENDING':
      return [
        { name: t('booking.steps.received'), desc: t('booking.steps.booking_submitted'), status: 'complete' },
        { name: t('booking.steps.confirmation'), desc: t('booking.steps.awaiting_guide'), status: 'current' },
        { name: t('booking.steps.travelDay'), desc: t('booking.steps.readyCheckin'), status: 'upcoming' },
        { name: t('booking.steps.completed'), desc: t('booking.steps.seeYouNext'), status: 'upcoming' }
      ]
    case 'COMPLETED':
      return [
        { name: t('booking.steps.received'), desc: t('booking.steps.booking_submitted'), status: 'complete' },
        { name: t('booking.steps.confirmed'), desc: t('booking.steps.reservationLocked'), status: 'complete' },
        { name: t('booking.steps.travelDay'), desc: t('booking.steps.readyDeparture'), status: 'complete' },
        { name: t('booking.steps.completed'), desc: t('booking.steps.seeYouNext'), status: 'complete' }
      ]
    case 'CONFIRMED':
    default:
      return [
        { name: t('booking.steps.received'), desc: t('booking.steps.booking_submitted'), status: 'complete' },
        { name: t('booking.steps.confirmed'), desc: t('booking.steps.reservationLocked'), status: 'complete' },
        { name: t('booking.steps.travelDay'), desc: t('booking.steps.readyDeparture'), status: 'current' },
        { name: t('booking.steps.completed'), desc: t('booking.steps.seeYouNext'), status: 'upcoming' }
      ]
  }
})

// 2. Status notice banner styling and configuration
const statusBanner = computed(() => {
  const configs: Record<BookingStatus, {
    icon: string
    isEmojiBadge: boolean
    wrapperClass: string
    textClass?: string
    messageKey: string
  }> = {
    COMPLETED: {
      icon: '🎉',
      isEmojiBadge: true,
      wrapperClass: 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border-emerald-200/80 text-emerald-950 shadow-sm shadow-emerald-900/5',
      textClass: 'text-emerald-700 font-extrabold',
      messageKey: 'booking.steps.completedStr'
    },
    CONFIRMED: {
      icon: '✨',
      isEmojiBadge: false,
      wrapperClass: 'bg-teal-50/50 border-teal-100/50 text-teal-800',
      messageKey: 'booking.steps.confirmedStr'
    },
    PENDING: {
      icon: '⏳',
      isEmojiBadge: false,
      wrapperClass: 'bg-amber-50/50 border-amber-100/50 text-amber-800',
      messageKey: 'booking.steps.pendingStr'
    },
    CANCELLED: {
      icon: '⚠️',
      isEmojiBadge: false,
      wrapperClass: 'bg-red-50/50 border-red-100/50 text-red-800',
      messageKey: 'booking.steps.cancellationStr'
    }
  }

  return configs[props.status] || configs.CONFIRMED
})
</script>

<template>
  <div class="bg-white border border-zinc-200/50 rounded-[32px] p-6 sm:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.015)]">
    <h2 class="text-xs font-extrabold uppercase tracking-widest text-zinc-400 mb-6 flex items-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-primary" />
      {{ $t('booking.milestone') }}
    </h2>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
      <!-- Stepper Connection Line -->
      <div class="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-zinc-100 -z-10" />

      <div 
        v-for="(step, idx) in steps" 
        :key="idx"
        class="flex flex-col items-center text-center space-y-2 group"
      >
        <!-- Milestone Circle Indicator -->
        <div 
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 border-4',
            step.status === 'complete' 
              ? 'bg-teal-50 border-teal-100 text-primary shadow-sm'
              : step.status === 'current'
                ? 'bg-amber-50 border-amber-100 text-secondary animate-bounce-subtle'
                : step.status === 'error'
                  ? 'bg-red-50 border-red-100 text-red-600'
                  : 'bg-zinc-50 border-zinc-100 text-zinc-400'
          ]"
        >
          <span v-if="step.status === 'complete'">✓</span>
          <span v-else-if="step.status === 'error'">✕</span>
          <span v-else>{{ idx + 1 }}</span>
        </div>

        <!-- Text details -->
        <div class="space-y-0.5">
          <h4 
            :class="[
              'text-xs font-extrabold tracking-tight',
              step.status === 'complete' || step.status === 'current' ? 'text-zinc-900' : 'text-zinc-400'
            ]"
          >
            {{ step.name }}
          </h4>
          <p class="text-[10px] text-zinc-500 max-w-[140px] leading-snug mx-auto">
            {{ step.desc }}
          </p>
        </div>
      </div>
    </div>

    <!-- Custom status-specific notice banner -->
    <div 
      :class="[
        'mt-8 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-medium flex items-center gap-3.5 transition-all duration-300',
        statusBanner.wrapperClass
      ]"
    >
      <div 
        v-if="statusBanner.isEmojiBadge" 
        class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25 text-base select-none"
      >
        {{ statusBanner.icon }}
      </div>
      <span v-else class="text-base shrink-0 select-none">
        {{ statusBanner.icon }}
      </span>

      <p class="leading-relaxed">
        <span class="font-bold text-zinc-900"> 
          {{ $t('booking.statusStr') }}: 
          <span :class="statusBanner.textClass">
            {{ $t(`booking.status.${status}`) }}
          </span> — 
        </span>
        {{ $t(statusBanner.messageKey) }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-subtle {
  animation: bounceSubtle 2s infinite ease-in-out;
}

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>
