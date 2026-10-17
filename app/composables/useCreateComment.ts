import { ref, reactive } from 'vue'
import { useApiClient } from '~/services/api'

export interface CommentFormState {
  name: string
  surname: string
  rating: number
  originalText: string
  images: File[]
}

export interface CommentFormErrors {
  name?: string
  surname?: string
  rating?: string
  originalText?: string
  images?: string
}

const MAX_IMAGES = 50

export function useCreateComment() {
  const api = useApiClient()

  const form = reactive<CommentFormState>({
    name: '',
    surname: '',
    rating: 0,
    originalText: '',
    images: [],
  })

  const errors = reactive<CommentFormErrors>({})
  const isSubmitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)

  function resetForm() {
    form.name = ''
    form.surname = ''
    form.rating = 0
    form.originalText = ''
    form.images = []
    Object.keys(errors).forEach((k) => delete (errors as any)[k])
    submitError.value = null
    submitSuccess.value = false
  }

  function validate(t: (key: string) => string): boolean {
    Object.keys(errors).forEach((k) => delete (errors as any)[k])

    let valid = true

    if (!form.name.trim()) {
      errors.name = t('home.comments.modal.validation.name')
      valid = false
    }

    if (!form.surname.trim()) {
      errors.surname = t('home.comments.modal.validation.surname')
      valid = false
    }

    if (!form.rating || form.rating < 1) {
      errors.rating = t('home.comments.modal.validation.rating')
      valid = false
    }

    if (!form.originalText.trim()) {
      errors.originalText = t('home.comments.modal.validation.comment')
      valid = false
    } else if (form.originalText.trim().length < 10) {
      errors.originalText = t('home.comments.modal.validation.commentMin')
      valid = false
    }

    if (form.images.length > MAX_IMAGES) {
      errors.images = t('home.comments.modal.validation.imagesMax')
      valid = false
    }

    return valid
  }

  async function submitComment(t: (key: string) => string): Promise<boolean> {
    if (!validate(t)) return false

    isSubmitting.value = true
    submitError.value = null

    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      formData.append('surname', form.surname.trim())
      formData.append('rating', String(form.rating))
      formData.append('originalText', form.originalText.trim())

      for (const file of form.images) {
        formData.append('images', file)
      }

      await api.post<any>('comments', formData)

      submitSuccess.value = true
      return true
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.message ||
        t('home.comments.modal.error')
      submitError.value = Array.isArray(msg) ? msg.join(', ') : msg
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    form,
    errors,
    isSubmitting,
    submitError,
    submitSuccess,
    submitComment,
    resetForm,
    MAX_IMAGES,
  }
}
