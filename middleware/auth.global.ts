import {useAuthToken} from "~/composables/useAuthToken";

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip token validation on server-side to avoid hydration issues
  if (import.meta.server) return

  const { isAuthenticated } = useAuthToken()
  const authStore = useAuthStore()

  // Check token validity by attempting to fetch current user
  // Only do this if we have a token but no user data yet
  if (isAuthenticated.value && !authStore.user) {
    await authStore.checkAuth()
  }

  // After validation, apply standard auth rules

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated.value && to.path !== '/login' && to.meta.requiresAuth !== false) {
    // You can customize this to return to the original page after login
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  }

  // If user is already authenticated and trying to access login page
  if (isAuthenticated.value && to.path === '/login') {
    return navigateTo('/')
  }
})