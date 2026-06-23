import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '../hooks/useRegister'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'

const schema = z
  .object({
    username: z.string().min(3, 'Minimum 3 caractères'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterForm() {
  const { mutate, isPending } = useRegister()
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit({ username, password }: FormValues) {
    mutate(
      { username, password },
      {
        onSuccess: () => toast.success('Compte créé', 'Vous pouvez maintenant vous connecter.'),
        onError: (err) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const message = (err as any)?.response?.data?.message ?? 'Erreur lors de l\'inscription'
          toast.error('Inscription échouée', message)
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identifiant</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmation</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Création…' : 'Créer un compte'}
        </Button>
      </form>
    </Form>
  )
}
