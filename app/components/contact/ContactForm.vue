<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseIcon from '~/components/ui/BaseIcon.vue'

interface FormData {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name: string
  email: string
  message: string
}

const { t } = useI18n();

const form = ref<FormData>({
  name: '',
  email: '',
  message: ''
})

const errors = ref<FormErrors>({
  name: '',
  email: '',
  message: ''
})

const isLoading = ref(false)
const isSuccess = ref(false)
const isError = ref(false)
const errorMessage = ref('')

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const validate = (): boolean => {
  let valid = true

  // Reset errors
  errors.value = { name: '', email: '', message: '' }

  if (!form.value.name.trim()) {
    errors.value.name = t('contactUs.form.validation.fullName')
    valid = false
  }

  if (!form.value.email.trim()) {
    errors.value.email = t('contactUs.form.validation.emailAddress')
    valid = false
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = t('contactUs.form.validation.emailAddress2')
    valid = false
  }

  if (!form.value.message.trim()) {
    errors.value.message = t('contactUs.form.validation.message')
    valid = false
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = t('contactUs.form.validation.message2')
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validate()) return

  isLoading.value = true
  isError.value = false
  errorMessage.value = ''

  try {
    // Simulated API call
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (use reject() to test error state)
        resolve()
      }, 1500)
    })

    isSuccess.value = true
    form.value = { name: '', email: '', message: '' }

    // Auto-reset success state after 6 seconds
    setTimeout(() => {
      isSuccess.value = false
    }, 6000)
  } catch (err: any) {
    isError.value = true
    errorMessage.value = err?.message || t('contactUs.form.error')
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  isSuccess.value = false
  isError.value = false
  errorMessage.value = ''
  errors.value = { name: '', email: '', message: '' }
}
</script>

<template>
  <div class="rounded-[32px] border shadow-sm hover:shadow-md hover:border-zinc-300/60 p-8 sm:p-10">
    
    <!-- Success State -->
    <div v-if="isSuccess" class="text-center py-12 space-y-4 animate-fade-in">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 text-primary border border-teal-100">
        <BaseIcon name="check-circle" size="lg" />
      </div>
      <h3 class="text-2xl font-bold text-zinc-900 font-serif">{{ $t('contactUs.success') }}</h3>
      <p class="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
        {{ $t('contactUs.successDesc') }}
      </p>
      <button 
        @click="resetForm"
        class="text-xs text-primary font-semibold hover:text-teal-800 transition-colors mt-2"
      >
        {{ $t('contactUs.form.sendAnother') }}
      </button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Error Banner -->
      <div 
        v-if="isError" 
        class="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 animate-fade-in"
      >
        <BaseIcon name="alert-circle" size="sm" custom-class="text-red-500 shrink-0 mt-0.5" />
        <div class="space-y-0.5">
          <p class="text-sm font-semibold">{{ $t('contactUs.form.errorTitle') }}</p>
          <p class="text-xs text-red-500">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Name Field -->
      <div>
        <label for="contact-name" class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          {{ $t('contactUs.form.fullName') }}
        </label>
        <input 
          id="contact-name"
          name="name"
          autocomplete="name"
          v-model="form.name"
          type="text"
          placeholder="John Doe"
          :class="[
            'w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/30 text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm font-semibold',
            errors.name ? 'border-red-300 bg-red-50/30' : 'border-zinc-200'
          ]"
          @input="errors.name = ''"
        />
        <p v-if="errors.name" class="mt-1.5 text-xs text-red-500 font-medium">{{ errors.name }}</p>
      </div>

      <!-- Email Field -->
      <div>
        <label for="contact-email" class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          {{ $t('contactUs.form.emailAddress') }}
        </label>
        <input 
          id="contact-email"
          name="email"
          autocomplete="email"
          v-model="form.email"
          type="email"
          placeholder="john@example.com"
          :class="[
            'w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/30 text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm font-semibold',
            errors.email ? 'border-red-300 bg-red-50/30' : 'border-zinc-200'
          ]"
          @input="errors.email = ''"
        />
        <p v-if="errors.email" class="mt-1.5 text-xs text-red-500 font-medium">{{ errors.email }}</p>
      </div>

      <!-- Message Field -->
      <div>
        <label for="contact-message" class="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
          {{ $t('contactUs.form.message') }}
        </label>
        <textarea 
          id="contact-message"
          name="message"
          v-model="form.message"
          rows="5"
          :placeholder="$t('contactUs.form.messagePlaceholder')"
          :class="[
            'w-full px-5 py-3.5 rounded-2xl border bg-zinc-50/30 text-zinc-800 placeholder-zinc-400 outline-none transition-all duration-300 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary text-sm font-semibold resize-none',
            errors.message ? 'border-red-300 bg-red-50/30' : 'border-zinc-200'
          ]"
          @input="errors.message = ''"
        />
        <p v-if="errors.message" class="mt-1.5 text-xs text-red-500 font-medium">{{ errors.message }}</p>
      </div>

      <!-- Submit Button -->
      <BaseButton 
        type="submit" 
        variant="primary" 
        class="shadow-brand-primary hover:shadow-brand-primary-hover w-full" 
        :loading="isLoading"
        :disabled="isLoading"
      >
        {{ isLoading ? $t('contactUs.form.processing') : $t('contactUs.form.submit') }}
      </BaseButton>
    </form>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
