<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  images: string[]
  currentIndex: number
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  'update:currentIndex': [index: number]
}>()

function next() {
  if (props.images.length <= 1) return
  const nextIdx = (props.currentIndex + 1) % props.images.length
  emit('update:currentIndex', nextIdx)
}

function prev() {
  if (props.images.length <= 1) return
  const prevIdx = (props.currentIndex - 1 + props.images.length) % props.images.length
  emit('update:currentIndex', prevIdx)
}

function handleKeydown(e: KeyboardEvent) {
  if (!props.isOpen) return
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowRight') {
    next()
  } else if (e.key === 'ArrowLeft') {
    prev()
  }
}

// Lock body scroll when open
watch(() => props.isOpen, (open) => {
  if (!import.meta.client) return
  document.body.style.overflow = open ? 'hidden' : ''
}, { immediate: true })

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- Teleport to <body> so it escapes the sidebar's stacking context entirely -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md select-none"
        @click="emit('close')"
      >
        <!-- Close button -->
        <button
          class="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/15 transition-all duration-300 active:scale-90 cursor-pointer shadow-lg"
          @click.stop="emit('close')"
          aria-label="Close preview"
        >
          <BaseIcon name="x" size="sm" />
        </button>

        <!-- Prev button -->
        <button
          v-if="images.length > 1"
          class="absolute left-5 z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/15 transition-all duration-300 active:scale-90 cursor-pointer shadow-xl"
          @click.stop="prev"
          aria-label="Previous image"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Image container — stops click propagation, fills most of the screen -->
        <div
          class="relative flex flex-col items-center justify-center gap-4 px-16"
          style="max-width: min(92vw, 1400px); max-height: 92vh;"
          @click.stop
        >
          <img
            :src="images[currentIndex]"
            alt="Large Image Preview"
            class="rounded-2xl object-contain shadow-2xl border border-white/10 transition-all duration-300"
            style="max-width: 100%; max-height: 82vh; width: auto; height: auto;"
          />

          <!-- Counter pill -->
          <div class="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-semibold tracking-wider border border-white/10 backdrop-blur-sm">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>

        <!-- Next button -->
        <button
          v-if="images.length > 1"
          class="absolute right-5 z-10 p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/15 transition-all duration-300 active:scale-90 cursor-pointer shadow-xl"
          @click.stop="next"
          aria-label="Next image"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
