<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    to?: string
    tag?: string
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'text'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    ariaLabel?: string
  }>(),
  {
    to: undefined,
    tag: undefined,
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    type: 'button',
    ariaLabel: undefined
  }
)

const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full tracking-tight transition-all duration-300 transform select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-brand-gradient-primary text-white shadow-brand hover:scale-[1.03] hover:shadow-brand-hover transition-all duration-400 ease-out'
    case 'secondary':
      return 'border border-secondary/20 bg-secondary/5 text-zinc-800 hover:bg-secondary/10 hover:border-secondary/40 hover:text-secondary hover:shadow-[0_8px_20px_rgba(248,155,31,0.08)]'
    case 'outline':
      return 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 hover:shadow-sm'
    case 'ghost':
      return 'text-zinc-600 hover:bg-zinc-50'
    case 'text':
      return 'text-primary hover:text-teal-900 hover:underline p-0 active:scale-100'
    default:
      return 'bg-brand-gradient text-white shadow-brand hover:scale-[1.03] hover:shadow-brand-hover transition-all duration-400 ease-out'
  }
})

const sizeClasses = computed(() => {
  if (props.variant === 'text') return ''
  switch (props.size) {
    case 'sm':
      return 'px-4 py-2 text-xs'
    case 'md':
      return 'px-6 py-3 text-sm'
    case 'lg':
      return 'px-8 py-4 text-base'
    default:
      return 'px-6 py-3 text-sm'
  }
})
</script>

<template>
  <component
    :is="tag || (to && !disabled ? 'NuxtLink' : 'button')"
    :to="tag ? undefined : (to && !disabled ? to : undefined)"
    :type="tag || to ? undefined : type"
    :disabled="tag ? undefined : (disabled || loading ? true : undefined)"
    :class="[baseClasses, variantClasses, sizeClasses]"
    :aria-label="ariaLabel"
  >
    <span v-if="loading" class="mr-2 animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
    <slot />
  </component>
</template>
