
export type LoanStatus = 'ACTIVE' | 'RETURNED'

export interface Loan {
  id: number
  bookId: number
  username: string
  loanDate: string
  returnDate: string | null
  status: LoanStatus
}

export interface CreateLoanRequest {
  bookId: number
}
