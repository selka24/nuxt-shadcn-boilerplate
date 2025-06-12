export interface Alert {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number // in milliseconds
}

const alerts = ref<Alert[]>([])

export const useAlert = () => {
  return {
    alerts
  }
}