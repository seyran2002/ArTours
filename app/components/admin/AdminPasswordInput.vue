<script setup lang="ts">
import { ref, computed } from 'vue'
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
    id: 'admin-password'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const onInput = (val: string) => {
  emit('update:modelValue', val)
}

const showPassword = ref(false)
const inputType = computed(() => showPassword.value ? 'text' : 'password')
const hasError = computed(() => !!props.error)

const toggleVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="flex flex-col gap-1.5 w-full">
    <!-- Accessible Input Label -->
    <label
      :for="id"
      class="text-xs font-bold uppercase tracking-wider text-zinc-500 select-none flex justify-between items-center"
    >
      <span>Password</span>
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
      <!-- Prepend Shield/Lock Icon -->
      <span :class="['flex-shrink-0 transition-colors duration-300', hasError ? 'text-red-400' : 'text-zinc-400']">
        <BaseIcon name="shield" size="sm" />
      </span>

      <!-- Inner BaseInput -->
      <BaseInput
        :id="id"
        :type="inputType"
        placeholder="••••••••"
        :model-value="modelValue"
        @update:model-value="onInput"
        :disabled="disabled"
        aria-required="true"
        :aria-invalid="hasError ? 'true' : 'false'"
        :aria-describedby="hasError ? `${id}-error` : undefined"
        class="flex-grow py-3 text-sm text-zinc-800 placeholder-zinc-400"
      />

      <!-- Password Visibility Toggle Button -->
      <button
        @click="toggleVisibility"
        type="button"
        class="flex-shrink-0 p-1 rounded-md text-zinc-400 hover:text-zinc-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
        :disabled="disabled"
      >
        <!-- Custom SVG Eye Icon (Open) -->
        <svg v-if="showPassword" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        
        <!-- Custom SVG Eye Icon (Closed / Slash) -->
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
      </button>
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
