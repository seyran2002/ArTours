import { useApiClient, adminToken } from './api'
import type { LoginForm, LoginResponse, User } from '~/types/admin-auth'

export function useAdminAuthService() {
  const api = useApiClient()

  return {
    async login(credentials: LoginForm): Promise<LoginResponse> {
      const data = await api.post<LoginResponse>('auth/login', credentials)
      adminToken.set(data.token)
      return data
    },

    async getCurrentUser(): Promise<User> {
      return await api.get<User>('auth/me')
    },

    logout(): void {
      adminToken.clear()

      const { clearAuth } = useAdminAuth()
      clearAuth()

      navigateTo('/admin/login')
    },
  }
}
