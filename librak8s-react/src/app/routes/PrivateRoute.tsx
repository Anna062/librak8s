import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'
import { Navbar } from '@/shared/components/Navbar'

export function PrivateRoute() {
  const token = useAuthStore((s) => s.token)

  if (!token) return <Navigate to="/login" replace />

  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </>
  )
}
