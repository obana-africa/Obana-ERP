import { useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '../../../api/customers'
import { toast } from '../../../lib/toast'
import { customerKeys } from './customerKeys'

/**
 * Customer mutations. Each:
 *   - Calls the API
 *   - Optimistically updates the cache where it makes sense
 *   - Rolls back on failure
 *   - Shows a toast (success or error)
 *   - Invalidates affected queries on settle
 *
 * UI code just calls `.mutate(...)` or `.mutateAsync(...)` and handles
 * `isPending` / `isError` if it needs to disable a button.
 */

// ── Create ───────────────────────────────────────────────────
export function useCreateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: data => customersApi.create(data),
    onSuccess: created => {
      toast.success(`${created.name} added`)
    },
    onError: err => {
      toast.error(err)
    },
    onSettled: () => {
      // List and stats both change — invalidate both. The detail cache is
      // automatically populated by the new record's response.
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

// ── Update ───────────────────────────────────────────────────
export function useUpdateCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => customersApi.update(id, data),

    // Optimistic: write to the detail cache immediately. Roll back on error.
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: customerKeys.detail(id) })
      const previous = qc.getQueryData(customerKeys.detail(id))
      if (previous) {
        qc.setQueryData(customerKeys.detail(id), { ...previous, ...data })
      }
      return { previous, id }
    },

    onSuccess: () => {
      toast.success('Customer updated')
    },

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(customerKeys.detail(ctx.id), ctx.previous)
      toast.error(err)
    },

    onSettled: (_data, _err, { id }) => {
      qc.invalidateQueries({ queryKey: customerKeys.detail(id) })
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

// ── Delete (single) ──────────────────────────────────────────
export function useDeleteCustomer() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: id => customersApi.delete(id),

    // Optimistic: scrub from every cached list page immediately.
    onMutate: async id => {
      await qc.cancelQueries({ queryKey: customerKeys.lists() })
      const snapshots = qc.getQueriesData({ queryKey: customerKeys.lists() })
      snapshots.forEach(([key, data]) => {
        if (!data?.items) return
        qc.setQueryData(key, {
          ...data,
          items: data.items.filter(c => c.id !== id),
          total: Math.max(0, (data.total || 0) - 1),
        })
      })
      return { snapshots }
    },

    onSuccess: () => {
      toast.success('Customer deleted')
    },

    onError: (err, _id, ctx) => {
      // Restore every snapshot we touched
      ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data))
      toast.error(err)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

// ── Bulk delete ──────────────────────────────────────────────
export function useBulkDeleteCustomers() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ids => customersApi.bulkDelete(ids),

    onMutate: async ids => {
      const set = new Set(ids)
      await qc.cancelQueries({ queryKey: customerKeys.lists() })
      const snapshots = qc.getQueriesData({ queryKey: customerKeys.lists() })
      snapshots.forEach(([key, data]) => {
        if (!data?.items) return
        qc.setQueryData(key, {
          ...data,
          items: data.items.filter(c => !set.has(c.id)),
          total: Math.max(0, (data.total || 0) - ids.length),
        })
      })
      return { snapshots }
    },

    onSuccess: (_data, ids) => {
      toast.success(`${ids.length} customer${ids.length === 1 ? '' : 's'} deleted`)
    },

    onError: (err, _ids, ctx) => {
      ctx?.snapshots?.forEach(([key, data]) => qc.setQueryData(key, data))
      toast.error(err)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}

// ── Bulk tag ─────────────────────────────────────────────────
export function useBulkUpdateTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ ids, tag }) => customersApi.bulkUpdateTag(ids, tag),
    onSuccess: (_data, { ids, tag }) => {
      toast.success(`Tagged ${ids.length} as ${tag}`)
    },
    onError: err => toast.error(err),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: customerKeys.lists() })
      qc.invalidateQueries({ queryKey: customerKeys.stats() })
    },
  })
}