import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'

/**
 * Gates protected routes. Redirects to /login if not authenticated,
 * preserving the attempted URL so the user lands back after sign-in.
 *
 * Currently the stub returns isAuthenticated=true, so this is a no-op.
 * The moment your real auth is wired, this guard activates automatically.
 */
export default function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null // or a full-page spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}