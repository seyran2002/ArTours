import { ref, computed, type ComputedRef, type Ref } from 'vue'
import { useState, useFetch, useRuntimeConfig } from '#app'
import { useLocationService } from '~/services/location.service'
import type { Location } from '~/types/location'

export function useLocation(id: string): {
  location: ComputedRef<Location | null>
  Location: ComputedRef<Location | null>
  loading: Ref<boolean>
  error: Ref<any>
  refresh: () => Promise<void>
}
export function useLocation(): {
  locations: Ref<Location[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchLocations: () => Promise<void>
  createLocation: (formData: FormData) => Promise<string | null>
  updateLocation: (id: string, formData: FormData) => Promise<string | null>
  deleteLocation: (id: string) => Promise<string | null>
}
export function useLocation(id?: string): any {
  if (id) {
    const { public: { apiUrl } } = useRuntimeConfig()
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
    const locationUrl = `${baseUrl}locations/${id}`

    const { data, pending, error, refresh } = useFetch<Location>(locationUrl, {
      key: `Location-fetch-${id}`,
      server: true,
      lazy: false
    })

    const location = computed(() => data.value)

    return {
      location,
      Location: location,
      loading: pending,
      error,
      refresh
    }
  }

  const locationService = useLocationService()

  const locations = useState<Location[]>('locations', () => [])
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

  async function fetchLocations(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      locations.value = await locationService.getLocations()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function createLocation(formData: FormData): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await locationService.createLocation(formData)
      await fetchLocations()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function updateLocation(id: string, formData: FormData): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await locationService.updateLocation(id, formData)
      await fetchLocations()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function deleteLocation(id: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await locationService.deleteLocation(id)
      locations.value = locations.value.filter((t) => t.id !== id)
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
    locations,
    loading,
    error,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  }
}
