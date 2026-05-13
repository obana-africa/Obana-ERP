import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Markets.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

export default function NewRollout() {
  const navigate = useNavigate()

  const [name,        setName]        = useState('')
  const [allVisitors, setAllVisitors] = useState(true)
  const [launchDate,  setLaunchDate]  = useState('')
  const [endDate,     setEndDate]     = useState('')
  const [changes,     setChanges]     = useState([])
  const [isDirty,     setIsDirty]     = useState(true)
  const [saving,      setSaving]      = useState(false)
  const [showDate,    setShowDate]    = useState(false)
  const [showEnd,     setShowEnd]     = useState(false)

  const set = (fn) => { fn(); setIsDirty(true) }

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false); setIsDirty(false)
    navigate('/markets/rollouts')
  }

  const handleDiscard = () => {
    if (isDirty && !window.confirm('Discard changes?')) return
    navigate('/markets/rollouts')
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
          <button className={s.breadBack} onClick={() => navigate('/markets/rollouts')}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <span className={s.breadSep}>›</span>
          <h1 className={s.formTitle}>New rollout</h1>
          <span className={s.draftBadge}>Draft</span>
        </div>
      </div>

      <div style={{ padding: '24px 28px', maxWidth: 700, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Name */}
        <div className={s.card}>
          <div className={s.cardPad}>
            <div className={s.field} style={{ marginBottom: 0 }}>
              <label className={s.label}>Name</label>
              <div className={s.inputCount} style={{ position: 'relative' }}>
                <input className={s.input}
                  placeholder=""
                  value={name} onChange={e => { setName(e.target.value); setIsDirty(true) }}
                  maxLength={255} style={{ paddingRight: 65 }} />
                <span className={s.counter}>{name.length}/255</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule card */}
        <div className={s.rolloutCard}>
          {/* Audience + launch date row */}
          <div className={s.audienceRow}>
            <div className={s.audienceLeft}>
              <span>Will launch to</span>
              <div className={s.audienceToggle}>
                <label className={s.toggle}>
                  <input type="checkbox" checked={allVisitors} onChange={e => setAllVisitors(e.target.checked)} />
                  <span className={s.toggleSlider} />
                </label>
                <span style={{ fontWeight: 600, color: allVisitors ? '#111827' : '#6B7280' }}>
                  {allVisitors ? 'all visitors' : 'no visitors'}
                </span>
              </div>
            </div>

            <button className={s.launchDateBtn}
              onClick={() => setShowDate(v => !v)}>
              <Ic d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" size={13} />
              {launchDate || 'Select launch date and time'}
            </button>
            {showDate && (
              <input type="datetime-local" className={s.input} style={{ maxWidth: 220 }}
                value={launchDate} onChange={e => { setLaunchDate(e.target.value); setIsDirty(true) }} />
            )}
          </div>

          {/* Add changes */}
          <button className={s.addChangesBtn}
            onClick={() => setChanges(c => [...c, { id: Date.now(), label: 'Change ' + (c.length + 1) }])}>
            <div style={{ width: 22, height: 22, borderRadius: 50, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ic d="M12 5v14M5 12h14" size={12} stroke="#fff" />
            </div>
            Add changes
          </button>

          {changes.map(ch => (
            <div key={ch.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--blt)', fontSize: 13.5 }}>
              <span style={{ flex: 1, color: '#374151' }}>{ch.label}</span>
              <button onClick={() => setChanges(c => c.filter(x => x.id !== ch.id))}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                <Ic d="M18 6L6 18M6 6l12 12" size={14} />
              </button>
            </div>
          ))}

          {/* End date */}
          <button className={s.endDateBtn}
            onClick={() => setShowEnd(v => !v)}>
            <div style={{ width: 22, height: 22, borderRadius: 50, border: '1.5px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ic d="M12 5v14M5 12h14" size={12} stroke="#9CA3AF" />
            </div>
            End date
          </button>
          {showEnd && (
            <div style={{ padding: '0 20px 14px' }}>
              <input type="datetime-local" className={s.input}
                value={endDate} onChange={e => { setEndDate(e.target.value); setIsDirty(true) }} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E5E7EB', padding: '12px 28px', display: 'flex', justifyContent: 'flex-end', gap: 10, zIndex: 40 }}>
        <button className={s.btnGhost} onClick={handleDiscard}>Cancel</button>
        <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
