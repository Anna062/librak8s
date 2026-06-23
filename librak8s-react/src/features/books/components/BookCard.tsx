import { BookOpen, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Book } from '../types'
import { useAuthStore } from '@/shared/store/authStore'
import { useBorrowBook } from '@/features/loans/hooks/useBorrowBook'
import { useDeleteBook } from '../hooks/useDeleteBook'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'

interface Props {
  book: Book
}

export function BookCard({ book }: Props) {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const { mutate: borrow, isPending: isBorrowing } = useBorrowBook()
  const { mutate: remove, isPending: isDeleting } = useDeleteBook()

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

  function handleDelete() {
    remove(book.id, {
      onSuccess: () => toast.success('Livre supprimé'),
      onError: () => toast.error('Erreur', 'Impossible de supprimer ce livre'),
    })
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base leading-tight">
          <Link to={`/books/${book.id}`} className="hover:underline">
            {book.title}
          </Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>
      <CardContent className="flex-1 space-y-1">
        <p className="text-xs text-muted-foreground font-mono">ISBN : {book.isbn}</p>
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <Badge variant={book.availableCopies > 0 ? 'success' : 'secondary'}>
            {book.availableCopies} / {book.totalCopies} disponible(s)
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          size="sm"
          disabled={book.availableCopies === 0 || isBorrowing}
          onClick={handleBorrow}
          className="flex-1"
        >
          {isBorrowing ? 'En cours…' : 'Emprunter'}
        </Button>
        {isAdmin && (
          <Button
            size="sm"
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
