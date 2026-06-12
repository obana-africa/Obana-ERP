/**
 * Authentication hook.
 *
 * STUB: returns a dev user with all permissions. Replace the implementation
 * with your real auth provider (Auth0, Clerk, Supabase, custom JWT, etc.)
 * without changing the interface — every component that calls `useAuth()`
 * relies only on the returned shape.
 *
 * Permissions follow the convention `resource:action`:
 *   customers:read, customers:create, customers:update,
 *   customers:delete, customers:export, customers:bulk
 */

const DEV_USER = {
  id: 'dev-user',
  name: 'Dev User',
  email: 'dev@example.com',
  role: 'admin',
  permissions: [
    'customers:read',
    'customers:create',
    'customers:update',
    'customers:delete',
    'customers:export',
    'customers:bulk',
  ],
}

export function useAuth() {
  const user = DEV_USER

  return {
    user,
    isAuthenticated: !!user,
    isLoading: false,

    hasPermission: permission => {
      if (!user) return false
      if (user.role === 'admin') return true
      return user.permissions.includes(permission)
    },

    hasAnyPermission: permissions => {
      if (!user) return false
      if (user.role === 'admin') return true
      return permissions.some(p => user.permissions.includes(p))
    },
  }
}