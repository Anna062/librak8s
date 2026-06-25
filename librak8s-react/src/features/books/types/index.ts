export interface Book {
  id: number
  title: string
  author: string
  isbn: string
  totalCopies: number
  availableCopies: number
}

export interface CreateBookRequest {
  title: string
  author: string
  isbn: string
  availableCopies: number
}

export interface UpdateBookRequest {
  title: string
  author: string
  isbn: string
  totalCopies: number
}
