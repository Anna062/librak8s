export interface ApiError {
  message: string
  status: number
  timestamp?: string
  path?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
