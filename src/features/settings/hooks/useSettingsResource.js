import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { settingsApi } from '../api/settings'
import { settingsKeys } from './settingsKeys'
import { useDirtyForm } from './useDirtyForm'
import { toast } from '../../../lib/toast'

/**
 * One hook to back any "document"-style settings panel (general, notifications,
 * billing-address, policies, etc.).
 *
 * Behind the scenes it composes:
 *   - React Query (fetch + cache + invalidate)
 *   - useDirtyForm (local edit state, dirty tracking, discard)
 *   - toast (success/error feedback)
 *
 * Panels using this hook become ~80 lines of UI with no state machinery.
 *
 *   const settings = useSettingsResource('general')
 *   settings.isLoading | isError | error
 *   settings.values, setField, isDirty, isSaving, save, discard
 *
 * The `resource` name must match a key on `settingsApi` (e.g. 'general',
 * 'notifications').
 */
export function useSettingsResource(resource, {
  successMessage = 'Settings saved',
  errorMessage,
} = {}) {
  const queryClient = useQueryClient()
  const api = settingsApi[resource]

  if (!api?.get || !api?.save) {
    throw new Error(
      `useSettingsResource: no document API found for "${resource}". ` +
      `Make sure settingsApi.${resource} exports get() and save().`
    )
  }

  // ── Server data ─────────────────────────────────────────
  const query = useQuery({
    queryKey: settingsKeys.resource(resource),
    queryFn:  () => api.get(),
  })

  // ── Save handler used by the form ───────────────────────
  const onSave = useCallback(async (values) => {
    try {
      const saved = await api.save(values)
      toast.success(successMessage)
      // Update cache so any other consumer of the same key sees the fresh value.
      queryClient.setQueryData(settingsKeys.resource(resource), saved)
      return saved
    } catch (err) {
      toast.error(errorMessage ? new Error(errorMessage) : err)
      throw err
    }
  }, [api, resource, successMessage, errorMessage, queryClient])

  // ── Local edit state ────────────────────────────────────
  const form = useDirtyForm(query.data, { onSave })

  return {
    // Query state
    isLoading: query.isLoading,
    isError:   query.isError,
    error:     query.error,
    refetch:   query.refetch,

    // Form state
    values:    form.values,
    setField:  form.setField,
    setValues: form.setValues,
    isDirty:   form.isDirty,
    isSaving:  form.isSaving,
    save:      form.save,
    discard:   form.discard,
  }
}
