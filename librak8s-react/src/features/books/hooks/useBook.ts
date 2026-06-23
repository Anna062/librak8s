import { useQuery } from '@tanstack/react-query'
import { booksApi } from '../api/booksApi'

export function useBook(id: number) {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksApi.getById(id),
    enabled: !!id,
  })
}
