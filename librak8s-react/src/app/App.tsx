import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { PrivateRoute } from './routes/PrivateRoute'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { BooksPage } from '@/pages/BooksPage'
import { BookDetailPage } from '@/pages/BookDetailPage'
import { MyLoansPage } from '@/pages/MyLoansPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { Toaster } from '@/components/ui/toaster'

export function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/books" element={<BooksPage />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/my-loans" element={<MyLoansPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </ErrorBoundary>
  )
}
