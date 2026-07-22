<script setup lang="ts">
import { ref } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    maxRating?: number
    disabled?: boolean
  }>(),
  {
    maxRating: 5,
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverRating = ref<number | null>(null)

function selectRating(rating: number) {
  if (props.disabled) return
  emit('update:modelValue', rating)
}

function setHover(rating: number | null) {
  if (props.disabled) return
  hoverRating.value = rating
}
</script>

<template>
  <div class="flex items-center gap-1.5 select-none">
    <button
      v-for="star in maxRating"
      :key="star"
      type="button"
      :disabled="disabled"
      :class="[
        !disabled ? 'hover:scale-110' : '',
        'p-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-150 transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'
      ]"
      @click="selectRating(star)"
      @mouseenter="setHover(star)"
      @mouseleave="setHover(null)"
      :aria-label="`Rate ${star} out of ${maxRating}`"
    >
      <BaseIcon
        name="star"
        :size="24"
        :custom-class="[
          'transition-all duration-200',
          (hoverRating !== null && star <= hoverRating) || star <= modelValue
            ? ' text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.3)] fill-amber-500 scale-105'
            : ' text-zinc-300 hover:text-amber-400'
        ].join('')"
      />
    </button>
  </div>
</template>
