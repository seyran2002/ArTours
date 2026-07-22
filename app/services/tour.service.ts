import { useApiClient } from './api'
import type { AdminTour } from '~/types/admin-tour'

export function useTourService() {
  const api = useApiClient()

  return {
    async getTours(): Promise<AdminTour[]> {
      return api.get<AdminTour[]>('tours')
    },

    async createTour(formData: FormData): Promise<AdminTour> {
      return api.post<AdminTour>('tours', formData)
    },

    async updateTour(id: string, formData: FormData): Promise<AdminTour> {
      return api.patch<AdminTour>(`tours/${id}`, formData)
    },

    async deleteTour(id: string): Promise<void> {
      return api.delete(`tours/${id}`)
    },
  }
}
