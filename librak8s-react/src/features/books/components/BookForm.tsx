import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateBook } from '../hooks/useCreateBook'
import { useUpdateBook } from '../hooks/useUpdateBook'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import { Book } from "@/features/books/types"

const schema = z.object({
  title: z.string().min(1, 'Titre requis'),
  author: z.string().min(1, 'Auteur requis'),
  isbn: z.string().min(1, 'ISBN requis'),
  totalCopies: z.coerce.number().int().min(1, 'Minimum 1 exemplaire'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess?: () => void
  book?: Book
}

export function BookForm({ onSuccess, book }: Props) {
  const isEditing = !!book
  const { mutate: create, isPending: isCreating } = useCreateBook()
  const { mutate: update, isPending: isUpdating } = useUpdateBook()
  const isPending = isCreating || isUpdating

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: book
      ? { title: book.title, author: book.author, isbn: book.isbn, totalCopies: book.totalCopies }
      : { totalCopies: 1 },
  })

  function onSubmit(values: FormValues) {
    if (isEditing) {
      update(
        { id: book.id, data: values },
        {
          onSuccess: () => {
            toast.success('Livre modifié', `"${values.title}" a été modifié.`)
            onSuccess?.()
          },
          onError: () => toast.error('Erreur', 'Impossible de modifier ce livre'),
        }
      )
    } else {
      create(values, {
        onSuccess: () => {
          toast.success('Livre ajouté', `"${values.title}" a été ajouté.`)
          form.reset()
          onSuccess?.()
        },
        onError: () => toast.error('Erreur', 'Impossible d\'ajouter ce livre'),
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Clean Code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auteur</FormLabel>
              <FormControl>
                <Input placeholder="Robert C. Martin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="978-0132350884" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalCopies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre d'exemplaires</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending
            ? (isEditing ? 'Modification…' : 'Ajout…')
            : (isEditing ? 'Modifier le livre' : 'Ajouter le livre')}
        </Button>
      </form>
    </Form>
  )
}
