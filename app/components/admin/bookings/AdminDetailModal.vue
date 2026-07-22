<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'hidden'
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity duration-300"
        @click="emit('close')"
      />

      <!-- Content Container -->
      <div 
        class="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-3xl shadow-xl border border-zinc-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-250 z-10"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/50">
          <h3 class="text-base font-extrabold text-zinc-900 tracking-tight">{{ title }}</h3>
          <button 
            type="button" 
            class="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-all duration-200 cursor-pointer"
            @click="emit('close')"
          >
            <BaseIcon name="x" size="sm" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-in {
  animation: fadeIn 0.2s ease-out;
}
</style>
