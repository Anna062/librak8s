import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateBook } from '../hooks/useCreateBook'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

const schema = z.object({
  title: z.string().min(1, 'Titre requis'),
  author: z.string().min(1, 'Auteur requis'),
  isbn: z.string().min(1, 'ISBN requis'),
  totalCopies: z.coerce.number().int().min(1, 'Minimum 1 exemplaire'),
})

type FormValues = z.infer<typeof schema>

interface Props {
  onSuccess?: () => void
}

export function BookForm({ onSuccess }: Props) {
  const { mutate, isPending } = useCreateBook()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { totalCopies: 1 },
  })

  function onSubmit(values: FormValues) {
    mutate(values, {
      onSuccess: () => {
        toast.success('Livre ajouté', `"${values.title}" a été ajouté.`)
        form.reset()
        onSuccess?.()
      },
      onError: () => toast.error('Erreur', 'Impossible d\'ajouter ce livre'),
    })
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
          {isPending ? 'Ajout…' : 'Ajouter le livre'}
        </Button>
      </form>
    </Form>
  )
}
