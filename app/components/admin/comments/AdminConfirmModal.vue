<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
    danger?: boolean
  }>(),
  {
    confirmLabel: 'Հաստատել',
    cancelLabel: 'Չեղարկել',
    loading: false,
    danger: true,
  }
)

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  confirm: []
  cancel: []
}>()

function close() {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue && !props.loading) {
    close()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeyDown)
  }
})
</script>

<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="confirm-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[400] bg-zinc-950/60 backdrop-blur-sm"
        @click.self="close"
      />
    </Transition>

    <!-- Modal Card -->
    <Transition name="confirm-scale">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[401] flex items-center justify-center p-4 sm:p-6"
      >
        <div
          class="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-zinc-100 flex flex-col items-center text-center"
          role="dialog"
          aria-modal="true"
        >
          <!-- Warning Icon -->
          <div
            :class="[
              'w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300',
              danger
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100',
            ]"
          >
            <BaseIcon
              :name="danger ? 'trash' : 'alert-triangle'"
              :size="26"
            />
          </div>

          <!-- Title -->
          <h3 class="text-lg font-extrabold text-zinc-900 tracking-tight mb-2">
            {{ title }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-zinc-500 leading-relaxed mb-6">
            {{ message }}
          </p>

          <!-- Actions -->
          <div class="flex items-center gap-3 w-full">
            <button
              type="button"
              :disabled="loading"
              class="flex-1 py-3 px-4 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-700 bg-white hover:bg-zinc-50 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
              @click="close"
            >
              {{ cancelLabel }}
            </button>

            <button
              type="button"
              :disabled="loading"
              :class="[
                'flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm',
                danger
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                  : 'bg-primary hover:bg-teal-900 shadow-teal-900/20',
              ]"
              @click="emit('confirm')"
            >
              <span
                v-if="loading"
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"
              />
              <span>{{ confirmLabel }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

.confirm-scale-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.confirm-scale-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease-in;
}
.confirm-scale-enter-from {
  opacity: 0;
  transform: scale(0.94) translateY(8px);
}
.confirm-scale-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(4px);
}
</style>
