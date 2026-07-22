import { ref, computed, type ComputedRef, type Ref } from 'vue'
import { useState, useFetch, useRuntimeConfig } from '#app'
import { useTransferService } from '~/services/transfer.service'
import type { Transfer } from '~/types/transfer'

export function useTransfer(id: string): {
  transfer: ComputedRef<Transfer | null>
  loading: Ref<boolean>
  error: Ref<any>
  refresh: () => Promise<void>
}
export function useTransfer(): {
  transfers: Ref<Transfer[]>
  loading: Ref<boolean>
  error: Ref<string | null>
  fetchTransfers: () => Promise<void>
  createTransfer: (formData: FormData) => Promise<string | null>
  updateTransfer: (id: string, formData: FormData) => Promise<string | null>
  deleteTransfer: (id: string) => Promise<string | null>
}
export function useTransfer(id?: string): any {
  if (id) {
    const { public: { apiUrl } } = useRuntimeConfig()
    const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`
    const transferUrl = `${baseUrl}transfers/${id}`

    const { data, pending, error, refresh } = useFetch<Transfer>(transferUrl, {
      key: `transfer-fetch-${id}`,
      server: true,
      lazy: false
    })

    const transfer = computed(() => data.value)

    return {
      transfer,
      loading: pending,
      error,
      refresh
    }
  }

  const transferService = useTransferService()

  const transfers = useState<Transfer[]>('transfers', () => [])
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

  async function fetchTransfers(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      transfers.value = await transferService.getTransfers()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
  }

  async function createTransfer(formData: FormData): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await transferService.createTransfer(formData)
      await fetchTransfers()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function updateTransfer(id: string, formData: FormData): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await transferService.updateTransfer(id, formData)
      await fetchTransfers()
      return null
    } catch (err) {
      const message = extractErrorMessage(err)
      error.value = message
      return message
    } finally {
      loading.value = false
    }
  }

  async function deleteTransfer(id: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      await transferService.deleteTransfer(id)
      transfers.value = transfers.value.filter((t) => t.id !== id)
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
    transfers,
    loading,
    error,
    fetchTransfers,
    createTransfer,
    updateTransfer,
    deleteTransfer,
  }
}
