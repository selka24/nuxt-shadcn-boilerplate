/**
 * API wrapper using Axios
 * Handles authorization with refresh tokens and global error handling
 */
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl || '/api/v1'
  const { accessToken, refreshToken, setTokens, clearTokens } = useAuthToken()
  // const toast = useToast?.()

  // Create axios instance with default config
  const api = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Request interceptor - add auth token to requests
  api.interceptors.request.use(
    (config) => {
      if (accessToken.value) {
        config.headers.Authorization = `Bearer ${accessToken.value}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - handle refresh token logic and errors
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

      // Handle 401 - Token expired
      if (error.response?.status === 401 && refreshToken.value && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          // Call your refresh token endpoint
          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refresh_token: refreshToken.value
          })

          // Set new tokens
          if (response.data.access_token && response.data.refresh_token) {
            setTokens(response.data.access_token, response.data.refresh_token)

            // Update header for the original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`
            }

            // Retry the original request
            return api(originalRequest)
          }
        } catch (refreshError) {
          // If refresh token is invalid, log the user out
          clearTokens()
          showErrorMessage('Your session has expired. Please log in again.')

          // Redirect to login page
          navigateTo('/login')
          return Promise.reject(refreshError)
        }
      }

      // Handle global error messages
      showErrorMessage(getErrorMessage(error))

      return Promise.reject(error)
    }
  )

  // Helper function to display error messages
  function showErrorMessage(message: string) {
    // if (toast) {
    //   toast.error(message)
    // } else {
      console.error('API Error:', message)
    // }
  }

  // Extract readable error message from error object
  function getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as Record<string, any>
      return data.message || data.error || String(error.response.data)
    }

    return error.message || 'An unexpected error occurred'
  }

  // HTTP request methods
  return {
    // GET request
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      return api.get<T, AxiosResponse<T>>(url, config)
        .then(response => response.data)
    },

    // POST request
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      return api.post<T, AxiosResponse<T>>(url, data, config)
        .then(response => response.data)
    },

    // PUT request
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      return api.put<T, AxiosResponse<T>>(url, data, config)
        .then(response => response.data)
    },

    // PATCH request
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
      return api.patch<T, AxiosResponse<T>>(url, data, config)
        .then(response => response.data)
    },

    // DELETE request
    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
      return api.delete<T, AxiosResponse<T>>(url, config)
        .then(response => response.data)
    }
  }
}
