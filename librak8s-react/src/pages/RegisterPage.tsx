import { Link, Navigate } from 'react-router-dom'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { useAuthStore } from '@/shared/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookMarked } from 'lucide-react'

export function RegisterPage() {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/books" replace />

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <BookMarked className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>Rejoignez LibraK8s</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
