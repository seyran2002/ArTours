<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    type?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    ariaLabel?: string
    id?: string
  }>(),
  {
    modelValue: '',
    placeholder: '',
    type: 'text',
    size: 'md',
    disabled: false,
    ariaLabel: undefined,
    id: undefined
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-4 py-2 text-xs'
    case 'md': return 'px-5 py-3 text-sm'
    case 'lg': return 'px-6 py-4 text-base'
    default: return 'px-5 py-3 text-sm'
  }
})

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :id="id"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @input="onInput"
    :class="[
      'w-full bg-transparent font-medium text-inherit placeholder-inherit outline-none border-none transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses
    ]"
    v-bind="$attrs"
  />
</template>
