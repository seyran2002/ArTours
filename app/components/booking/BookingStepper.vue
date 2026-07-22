<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'COMPLETED'
  email: string
}>()

const { t } = useI18n();

const steps = computed(() => {
  if (props.status === 'CANCELLED') {
    return [
      { name: t('booking.steps.booking_received'), desc: t('booking.steps.reservation_entered'), status: 'complete' },
      { name: t('booking.steps.cancelled'), desc: t('booking.steps.booking_voided'), status: 'error' }
    ]
  }
  if (props.status === 'PENDING') {
    return [
      { name: t('booking.steps.received'), desc: t('booking.steps.booking_submitted'), status: 'complete' },
      { name: t('booking.steps.confirmation'), desc: t('booking.steps.awaiting_guide'), status: 'current' },
      { name: t('booking.steps.travelDay'), desc: t('booking.steps.readyCheckin'), status: 'upcoming' },
      { name: t('booking.steps.completed'), desc: t('booking.steps.seeYouNext'), status: 'upcoming' }
    ]
  }
  if (props.status === 'COMPLETED') {
    return [
      { name: t('booking.steps.received'), desc: t('booking.steps.booking_submitted'), status: 'complete' },
      { name: t('booking.steps.confirmed'), desc: t('booking.steps.reservationLocked'), status: 'complete' },
      { name: t('booking.steps.travelDay'), desc: t('booking.steps.readyDeparture'), status: 'current' },
      { name: t('booking.steps.completed'), desc: t('booking.steps.seeYouNext'), status: 'complete' }
    ]
  }
  // Default/CONFIRMED state
  return [
    { name: t('booking.steps.received'), desc: t('booking.steps.booking_submitted'), status: 'complete' },
    { name: t('booking.steps.confirmed'), desc: t('booking.steps.reservationLocked'), status: 'complete' },
    { name: t('booking.steps.travelDay'), desc: t('booking.steps.readyDeparture'), status: 'current' },
    { name: t('booking.steps.completed'), desc: t('booking.steps.seeYouNext'), status: 'upcoming' }
  ]
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
        'mt-8 p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm font-medium flex items-start gap-3',
        status === 'CONFIRMED' 
          ? 'bg-teal-50/50 border-teal-100/50 text-teal-800' 
          : status === 'PENDING'
            ? 'bg-amber-50/50 border-amber-100/50 text-amber-800'
            : 'bg-red-50/50 border-red-100/50 text-red-800'
      ]"
    >
      <span class="text-base shrink-0 select-none">
        {{ status === 'CONFIRMED' ? '✨' : status === 'PENDING' ? '⏳' : '⚠️' }}
      </span>
      <p class="leading-relaxed">
        <span class="font-bold text-zinc-900"> 
          {{ $t('booking.statusStr') }}: {{ $t(`booking.status.${status}`) }} — 
        </span>
        {{ 
          status === 'CONFIRMED' 
            ? $t('booking.steps.confirmedStr') 
            : status === 'PENDING'
              ? $t('booking.steps.pendingStr') 
              : $t('booking.steps.cancellationStr')
        }}
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
