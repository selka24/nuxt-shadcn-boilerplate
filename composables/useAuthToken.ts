/**
 * Auth token management composable
 * Handles access and refresh tokens via cookies with proper security settings
 */
export const useAuthToken = () => {
  const accessToken = useCookie('access_token', {
    maxAge: 1800, // 30 minutes
    sameSite: 'lax',  // Changed from 'strict' to 'lax' for better compatibility
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: false // Allow JavaScript access to the cookie in all environments
  })

  const refreshToken = useCookie('refresh_token', {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: 'lax',  // Changed from 'strict' to 'lax' for better compatibility
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    httpOnly: false // Allow JavaScript access to the cookie in all environments
  })

  const isAuthenticated = computed(() => !!accessToken.value)

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access
    refreshToken.value = refresh
  }

  const clearTokens = () => {
    accessToken.value = null
    refreshToken.value = null
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    setTokens,
    clearTokens
  }
}
