import apiClient from '@/shared/lib/axios'
import type { CreateLoanRequest, Loan } from '../types'

export const loansApi = {
  getMyLoans: () =>
    apiClient.get<Loan[]>('/api/loans/my')
    .then((r) => {
      console.log(r.data);

      return r.data;
    }),

  borrow: (data: CreateLoanRequest) =>
    apiClient.post<Loan>('/api/loans', data).then((r) => r.data),

  returnLoan: (id: number) =>
    apiClient.put<Loan>(`/api/loans/${id}/return`).then((r) => r.data),
}
