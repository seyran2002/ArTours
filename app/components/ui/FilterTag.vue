<script setup lang="ts">
defineProps<{
  label: string
  active: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    @click="$emit('click')"
    role="tab"
    :aria-selected="active"
    :class="[
      'px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold transition-all duration-300 select-none outline-none',
      'focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1',
      active
        ? 'bg-brand-gradient-primary text-white shadow-lg shadow-primary/20 scale-[1.03]'
        : 'bg-white border border-zinc-200/80 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm hover:-translate-y-0.5'
    ]"
  >
    {{ label }}
  </button>
</template>
