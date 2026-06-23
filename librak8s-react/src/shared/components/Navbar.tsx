import { Link, NavLink } from 'react-router-dom'
import { BookMarked, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { user, logout } = useAuthStore()
  const isAdmin = user?.role === 'ROLE_ADMIN'

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/books" className="flex items-center gap-2 font-bold text-primary">
            <BookMarked className="h-5 w-5" />
            LibraK8s
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/books"
              className={({ isActive }) =>
                isActive ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
              }
            >
              Livres
            </NavLink>
            <NavLink
              to="/my-loans"
              className={({ isActive }) =>
                isActive ? 'font-medium text-foreground' : 'text-muted-foreground hover:text-foreground'
              }
            >
              Mes emprunts
            </NavLink>
            {isAdmin && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Admin
              </span>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            {user?.username}
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>
  )
}
