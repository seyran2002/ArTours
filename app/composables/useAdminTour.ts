// app/composables/useAdminTour.ts
import { ref } from 'vue'
import { useState } from '#app'
import { useTourService } from '~/services/tour.service'
import type { AdminTour } from '~/types/admin-tour'

export function useAdminTour() {
  const tourService = useTourService()

  const tours = useState<AdminTour[]>('admin-tours', () => [])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  function extractErrorMessage(err: unknown): string {
    if (
      err &&
      typeof err === 'object' &&
      'response' in err &&
      (err as any).response?.data?.message
    ) {
      const message = (err as any).response.data.message
      return Array.isArray(message) ? message.join(', ') : message
    }
    if (err instanceof Error) return err.message
    return 'An unexpected error occurred. Please try again.'
  }

  async function fetchTours(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      tours.value = await tourService.getTours()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function createTour(formData: FormData): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await tourService.createTour(formData)
      await fetchTours()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function updateTour(id: string, formData: FormData): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await tourService.updateTour(id, formData)
      await fetchTours()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function deleteTour(id: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await tourService.deleteTour(id)
      tours.value = tours.value.filter((t) => t.id !== id)
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  return {
    tours,
    loading,
    error,
    fetchTours,
    createTour,
    updateTour,
    deleteTour,
  }
}
