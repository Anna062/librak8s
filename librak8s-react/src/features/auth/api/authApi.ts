import apiClient from '@/shared/lib/axios'
import type { AuthRequest, AuthResponse, RegisterRequest } from '../types'

export const authApi = {
  login: (data: AuthRequest) =>
    apiClient.post<AuthResponse>('/api/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    apiClient.post<void>('/api/auth/register', data).then((r) => r.data),
}
