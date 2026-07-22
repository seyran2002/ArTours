<script setup lang="ts">
import { computed } from 'vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
  modelValue: string
  isLoading: boolean
  errorMsg: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'checkStatus': []
}>()

const bookingCode = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const onCheckStatus = () => {
  emit('checkStatus')
}
</script>

<template>
  <div class="bg-white border border-zinc-200/60 rounded-[32px] p-6 sm:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.03)] backdrop-blur-md relative z-10 mb-8">
    <form role="search" @submit.prevent="onCheckStatus" class="flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative flex items-center bg-zinc-50 border border-zinc-200 rounded-full px-5 py-0.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-300">
        <label for="booking-code" class="sr-only">{{ $t('booking.placeholder') }}</label>
        <BaseIcon name="booking" size="sm" custom-class="text-zinc-400 mr-2.5 shrink-0" />
        <BaseInput 
          id="booking-code"
          name="bookingCode"
          autocomplete="off"
          v-model="bookingCode"
          :placeholder="$t('booking.placeholder')"
          aria-label="Booking Reference Code"
          :aria-invalid="!!errorMsg"
          :aria-describedby="errorMsg ? 'booking-search-error' : undefined"
          class="uppercase text-zinc-800 placeholder-zinc-400 font-semibold tracking-wide"
        />
      </div>
      <BaseButton 
        type="submit" 
        variant="primary" 
        size="md" 
        :loading="isLoading"
        class="shadow-brand-primary hover:shadow-brand-primary-hover whitespace-nowrap"
      >
        {{ $t('booking.checkStatus') }}
      </BaseButton>
    </form>

    <!-- Validation Error Message -->
    <div v-if="errorMsg" id="booking-search-error" role="alert" class="mt-4 flex items-center gap-2 text-xs font-semibold text-red-600 pl-3">
      <span class="text-base">⚠️</span>
      <span>{{ errorMsg }}</span>
    </div>
  </div>
</template>
