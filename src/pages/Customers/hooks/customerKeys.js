/**
 * Query-key factory. All customer-related cache keys live here.
 *
 * Why centralize: invalidation only works if the key you invalidate is
 * *exactly* the prefix of the key you queried. Typos here are silent bugs.
 *
 *   queryClient.invalidateQueries({ queryKey: customerKeys.lists() })
 */
export const customerKeys = {
  all:     () => ['customers'],
  lists:   () => ['customers', 'list'],
  list:    (params) => ['customers', 'list', params],
  details: () => ['customers', 'detail'],
  detail:  (id) => ['customers', 'detail', id],
  stats:   () => ['customers', 'stats'],
}