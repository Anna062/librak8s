import { useReturnLoan } from '../hooks/useReturnLoan'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

interface Props {
  loanId: number
}

export function ReturnButton({ loanId }: Props) {
  const { mutate, isPending } = useReturnLoan()

  function handleReturn() {
    mutate(loanId, {
      onSuccess: () => toast.success('Livre retourné', 'L\'emprunt a été clôturé.'),
      onError: () => toast.error('Erreur', 'Impossible de retourner ce livre'),
    })
  }

  return (
    <Button size="sm" variant="outline" disabled={isPending} onClick={handleReturn}>
      {isPending ? 'En cours…' : 'Retourner'}
    </Button>
  )
}
