import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '../api/errors'

/**
 * Shared React Query client. Mount once at the app root:
 *
 *   import { QueryClientProvider } from '@tanstack/react-query'
 *   import { queryClient } from './lib/queryClient'
 *
 *   <QueryClientProvider client={queryClient}>
 *     <App />
 *   </QueryClientProvider>
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Keep results fresh for 30s before background refetching on mount.
      staleTime: 30_000,
      // Garbage-collect inactive queries after 5 minutes.
      gcTime: 5 * 60_000,
      // Don't retry on client errors (4xx) — those won't succeed on retry.
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status && error.status < 500) return false
        return failureCount < 2
      },
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutations don't retry by default — user-initiated actions
      // shouldn't fire twice without explicit consent.
      retry: false,
    },
  },
})