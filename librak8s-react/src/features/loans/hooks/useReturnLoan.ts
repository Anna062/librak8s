import { useMutation, useQueryClient } from '@tanstack/react-query'
import { loansApi } from '../api/loansApi'
import type { Loan } from '../types'

export function useReturnLoan() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: loansApi.returnLoan,
    onMutate: async (loanId) => {
      await qc.cancelQueries({ queryKey: ['loans', 'my'] })
      const previous = qc.getQueryData<Loan[]>(['loans', 'my'])
      qc.setQueryData<Loan[]>(['loans', 'my'], (old) =>
        old?.map((l) =>
          l.id === loanId
            ? { ...l, status: 'RETURNED', returnDate: new Date().toISOString().split('T')[0] }
            : l
        )
      )
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        qc.setQueryData(['loans', 'my'], context.previous)
      }
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['loans', 'my'] })
      void qc.invalidateQueries({ queryKey: ['books'] })
    },
  })
}
