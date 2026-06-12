import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLocations, useCreateLocation, useUpdateLocation } from '../../hooks/useLocations'
import { useDirtyForm } from '../../hooks/useDirtyForm'
import { Input, Select, Toggle } from '../../components/Form'
import SaveBar from '../../components/SaveBar'
import PanelSkeleton from '../../components/PanelSkeleton'
import PanelError from '../../components/PanelError'
import Icon from '../../components/Icon'
import { ICONS } from '../../constants/icons'
import { validateLocation } from './location.schema'
import { BLANK_LOCATION, NIGERIAN_STATES, COUNTRIES } from './utils'
import styles from './Locations.module.css'

/**
 * Add/edit location form. Routes:
 *   /settings/locations/new       → add mode (no id)
 *   /settings/locations/:id/edit  → edit mode
 *
 * On save: redirects back to /settings/locations.
 */
export default function LocationForm({ mode }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = mode === 'edit'

  const { data: locations = [], isLoading, isError, error, refetch } = useLocations()
  const createMutation = useCreateLocation()
  const updateMutation = useUpdateLocation()

  const existing = isEdit ? locations.find(l => l.id === id) : null
  const initial = useMemo(() => existing || BLANK_LOCATION, [existing])

  const onSave = useCallback(async (values) => {
    const result = validateLocation(values)
    if (!result.success) {
      const err = new Error('Please fix the highlighted fields')
      err.fieldErrors = result.errors
      throw err
    }
    if (isEdit) {
      await updateMutation.mutateAsync({ id, data: values })
    } else {
      await createMutation.mutateAsync(values)
    }
    navigate('/settings/locations')
  }, [isEdit, id, createMutation, updateMutation, navigate])

  const form = useDirtyForm(initial, { onSave })
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const fieldErrors = useMemo(() => {
    if (!submitAttempted) return {}
    const result = validateLocation(form.values)
    return result.success ? {} : result.errors
  }, [form.values, submitAttempted])

  const isPending = createMutation.isPending || updateMutation.isPending || form.isSaving

  // Loading / error gates
  if (isLoading) return <PanelSkeleton sections={2} />
  if (isError)   return <PanelError error={error} onRetry={refetch} />
  if (isEdit && !existing) {
    return <PanelError
      error={{ message: `Location "${id}" not found` }}
      onRetry={() => navigate('/settings/locations')}
      title="Location not found"
    />
  }

  const handleSubmit = async () => {
    setSubmitAttempted(true)
    try {
      await form.save()
    } catch {
      // toast is already fired by mutation hooks; field errors render below
    }
  }

  const f = form.values
  const set = form.setField

  return (
    <div>
      <SaveBar dirty={form.isDirty} saving={isPending} onSave={handleSubmit} onDiscard={form.discard} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button type="button" className={styles.breadcrumbBack} onClick={() => navigate('/settings/locations')}>
          <Icon d={ICONS.pin} size={13} stroke="#9CA3AF" /> Locations
        </button>
        <Icon d={ICONS.chevRight} size={12} stroke="#9CA3AF" />
        <span className={styles.breadcrumbCurrent}>
          {isEdit ? (existing?.name || 'Edit location') : 'Add location'}
        </span>
      </div>

      {/* Location details */}
      <div className={styles.formSection}>
        <div className={styles.formSectionHead}>
          <h2 className={styles.formSectionTitle}>Location details</h2>
        </div>
        <div className={styles.formSectionBody}>
          <FormRow icon={ICONS.home} label="Name" required error={fieldErrors.name}>
            <Input
              value={f.name}
              onChange={v => set('name', v)}
              placeholder="e.g. Lekki Outlet"
              error={!!fieldErrors.name}
            />
          </FormRow>

          <FormRow icon={ICONS.pin} label="Address" required error={fieldErrors.address}>
            <Input
              value={f.address}
              onChange={v => set('address', v)}
              placeholder="Street address"
              error={!!fieldErrors.address}
            />
            <div className={styles.addrGrid}>
              <Input
                value={f.city}
                onChange={v => set('city', v)}
                placeholder="City"
                error={!!fieldErrors.city}
              />
              <Select
                value={f.state}
                onChange={v => set('state', v)}
                options={NIGERIAN_STATES}
              />
              <Input
                value={f.zip}
                onChange={v => set('zip', v)}
                placeholder="Postal code"
              />
            </div>
            <Select value={f.country} onChange={v => set('country', v)} options={COUNTRIES} />
            <Input
              value={f.phone}
              onChange={v => set('phone', v)}
              placeholder="+234 800 000 0000"
              type="tel"
            />
            {(fieldErrors.city || fieldErrors.state || fieldErrors.country) && (
              <div className={styles.fieldErrorMsg}>
                {fieldErrors.city || fieldErrors.state || fieldErrors.country}
              </div>
            )}
          </FormRow>

          <div className={styles.formRowToggle}>
            <div className={styles.formRowIcon}>
              <Icon d={ICONS.home} size={15} stroke="#6B7280" />
            </div>
            <div className={styles.formRowContent}>
              <div className={styles.formLabel}>Physical storefront</div>
              <div className={styles.formHint}>
                Show this physical store's location in the Shop app and on your online store
              </div>
            </div>
            <Toggle value={f.isStorefront} onChange={v => set('isStorefront', v)} />
          </div>
        </div>
      </div>

      {/* Fulfillment */}
      <div className={styles.formSection}>
        <div className={styles.formSectionHeadRow}>
          <div>
            <h2 className={styles.formSectionTitle}>Fulfillment</h2>
            <p className={styles.formSectionSub}>Use inventory at this location to fulfill online orders</p>
          </div>
          <Toggle value={f.fulfillsOnline} onChange={v => set('fulfillsOnline', v)} />
        </div>
      </div>

      {/* Footer (also has Save) */}
      <div className={styles.formFooter}>
        <button type="button" className={styles.cancelBtn} onClick={() => navigate('/settings/locations')}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.saveBtn}
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Add location'}
        </button>
      </div>
    </div>
  )
}

/* ── Small internal sub-component for the icon+label form row ─── */
function FormRow({ icon, label, required, error, children }) {
  return (
    <div className={`${styles.formRow} ${error ? styles.formRowError : ''}`}>
      <div className={styles.formRowIcon}>
        <Icon d={icon} size={15} stroke="#6B7280" />
      </div>
      <div className={styles.formRowContent}>
        <label className={styles.formLabel}>
          {label} {required && <span className={styles.req}>*</span>}
        </label>
        {children}
        {error && <div className={styles.fieldErrorMsg}>{error}</div>}
      </div>
    </div>
  )
}