import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './AbandonedCheckouts.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const SEED = [
  { id:'40355789209796', date:'25 Mar at 11:39', customer:'Oluwatobiloba Abiala',        email:'oluwatobiloba@example.com', region:'Nigeria', status:'not_recovered', total:62137.50  },
  { id:'40171655561412', date:'10 Mar at 13:09', customer:'Oluwatobiloba Abiala',        email:'oluwatobiloba@example.com', region:'Nigeria', status:'not_recovered', total:43312.50  },
  { id:'40023572381892', date:'28 Feb at 16:59', customer:'gilbert.maria@alfaro-mail.com',email:'gilbert.maria@alfaro-mail.com', region:'Nigeria', status:'not_recovered', total:35250.00  },
  { id:'39908710449348', date:'12 Feb at 15:45', customer:'Ozioma Idevbaru',             email:'ozioma@example.com', region:'Nigeria', status:'not_recovered', total:49500.00  },
]

const fmt = n => `₦${Number(n).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const RecoveryPill = ({ status }) => {
  if (status === 'recovered')
    return <span className={s.pillRecovered}>Recovered</span>
  return <span className={s.pillNotRecovered}>Not Recovered</span>
}

export default function AbandonedCheckouts() {
  const navigate  = useNavigate()
  const [checkouts, setCheckouts] = useState(SEED)
  const [filter,    setFilter]    = useState('All')
  const [selected,  setSelected]  = useState([])
  const [visible,   setVisible]   = useState(false)
  const [sortDir,   setSortDir]   = useState('desc')

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const filtered = filter === 'All' ? checkouts
    : checkouts.filter(c => c.status === filter.toLowerCase().replace(' ','_'))

  const totalAbandoned = checkouts.reduce((a, c) => a + c.total, 0)
  const notRecovered   = checkouts.filter(c => c.status === 'not_recovered').length

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(c => c.id))

  const markRecovered = () => {
    setCheckouts(prev => prev.map(c => selected.includes(c.id) ? { ...c, status:'recovered' } : c))
    setSelected([])
  }

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.breadBack} onClick={() => navigate('/orders')}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <div className={s.titleIconWrap}>
            <Ic d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" size={16} stroke="#1b3b5f" />
          </div>
          <h1 className={s.title}>Abandoned checkouts</h1>
        </div>
        <button className={s.btnOutline}>
          <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
          Export
        </button>
      </div>

      {/* ── Stats strip ─────────────────────────────────────── */}
      <div className={s.statsStrip}>
        <div className={s.statItem}>
          <span className={s.statVal}>{checkouts.length}</span>
          <span className={s.statLbl}>Total abandoned</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.statItem}>
          <span className={s.statVal} style={{ color:'#EF4444' }}>{notRecovered}</span>
          <span className={s.statLbl}>Not recovered</span>
        </div>
        <div className={s.statDivider} />
        <div className={s.statItem}>
          <span className={s.statVal} style={{ color:'#2DBD97', fontSize:16 }}>{fmt(totalAbandoned)}</span>
          <span className={s.statLbl}>Total value</span>
        </div>
        <div className={s.recoveryHint}>
          <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#6B7280" />
          <span>Send recovery emails from <a href="#" className={s.link}>Marketing → Campaigns</a></span>
        </div>
      </div>

      {/* ── Bulk bar ─────────────────────────────────────────── */}
      {selected.length > 0 && (
        <div className={s.bulkBar}>
          <span className={s.bulkCount}>{selected.length} selected</span>
          <button className={s.bulkAction} onClick={markRecovered}>
            <Ic d="M20 6L9 17l-5-5" size={13} />
            Mark as recovered
          </button>
          <button className={s.bulkClear} onClick={() => setSelected([])}>Deselect all</button>
        </div>
      )}

      {/* ── Filter tabs ──────────────────────────────────────── */}
      <div className={s.filterBar}>
        <div className={s.filterTabs}>
          {['All','Not Recovered','Recovered'].map(f => (
            <button key={f}
              className={`${s.ftab} ${filter===f?s.ftabOn:''}`}
              onClick={() => setFilter(f)}>
              {f}
              {f !== 'All' && (
                <span className={s.ftabCount}>
                  {checkouts.filter(c => c.status === f.toLowerCase().replace(' ','_')).length}
                </span>
              )}
            </button>
          ))}
          <button className={s.ftabAdd}>
            <Ic d="M12 5v14M5 12h14" size={12} />
          </button>
        </div>
        <div className={s.filterRight}>
          <button className={s.iconBtn}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={13} /></button>
          <button className={s.iconBtn}><Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={13} /></button>
          <button className={s.iconBtn}><Ic d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" size={13} /></button>
        </div>
      </div>

      {/* ── Table ────────────────────────────────────────────── */}
      <div className={s.tableWrap}>
        <div className={s.tHead}>
          <div className={s.tCheck}>
            <input type="checkbox" className={s.checkbox}
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll} />
          </div>
          <span>Checkout</span>
          <span className={s.sortHead} onClick={() => setSortDir(d => d==='asc'?'desc':'asc')}>
            Date <Ic d={sortDir==='asc'?'M18 15l-6-6-6 6':'M6 9l6 6 6-6'} size={11} />
          </span>
          <span>Customer</span>
          <span>Region</span>
          <span>Recovery Status</span>
          <span className={s.tRight}>Total</span>
        </div>

        {filtered.length === 0 ? (
          <div className={s.emptyState}>
            <Ic d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" size={44} stroke="#D1D5DB" />
            <p className={s.emptyTitle}>No abandoned checkouts</p>
            <p className={s.emptySub}>Customers who added items but didn't complete checkout will appear here</p>
          </div>
        ) : filtered.map((c, i) => (
          <div key={c.id} className={s.tRow}
            style={{ animationDelay:`${i*30}ms` }}
            onClick={() => navigate(`/orders/abandoned/${c.id}`)}>
            <div className={s.tCheck} onClick={e => e.stopPropagation()}>
              <input type="checkbox" className={s.checkbox}
                checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} />
            </div>
            <span className={s.checkoutId}>#{c.id}</span>
            <span className={s.dateCell}>{c.date}</span>
            <span className={s.customerCell}>
              <div className={s.customerAvatar}>{c.customer[0].toUpperCase()}</div>
              <div>
                <div className={s.customerName}>{c.customer}</div>
                {c.email !== c.customer && (
                  <div className={s.customerEmail}>{c.email}</div>
                )}
              </div>
            </span>
            <span>
              <div className={s.regionCell}>
                <span className={s.regionFlag}>🇳🇬</span>
                {c.region}
              </div>
            </span>
            <span><RecoveryPill status={c.status} /></span>
            <span className={`${s.tRight} ${s.totalCell}`}>{fmt(c.total)}</span>
          </div>
        ))}

        <div style={{ textAlign:'center', padding:'18px', borderTop:'1px solid var(--border)' }}>
          <a href="#" className={s.learnLink}>Learn more about abandoned checkouts</a>
        </div>
      </div>
    </div>
  )
}
