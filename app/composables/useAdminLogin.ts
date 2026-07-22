import { ref, reactive } from 'vue'
import { useAdminAuthService } from '~/services/admin-auth.service'
import type { LoginForm } from '~/types/admin-auth'

export function useAdminLogin() {
  const form = reactive<LoginForm>({
    email: '',
    password: ''
  })

  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const validationErrors = reactive<{
    email?: string
    password?: string
  }>({
    email: undefined,
    password: undefined
  })

  const { login, logout } = useAdminAuthService()

  // Email Validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  /**
   * Resets all validation and API error states
   */
  const clearErrors = () => {
    error.value = null
    validationErrors.email = undefined
    validationErrors.password = undefined
  }

  /**
   * Validates form credentials on the client side
   */
  const validate = (): boolean => {
    clearErrors()
    let isValid = true

    // Email validation
    if (!form.email) {
      validationErrors.email = 'Email is required'
      isValid = false
    } else if (!EMAIL_REGEX.test(form.email)) {
      validationErrors.email = 'Please enter a valid email address'
      isValid = false
    }

    // Password validation
    if (!form.password) {
      validationErrors.password = 'Password is required'
      isValid = false
    } else if (form.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters long'
      isValid = false
    }

    return isValid
  }

  /**
   * Submit handler for Admin Login
   */
  const submit = async (): Promise<boolean> => {
    if (!validate()) return false

    loading.value = true
    error.value = null

    try {
      await login({
        email: form.email.trim(),
        password: form.password
      })
      
      // On success, redirect to the admin dashboard (or root admin route)
      await navigateTo('/admin')
      return true
    } catch (err: any) {
      // Extract backend error message or use fallback
      if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else if (err.message) {
        error.value = err.message
      } else {
        error.value = 'An unexpected error occurred. Please try again.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    form,
    loading,
    error,
    validationErrors,
    clearErrors,
    validate,
    submit
  }
}
