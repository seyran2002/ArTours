<script setup lang="ts">
import { watch, nextTick } from 'vue'
import type { BookingType, BookingResponse } from '~/types/booking'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  modelValue: boolean
  type: BookingType
  entityId: string
  entityTitle: string
  price: number
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  success: [booking: BookingResponse]
}>()

function close() {
  emit('update:modelValue', false)
}

function onSuccess(booking: BookingResponse) {
  emit('success', booking)
  // keep modal open so user can see the ticket — they can close manually
}

// Lock body scroll while modal is open
watch(
  () => props.modelValue,
  (open) => {
    nextTick(() => {
      if (import.meta.client) {
        document.body.style.overflow = open ? 'hidden' : ''
      }
    })
  },
)
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="panel">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[201] flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        <div
          class="relative w-full max-w-4xl max-h-[95dvh] bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.25)] flex flex-col"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-zinc-100 shrink-0">
            <div class="space-y-0.5">
              <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {{ type === 'TOUR' ? 'Tour Booking' : 'Transfer Booking' }}
              </p>
              <h2 class="text-lg font-bold text-zinc-900 leading-tight line-clamp-1">
                {{ entityTitle }}
              </h2>
            </div>
            <button
              id="booking-modal-close"
              @click="close"
              class="ml-4 shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Close booking modal"
            >
              <BaseIcon name="x" size="sm" />
            </button>
          </div>

          <!-- Scrollable Body -->
          <div class="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
            <LazyBookingForm
              :type="type"
              :entity-id="entityId"
              :entity-title="entityTitle"
              :price="price"
              @success="onSuccess"
            />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.28s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Panel — slides up on mobile, scales in on desktop */
.panel-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-leave-active {
  transition: opacity 0.22s ease, transform 0.25s ease-in;
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.97);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.97);
}
</style>
