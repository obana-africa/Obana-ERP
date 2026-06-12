import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '../api/settings'
import { settingsKeys } from './settingsKeys'
import { toast } from '../../../lib/toast'

/**
 * Location CRUD hooks. Collection-style resource with optimistic updates.
 *
 * Used by the Locations panel + its add/edit sub-views. Each mutation:
 *   - Updates the cache optimistically where it makes sense
 *   - Rolls back on failure
 *   - Surfaces a toast
 *   - Invalidates the list afterwards
 */

const api = () => settingsApi.locations

export function useLocations() {
  return useQuery({
    queryKey: settingsKeys.locations.list(),
    queryFn:  () => api().list(),
  })
}

export function useCreateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api().create(data),
    onSuccess: (created) => {
      toast.success(`${created.name} added`)
    },
    onError: (err) => toast.error(err),
    onSettled: () => qc.invalidateQueries({ queryKey: settingsKeys.locations.list() }),
  })
}

export function useUpdateLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => api().update(id, data),

    // Optimistic write into the list cache
    onMutate: async ({ id, data }) => {
      await qc.cancelQueries({ queryKey: settingsKeys.locations.list() })
      const previous = qc.getQueryData(settingsKeys.locations.list())
      if (Array.isArray(previous)) {
        qc.setQueryData(settingsKeys.locations.list(), previous.map(l =>
          l.id === id ? { ...l, ...data } : l
        ))
      }
      return { previous }
    },

    onSuccess: () => toast.success('Location updated'),

    onError: (err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(settingsKeys.locations.list(), ctx.previous)
      toast.error(err)
    },

    onSettled: () => qc.invalidateQueries({ queryKey: settingsKeys.locations.list() }),
  })
}

export function useDeleteLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api().remove(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: settingsKeys.locations.list() })
      const previous = qc.getQueryData(settingsKeys.locations.list())
      if (Array.isArray(previous)) {
        qc.setQueryData(settingsKeys.locations.list(), previous.filter(l => l.id !== id))
      }
      return { previous }
    },

    onSuccess: () => toast.success('Location deleted'),

    onError: (err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(settingsKeys.locations.list(), ctx.previous)
      toast.error(err)
    },

    onSettled: () => qc.invalidateQueries({ queryKey: settingsKeys.locations.list() }),
  })
}

export function useSetDefaultLocation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api().setDefault(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: settingsKeys.locations.list() })
      const previous = qc.getQueryData(settingsKeys.locations.list())
      if (Array.isArray(previous)) {
        qc.setQueryData(settingsKeys.locations.list(),
          previous.map(l => ({ ...l, isDefault: l.id === id })))
      }
      return { previous }
    },

    onSuccess: () => toast.success('Default location updated'),

    onError: (err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(settingsKeys.locations.list(), ctx.previous)
      toast.error(err)
    },

    onSettled: () => qc.invalidateQueries({ queryKey: settingsKeys.locations.list() }),
  })
}

export function useToggleLocationActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => api().toggleActive(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: settingsKeys.locations.list() })
      const previous = qc.getQueryData(settingsKeys.locations.list())
      if (Array.isArray(previous)) {
        qc.setQueryData(settingsKeys.locations.list(),
          previous.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l))
      }
      return { previous, id }
    },

    onSuccess: (updated) => {
      toast.success(updated.isActive ? 'Location activated' : 'Location deactivated')
    },

    onError: (err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(settingsKeys.locations.list(), ctx.previous)
      toast.error(err)
    },

    onSettled: () => qc.invalidateQueries({ queryKey: settingsKeys.locations.list() }),
  })
}