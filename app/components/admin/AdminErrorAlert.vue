<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

defineProps<{
  error?: string | null
}>()

const emit = defineEmits<{
  'close': []
}>()
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <div
      v-if="error"
      class="flex items-start p-4 bg-red-50/80 border border-red-200/60 rounded-xl shadow-sm backdrop-blur-sm"
      role="alert"
      aria-live="assertive"
    >
      <div class="flex-shrink-0 text-red-500 mt-0.5">
        <BaseIcon name="alert-circle" size="md" />
      </div>
      <div class="ml-3 flex-grow text-xs font-semibold text-red-800 leading-relaxed">
        {{ error }}
      </div>
      <button
        @click="emit('close')"
        type="button"
        class="ml-auto -mx-1.5 -my-1.5 bg-transparent text-red-500 hover:text-red-700 hover:bg-red-100/50 rounded-lg p-1.5 inline-flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
        aria-label="Dismiss error"
      >
        <span class="sr-only">Dismiss</span>
        <!-- Dismiss / Close Icon (Simple X) -->
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </Transition>
</template>
