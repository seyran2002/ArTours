import { useApiClient } from './api'
import type { Transfer } from '~/types/transfer'

export function useTransferService() {
  const api = useApiClient()

  return {
    async getTransfers(): Promise<Transfer[]> {
      return api.get<Transfer[]>('transfers')
    },

    async getTransfersCount(): Promise<{ count: number }> {
      return api.get<{ count: number }>('transfers/count')
    },

    async createTransfer(formData: FormData): Promise<Transfer> {
      return api.post<Transfer>('transfers', formData)
    },

    async updateTransfer(id: string, formData: FormData): Promise<Transfer> {
      return api.patch<Transfer>(`transfers/${id}`, formData)
    },

    async deleteTransfer(id: string): Promise<void> {
      return api.delete(`transfers/${id}`)
    },
  }
}
