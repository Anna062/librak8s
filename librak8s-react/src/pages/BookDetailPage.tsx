import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBook } from '@/features/books/hooks/useBook'
import { BookDetail } from '@/features/books/components/BookDetail'
import { Loader } from '@/shared/components/Loader'
import { Button } from '@/components/ui/button'

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading, isError } = useBook(Number(id))

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link to="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au catalogue
        </Link>
      </Button>
      {isLoading && <Loader />}
      {isError && <p className="text-destructive">Livre introuvable.</p>}
      {book && <BookDetail book={book} />}
    </div>
  )
}
