import { adminToken } from '~/services/api'

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) return

  const isLoginPage = to.path === '/admin/login'
  const token = adminToken.get()

  if (!token) {
    if (isLoginPage) return
    return navigateTo('/admin/login')
  }


  const { checkAuth } = useAdminAuth()
  const authenticated = await checkAuth()

  if (authenticated) {
    if (isLoginPage) return navigateTo('/admin')
    return
  }

  if (!isLoginPage) {
    return navigateTo('/admin/login')
  }
})
