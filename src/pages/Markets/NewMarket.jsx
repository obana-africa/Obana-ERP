import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './Markets.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const CONFIG_ROWS = [
  { key: 'currency',  label: 'Currency',             icon: '₦', value: 'Nigerian Naira (NGN ₦)' },
  { key: 'catalogs',  label: 'Catalogs',             icon: '📋', value: 'All products' },
  { key: 'domain',    label: 'Domain / language',    icon: '🌐', value: 'theoutlet.ng • English' },
  { key: 'store',     label: 'Online Store',         icon: '🛒', value: 'Trade' },
  { key: 'checkout',  label: 'Checkout and accounts',icon: '🏪', value: 'TheOutlet.NG configuration' },
]

export default function NewMarket() {
  const navigate = useNavigate()
  const { id }   = useParams()
  const isEdit   = Boolean(id)

  const [name,    setName]    = useState('')
  const [status,  setStatus]  = useState('active')
  const [isDirty, setIsDirty] = useState(false)
  const [saving,  setSaving]  = useState(false)

  useEffect(() => { if (name) setIsDirty(true) }, [name])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false); setIsDirty(false)
    navigate('/markets')
  }

  const handleDiscard = () => {
    if (isDirty && !window.confirm('Discard changes?')) return
    navigate('/markets')
  }

  return (
    <div className={s.formPage}>
      {isDirty && (
        <div className={s.unsavedBar}>
          <span className={s.unsavedDot} />
          <span>Unsaved changes</span>
          <div className={s.unsavedRight}>
            <button className={s.discardBtn} onClick={handleDiscard}>Discard</button>
            <button className={s.saveTopBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      <div className={s.formHeader}>
        <div className={s.formHeaderLeft}>
          <button className={s.breadBack} onClick={() => navigate('/markets')}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <span className={s.breadSep}>›</span>
          <h1 className={s.formTitle}>{isEdit ? 'Edit market' : 'New market'}</h1>
          {status === 'active'
            ? <span className={s.activeBadge}>Active</span>
            : <span className={s.draftBadge}>Draft</span>
          }
        </div>
        {!isDirty && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={s.btnGhost} onClick={handleDiscard}>Cancel</button>
            <button className={s.btnPrimary} onClick={handleSave} disabled={!name.trim()}>Save</button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, padding: '24px 28px', maxWidth: 1100 }}>

        {/* Main form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Name + status */}
          <div className={s.card}>
            <div className={s.cardPad} style={{ paddingBottom: 0 }}>
              <div className={s.nameStatusRow}>
                <input className={s.input} placeholder="Market name"
                  value={name} onChange={e => setName(e.target.value)} autoFocus />
                <select className={s.statusSel} value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Includes */}
            <div className={s.includesRow}>
              <span className={s.includesLabel}>Includes</span>
              <button className={s.addCondBtn}>
                <Ic d="M12 5v14M5 12h14" size={13} />
                Add condition
              </button>
            </div>
          </div>

          {/* Customized section */}
          <div className={s.card}>
            <div className={s.cardPad} style={{ paddingBottom: 8 }}>
              <div className={s.cardTitle}>Customized</div>
              <div className={s.cardSubtitle}>Create unique configurations for customers in this market</div>
            </div>

            <div className={s.inheritedSection}>
              <div className={s.inheritedTitle}>Inherited</div>
              {CONFIG_ROWS.map((row, i) => (
                <div key={row.key} className={s.configRow}
                  style={{ animationDelay: `${i * 40}ms` }}
                  onClick={() => {}}>
                  <div className={s.configRowLabel}>
                    <div className={s.configRowIcon}>
                      <span style={{ fontSize: 12 }}>{row.icon}</span>
                    </div>
                    {row.label}
                  </div>
                  <div className={s.configRowVal}>
                    <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#9CA3AF" />
                    {row.value}
                  </div>
                  <div className={s.configChev}>
                    <Ic d="M12 5v14M5 12h14" size={14} stroke="#9CA3AF" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — hierarchy preview */}
        <div>
          <div className={s.hierarchyPreview}>
            <div className={s.hierarchyHint}>
              <div className={s.hierarchyIllo}>
                <div className={s.hierNode}>
                  <Ic d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" size={20} stroke="#9CA3AF" />
                </div>
                <div className={s.hierLine} />
                <div className={s.hierNode}>
                  <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={20} stroke="#9CA3AF" />
                </div>
              </div>
              <span>Save to show market hierarchy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom save */}
      {!isDirty && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E5E7EB', padding: '12px 28px', display: 'flex', justifyContent: 'flex-end', gap: 10, zIndex: 40 }}>
          <button className={s.btnGhost} onClick={handleDiscard}>Cancel</button>
          <button className={s.btnPrimary} onClick={handleSave} disabled={!name.trim()}>Save</button>
        </div>
      )}
    </div>
  )
}
