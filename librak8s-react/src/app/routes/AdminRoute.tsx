import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/shared/store/authStore'

export function AdminRoute() {
  const user = useAuthStore((s) => s.user)

  if (user?.role !== 'ROLE_ADMIN') return <Navigate to="/books" replace />

  return <Outlet />
}
