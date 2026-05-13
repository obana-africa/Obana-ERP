/**
 * Locations.jsx  — Settings › Locations panel
 *
 * Wire into Settings.jsx:
 *   import PanelLocations from './panels/Locations'
 *   locations: <PanelLocations />
 *
 * Sub-views are rendered inline (no hard navigation) so they
 * slot cleanly into the existing Settings layout without any
 * router changes.
 *
 * TODO stubs are marked with  // API:  — drop real fetch/post calls there.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Locations.module.css'

/* ── Icon ────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const PIN     = 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'
const STORE   = 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'
const EDIT    = ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']
const TRASH   = ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2']
const SEARCH  = 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0'
const SORT    = ['M3 6h18', 'M6 12h12', 'M9 18h6']
const FILTER  = 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z'
const CHEVD   = 'M6 9l6 6 6-6'
const CHEVR   = 'M9 18l6-6-6-6'
const PACKAGE = 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z'
const CLOSE   = 'M18 6L6 18M6 6l12 12'
const CHECK   = 'M20 6L9 17l-5-5'
const PLUS    = 'M12 5v14M5 12h14'
const INFO    = ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M12 8v4', 'M12 16h.01']

/* ── Seed data ───────────────────────────────────────────────────── */
const SEED_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'LEKKI OUTLET',
    address: '7 Oriwu Street',
    city: 'Lekki',
    state: 'Lagos',
    country: 'Nigeria',
    zip: '106104',
    phone: '+234 801 234 5678',
    posSubscription: 'POS Lite',
    isActive: true,
    isDefault: false,
    isStorefront: true,
    fulfillsOnline: true,
    createdAt: '2024-01-15',
  },
  {
    id: 'loc-2',
    name: 'OPEBI OUTLET',
    address: '7b Opebi Road',
    city: 'Opebi',
    state: 'Lagos',
    country: 'Nigeria',
    zip: '101233',
    phone: '+234 802 345 6789',
    posSubscription: 'POS Lite',
    isActive: true,
    isDefault: true,
    isStorefront: true,
    fulfillsOnline: true,
    createdAt: '2024-02-10',
  },
]

const MAX_LOCATIONS = 10

/* ── Helpers ─────────────────────────────────────────────────────── */
const fullAddress = loc => [loc.address, loc.city, loc.state, loc.country].filter(Boolean).join(', ')
const initials    = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

