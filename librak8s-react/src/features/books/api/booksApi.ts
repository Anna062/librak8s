import apiClient from '@/shared/lib/axios'
import type { Book, CreateBookRequest, UpdateBookRequest } from '../types'

export const booksApi = {
  getAll: () =>
    apiClient.get<Book[]>('/api/books').then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Book>(`/api/books/${id}`).then((r) => r.data),

  create: (data: CreateBookRequest) =>
    apiClient.post<Book>('/api/books', data).then((r) => r.data),

  update: (id: number, data: UpdateBookRequest) =>
    apiClient.put<Book>(`/api/books/${id}`, data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete(`/api/books/${id}`).then((r) => r.data),
}
