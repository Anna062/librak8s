import { BookOpen } from 'lucide-react'
import type { Book } from '../types'
import { useBorrowBook } from '@/features/loans/hooks/useBorrowBook'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'

interface Props {
  book: Book
}

export function BookDetail({ book }: Props) {
  const { mutate: borrow, isPending } = useBorrowBook()

  function handleBorrow() {
    borrow(
      { bookId: book.id },
      {
        onSuccess: () => toast.success('Emprunt créé', `"${book.title}" est emprunté.`),
        onError: (err) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const msg = (err as any)?.response?.data?.message ?? 'Impossible d\'emprunter ce livre'
          toast.error('Erreur', msg)
        },
      }
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <p className="text-xl text-muted-foreground mt-1">{book.author}</p>
      </div>
      <dl className="grid grid-cols-2 gap-4 rounded-lg border p-4">
        <div>
          <dt className="text-sm text-muted-foreground">ISBN</dt>
          <dd className="font-mono text-sm">{book.isbn}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Exemplaires totaux</dt>
          <dd>{book.totalCopies}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-sm text-muted-foreground mb-1">Disponibilité</dt>
          <dd className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <Badge variant={book.availableCopies > 0 ? 'success' : 'secondary'}>
              {book.availableCopies} / {book.totalCopies} disponible(s)
            </Badge>
          </dd>
        </div>
      </dl>
      <Button disabled={book.availableCopies === 0 || isPending} onClick={handleBorrow} size="lg">
        {isPending ? 'En cours…' : 'Emprunter ce livre'}
      </Button>
    </div>
  )
}
