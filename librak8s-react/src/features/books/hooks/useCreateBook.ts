import { useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '../api/booksApi'

export function useCreateBook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: booksApi.create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
