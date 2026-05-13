import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import s from './Companies.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
  'FCT Abuja',
]

const PAYMENT_TERMS = [
  'No payment terms', 'Net 7', 'Net 15', 'Net 30', 'Net 45', 'Net 60',
  'Due on receipt', '50% deposit',
]

/* ════════════════════════════════════════════════════════════════
   NEW COMPANY FORM
   ════════════════════════════════════════════════════════════════ */
function NewCompanyForm({ onDiscard, onSave }) {
  const [isDirty,   setIsDirty]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [form, setForm] = useState({
    companyName:    '',
    companyId:      '',
    mainContact:    '',
    // location
    address:        '',
    city:           '',
    state:          'Lagos',
    country:        'Nigeria',
    zip:            '',
    locationId:     '',
    billingIsSame:  true,
    // markets / catalogs
    market:         'Nigeria',
    catalog:        'Nigeria',
    // payment
    paymentTerms:   'No payment terms',
    // checkout
    shipToAddress:  false,
    orderSubmission:'auto',
    // tax
    taxId:          '',
    taxSettings:    'collect',
    // notes
    notes:          '',
  })

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setIsDirty(true) }

  const handleSave = async () => {
    if (!form.companyName.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    onSave(form)
    setSaving(false)
  }

  /* ── Section card ─────────────────────────────────────────── */
  const Card = ({ title, children }) => (
    <div className={s.formCard}>
      {title && <h3 className={s.cardTitle}>{title}</h3>}
      {children}
    </div>
  )
  const Field = ({ label, hint, children }) => (
    <div className={s.formField}>
      {label && <label className={s.formLabel}>{label}</label>}
      {children}
      {hint && <p className={s.formHint}>{hint}</p>}
    </div>
  )

  return (
    <div className={s.formPage}>
      {/* Unsaved bar */}
      {isDirty && (
        <div className={s.unsavedBar}>
          <span className={s.unsavedDot} />
          <span className={s.unsavedMsg}>Unsaved changes</span>
          <div className={s.unsavedActions}>
            <button className={s.unsavedDiscard} onClick={onDiscard}>Discard</button>
            <button className={s.unsavedSave} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Page header */}
      <div className={s.formHeader}>
        <div className={s.formBreadcrumb}>
          <button className={s.breadLink} onClick={onDiscard}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <span className={s.breadSep}>/</span>
          <span className={s.breadCurrent}>New company</span>
        </div>
      </div>

      <div className={s.formBody}>
        <div className={s.formMain}>

          {/* ── Company name + ID ─────────────────────────────── */}
          <Card>
            <Field label="Company name" hint="This will appear in customer accounts and at checkout.">
              <input className={s.input} placeholder="e.g. Acme Corp"
                value={form.companyName} onChange={e => set('companyName', e.target.value)} autoFocus />
            </Field>
            <Field label="Company ID" hint="Add an existing external ID or create a unique ID.">
              <input className={s.input} placeholder="e.g. COMP-001"
                value={form.companyId} onChange={e => set('companyId', e.target.value)} />
            </Field>
          </Card>

          {/* ── Main contact ──────────────────────────────────── */}
          <Card title="Main contact">
            <div className={s.searchBox}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
              <input className={s.searchInput} placeholder="Search customers"
                value={form.mainContact} onChange={e => set('mainContact', e.target.value)} />
            </div>
          </Card>

          {/* ── Location ──────────────────────────────────────── */}
          <div className={s.locationSection}>
            <h3 className={s.locationTitle}>Location</h3>
            <p className={s.locationDesc}>
              Add a location to this company. This is where you'll ship products to.
              Each location can have custom catalogs, checkout settings, and more.
              You can add more locations later.
            </p>

            <div className={s.formCard}>
              <div className={s.shippingHead}>
                <span className={s.cardTitle}>Shipping address</span>
                <button className={s.clearBtn} onClick={() => {
                  ['address','city','state','country','zip'].forEach(k => set(k, k === 'state' ? 'Lagos' : k === 'country' ? 'Nigeria' : ''))
                }}>Clear</button>
              </div>

              <Field>
                <button className={s.addAddressBtn} onClick={() => {}}>
                  <div className={s.addAddressIcon}>
                    <Ic d="M12 5v14M5 12h14" size={14} stroke="#2DBD97" />
                  </div>
                  <span>Add address</span>
                  <Ic d="M9 18l6-6-6-6" size={14} stroke="#9CA3AF" style={{ marginLeft: 'auto' }} />
                </button>
              </Field>

              {/* Expanded address fields */}
              <div className={s.addressFields}>
                <Field label="Street address">
                  <input className={s.input} placeholder="12 Allen Avenue"
                    value={form.address} onChange={e => set('address', e.target.value)} />
                </Field>
                <div className={s.fieldRow2}>
                  <Field label="City">
                    <input className={s.input} placeholder="Ikeja"
                      value={form.city} onChange={e => set('city', e.target.value)} />
                  </Field>
                  <Field label="State">
                    <select className={s.select} value={form.state}
                      onChange={e => set('state', e.target.value)}>
                      {NIGERIAN_STATES.map(st => <option key={st}>{st}</option>)}
                    </select>
                  </Field>
                </div>
                <div className={s.fieldRow2}>
                  <Field label="Country">
                    <input className={s.input} value={form.country} readOnly style={{ background: '#F9FAFB' }} />
                  </Field>
                  <Field label="Postal code">
                    <input className={s.input} placeholder="100001"
                      value={form.zip} onChange={e => set('zip', e.target.value)} />
                  </Field>
                </div>
              </div>

              <label className={s.checkRow}>
                <input type="checkbox" className={s.checkbox}
                  checked={form.billingIsSame} onChange={e => set('billingIsSame', e.target.checked)} />
                Billing address same as shipping address
              </label>

              <Field label="Location ID" hint="Add an existing external ID or create a unique ID.">
                <input className={s.input} placeholder="e.g. LOC-001"
                  value={form.locationId} onChange={e => set('locationId', e.target.value)} />
              </Field>
            </div>
          </div>

          {/* ── Markets ───────────────────────────────────────── */}
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Markets</h3>
            <div className={s.tagRow}>
              <span className={s.tag}>{form.market}</span>
              <button className={s.tagAdd} onClick={() => {}}>
                <Ic d="M12 5v14M5 12h14" size={12} />
              </button>
            </div>
          </div>

          {/* ── Catalogs ──────────────────────────────────────── */}
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Catalogs</h3>
            <div className={s.tagRow}>
              <span className={s.tag}>{form.catalog}</span>
              <button className={s.tagAdd} onClick={() => {}}>
                <Ic d="M12 5v14M5 12h14" size={12} />
              </button>
            </div>
          </div>

          {/* ── Payment terms ─────────────────────────────────── */}
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Payment terms</h3>
            <select className={s.select} style={{ width: '100%' }}
              value={form.paymentTerms} onChange={e => set('paymentTerms', e.target.value)}>
              {PAYMENT_TERMS.map(pt => <option key={pt}>{pt}</option>)}
            </select>
          </div>

          {/* ── Checkout ──────────────────────────────────────── */}
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Checkout</h3>

            <div className={s.checkoutSection}>
              <p className={s.checkoutSectionTitle}>Ship to address</p>
              <label className={s.checkRow}>
                <input type="checkbox" className={s.checkbox}
                  checked={form.shipToAddress} onChange={e => set('shipToAddress', e.target.checked)} />
                Allow customers to ship to any one-time address
              </label>
            </div>

            <div className={s.checkoutSection}>
              <p className={s.checkoutSectionTitle}>Order submission</p>
              <label className={s.radioRow}>
                <input type="radio" name="orderSub" value="auto" className={s.checkbox}
                  checked={form.orderSubmission === 'auto'}
                  onChange={() => set('orderSubmission', 'auto')} />
                <div>
                  <div className={s.radioLabel}>Automatically submit orders</div>
                  <div className={s.radioDesc}>Orders without shipping addresses will be submitted as draft orders</div>
                </div>
              </label>
              <label className={s.radioRow} style={{ marginTop: 10 }}>
                <input type="radio" name="orderSub" value="draft" className={s.checkbox}
                  checked={form.orderSubmission === 'draft'}
                  onChange={() => set('orderSubmission', 'draft')} />
                <div>
                  <div className={s.radioLabel}>Submit all orders as drafts for review</div>
                </div>
              </label>
            </div>
          </div>

          {/* ── Tax details ───────────────────────────────────── */}
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Tax details</h3>
            <Field label="Tax ID">
              <input className={s.input} placeholder="Enter tax ID"
                value={form.taxId} onChange={e => set('taxId', e.target.value)} />
            </Field>
            <Field label="Tax settings">
              <select className={s.select} style={{ width: '100%' }}
                value={form.taxSettings} onChange={e => set('taxSettings', e.target.value)}>
                <option value="collect">Collect tax</option>
                <option value="exempt">Tax exempt</option>
              </select>
            </Field>
          </div>

          {/* ── Notes ─────────────────────────────────────────── */}
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Notes</h3>
            <textarea className={s.textarea} placeholder="Add notes about this company…"
              rows={4} value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>

        {/* ── Right sidebar ─────────────────────────────────── */}
        <aside className={s.formSide}>
          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Summary</h3>
            {form.companyName
              ? <p className={s.summaryName}>{form.companyName}</p>
              : <p className={s.summaryEmpty}>No name added yet</p>}
            {(form.city || form.state) && (
              <p className={s.summaryMeta}>{[form.city, form.state, form.country].filter(Boolean).join(', ')}</p>
            )}
          </div>

          <div className={s.formCard}>
            <h3 className={s.cardTitle}>Quick actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className={s.sideAction}>
                <Ic d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87" size={13} />
                Add contacts
              </button>
              <button className={s.sideAction}>
                <Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" size={13} />
                Add location
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom save bar */}
      <div className={s.bottomBar}>
        <button className={s.btnGhost} onClick={onDiscard}>Discard</button>
        <button className={s.btnPrimary} onClick={handleSave}
          disabled={saving || !form.companyName.trim()}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   COMPANIES LIST
   ════════════════════════════════════════════════════════════════ */
function CompaniesList({ onAdd, companies }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.title}>Companies</h1>
          {companies.length > 0 && <span className={s.count}>{companies.length} companies</span>}
        </div>
        {companies.length > 0 && (
          <button className={s.btnPrimary} onClick={onAdd}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
            Add company
          </button>
        )}
      </div>

      {/* B2B info banner */}
      <div className={s.b2bBanner}>
        <div className={s.b2bBannerLeft}>
          <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={15} stroke="#1b3b5f" />
          <div>
            <strong>App behavior with B2B orders</strong>
            <p>
              Some apps may not attribute B2B orders correctly on your current plan.
              Check that B2B orders are assigned to a company, not just an individual customer.
              If you notice orders are not assigned to a company, contact the app developer.
            </p>
          </div>
        </div>
        <button className={s.bannerClose}>
          <Ic d="M18 6L6 18M6 6l12 12" size={16} />
        </button>
      </div>

      {companies.length === 0 ? (
        /* Empty state */
        <div className={s.emptyWrap}>
          <div className={s.emptyIllo}>
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
              <rect x="20" y="20" width="80" height="65" rx="6" fill="#E8EEF5" stroke="#1b3b5f" strokeWidth="1.5" />
              <rect x="30" y="30" width="35" height="40" rx="3" fill="#C3D0E0" />
              <rect x="72" y="50" width="20" height="20" rx="2" fill="#2DBD97" opacity="0.6" />
              <rect x="30" y="18" width="60" height="6" rx="2" fill="#1b3b5f" opacity="0.2" />
              <circle cx="38" cy="22" r="2" fill="#2DBD97" />
              <path d="M80 62l8 8M88 62l-8 8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h3 className={s.emptyTitle}>Bring the power of customisation to your B2B business</h3>
          <p className={s.emptySub}>
            Everything you need for B2B in one place. Get started by adding a company
            and assigning custom pricing, net payment terms, and permissions for multiple locations and buyers.
          </p>
          <button className={s.btnPrimary} onClick={onAdd}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
            Add company
          </button>
          <a href="#" className={s.learnLink}>Learn more about companies</a>
        </div>
      ) : (
        /* Company table */
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Company</th>
                <th>Location</th>
                <th>Contacts</th>
                <th>Total spent</th>
                <th>Orders</th>
                <th style={{ width: 50 }} />
              </tr>
            </thead>
            <tbody>
              {companies.map((c, i) => (
                <tr key={c.id} className={s.tr}
                  style={{ animationDelay: `${i * 30}ms` }}>
                  <td>
                    <div className={s.companyCell}>
                      <div className={s.companyAvatar}>{c.companyName[0].toUpperCase()}</div>
                      <div>
                        <div className={s.companyName}>{c.companyName}</div>
                        {c.companyId && <div className={s.companyId}>ID: {c.companyId}</div>}
                      </div>
                    </div>
                  </td>
                  <td className={s.muted}>{[c.city, c.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className={s.muted}>{c.mainContact || '—'}</td>
                  <td className={s.muted}>₦0.00</td>
                  <td className={s.muted}>0</td>
                  <td>
                    <button className={s.moreBtn}>
                      <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   ROOT — toggles between list and form
   ════════════════════════════════════════════════════════════════ */
export default function Companies() {
  const [view,      setView]      = useState('list') // 'list' | 'new'
  const [companies, setCompanies] = useState([])

  const handleSave = (data) => {
    setCompanies(prev => [...prev, { ...data, id: Date.now() }])
    setView('list')
  }

  if (view === 'new') {
    return <NewCompanyForm onDiscard={() => setView('list')} onSave={handleSave} />
  }
  return <CompaniesList onAdd={() => setView('new')} companies={companies} />
}
