import { useState } from 'react'
import { BookList } from '@/features/books/components/BookList'
import { useAuthStore } from '@/shared/store/authStore'
import { BookDialog } from "@/shared/components/AddBookDialog.tsx"
import type { Book } from '@/features/books/types'

export function BooksPage() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const [open, setOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined)

  function handleEdit(book: Book) {
    setEditingBook(book)
    setOpen(true)
  }

  function handleClose(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setEditingBook(undefined)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Catalogue</h1>
        {isAdmin && <BookDialog open={open} setOpen={handleClose} book={editingBook} />}
      </div>
      <BookList onEdit={isAdmin ? handleEdit : undefined} />
    </div>
  )
}