/* ── Shared primitives ───────────────────────────────────────────── */
function SaveBar({ dirty, saving, onSave, onDiscard }) {
  if (!dirty) return null
  return (
    <div className={styles.saveBar}>
      <span className={styles.saveBarMsg}>You have unsaved changes</span>
      <div className={styles.saveBarActions}>
        <button className={styles.discardBtn} onClick={onDiscard}>Discard</button>
        <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

function Toast({ msg, type = 'success', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return (
    <div className={`${styles.toast} ${type === 'error' ? styles.toastError : ''}`}>
      <Ic d={type === 'error' ? CLOSE : CHECK} size={13}
        stroke={type === 'error' ? '#EF4444' : '#2DBD97'} />
      {msg}
    </div>
  )
}

function Toggle({ value, onChange, disabled }) {
  return (
    <button type="button" role="switch" aria-checked={value}
      disabled={disabled}
      className={`${styles.toggle} ${value ? styles.toggleOn : ''} ${disabled ? styles.toggleDisabled : ''}`}
      onClick={() => !disabled && onChange?.(!value)}>
      <span className={styles.toggleThumb} />
    </button>
  )
}

function Input({ value, onChange, placeholder, type = 'text', disabled, prefix }) {
  return (
    <div className={`${styles.inputWrap} ${prefix ? styles.inputWrapPfx : ''}`}>
      {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
      <input className={styles.input} type={type} value={value}
        onChange={e => onChange?.(e.target.value)} placeholder={placeholder} disabled={disabled} />
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select className={styles.select} value={value} onChange={e => onChange?.(e.target.value)}>
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value}
          value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}

function Badge({ color = 'green', children }) {
  return <span className={`${styles.badge} ${styles[`badge_${color}`]}`}>{children}</span>
}

function ConfirmModal({ title, body, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmHead}>
          <h3 className={styles.confirmTitle}>{title}</h3>
          <button className={styles.mClose} onClick={onClose}><Ic d={CLOSE} size={15} /></button>
        </div>
        <p className={styles.confirmBody}>{body}</p>
        <div className={styles.confirmFoot}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={`${styles.confirmBtn} ${danger ? styles.confirmBtnDanger : ''}`}
            onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ADD / EDIT LOCATION VIEW
═══════════════════════════════════════════════════════════════════ */
function LocationForm({ location, onBack, onSave, showToast }) {
  const isEdit  = !!location
  const blank   = { name:'', address:'', city:'', state:'', country:'Nigeria', zip:'', phone:'', isStorefront:true, fulfillsOnline:true }
  const [form,  setForm]  = useState(isEdit ? { ...location } : blank)
  const [saved, setSaved] = useState(JSON.stringify(isEdit ? { ...location } : blank))
  const [saving,setSaving]= useState(false)
  const dirty = JSON.stringify(form) !== saved

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.name.trim() || !form.address.trim()) return
    setSaving(true)
    try {
      // API: isEdit
      //   ? await api.put(`/api/settings/locations/${location.id}`, form)
      //   : await api.post('/api/settings/locations', form)
      await new Promise(r => setTimeout(r, 700))
      setSaved(JSON.stringify(form))
      onSave({ ...form, id: location?.id || `loc-${Date.now()}` })
      showToast(isEdit ? 'Location updated' : 'Location added')
    } catch {
      showToast('Failed to save location', 'error')
    } finally {
      setSaving(false)
    }
  }

  const NIGERIAN_STATES = [
    'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
    'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
    'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
    'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
    'Sokoto','Taraba','Yobe','Zamfara',
  ]

  return (
    <div className={styles.panel}>
      <SaveBar dirty={dirty} saving={saving} onSave={handleSave}
        onDiscard={() => setForm(JSON.parse(saved))} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbBack} onClick={onBack}>
          <Ic d={PIN} size={13} stroke="#9CA3AF" /> Locations
        </button>
        <Ic d={CHEVR} size={12} stroke="#9CA3AF" />
        <span className={styles.breadcrumbCurrent}>{isEdit ? location.name : 'Add location'}</span>
      </div>

      {/* Location details */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Location details</h2>
        </div>
        <div className={styles.sectionBody}>

          {/* Name */}
          <div className={styles.formRow}>
            <div className={styles.formRowIcon}>
              <Ic d={STORE} size={15} stroke="#6B7280" />
            </div>
            <div className={styles.formRowContent}>
              <label className={styles.formLabel}>Name <span className={styles.req}>*</span></label>
              <Input value={form.name} onChange={v => set('name', v)}
                placeholder="e.g. Lekki Outlet" />
            </div>
          </div>

          {/* Address */}
          <div className={styles.formRow}>
            <div className={styles.formRowIcon}>
              <Ic d={PIN} size={15} stroke="#6B7280" />
            </div>
            <div className={styles.formRowContent}>
              <label className={styles.formLabel}>Address <span className={styles.req}>*</span></label>
              <Input value={form.address} onChange={v => set('address', v)}
                placeholder="Street address" />
              <div className={styles.addrGrid}>
                <Input value={form.city}  onChange={v => set('city', v)}  placeholder="City" />
                <Select value={form.state} onChange={v => set('state', v)}
                  options={NIGERIAN_STATES} />
                <Input value={form.zip}   onChange={v => set('zip', v)}   placeholder="Postal code" />
              </div>
              <Select value={form.country} onChange={v => set('country', v)}
                options={['Nigeria','Ghana','Kenya','South Africa','Other']} />
              <Input value={form.phone} onChange={v => set('phone', v)}
                placeholder="+234 800 000 0000" type="tel" />
            </div>
          </div>

          {/* Physical storefront toggle */}
          <div className={styles.formRowToggle}>
            <div className={styles.formRowIcon}>
              <Ic d={STORE} size={15} stroke="#6B7280" />
            </div>
            <div className={styles.formRowContent}>
              <div className={styles.formLabel}>Physical storefront</div>
              <div className={styles.formHint}>
                Show this physical store's location in the Shop app and on your online store
              </div>
            </div>
            <Toggle value={form.isStorefront} onChange={v => set('isStorefront', v)} />
          </div>
        </div>
      </div>

      {/* Fulfillment */}
      <div className={styles.section}>
        <div className={styles.sectionHeadRow}>
          <div>
            <h2 className={styles.sectionTitle}>Fulfillment</h2>
            <p className={styles.sectionSub}>Use inventory at this location to fulfill online orders</p>
          </div>
          <Toggle value={form.fulfillsOnline} onChange={v => set('fulfillsOnline', v)} />
        </div>
      </div>

      {/* Save footer */}
      <div className={styles.formFooter}>
        <button className={styles.cancelBtn} onClick={onBack}>Cancel</button>
        <button className={styles.saveBtn} onClick={handleSave}
          disabled={saving || !form.name.trim() || !form.address.trim()}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add location'}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN LOCATIONS PANEL
═══════════════════════════════════════════════════════════════════ */
export default function PanelLocations() {
  const navigate = useNavigate()

  /* State */
  const [locations,  setLocations]  = useState(SEED_LOCATIONS)
  const [view,       setView]       = useState('list')   // 'list' | 'add' | { type:'edit', location }
  const [filter,     setFilter]     = useState('all')    // 'all' | 'active' | 'inactive' | 'pos_pro' | 'pos_lite'
  const [search,     setSearch]     = useState('')
  const [sortBy,     setSortBy]     = useState('name')
  const [toast,      setToast]      = useState(null)
  const [confirm,    setConfirm]    = useState(null)
  const [changingDefault, setChangingDefault] = useState(false)

  const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), [])

  /* Derived */
  const activeCount = locations.filter(l => l.isActive).length
  const defaultLoc  = locations.find(l => l.isDefault)

  let displayed = locations.filter(l => {
    const q  = search.toLowerCase()
    const ms = !q || l.name.toLowerCase().includes(q) || fullAddress(l).toLowerCase().includes(q)
    const mf = filter === 'all'
      || (filter === 'active'   && l.isActive)
      || (filter === 'inactive' && !l.isActive)
      || (filter === 'pos_pro'  && l.posSubscription === 'POS Pro')
      || (filter === 'pos_lite' && l.posSubscription === 'POS Lite')
    return ms && mf
  })

  displayed = [...displayed].sort((a, b) => {
    if (sortBy === 'name')    return a.name.localeCompare(b.name)
    if (sortBy === 'status')  return (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0)
    if (sortBy === 'default') return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)
    return 0
  })

  /* Mutations */
  const saveLocation = (updated) => {
    setLocations(ls => {
      const idx = ls.findIndex(l => l.id === updated.id)
      if (idx >= 0) {
        const next = [...ls]; next[idx] = updated; return next
      }
      return [...ls, updated]
    })
    setView('list')
  }

  const deactivateLocation = (id) => {
    // API: await api.patch(`/api/settings/locations/${id}`, { isActive: false })
    setLocations(ls => ls.map(l => l.id === id ? { ...l, isActive: false } : l))
    showToast('Location deactivated')
  }

  const deleteLocation = (id) => {
    // API: await api.delete(`/api/settings/locations/${id}`)
    setLocations(ls => ls.filter(l => l.id !== id))
    showToast('Location deleted', 'error')
  }

  const setDefault = async (id) => {
    setChangingDefault(true)
    // API: await api.patch(`/api/settings/locations/${id}/set-default`)
    await new Promise(r => setTimeout(r, 500))
    setLocations(ls => ls.map(l => ({ ...l, isDefault: l.id === id })))
    setChangingDefault(false)
    showToast('Default location updated')
  }

  const toggleActive = (id) => {
    setLocations(ls => ls.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l))
    const loc = locations.find(l => l.id === id)
    showToast(loc.isActive ? 'Location deactivated' : 'Location activated')
    // API: await api.patch(`/api/settings/locations/${id}`, { isActive: !loc.isActive })
  }

  /* ── Sub-views ────────────────────────────────────────────────── */
  if (view === 'add') {
    return <LocationForm onBack={() => setView('list')} onSave={saveLocation} showToast={showToast} />
  }
  if (view?.type === 'edit') {
    return <LocationForm location={view.location} onBack={() => setView('list')} onSave={saveLocation} showToast={showToast} />
  }

  /* ── FILTER TABS ──────────────────────────────────────────────── */
  const FILTER_TABS = [
    { key: 'all',      label: 'All' },
    { key: 'active',   label: 'Active' },
    { key: 'inactive', label: 'Inactive' },
    { key: 'pos_pro',  label: 'POS Pro' },
    { key: 'pos_lite', label: 'POS Lite' },
  ]

  return (
    <div className={styles.panel}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}

      {/* ══ 1. ALL LOCATIONS ═══════════════════════════════════════ */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>All locations</h2>
            <p className={styles.sectionSub}>
              Using {activeCount} of {MAX_LOCATIONS} active locations available on your plan
            </p>
          </div>
          <button
            className={styles.primaryBtn}
            disabled={activeCount >= MAX_LOCATIONS}
            onClick={() => setView('add')}
            title={activeCount >= MAX_LOCATIONS ? `Max ${MAX_LOCATIONS} locations reached` : undefined}>
            <Ic d={PLUS} size={13} stroke="#fff" />
            Add location
          </button>
        </div>

        {/* Filter + search bar */}
        <div className={styles.tableBar}>
          <div className={styles.filterTabs}>
            {FILTER_TABS.map(t => (
              <button key={t.key}
                className={`${styles.filterTab} ${filter === t.key ? styles.filterTabOn : ''}`}
                onClick={() => setFilter(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.tableActions}>
            <div className={styles.searchBox}>
              <Ic d={SEARCH} size={13} stroke="#9CA3AF" />
              <input className={styles.searchInput} placeholder="Search locations…"
                value={search} onChange={e => setSearch(e.target.value)} />
              {search && (
                <button className={styles.searchClear} onClick={() => setSearch('')}>
                  <Ic d={CLOSE} size={11} />
                </button>
              )}
            </div>
            <button className={styles.iconBtn} title="Sort" onClick={() => {
              const order = ['name','status','default']
              setSortBy(o => order[(order.indexOf(o) + 1) % order.length])
            }}>
              <Ic d={SORT} size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Location</span>
            <span>POS Subscription</span>
            <span>Status</span>
            <span></span>
          </div>

          {displayed.length === 0 ? (
            <div className={styles.emptyTable}>
              <Ic d={PIN} size={32} stroke="#D1D5DB" sw={1.2} />
              <p>No locations found</p>
              {search && <button className={styles.outlineBtn} onClick={() => setSearch('')}>Clear search</button>}
            </div>
          ) : displayed.map(loc => (
            <div key={loc.id} className={styles.tableRow}>
              <span className={styles.locCell}>
                <div className={styles.locAvatar}>{initials(loc.name)}</div>
                <div className={styles.locCellInfo}>
                  <button className={styles.locName}
                    onClick={() => setView({ type: 'edit', location: loc })}>
                    {loc.name}
                    {loc.isDefault && <span className={`${styles.badge} ${styles.badge_navy}`}>Default</span>}
                  </button>
                  <span className={styles.locAddress}>{fullAddress(loc)}</span>
                </div>
              </span>
              <span className={styles.posCell}>{loc.posSubscription}</span>
              <span>
                <Badge color={loc.isActive ? 'green' : 'red'}>
                  {loc.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </span>
              <span className={styles.rowActions}>
                <button className={styles.rowActionBtn}
                  title="Edit location"
                  onClick={() => setView({ type: 'edit', location: loc })}>
                  <Ic d={EDIT} size={13} />
                </button>
                <button className={styles.rowActionBtn}
                  title={loc.isActive ? 'Deactivate' : 'Activate'}
                  onClick={() => toggleActive(loc.id)}>
                  <Ic d={loc.isActive ? 'M18.36 6.64A9 9 0 0 1 20.77 14M6.16 6.16A9 9 0 1 0 17.84 17.84' : 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'} size={13} />
                </button>
                {!loc.isDefault && (
                  <button className={`${styles.rowActionBtn} ${styles.rowActionBtnRed}`}
                    title="Delete location"
                    onClick={() => setConfirm({
                      title: 'Delete location?',
                      body:  `"${loc.name}" will be permanently deleted. This action cannot be undone.`,
                      confirmLabel: 'Delete',
                      danger: true,
                      onConfirm: () => deleteLocation(loc.id),
                    })}>
                    <Ic d={TRASH} size={13} />
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ 2. DEFAULT LOCATION ════════════════════════════════════ */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Default location</h2>
            <p className={styles.sectionSub}>
              This location is used by apps when no other location is specified
            </p>
          </div>
        </div>
        <div className={styles.sectionBody}>
          {defaultLoc ? (
            <div className={styles.defaultLocRow}>
              <div className={styles.defaultLocIcon}>
                <Ic d={PIN} size={16} stroke="#6B7280" />
              </div>
              <div className={styles.defaultLocInfo}>
                <div className={styles.defaultLocName}>{defaultLoc.name}</div>
                <div className={styles.defaultLocAddr}>
                  {[defaultLoc.address, defaultLoc.zip, defaultLoc.city, defaultLoc.state, defaultLoc.country].filter(Boolean).join(', ')}
                </div>
              </div>

              {/* Change default dropdown */}
              <ChangeDefaultDropdown
                locations={locations.filter(l => l.isActive && !l.isDefault)}
                onSelect={setDefault}
                loading={changingDefault}
              />
            </div>
          ) : (
            <div className={styles.noDefault}>No active locations available.</div>
          )}
        </div>
      </div>

      {/* ══ 3. POINT OF SALE SUBSCRIPTIONS ════════════════════════ */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>Point of Sale subscriptions</h2>
            <Ic d={INFO} size={14} stroke="#9CA3AF" />
          </div>
          <p className={styles.sectionSub}>
            For each location, use the POS features included in your plan or upgrade to POS Pro to fit your retail needs.
          </p>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.posRow}>
            <div className={styles.posIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="6" fill="#1b3b5f"/>
                <path d="M7 10h14M7 14h10M7 18h6" stroke="#2DBD97" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div className={styles.posInfo}>
              <div className={styles.posName}>Point of Sale</div>
              <div className={styles.posSub}>
                {locations.filter(l => l.posSubscription === 'POS Pro').length} POS Pro ·{' '}
                {locations.filter(l => l.posSubscription === 'POS Lite').length} POS Lite
              </div>
            </div>
            <button className={styles.outlineBtn}
              onClick={() => navigate('/apps/pos/subscriptions')}>
              Manage Subscriptions
            </button>
          </div>
        </div>
      </div>

      {/* ══ 4. PLAN LIMIT NOTICE ══════════════════════════════════ */}
      {activeCount >= MAX_LOCATIONS && (
        <div className={styles.limitBanner}>
          <Ic d={INFO} size={15} stroke="#B45309" />
          <span>
            You've reached the maximum of <strong>{MAX_LOCATIONS} locations</strong> on your current plan.{' '}
            <button className={styles.bannerLink} onClick={() => navigate('/settings/plan')}>
              Upgrade your plan
            </button>{' '}
            to add more.
          </span>
        </div>
      )}
    </div>
  )
}

/* ── Change default dropdown ─────────────────────────────────────── */
function ChangeDefaultDropdown({ locations, onSelect, loading }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div className={styles.changeWrap} ref={ref}>
      <button className={styles.changeBtn} onClick={() => setOpen(o => !o)} disabled={loading}>
        {loading ? 'Updating…' : 'Change'}
        <Ic d={CHEVD} size={12} stroke="currentColor"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open && (
        <div className={styles.changeDropdown}>
          {locations.length === 0 ? (
            <div className={styles.changeDdEmpty}>No other active locations</div>
          ) : locations.map(loc => (
            <button key={loc.id} className={styles.changeDdItem}
              onClick={() => { onSelect(loc.id); setOpen(false) }}>
              <Ic d={PIN} size={13} stroke="#6B7280" />
              <div>
                <div className={styles.changeDdName}>{loc.name}</div>
                <div className={styles.changeDdAddr}>{fullAddress(loc)}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
