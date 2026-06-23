import { useBooks } from '../hooks/useBooks'
import { BookCard } from './BookCard'
import { Loader } from '@/shared/components/Loader'

export function BookList() {
  const { data: books, isLoading, isError } = useBooks()

  if (isLoading) return <Loader />
  if (isError) return <p className="text-destructive">Impossible de charger les livres.</p>
  if (!books?.length) return <p className="text-muted-foreground">Aucun livre disponible.</p>

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  )
}
