import {useApi} from "~/composables/useApi";
import {defineStore} from "pinia";
import {useAuthToken} from "~/composables/useAuthToken";

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const {post, get} = useApi()
  const {setTokens, clearTokens, accessToken, isAuthenticated} = useAuthToken()

  const login = async (credentials: any) => {
    try {
      const {access_token, refresh_token} = await post<{access_token: string, refresh_token: string}>('/auth/login', credentials)
      setTokens(access_token, refresh_token)
      await fetchCurrentUser()
      return true
    } catch (e) {
      return false
    }
  }

  const logout = () => {
    clearTokens()
    user.value = null
    // Optionally, you can redirect to the login page after logout
    navigateTo('/login')
  }

  const fetchCurrentUser = async () => {
    if (!isAuthenticated.value) return null

    try {
      user.value = await get('/auth/profile')
      return user.value
    } catch (error) {
      user.value = null
      return null
    }
  }

  const checkAuth = async () => {
    isLoading.value = true
    try {
      if (accessToken.value) {
        await fetchCurrentUser()
      }
    } catch (error) {
      // If there's an error fetching the user, the token might be invalid
      clearTokens()
    } finally {
      isLoading.value = false
    }

    return !!user.value
  }

  return {
    user,
    login,
    logout,
    checkAuth,
    fetchCurrentUser,
    isLoading
  }
})