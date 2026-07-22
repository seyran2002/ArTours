export const adminToken = {
  get(): string | null {
    if (!import.meta.client) return null

    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith('admin_token='))

    return match ? decodeURIComponent(match.slice('admin_token='.length)) : null
  },

  set(token: string, maxAgeSeconds = 28_800): void {
    if (!import.meta.client) return
    document.cookie = `admin_token=${encodeURIComponent(token)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax; Secure`
  },

  clear(): void {
    if (!import.meta.client) return
    document.cookie = 'admin_token=; path=/; max-age=0; SameSite=Lax; Secure'
  },
}

const API_INSTANCE_KEY = '__apiInstance__' as const

function createFetchInstance(baseURL: string) {
  const fetcher = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const token = adminToken.get()
      if (token) {
        options.headers = options.headers || {}
        if (options.headers instanceof Headers) {
          options.headers.set('Authorization', `Bearer ${token}`)
        } else if (Array.isArray(options.headers)) {
          (options.headers as [string, string][]).push(['Authorization', `Bearer ${token}`])
        } else {
          (options.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401 && import.meta.client) {
        adminToken.clear()
        navigateTo('/admin/login')
      }
    }
  })

  return {
    get<T>(url: string, options?: any): Promise<T> {
      return fetcher<T>(url, { ...options, method: 'GET' })
    },
    post<T>(url: string, body?: any, options?: any): Promise<T> {
      return fetcher<T>(url, { ...options, method: 'POST', body })
    },
    patch<T>(url: string, body?: any, options?: any): Promise<T> {
      return fetcher<T>(url, { ...options, method: 'PATCH', body })
    },
    delete<T>(url: string, options?: any): Promise<T> {
      return fetcher<T>(url, { ...options, method: 'DELETE' })
    }
  }
}

export function useApiClient() {
  const nuxtApp = useNuxtApp()
  const { public: { apiUrl } } = useRuntimeConfig()

  if (import.meta.server) {
    return createFetchInstance(apiUrl as string)
  }

  if (!nuxtApp[API_INSTANCE_KEY]) {
    nuxtApp[API_INSTANCE_KEY] = createFetchInstance(apiUrl as string)
  }

  return nuxtApp[API_INSTANCE_KEY] as ReturnType<typeof createFetchInstance>
}
