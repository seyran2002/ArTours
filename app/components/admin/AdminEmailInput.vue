<script setup lang="ts">
import { computed } from 'vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    error?: string
    disabled?: boolean
    id?: string
  }>(),
  {
    error: '',
    disabled: false,
    id: 'admin-email'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onInput = (val: string) => {
  emit('update:modelValue', val)
}

const hasError = computed(() => !!props.error)
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <!-- Accessible Input Label -->
    <label
      :for="id"
      class="text-xs font-bold uppercase tracking-wider text-zinc-500 select-none flex justify-between items-center"
    >
      <span>Email Address</span>
      <span v-if="hasError" class="text-[10px] text-red-500 font-semibold normal-case tracking-normal">
        Required
      </span>
    </label>

    <!-- Styled Container wrapper for the BaseInput -->
    <div
      :class="[
        'flex items-center gap-3 px-4 rounded-xl border bg-white/50 backdrop-blur-sm transition-all duration-300 focus-within:ring-4',
        hasError
          ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-100'
          : 'border-zinc-200/80 focus-within:border-primary focus-within:ring-primary/10'
      ]"
    >
      <!-- Prepend Email Icon -->
      <span :class="['flex-shrink-0 transition-colors duration-300', hasError ? 'text-red-400' : 'text-zinc-400 focus-within:text-primary']">
        <BaseIcon name="mail" size="sm" />
      </span>

      <!-- Inner BaseInput -->
      <BaseInput
        :id="id"
        type="email"
        placeholder="admin@artours.com"
        :model-value="modelValue"
        @update:model-value="onInput"
        :disabled="disabled"
        aria-required="true"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="hasError ? `${id}-error` : undefined"
        class="flex-grow py-3 text-sm text-zinc-800 placeholder-zinc-400"
      />
    </div>

    <!-- Error message display -->
    <div
      v-if="hasError"
      :id="`${id}-error`"
      class="text-[11px] font-medium text-red-500 mt-0.5 flex items-center gap-1 animate-fadeIn"
      role="alert"
    >
      <span class="inline-block w-1 h-1 bg-red-500 rounded-full" />
      <span>{{ error }}</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}
</style>
