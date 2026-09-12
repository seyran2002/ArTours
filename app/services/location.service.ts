import { useApiClient } from './api'
import type { Location } from '~/types/location'

export function useLocationService() {
  const api = useApiClient()

  return {
    async getLocations(): Promise<Location[]> {
      return api.get<Location[]>('locations')
    },

    async getLocationsCount(): Promise<{ count: number }> {
      return api.get<{ count: number }>('locations/count')
    },

    async createLocation(formData: FormData): Promise<Location> {
      return api.post<Location>('locations', formData)
    },

    async updateLocation(id: string, formData: FormData): Promise<Location> {
      return api.patch<Location>(`locations/${id}`, formData)
    },

    async deleteLocation(id: string): Promise<void> {
      return api.delete(`locations/${id}`)
    },
  }
}
