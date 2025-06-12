/**
 * Auth token management composable
 * Handles access and refresh tokens via cookies with proper security settings
 */
export const useAuthToken = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  const accessToken = useCookie('access_token', {
    maxAge: 1800, // 30 minutes
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
    httpOnly: isProduction // Better security in production
  })

  const refreshToken = useCookie('refresh_token', {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    sameSite: 'strict',
    secure: isProduction,
    path: '/',
    httpOnly: isProduction // Better security in production
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
