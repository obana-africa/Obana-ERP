
import { useState } from 'react'
import styles from '../POS.module.css'
import { fmt, uid } from '../../../utils/formatters'
import { CRM_CUSTOMERS } from '../../../data/pos'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const TIER_CFG = {
  VIP:     { bg:'#FFFBEB', color:'#B45309' },
  Regular: { bg:'#EFF6FF', color:'#1D4ED8' },
  New:     { bg:'#ECFDF5', color:'#047857' },
}

const initials = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()

/**
 * Props:
 *  onSelect — (customer) => void
 *  onClose  — () => void
 */
const CustomerPanel = ({ onSelect, onClose }) => {
  const [q,    setQ]    = useState('')
  const [mode, setMode] = useState('search') // 'search' | 'create'
  const [form, setForm] = useState({ name:'', phone:'', email:'' })

  const results = CRM_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.phone.includes(q) ||
    c.email.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <div className={styles.cpOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.cpPanel}>
        <div className={styles.cpHead}>
          <h3 className={styles.cpTitle}>Customer</h3>
          <div className={styles.cpTabs}>
            <button className={`${styles.cpTab} ${mode==='search'?styles.cpTabOn:''}`} onClick={() => setMode('search')}>Search</button>
            <button className={`${styles.cpTab} ${mode==='create'?styles.cpTabOn:''}`} onClick={() => setMode('create')}>New Customer</button>
          </div>
          <button className={styles.cpClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        {mode === 'search' ? (
          <div className={styles.cpBody}>
            <div className={styles.cpSearch}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Name, phone or email…" />
            </div>
            <div className={styles.cpResults}>
              {(q ? results : CRM_CUSTOMERS).map(c => (
                <button key={c.id} className={styles.cpCustomer}
                  onClick={() => { onSelect(c); onClose() }}>
                  <div className={styles.cpAvatar}>{initials(c.name)}</div>
                  <div className={styles.cpCustInfo}>
                    <div className={styles.cpCustName}>{c.name}</div>
                    <div className={styles.cpCustMeta}>{c.phone} · {c.orders} orders · {fmt(c.totalSpend)}</div>
                  </div>
                  <span className={styles.cpTierBadge} style={TIER_CFG[c.tier]}>{c.tier}</span>
                </button>
              ))}
              {q && results.length === 0 && (
                <div className={styles.cpNoResult}>
                  No customer found.{' '}
                  <button onClick={() => setMode('create')}>Create new →</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.cpBody}>
            {['name','phone','email'].map(f => (
              <div key={f} className={styles.cpFg}>
                <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                  placeholder={f==='phone'?'08012345678':f==='email'?'customer@email.com':'Full name'} />
              </div>
            ))}
            <button className={styles.cpCreateBtn}
              disabled={!form.name || !form.phone}
              onClick={() => {
                const newC = { id: uid(), ...form, tier:'New', totalSpend:0, orders:0, points:0 }
                onSelect(newC); onClose()
              }}>
              Create & Select Customer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerPanel
