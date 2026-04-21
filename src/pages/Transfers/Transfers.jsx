import { useState } from 'react'
import styles from './Transfers.module.css'
import { fmt, fmtD } from '../../utils/formatters'
import { SEED_TRANSFERS, STATUS_CFG, TYPE_CFG } from '../../data/transfers'
import TransferDetailModal from './components/TransferDetailModal'
import CreateTransferModal from './components/CreateTransferModal'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const Pill = ({ label, bg, color }) => (
  <span className={styles.pill} style={{ background: bg, color }}>{label}</span>
)

export default function Transfers() {
  const [transfers,    setTransfers]    = useState(SEED_TRANSFERS)
  const [selected,     setSelected]     = useState(null)
  const [showCreate,   setShowCreate]   = useState(false)
  const [search,       setSearch]       = useState('')
  const [filterType,   setFilterType]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = transfers.filter(tr => {
    const q   = search.toLowerCase()
    const ms  = tr.id.toLowerCase().includes(q) || tr.origin.toLowerCase().includes(q) || tr.dest.toLowerCase().includes(q)
    const mt  = filterType   === 'all' || tr.type   === filterType
    const mst = filterStatus === 'all' || tr.status === filterStatus
    return ms && mt && mst
  })

  const receive = (id, recvQtys) => {
    setTransfers(ts => ts.map(tr => {
      if (tr.id !== id) return tr
      const items = tr.items.map(i => ({ ...i, recv: recvQtys[i.sku] ?? i.recv }))
      const all   = items.every(i => i.recv >= i.exp)
      const any   = items.some(i => i.recv > 0)
      return { ...tr, items, status: all ? 'received' : any ? 'partial' : tr.status }
    }))
  }

  const pendingCount = transfers.filter(t => t.status === 'pending').length
  const totalValue   = transfers.reduce((a, tr) => a + tr.items.reduce((b, i) => b + i.exp * i.cost, 0), 0)

  const STATS = [
    { label:'Total Transfers', value:transfers.length,                                    accent:'#1a1a2e' },
    { label:'In Transit',      value:transfers.filter(t=>t.status==='in_transit').length, accent:'#3B82F6' },
    { label:'Awaiting Action', value:pendingCount,                                         accent:'#F59E0B' },
    { label:'Completed',       value:transfers.filter(t=>t.status==='received').length,   accent:'#2DBD97' },
    { label:'Total Value',     value:fmt(totalValue),                                      accent:'#8B5CF6' },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Transfers</h1>
        <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
          <Ic d="M12 5v14M5 12h14" size={14} /> Create Transfer
        </button>
      </header>

      <div className={styles.content}>
        {/* Stats */}
        <div className={styles.statsRow}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue} style={{ color:s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Alert banner */}
        {pendingCount > 0 && (
          <div className={styles.alertBanner}>
            <Ic d={['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01']} size={15} stroke="#B45309" />
            <span>
              <strong>{pendingCount} transfer{pendingCount>1?'s':''}</strong> awaiting action — review and update status.
            </span>
            <button className={styles.alertBtn} onClick={() => setFilterStatus('pending')}>View pending →</button>
          </div>
        )}

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span className={styles.searchIco}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />
            </span>
            <input className={styles.searchInput} value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, origin, destination…" />
          </div>
          <div className={styles.controlsR}>
            <select className={styles.filterSel} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {Object.entries(TYPE_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {Object.entries(STATUS_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {(filterType !== 'all' || filterStatus !== 'all') && (
              <button className={styles.clearBtn} onClick={() => { setFilterType('all'); setFilterStatus('all') }}>Clear ×</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tHead}>
            <span>Transfer ID</span><span>Type</span><span>Origin</span>
            <span>Destination</span><span>Units</span><span>Value</span>
            <span>Created</span><span>Status</span><span />
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <rect x="10" y="20" width="52" height="38" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5"/>
                <path d="M22 39h28M36 27v24" stroke="#2DBD97" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="54" cy="54" r="12" fill="#2DBD97"/>
                <path d="M49 54h10M54 49v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>No transfers found</h3>
              <p>Create your first transfer to move stock between locations</p>
              <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
                <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Create Transfer
              </button>
            </div>
          ) : filtered.map(tr => {
            const totalVal   = tr.items.reduce((a,i) => a + i.exp * i.cost, 0)
            const totalUnits = tr.items.reduce((a,i) => a + i.exp, 0)
            return (
              <div key={tr.id} className={styles.tRow} onClick={() => setSelected(tr)}>
                <span className={styles.transferId}>{tr.id}</span>
                <span><Pill {...TYPE_CFG[tr.type]} /></span>
                <span className={styles.locationCell}>{tr.origin}</span>
                <span className={styles.locationCell}>{tr.dest}</span>
                <span className={styles.unitsCell}>{totalUnits}</span>
                <span className={styles.valueCell}>{fmt(totalVal)}</span>
                <span className={styles.dateCell}>{fmtD(tr.date)}</span>
                <span><Pill {...STATUS_CFG[tr.status]} /></span>
                <span className={styles.actCell} onClick={e => e.stopPropagation()}>
                  <button className={styles.viewBtn} onClick={() => setSelected(tr)}>
                    <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={13} />
                  </button>
                </span>
              </div>
            )
          })}
        </div>

        <p className={styles.countLine}>Showing {filtered.length} of {transfers.length} transfers</p>
      </div>

      {selected && (
        <TransferDetailModal
          transfer={selected}
          onClose={() => setSelected(null)}
          onReceive={receive}
        />
      )}
      {showCreate && (
        <CreateTransferModal
          onClose={() => setShowCreate(false)}
          onSave={data => setTransfers(ts => [data, ...ts])}
        />
      )}
    </div>
  )
}
