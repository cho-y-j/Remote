import axios from 'axios'
import { useAuthStore } from './authStore'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  email: string
  name: string
  plan: string
}

export interface SessionResponse {
  id: string
  sessionCode: string
  hostDeviceId: string
  clientDeviceId: string | null
  status: string
  startedAt: string
  endedAt: string | null
  durationSeconds: number | null
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface GoogleAuthRequest {
  idToken: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: RegisterRequest) =>
    api.post<AuthResponse>('/auth/register', data),

  googleLogin: (data: GoogleAuthRequest) =>
    api.post<AuthResponse>('/auth/google', data),
}

export interface SubscriptionResponse {
  id: string
  plan: string
  status: string
  billingCycle: string
  amount: number
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelledAt: string | null
  createdAt: string
}

export interface PaymentHistoryResponse {
  id: string
  orderId: string
  amount: number
  status: string
  orderName: string
  paidAt: string
  createdAt: string
}

export interface BillingAuthRequest {
  authKey: string
  customerKey: string
  plan: string
  billingCycle: string
}

export const paymentApi = {
  subscribe: (data: BillingAuthRequest) =>
    api.post<SubscriptionResponse>('/payments/subscribe', data),

  cancelSubscription: () =>
    api.delete<SubscriptionResponse>('/payments/subscribe'),

  getCurrentSubscription: () =>
    api.get<SubscriptionResponse>('/payments/subscribe'),

  getPaymentHistory: () =>
    api.get<PaymentHistoryResponse[]>('/payments/history'),
}

export const sessionApi = {
  getActiveSessions: () =>
    api.get<SessionResponse[]>('/sessions/active'),

  getSessionByCode: (code: string) =>
    api.get<SessionResponse>(`/sessions/code/${code}`),

  joinSession: (code: string, deviceId: string) =>
    api.post<SessionResponse>(`/sessions/code/${code}/join`, null, {
      params: { clientDeviceId: deviceId },
    }),

  endSession: (id: string) =>
    api.delete<SessionResponse>(`/sessions/${id}`),
}

export default api
