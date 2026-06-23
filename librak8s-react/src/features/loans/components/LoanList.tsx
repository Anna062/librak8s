import { useMyLoans } from '../hooks/useMyLoans'
import { LoanCard } from './LoanCard'
import { Loader } from '@/shared/components/Loader'

export function LoanList() {
  const { data: loans, isLoading, isError } = useMyLoans()

  if (isLoading) return <Loader />
  if (isError) return <p className="text-destructive">Impossible de charger vos emprunts.</p>
  if (!loans?.length)
    return <p className="text-muted-foreground">Vous n'avez aucun emprunt en cours.</p>

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {loans.map((loan) => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
    </div>
  )
}
