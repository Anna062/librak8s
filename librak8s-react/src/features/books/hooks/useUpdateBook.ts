import { useMutation, useQueryClient } from '@tanstack/react-query'
import { booksApi } from '../api/booksApi'
import type { UpdateBookRequest } from '../types'

export function useUpdateBook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBookRequest }) =>
      booksApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
