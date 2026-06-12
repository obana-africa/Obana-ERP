import { useCallback, useEffect, useState, useMemo } from 'react'

/**
 * Generic dirty-form state.
 *
 * Backs every panel form in Settings. Replaces the hand-rolled pattern
 *   const [form, setForm] = useState(INITIAL)
 *   const [saved, setSaved] = useState(JSON.stringify(INITIAL))
 *   const dirty = JSON.stringify(form) !== saved
 * which appeared in 9+ panels.
 *
 * Usage:
 *   const form = useDirtyForm(serverData, { onSave: api.save })
 *   form.values       — current edited state
 *   form.setField('x', v)
 *   form.setValues({ ... })
 *   form.isDirty
 *   form.save()       — calls onSave(values), updates baseline on success
 *   form.discard()
 *   form.isSaving
 *
 * If `initialData` changes (e.g. a fresh fetch arrives), the form syncs
 * to it ONLY when not dirty — never blow away user edits.
 */
export function useDirtyForm(initialData, { onSave } = {}) {
  const [values, setValues] = useState(initialData || {})
  const [baseline, setBaseline] = useState(initialData || {})
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  // Memoize the serialized comparison so we don't re-stringify on every render
  const isDirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(baseline),
    [values, baseline]
  )

  // Sync to a new initial when it arrives (but only if user hasn't edited)
  useEffect(() => {
    if (!initialData) return
    setBaseline(prev => {
      const prevStr = JSON.stringify(prev)
      const nextStr = JSON.stringify(initialData)
      if (prevStr === nextStr) return prev
      // Only adopt the new server state if the user wasn't in the middle of editing
      const valuesStr = JSON.stringify(values)
      if (valuesStr === prevStr) {
        // not dirty → adopt new data into both
        setValues(initialData)
      }
      return initialData
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData])

  const setField = useCallback(
    (key, value) => setValues(v => ({ ...v, [key]: value })),
    []
  )

  const setManyFields = useCallback(
    (partial) => setValues(v => ({ ...v, ...partial })),
    []
  )

  const discard = useCallback(() => {
    setValues(baseline)
    setSaveError(null)
  }, [baseline])

  const save = useCallback(async () => {
    if (!onSave) return
    setIsSaving(true)
    setSaveError(null)
    try {
      const result = await onSave(values)
      // The server may return a transformed payload (e.g. timestamps).
      // Use it as the new baseline if so; otherwise our local copy.
      const next = result ?? values
      setBaseline(next)
      setValues(next)
      return next
    } catch (err) {
      setSaveError(err)
      throw err
    } finally {
      setIsSaving(false)
    }
  }, [onSave, values])

  return {
    values,
    setField,
    setValues: setManyFields,
    replaceValues: setValues,
    isDirty,
    isSaving,
    saveError,
    save,
    discard,
  }
}