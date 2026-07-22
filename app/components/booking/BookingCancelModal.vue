<script setup lang="ts">
import BaseModal from '~/components/ui/BaseModal.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
  modelValue: boolean
  bookingNumber: string
  isCancelling: boolean
  cancelError: string | null
  cancelEmail: string
}>()

const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  'update:cancelEmail': [val: string]
  confirm: []
  close: []
}>()

function handleClose() {
  emit('update:modelValue', false)
  emit('close')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    max-width="max-w-lg"
    @update:model-value="handleClose"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
          <span class="text-lg select-none">⚠️</span>
        </div>
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-0.5">
            {{ $t('booking.cancelModal.subtitle') }}
          </p>
          <h2 class="text-lg font-bold text-zinc-900 leading-tight">
            {{ $t('booking.cancelModal.title') }}
          </h2>
        </div>
      </div>
    </template>

    <!-- Body -->
    <div class="space-y-5">

      <!-- Warning callout -->
      <div class="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
        <span class="text-base shrink-0 select-none mt-0.5">🚫</span>
        <p class="text-xs text-red-700 leading-relaxed">
          <span class="font-bold text-red-800">{{ $t('booking.cancelModal.desc1') }}</span>
          {{ $t('booking.cancelModal.desc2') }}
        </p>
      </div>

      <!-- Booking reference (read-only) -->
      <div class="space-y-1.5">
        <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
          {{ $t('booking.cancelModal.reference') }}
        </label>
        <div class="bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-3 flex items-center gap-2">
          <span class="text-sm font-bold tracking-tight text-zinc-900 font-mono">
            {{ bookingNumber }}
          </span>
          <span class="ml-auto text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
            {{ $t('booking.cancelModal.readOnly') }}
          </span>
        </div>
      </div>

      <!-- Email field -->
      <div class="space-y-1.5">
        <label
          for="cancel-email-input"
          class="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block"
        >
          {{ $t('booking.cancelModal.emailLabel') }}
        </label>
        <div
          :class="[
            'flex items-center border rounded-xl transition-all duration-200',
            cancelError
              ? 'border-red-300 bg-red-50/30 ring-2 ring-red-100'
              : 'border-zinc-200 bg-zinc-50 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10',
          ]"
        >
          <span class="pl-4 text-zinc-400 select-none text-sm">✉</span>
          <BaseInput
            id="cancel-email-input"
            name="email"
            autocomplete="email"
            type="email"
            :model-value="cancelEmail"
            placeholder="customer@example.com"
            size="md"
            aria-label="Customer email for cancellation"
            :aria-invalid="!!cancelError"
            @update:model-value="emit('update:cancelEmail', $event)"
          />
        </div>
        <p class="text-[10px] text-zinc-400 leading-snug">
          {{ $t('booking.cancelModal.emailDesc') }}
        </p>
      </div>

      <!-- Inline error -->
      <Transition name="err-fade">
        <div
          v-if="cancelError"
          class="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-700 text-xs font-medium rounded-xl p-3.5"
        >
          <span class="shrink-0 mt-0.5 select-none">⚠️</span>
          <span>{{ cancelError }}</span>
        </div>
      </Transition>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-3 pt-1">
        <!-- Destructive confirm -->
        <button
          id="cancel-booking-confirm-btn"
          type="button"
          :disabled="isCancelling"
          class="
            flex-1 inline-flex items-center justify-center gap-2
            px-6 py-3 text-sm font-semibold rounded-full
            bg-red-600 text-white
            hover:bg-red-700 active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2
          "
          @click="emit('confirm')"
        >
          <span
            v-if="isCancelling"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          />
          <span>{{ isCancelling ? $t('booking.cancelModal.cancelling') : $t('booking.cancelModal.confirmCancellation') }}</span>
        </button>

        <!-- Keep booking -->
        <BaseButton
          id="cancel-booking-keep-btn"
          variant="outline"
          size="md"
          class="flex-1"
          :disabled="isCancelling"
          @click="handleClose"
        >
         {{ $t('booking.cancelModal.keep') }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.err-fade-enter-active,
.err-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.err-fade-enter-from,
.err-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
