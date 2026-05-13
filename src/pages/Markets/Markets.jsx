import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Markets.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const FLAGS = { International: '🌐', Nigeria: '🇳🇬', Philippines: '🇵🇭', 'United States': '🇺🇸', 'United Kingdom': '🇬🇧' }

const SEED = [
  { id: 1, name: 'International', status: 'active',  includes: '28 regions',   icon: '🌐' },
  { id: 2, name: 'Nigeria',       status: 'active',  includes: 'Nigeria',      icon: '🇳🇬' },
  { id: 3, name: 'test',          status: 'draft',   includes: 'Philippines',  icon: '🇵🇭' },
]

export default function Markets() {
  const navigate = useNavigate()
  const [markets,  setMarkets]  = useState(SEED)
  const [search,   setSearch]   = useState('')
  const [visible,  setVisible]  = useState(false)
  const [selected, setSelected] = useState([])

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const filtered = markets.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()))

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(m => m.id))

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <div className={s.titleIcon}>
            <Ic d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" size={14} stroke="#1b3b5f" />
          </div>
          <h1 className={s.pageTitle}>Markets</h1>
        </div>
        <div className={s.pageHeaderRight}>
          <button className={s.btnOutline}>
            <Ic d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" size={13} />
            Graph view
          </button>
          <button className={s.btnPrimary} onClick={() => navigate('/markets/new')}>
            Create market
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className={s.searchBar}>
        <div className={s.searchInner}>
          <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
          <input className={s.searchInput} placeholder="Search in all markets"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className={s.searchBarRight}>
          <button className={s.iconBtn}><Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={13} /></button>
          <button className={s.iconBtn}><Ic d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" size={13} /></button>
        </div>
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        <div className={s.tHead} style={{ gridTemplateColumns: '36px 1fr 140px 1fr 80px' }}>
          <div className={s.tHeadCheck}>
            <input type="checkbox" className={s.checkbox}
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll} />
          </div>
          <span className={s.sortableHead} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            Market <Ic d="M18 15l-6-6-6 6" size={12} />
          </span>
          <span>Status</span>
          <span>Includes</span>
          <span>Customizations</span>
        </div>
        {filtered.map((m, i) => (
          <div key={m.id} className={s.tRow}
            style={{ gridTemplateColumns: '36px 1fr 140px 1fr 80px', animationDelay: `${i * 40}ms` }}
            onClick={() => navigate(`/markets/${m.id}`)}>
            <div onClick={e => e.stopPropagation()}>
              <input type="checkbox" className={s.checkbox}
                checked={selected.includes(m.id)}
                onChange={() => toggleSelect(m.id)} />
            </div>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--navy)' }}>
              <span style={{ fontSize: 16 }}>{m.icon}</span>
              {m.name}
            </span>
            <span>
              {m.status === 'active' ? <span className={s.pillActive}>Active</span> : <span className={s.pillDraft}>Draft</span>}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13.5 }}>
              {m.includes.includes('regions') ? (
                <>
                  <Ic d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" size={14} stroke="#6B7280" />
                  {m.includes}
                </>
              ) : (
                <>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  {m.includes}
                </>
              )}
            </span>
            <span>
              <button className={s.iconBtn} onClick={e => { e.stopPropagation(); navigate(`/markets/${m.id}`) }}
                style={{ width: 28, height: 28, borderRadius: 6 }}>
                <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={12} />
              </button>
            </span>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid var(--border)' }}>
          <a href="#" className={s.learnLink}>Learn more about markets</a>
        </div>
      </div>
    </div>
  )
}
