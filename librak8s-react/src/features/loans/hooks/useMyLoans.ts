import { useQuery } from '@tanstack/react-query'
import { loansApi } from '../api/loansApi'

export function useMyLoans() {
  return useQuery({
    queryKey: ['loans', 'my'],
    queryFn: loansApi.getMyLoans,
  })
}
