<script setup lang="ts">
import { useAdminLogin } from '~/composables/useAdminLogin'
import AdminEmailInput from './AdminEmailInput.vue'
import AdminPasswordInput from './AdminPasswordInput.vue'
import AdminErrorAlert from './AdminErrorAlert.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const {
  form,
  loading,
  error,
  validationErrors,
  clearErrors,
  submit
} = useAdminLogin()

const handleLogin = async () => {
  await submit()
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="flex flex-col gap-6 w-full" novalidate>
    <!-- General API Error Alert Area -->
    <AdminErrorAlert :error="error" @close="clearErrors" />

    <!-- Form Inputs Group -->
    <div class="flex flex-col gap-4">
      <!-- Email Field -->
      <AdminEmailInput
        v-model="form.email"
        :error="validationErrors.email"
        :disabled="loading"
      />

      <!-- Password Field -->
      <AdminPasswordInput
        v-model="form.password"
        :error="validationErrors.password"
        :disabled="loading"
      />
    </div>

    <!-- Login Submit Button (using BaseButton) -->
    <div class="mt-2">
      <BaseButton
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        :disabled="loading"
        class="w-full text-center flex items-center justify-center font-bold"
        aria-label="Sign in to Admin Dashboard"
      >
        <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
      </BaseButton>
    </div>
  </form>
</template>
