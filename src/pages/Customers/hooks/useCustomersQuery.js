import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { customersApi } from '../../../api/customers'
import { customerKeys } from './customerKeys'

/**
 * Paginated customer list. Server takes filter/sort/page params; we never
 * sift through more than `pageSize` records in the browser.
 *
 *   const { data, isLoading, isError, error, refetch, isFetching } =
 *     useCustomersQuery({ segment, search, state, sort, page, pageSize })
 *
 *   data: { items, total, page, pageSize }
 */
export function useCustomersQuery(params) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn:  () => customersApi.list(params),
    // Keep the previous page visible while the next page loads — no flash
    // back to a skeleton just for paginating or tweaking a filter.
    placeholderData: keepPreviousData,
  })
}

/**
 * Single customer detail. Pulled separately so the modal can show fresh
 * data (and not whatever was stale in the list cache).
 */
export function useCustomerQuery(id, { enabled = true } = {}) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn:  () => customersApi.getById(id),
    enabled:  enabled && !!id,
  })
}

/**
 * Aggregate stats for the top cards. Refetched less frequently than the
 * list since the numbers don't change as often.
 */
export function useCustomerStatsQuery() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn:  () => customersApi.stats(),
    staleTime: 60_000, // stats can be 1 minute old, that's fine
  })
}