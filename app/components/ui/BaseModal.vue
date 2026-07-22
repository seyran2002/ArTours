<script setup lang="ts">
import { watch, nextTick } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    subtitle?: string
    maxWidth?: string
  }>(),
  {
    title: undefined,
    subtitle: undefined,
    maxWidth: 'max-w-lg',
  },
)

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

// Lock / unlock body scroll while open
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
    <Transition name="bm-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <!-- Panel -->
    <Transition name="bm-panel">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[301] flex items-end sm:items-center justify-center p-0 sm:p-6"
      >
        <div
          :class="[
            'relative w-full bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden',
            'shadow-[0_32px_80px_rgba(0,0,0,0.25)] flex flex-col max-h-[95dvh]',
            maxWidth,
          ]"
        >
          <!-- Header -->
          <div class="flex items-start justify-between px-6 sm:px-8 pt-6 pb-4 border-b border-zinc-100 shrink-0">
            <div class="space-y-0.5 pr-4">
              <slot name="header">
                <h2 v-if="title" class="text-lg font-bold text-zinc-900 leading-tight">
                  {{ title }}
                </h2>
                <p v-if="subtitle" class="text-xs text-zinc-500 leading-snug mt-0.5">
                  {{ subtitle }}
                </p>
              </slot>
            </div>
            <button
              id="base-modal-close"
              type="button"
              @click="close"
              class="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Close modal"
            >
              <BaseIcon name="x" size="sm" />
            </button>
          </div>

          <!-- Scrollable body -->
          <div class="overflow-y-auto flex-1 px-6 sm:px-8 py-6">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.bm-overlay-enter-active,
.bm-overlay-leave-active {
  transition: opacity 0.25s ease;
}
.bm-overlay-enter-from,
.bm-overlay-leave-to {
  opacity: 0;
}

/* Panel */
.bm-panel-enter-active {
  transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.bm-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.22s ease-in;
}
.bm-panel-enter-from {
  opacity: 0;
  transform: translateY(40px) scale(0.97);
}
.bm-panel-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.97);
}
</style>
