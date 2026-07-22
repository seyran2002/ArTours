<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'glass' | 'outline' | 'neutral'
    size?: 'xs' | 'sm' | 'md'
    pulse?: boolean
    pulseColor?: 'primary' | 'secondary' | 'zinc'
  }>(),
  {
    variant: 'neutral',
    size: 'md',
    pulse: false,
    pulseColor: 'secondary'
  }
)

const baseClasses = 'inline-flex items-center gap-1.5 rounded-full font-sans transition-all duration-300'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-teal-50/70 border border-teal-100/50 text-primary'
    case 'secondary':
      return 'bg-amber-50/70 border border-amber-100/50 text-secondary'
    case 'glass':
      return 'bg-white/95 backdrop-blur-md text-primary border border-white/20 shadow-sm'
    case 'outline':
      return 'border border-zinc-200 text-zinc-600 bg-white hover:border-zinc-300'
    case 'neutral':
    default:
      return 'bg-zinc-50 border border-zinc-100/80 text-zinc-700'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest'
    case 'sm':
      return 'px-3 py-1 text-[10px] font-bold tracking-wider'
    case 'md':
    default:
      return 'px-3.5 py-1.5 text-[11px] font-bold tracking-tight'
  }
})

const pulseDotClasses = computed(() => {
  switch (props.pulseColor) {
    case 'primary':
      return 'bg-primary'
    case 'zinc':
      return 'bg-zinc-400'
    case 'secondary':
    default:
      return 'bg-secondary'
  }
})
</script>

<template>
  <span :class="[baseClasses, variantClasses, sizeClasses]">
    <!-- Prefix Icon / Slot -->
    <slot name="prefix" />

    <!-- Pulse indicator dot -->
    <span 
      v-if="pulse" 
      :class="['w-1.5 h-1.5 rounded-full animate-pulse shrink-0', pulseDotClasses]" 
    />

    <!-- Default Badge Text -->
    <slot />

    <!-- Suffix Icon / Slot -->
    <slot name="suffix" />
  </span>
</template>
