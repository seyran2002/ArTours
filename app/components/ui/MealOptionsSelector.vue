<script setup lang="ts">
import { useI18n } from '#imports'
import BaseIcon from './BaseIcon.vue'

interface MealOptions {
  breakfast: boolean
  lunch: boolean
  dinner: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: MealOptions
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: MealOptions]
}>()

const { t } = useI18n()

const meals = [
  { key: 'breakfast' as const, icon: 'clock' },
  { key: 'lunch' as const, icon: 'globe' }, // we can use globe or custom icons
  { key: 'dinner' as const, icon: 'heart' }   // let's use check or other icon if needed
]

function toggleMeal(key: keyof MealOptions) {
  if (props.disabled) return
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: !props.modelValue[key]
  })
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div
      v-for="meal in meals"
      :key="meal.key"
      class="relative flex items-center justify-between p-4 border rounded-2xl cursor-pointer select-none transition-all duration-300"
      :class="[
        modelValue[meal.key]
          ? 'border-primary bg-primary/[0.03] shadow-sm'
          : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/30',
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      ]"
      @click="toggleMeal(meal.key)"
    >
      <div class="flex items-center gap-3">
        <!-- Status Indicator Dot -->
        <span
          class="flex items-center justify-center w-5.5 h-5.5 rounded-lg border-2 transition-all duration-200 shrink-0"
          :class="[
            modelValue[meal.key]
              ? 'border-primary bg-primary text-white scale-100'
              : 'border-zinc-300 bg-white'
          ]"
        >
          <BaseIcon v-if="modelValue[meal.key]" name="check" size="xs" />
        </span>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-zinc-800 capitalize">
            {{ t(`tour.${meal.key}`) }}
          </span>
          <span class="text-[10px] text-zinc-400">
            {{ t(`tour.${meal.key}Desc`, meal.key === 'breakfast' ? 'Morning fuel' : meal.key === 'lunch' ? 'Midday feast' : 'Evening delight') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
