import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loansApi } from '../api/loansApi'

export function useBorrowBook() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: loansApi.borrow,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['books'] })
      void qc.invalidateQueries({ queryKey: ['loans'] })
    },
  })
}
