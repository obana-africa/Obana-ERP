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

const SEED_CATALOGS = [
  { id: 1, title: 'International', status: 'active', assignedTo: 'International', priceOverrides: 'None', adjustment: 'None', products: 2315 },
  { id: 2, title: 'Nigeria',       status: 'active', assignedTo: 'Nigeria',       priceOverrides: 'None', adjustment: 'None', products: 2315 },
  { id: 3, title: 'test',          status: 'active', assignedTo: 'test',          priceOverrides: 'None', adjustment: 'None', products: 2315 },
]

export default function Catalogs() {
  const navigate = useNavigate()
  const [catalogs, setCatalogs] = useState(SEED_CATALOGS)
  const [filter,   setFilter]   = useState('All')
  const [selected, setSelected] = useState([])
  const [visible,  setVisible]  = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const filtered = filter === 'All' ? catalogs
    : catalogs.filter(c => c.status === filter.toLowerCase())

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(c => c.id))

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <div className={s.titleIcon}>
            <Ic d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" size={14} stroke="#1b3b5f" />
          </div>
          <h1 className={s.pageTitle}>Catalogs</h1>
        </div>
        <div className={s.pageHeaderRight}>
          <button className={s.btnOutline}>
            <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
            Export
          </button>
          <button className={s.btnOutline}>
            <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={13} />
            Import
          </button>
          <button className={s.btnPrimary} onClick={() => navigate('/markets/catalogs/new')}>
            Create catalog
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className={s.filterTabs}>
        {['All', 'Active', 'Draft', 'Archived'].map(f => (
          <button key={f}
            className={`${s.ftab} ${filter === f ? s.ftabOn : ''}`}
            onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        <div className={s.tHead} style={{ gridTemplateColumns: '36px 1fr 120px 1fr 1fr 80px' }}>
          <div className={s.tHeadCheck}>
            <input type="checkbox" className={s.checkbox}
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={toggleAll} />
          </div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            Title <Ic d="M18 15l-6-6-6 6" size={12} />
          </span>
          <span>Status</span>
          <span>Assigned to</span>
          <span>Price overrides</span>
          <span>Products</span>
        </div>
        {filtered.map((c, i) => (
          <div key={c.id} className={s.tRow}
            style={{ gridTemplateColumns: '36px 1fr 120px 1fr 1fr 80px', animationDelay: `${i * 40}ms` }}
            onClick={() => navigate(`/markets/catalogs/${c.id}`)}>
            <div onClick={e => e.stopPropagation()}>
              <input type="checkbox" className={s.checkbox}
                checked={selected.includes(c.id)}
                onChange={() => toggleSelect(c.id)} />
            </div>
            <span style={{ fontWeight: 600, color:'var(--navy)' }}>{c.title}</span>
            <span><span className={s.pillActive}>Active</span></span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280' }}>
              <Ic d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" size={14} stroke="#6B7280" />
              {c.assignedTo}
            </span>
            <span style={{ color: '#6B7280' }}>{c.adjustment}</span>
            <span style={{ fontWeight: 600, color: '#374151' }}>{c.products.toLocaleString()}</span>
          </div>
        ))}

        <div style={{ textAlign: 'center', padding: '20px', borderTop: '1px solid var(--border)' }}>
          <a href="#" className={s.learnLink}>Learn more about catalogs</a>
        </div>
      </div>
    </div>
  )
}
