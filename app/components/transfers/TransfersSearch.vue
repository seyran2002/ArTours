<script setup lang="ts">
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="relative group">
    <div
      class="flex items-center gap-3 bg-white rounded-2xl border border-zinc-200/80 px-5 py-3 sm:py-3.5 transition-all duration-300 group-focus-within:border-primary/30 group-focus-within:shadow-[0_0_0_3px_rgba(18,83,78,0.06)] group-focus-within:bg-white hover:border-zinc-300"
    >
      <BaseIcon 
        name="search" 
        size="sm" 
        custom-class="text-zinc-400 group-focus-within:text-primary transition-colors duration-300 shrink-0" 
      />
      <input
        id="transfers-search"
        type="text"
        :value="modelValue"
        @input="onInput"
        :placeholder="$t('transfers.searchPlaceholder')"
        aria-label="Search destinations"
        class="w-full bg-transparent text-sm font-medium text-zinc-800 placeholder-zinc-400 outline-none border-none"
      />
      <!-- Clear button -->
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="shrink-0 p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all duration-200"
        aria-label="Clear search"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>
