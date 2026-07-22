import { adminToken } from '~/services/api'
import { useAdminAuthService } from '~/services/admin-auth.service'
import type { User } from '~/types/admin-auth'

/**
 * Global singleton auth state for the Admin Panel.
 *
 * Lifecycle:
 *  - `isChecking`     → true while GET /auth/me is in-flight
 *  - `user`           → populated on successful validation, null otherwise
 *  - `isAuthenticated`→ derived: user !== null
 *
 * Usage:
 *  const { user, isAuthenticated, isChecking, checkAuth, clearAuth } = useAdminAuth()
 */
export const useAdminAuth = () => {
  const user = useState<User | null>('admin_auth_user', () => null)
  const isChecking = useState<boolean>('admin_auth_checking', () => false)

  const isAuthenticated = computed(() => user.value !== null)

  const checkAuth = async (): Promise<boolean> => {
    const token = adminToken.get()

    if (!token) {
      user.value = null
      return false
    }

    if (user.value !== null) {
      return true
    }

    isChecking.value = true

    try {
      const { getCurrentUser } = useAdminAuthService()
      const fetchedUser = await getCurrentUser()
      user.value = fetchedUser
      return true
    } catch {
      adminToken.clear()
      user.value = null
      return false
    } finally {
      isChecking.value = false
    }
  }

  const clearAuth = (): void => {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    isChecking,
    checkAuth,
    clearAuth,
  }
}
