import { Link } from 'react-router-dom'
import type { Loan } from '../types'
import { ReturnButton } from './ReturnButton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {useBook} from "@/features/books/hooks/useBook.ts";

interface Props {
  loan: Loan
}

export function LoanCard({ loan }: Props) {
  const {data} = useBook(loan.bookId);
  const isActive = loan.status === 'ACTIVE'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          <Link to={`/books/${loan.bookId}`} className="hover:underline">
            {data ? data.title : "Book"}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{data ? data.author : "Author"}</p>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Statut :</span>
          <Badge variant={isActive ? 'warning' : 'success'}>
            {isActive ? 'ACTIF' : 'RETOURNÉ'}
          </Badge>
        </div>
        <p>
          <span className="text-muted-foreground">Emprunté le : </span>
          {loan.loanDate}
        </p>
        {loan.returnDate && (
          <p>
            <span className="text-muted-foreground">Retourné le : </span>
            {loan.returnDate}
          </p>
        )}
      </CardContent>
      {isActive && (
        <CardFooter>
          <ReturnButton loanId={loan.id} />
        </CardFooter>
      )}
    </Card>
  )
}
