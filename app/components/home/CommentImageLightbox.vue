<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  modelValue: boolean
  images: string[]
  initialIndex?: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const currentIndex = ref(props.initialIndex || 0)

watch(
  () => props.initialIndex,
  (newIdx) => {
    currentIndex.value = newIdx || 0
  }
)

watch(
  () => props.modelValue,
  (isOpen) => {
    if (import.meta.client) {
      document.body.style.overflow = isOpen ? 'hidden' : ''
    }
    if (isOpen) {
      currentIndex.value = props.initialIndex || 0
    }
  }
)

function close() {
  emit('update:modelValue', false)
}

function next() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function prev() {
  if (!props.images.length) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function onKeydown(e: KeyboardEvent) {
  if (!props.modelValue) return
  if (e.key === 'Escape') close()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'ArrowLeft') prev()
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', onKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none"
        @click.self="close"
      >
        <!-- Top Toolbar -->
        <div class="flex items-center justify-between z-10 w-full max-w-5xl mx-auto text-white">
          <div class="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm">
            <BaseIcon name="image" size="xs" />
            <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
          </div>

          <button
            type="button"
            @click="close"
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all duration-200 focus:outline-none"
            aria-label="Close image viewer"
          >
            <BaseIcon name="x" size="sm" />
          </button>
        </div>

        <!-- Main Image Display -->
        <div class="relative flex-1 flex items-center justify-center max-w-5xl w-full mx-auto my-2 overflow-hidden">
          <!-- Previous Button -->
          <button
            v-if="images.length > 1"
            type="button"
            @click.stop="prev"
            class="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm active:scale-95 focus:outline-none"
            aria-label="Previous photo"
          >
            <BaseIcon name="chevron-left" size="sm" />
          </button>

          <!-- Current Image -->
          <Transition
            mode="out-in"
            enter-active-class="transition-opacity duration-200 ease-out"
            enter-from-class="opacity-0 scale-98"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-98"
          >
            <img
              :key="images[currentIndex]"
              :src="images[currentIndex]"
              alt="Traveler review full photo"
              class="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all"
            />
          </Transition>

          <!-- Next Button -->
          <button
            v-if="images.length > 1"
            type="button"
            @click.stop="next"
            class="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-sm active:scale-95 focus:outline-none"
            aria-label="Next photo"
          >
            <BaseIcon name="chevron-right" size="sm" />
          </button>
        </div>

        <!-- Bottom Thumbnails Strip (if multiple) -->
        <div v-if="images.length > 1" class="w-full max-w-md mx-auto flex items-center justify-center gap-2 overflow-x-auto py-2">
          <button
            v-for="(img, idx) in images"
            :key="img"
            type="button"
            @click="currentIndex = idx"
            :class="[
              'w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 cursor-pointer',
              currentIndex === idx ? 'border-primary ring-2 ring-white/60 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
            ]"
          >
            <img :src="img" :alt="`Thumbnail ${idx + 1}`" class="w-full h-full object-cover" />
          </button>
        </div>
        <div v-else class="h-4" />
      </div>
    </Transition>
  </Teleport>
</template>
