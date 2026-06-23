import { useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '../api/booksApi'

export function useDeleteBook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: booksApi.remove,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
