import { LoanList } from '@/features/loans/components/LoanList'

export function MyLoansPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes emprunts</h1>
      <LoanList />
    </div>
  )
}
