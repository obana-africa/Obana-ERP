import { useEffect, useState } from 'react'
import styles from './Discounts.module.css'
import { fmt, fmtD } from '../../utils/formatters'
import { SEED_DISCOUNTS, DISC_TYPES, STATUS_CFG } from '../../data/discounts'
import DiscountModal      from './components/DiscountModal'
import DiscountCalculator from './components/DiscountCalculator'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const uid = () => `disc-${Date.now()}-${Math.random().toString(36).slice(2,6)}`

export default function Discounts() {
  const [discounts,    setDiscounts]    = useState(SEED_DISCOUNTS)
  const [modal,        setModal]        = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterType,   setFilterType]   = useState('All')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected,     setSelected]     = useState([])

   // Auto-open modal when navigated here from Quick Actions
  useEffect(() => {
    if (location.state?.openModal) {
      setModal(location.state.openModal)
      // Clear the state so refreshing doesn't re-open it
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const stats = {
    total:     discounts.length,
    active:    discounts.filter(d => d.status === 'active').length,
    totalUses: discounts.reduce((a, d) => a + (d.usedCount || 0), 0),
    scheduled: discounts.filter(d => d.status === 'scheduled').length,
  }

  const filtered = discounts.filter(d => {
    const q   = search.toLowerCase()
    const ms  = d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    const mt  = filterType   === 'All' || d.type   === filterType
    const mst = filterStatus === 'all' || d.status === filterStatus
    return ms && mt && mst
  })

  const save  = data => {
    if (editTarget) {
      setDiscounts(ds => ds.map(d => d.id === editTarget.id ? { ...d, ...data } : d))
    } else {
      setDiscounts(ds => [...ds, { ...data, id:uid(), usedCount:0, conditions:[] }])
    }
    setModal(null); setEditTarget(null)
  }
  const del   = id  => setDiscounts(ds => ds.filter(d => d.id !== id))
  const pause = id  => setDiscounts(ds => ds.map(d => d.id === id
    ? { ...d, status: d.status === 'paused' ? 'active' : 'paused' } : d))

  const toggleSel = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])
  const toggleAll = ()  => setSelected(s => s.length === filtered.length ? [] : filtered.map(d=>d.id))
  const usagePct  = d   => d.maxUses ? Math.min(100, Math.round((d.usedCount/d.maxUses)*100)) : null

  const STATS_CFG = [
    { label:'Total Discounts',   value:stats.total,     accent:'#1a1a2e', icon:'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0' },
    { label:'Active',            value:stats.active,    accent:'#2DBD97', icon:'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3' },
    { label:'Scheduled',         value:stats.scheduled, accent:'#3B82F6', icon:'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2' },
    { label:'Total Redemptions', value:stats.totalUses, accent:'#8B5CF6', icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Discounts</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline} onClick={() => setModal('calc')}>
            <Ic d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" size={14} />
            Calculator
          </button>
          <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('discount') }}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" /> Create Discount
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Stats */}
        <div className={styles.statsRow}>
          {STATS_CFG.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLbl}>{s.label}</span>
                <Ic d={s.icon} size={15} stroke={s.accent} />
              </div>
              <div className={styles.statVal} style={{ color:s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Type filter pills */}
        <div className={styles.typeFilterRow}>
          <button className={`${styles.typePill} ${filterType==='All'?styles.typePillOn:''}`}
            onClick={() => setFilterType('All')}>All Types</button>
          {Object.entries(DISC_TYPES).map(([key, cfg]) => (
            <button key={key}
              className={`${styles.typePill} ${filterType===key?styles.typePillOn:''}`}
              onClick={() => setFilterType(key)}
              style={filterType===key ? { background:cfg.color, color:'#fff', borderColor:cfg.color } : {}}>
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsL}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />
              </span>
              <input className={styles.searchInput} value={search}
                onChange={e => setSearch(e.target.value)} placeholder="Search by code or name…" />
            </div>
          </div>
          <div className={styles.controlsR}>
            <select className={styles.filterSel} value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {Object.entries(STATUS_CFG).map(([k,v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Bulk bar */}
        {selected.length > 0 && (
          <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>{selected.length} selected</span>
            <button className={styles.bulkBtn}
              onClick={() => { selected.forEach(del); setSelected([]) }}>
              <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} stroke="#FCA5A5" /> Delete
            </button>
            <button className={styles.bulkBtn}
              onClick={() => { selected.forEach(pause); setSelected([]) }}>
              Pause Selected
            </button>
          </div>
        )}

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tHead}>
            <span><input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0} onChange={toggleAll} /></span>
            <span>Discount</span><span>Type</span><span>Value</span>
            <span>Usage</span><span>Conditions</span><span>Dates</span>
            <span>Status</span><span />
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <rect x="10" y="20" width="52" height="38" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5"/>
                <path d="M22 39l14-14M28 33a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM44 47a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#2DBD97" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="54" cy="54" r="12" fill="#2DBD97"/>
                <path d="M49 54h10M54 49v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>No discounts found</h3>
              <p>Create your first discount to start driving sales</p>
              <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('discount') }}>
                <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Create Discount
              </button>
            </div>
          ) : filtered.map(d => {
            const typeInfo  = DISC_TYPES[d.type]
            const usage     = usagePct(d)
            const isExpired = d.endDate && new Date(d.endDate) < new Date()
            return (
              <div key={d.id} className={styles.tRow}>
                <span><input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggleSel(d.id)} /></span>
                <span className={styles.discCell}>
                  <div className={styles.discName}>{d.name}</div>
                  {d.code && <code className={styles.discCode}>{d.code}</code>}
                  {d.description && <div className={styles.discDesc}>{d.description}</div>}
                </span>
                <span>
                  <span className={styles.typeBadge} style={{ background:typeInfo.bg, color:typeInfo.color }}>
                    <Ic d={typeInfo.icon} size={11} stroke={typeInfo.color} />
                    {typeInfo.label}
                  </span>
                </span>
                <span className={styles.valueCell}>
                  {d.type==='percentage'||d.type==='flash' ? `${d.value}% off`
                    : d.type==='fixed'        ? `${fmt(d.value)} off`
                    : d.type==='bogo'         ? `B${d.buyQty}G${d.getQty}`
                    : d.type==='multibuy'     ? `×${d.multipleOf} → ${d.value}% off`
                    : d.type==='rrp'          ? `RRP ${fmt(d.rrpPrice)}`
                    : d.type==='tiered'       ? `${d.tiers.length} tiers`
                    : d.type==='freeShipping' ? 'Free shipping'
                    : d.type==='loyalty'      ? `${d.value}% off`
                    : d.type==='bundle'       ? 'Bundle' : '—'}
                </span>
                <span className={styles.usageCell}>
                  <div className={styles.usageNums}>
                    <span>{d.usedCount}</span>
                    {d.maxUses > 0 && <span className={styles.usageMax}>/ {d.maxUses}</span>}
                  </div>
                  {usage !== null && (
                    <div className={styles.usageBar}>
                      <div className={styles.usageBarFill} style={{ width:`${usage}%`, background:usage>=90?'#EF4444':usage>=70?'#F59E0B':'#2DBD97' }} />
                    </div>
                  )}
                </span>
                <span className={styles.condCell}>
                  <div className={styles.condItem}>{d.appliesTo}</div>
                  {d.minOrder > 0 && <div className={styles.condItem}>Min {fmt(d.minOrder)}</div>}
                  {d.customerSegment !== 'All customers' && <div className={styles.condItem}>{d.customerSegment}</div>}
                  {d.stackable && <span className={styles.stackBadge}>Stackable</span>}
                </span>
                <span className={styles.dateCell}>
                  <div>{fmtD(d.startDate)}</div>
                  {d.endDate ? <div className={styles.dateSep}>→ {fmtD(d.endDate)}</div>
                             : <div className={styles.dateSep}>No expiry</div>}
                </span>
                <span>
                  <span className={styles.statusPill} style={{ background:STATUS_CFG[d.status]?.bg, color:STATUS_CFG[d.status]?.color }}>
                    {STATUS_CFG[d.status]?.label}
                  </span>
                  {isExpired && d.status==='active' && (
                    <div style={{ fontSize:10.5, color:'#DC2626', marginTop:2 }}>Expired</div>
                  )}
                </span>
                <span className={styles.actCell}>
                  <button className={styles.iconBtn} title="Edit" onClick={() => { setEditTarget(d); setModal('discount') }}>
                    <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
                  </button>
                  <button className={styles.iconBtn} title={d.status==='paused'?'Resume':'Pause'} onClick={() => pause(d.id)}>
                    <Ic d={d.status==='paused'?'M5 3l14 9-14 9V3z':'M10 9v6m4-6v6M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'} size={13} />
                  </button>
                  <button className={styles.iconBtnRed} title="Delete" onClick={() => del(d.id)}>
                    <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} />
                  </button>
                </span>
              </div>
            )
          })}
        </div>

        <p className={styles.countLine}>Showing {filtered.length} of {discounts.length} discounts</p>
      </div>

      {modal === 'discount' && (
        <DiscountModal
          discount={editTarget}
          onClose={() => { setModal(null); setEditTarget(null) }}
          onSave={save}
        />
      )}
      {modal === 'calc' && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className={styles.modalCalc}>
            <div className={styles.mHead}>
              <div>
                <h2 className={styles.mTitle}>Discount Calculator</h2>
                <p className={styles.mSub}>Test how your discounts apply to a real order</p>
              </div>
              <button className={styles.mClose} onClick={() => setModal(null)}>
                <Ic d="M18 6L6 18M6 6l12 12" size={18} />
              </button>
            </div>
            <div className={styles.mBody}><DiscountCalculator /></div>
          </div>
        </div>
      )}
    </div>
  )
}
