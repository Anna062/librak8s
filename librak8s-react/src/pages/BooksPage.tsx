import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import { BookList } from '@/features/books/components/BookList'
import { BookForm } from '@/features/books/components/BookForm'
import { useAuthStore } from '@/shared/store/authStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function BooksPage() {
  const user = useAuthStore((s) => s.user)
  const isAdmin = user?.role === 'ROLE_ADMIN'
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Catalogue</h1>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un livre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouveau livre</DialogTitle>
              </DialogHeader>
              <BookForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
      <BookList />
    </div>
  )
}
