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

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data),

  register: (data: LoginRequest & { name: string }) =>
    api.post<AuthResponse>('/auth/register', data),
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
