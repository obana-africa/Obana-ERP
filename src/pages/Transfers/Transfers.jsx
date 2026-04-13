import { useState } from 'react'
import styles from './Transfers.module.css'

// ─── Icon helper ───────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = '#9CA3AF', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ─── Pill badge ────────────────────────────────────────────
const Pill = ({ label, bg, color }) => (
  <span className={styles.pill} style={{ background: bg, color }}>{label}</span>
)

// ─── Status configs ────────────────────────────────────────
const STATUS = {
  draft:      { label: 'Draft',       bg: '#F3F4F6', color: '#6B7280' },
  pending:    { label: 'Pending',     bg: '#FFFBEB', color: '#B45309' },
  in_transit: { label: 'In Transit',  bg: '#EFF6FF', color: '#1D4ED8' },
  received:   { label: 'Received',    bg: '#ECFDF5', color: '#047857' },
  partial:    { label: 'Partial',     bg: '#FFF7ED', color: '#C2410C' },
  cancelled:  { label: 'Cancelled',   bg: '#FEF2F2', color: '#B91C1C' },
}

// ─── Transfer type configs ─────────────────────────────────
const TYPE = {
  incoming: {
    label: 'Incoming', bg: '#ECFDF5', color: '#047857',
    icon: 'M8 17l4 4 4-4M12 12v9M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29',
  },
  outgoing: {
    label: 'Outgoing', bg: '#FEF2F2', color: '#B91C1C',
    icon: 'M16 7h5v5M21 7l-9 9-4-4-6 6',
  },
  return: {
    label: 'Return', bg: '#F5F3FF', color: '#6D28D9',
    icon: 'M1 4v6h6M3.51 15a9 9 0 1 0 .49-3.96',
  },
}

// ─── Static data ───────────────────────────────────────────
const SUPPLIERS = [
  'Lagos Textile Hub',
  'Kano Craft Suppliers',
  'Abuja Beauty Wholesale',
  'PH Fabrics Ltd',
]

const LOCATIONS = [
  'Main Store — Lagos',
  'POS Outlet — Abuja',
  'Warehouse — Lagos',
  'POS Kiosk — Kano',
]

const PRODUCTS = [
  { sku: 'AKR-001', name: 'Classic Ankara Dress',   cost: 9000  },
  { sku: 'LCB-002', name: 'Leather Crossbody Bag',  cost: 12000 },
  { sku: 'SHB-003', name: 'Premium Shea Butter',    cost: 2000  },
  { sku: 'KFT-004', name: "Men's Kaftan Set",        cost: 16000 },
  { sku: 'GFT-005', name: 'Ankara Gift Set Bundle', cost: 20000 },
]

const SEED_TRANSFERS = [
  {
    id: 'TRF-2026-001', type: 'incoming', status: 'received',
    origin: 'Lagos Textile Hub', dest: 'Main Store — Lagos',
    date: '2026-03-15', eta: '2026-03-15', ref: 'PO-001',
    items: [
      { sku: 'AKR-001', name: 'Classic Ankara Dress', exp: 20, recv: 20, cost: 9000  },
      { sku: 'KFT-004', name: "Men's Kaftan Set",      exp: 10, recv: 10, cost: 16000 },
    ],
    notes: 'Monthly restock from main supplier.',
  },
  {
    id: 'TRF-2026-002', type: 'incoming', status: 'in_transit',
    origin: 'Abuja Beauty Wholesale', dest: 'Main Store — Lagos',
    date: '2026-04-05', eta: '2026-04-12', ref: 'PO-002',
    items: [
      { sku: 'SHB-003', name: 'Premium Shea Butter', exp: 50, recv: 0, cost: 2000 },
    ],
    notes: '',
  },
  {
    id: 'TRF-2026-003', type: 'outgoing', status: 'pending',
    origin: 'Main Store — Lagos', dest: 'POS Outlet — Abuja',
    date: '2026-04-06', eta: '2026-04-08', ref: null,
    items: [
      { sku: 'AKR-001', name: 'Classic Ankara Dress',  exp: 5, recv: 0, cost: 9000  },
      { sku: 'LCB-002', name: 'Leather Crossbody Bag', exp: 3, recv: 0, cost: 12000 },
    ],
    notes: 'Pop-up weekend stock.',
  },
  {
    id: 'TRF-2026-004', type: 'incoming', status: 'partial',
    origin: 'Kano Craft Suppliers', dest: 'Main Store — Lagos',
    date: '2026-04-03', eta: '2026-04-10', ref: 'PO-003',
    items: [
      { sku: 'LCB-002', name: 'Leather Crossbody Bag', exp: 15, recv: 8, cost: 12000 },
    ],
    notes: 'Remaining 7 units arriving next week.',
  },
  {
    id: 'TRF-2026-005', type: 'return', status: 'pending',
    origin: 'Main Store — Lagos', dest: 'Lagos Textile Hub',
    date: '2026-04-08', eta: '2026-04-10', ref: null,
    items: [
      { sku: 'KFT-004', name: "Men's Kaftan Set", exp: 2, recv: 0, cost: 16000 },
    ],
    notes: 'Damaged units — supplier agreed to replacement.',
  },
]

// ─── Helpers ───────────────────────────────────────────────
const fmt  = (n) => `₦${Number(n || 0).toLocaleString()}`
const fmtD = (s) => new Date(s).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })

// ─── Reusable buttons ──────────────────────────────────────
const BtnPrimary = ({ children, onClick, disabled }) => (
  <button className={styles.btnPrimary} onClick={onClick} disabled={disabled}>{children}</button>
)
const BtnOutline = ({ children, onClick }) => (
  <button className={styles.btnOutline} onClick={onClick}>{children}</button>
)
const BtnGhost = ({ children, onClick }) => (
  <button className={styles.btnGhost} onClick={onClick}>{children}</button>
)

// ─── Detail Modal ───────────────────────────────────────────
function DetailModal({ transfer, onClose, onReceive }) {
  const [recv, setRecv] = useState(
    Object.fromEntries(transfer.items.map(i => [i.sku, i.recv]))
  )

  const canEdit = ['pending', 'in_transit', 'partial'].includes(transfer.status)
  const total   = transfer.items.reduce((a, i) => a + i.exp * i.cost, 0)
  const STEPS   = ['Created', 'Approved', 'In Transit', 'Received']
  const stepIdx = {
    draft: 0, pending: 1, in_transit: 2,
    received: 3, partial: 2, cancelled: 0,
  }[transfer.status]

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.mHead}>
          <div>
            <div className={styles.mTitleRow}>
              <span className={styles.mTitle}>{transfer.id}</span>
              <Pill {...TYPE[transfer.type]} />
              <Pill {...STATUS[transfer.status]} />
            </div>
            <p className={styles.mSub}>
              {transfer.origin}
              <span className={styles.arrow}> → </span>
              {transfer.dest}
              {transfer.ref && <span className={styles.mRef}> · {transfer.ref}</span>}
            </p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        {/* Progress timeline */}
        <div className={styles.timeline}>
          {STEPS.map((step, i) => (
            <div key={step} className={styles.timelineItem} style={{ flex: i < STEPS.length - 1 ? 1 : 0 }}>
              <div className={styles.timelineStep}>
                <div
                  className={styles.timelineDot}
                  style={{ background: i < stepIdx ? '#2DBD97' : i === stepIdx ? '#1a1a2e' : '#E5E7EB' }}
                />
                <span
                  className={styles.timelineLabel}
                  style={{ color: i <= stepIdx ? '#1a1a2e' : '#9CA3AF', fontWeight: i === stepIdx ? 700 : 400 }}
                >
                  {step}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={styles.timelineLine} style={{ background: i < stepIdx ? '#2DBD97' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className={styles.mBody}>

          {/* Info cards row */}
          <div className={styles.infoCards}>
            {[
              { label: 'Created',     value: fmtD(transfer.date) },
              { label: 'Expected',    value: fmtD(transfer.eta)  },
              { label: 'Total Value', value: fmt(total)           },
            ].map(card => (
              <div key={card.label} className={styles.infoCard}>
                <div className={styles.infoCardLabel}>{card.label}</div>
                <div className={styles.infoCardValue}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Items table */}
          <div className={styles.itemsTable}>
            <div className={styles.itemsHead}>
              <span>Product</span>
              <span>SKU</span>
              <span>Expected</span>
              <span>Received</span>
              <span>Variance</span>
              <span>Subtotal</span>
            </div>

            {transfer.items.map(item => {
              const r = recv[item.sku] ?? 0
              const v = r - item.exp
              return (
                <div key={item.sku} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemSku}>{item.sku}</span>
                  <span>{item.exp}</span>
                  <span>
                    {canEdit ? (
                      <input
                        type="number"
                        min={0}
                        max={item.exp}
                        className={styles.recvInput}
                        value={r}
                        onChange={e => setRecv(prev => ({ ...prev, [item.sku]: Number(e.target.value) }))}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: r >= item.exp ? '#047857' : '#B45309' }}>{r}</span>
                    )}
                  </span>
                  <span
                    className={styles.variance}
                    style={{ color: v < 0 ? '#EF4444' : v > 0 ? '#2DBD97' : '#9CA3AF' }}
                  >
                    {v === 0 ? '—' : `${v > 0 ? '+' : ''}${v}`}
                  </span>
                  <span className={styles.itemSubtotal}>{fmt(item.exp * item.cost)}</span>
                </div>
              )
            })}

            <div className={styles.itemsTotal}>
              <span className={styles.itemsTotalLabel}>
                {transfer.items.reduce((a, i) => a + i.exp, 0)} units total
              </span>
              <span className={styles.itemsTotalValue}>{fmt(total)}</span>
            </div>
          </div>

          {transfer.notes && (
            <div className={styles.notesBox}>
              <strong>Note: </strong>{transfer.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.mFoot}>
          <BtnGhost onClick={onClose}>Close</BtnGhost>
          {canEdit && (
            <BtnPrimary onClick={() => { onReceive(transfer.id, recv); onClose() }}>
              <Ic d="M20 6L9 17l-5-5" size={13} stroke="#fff" />
              Mark as Received
            </BtnPrimary>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Create Modal ───────────────────────────────────────────
function CreateModal({ onClose, onSave }) {
  const [type,   setType]   = useState('incoming')
  const [origin, setOrigin] = useState('')
  const [dest,   setDest]   = useState('')
  const [eta,    setEta]    = useState('')
  const [ref,    setRef]    = useState('')
  const [notes,  setNotes]  = useState('')
  const [items,  setItems]  = useState([{ sku: '', name: '', exp: 1, cost: '' }])

  const setItem = (i, key, val) => {
    setItems(its => {
      const next = [...its]
      next[i] = { ...next[i], [key]: val }
      if (key === 'name') {
        const match = PRODUCTS.find(p => p.name === val)
        if (match) { next[i].sku = match.sku; next[i].cost = match.cost }
      }
      return next
    })
  }

  const addItem    = () => setItems(its => [...its, { sku: '', name: '', exp: 1, cost: '' }])
  const removeItem = (i) => setItems(its => its.filter((_, j) => j !== i))
  const total      = items.reduce((a, i) => a + (Number(i.exp) * Number(i.cost) || 0), 0)
  const origins    = type === 'incoming' ? SUPPLIERS : LOCATIONS

  const save = (status) => {
    onSave({
      id:    `TRF-2026-${String(Date.now()).slice(-3)}`,
      type, status, origin, dest,
      ref:   ref || null,
      notes,
      date:  new Date().toISOString().split('T')[0],
      eta:   eta || new Date().toISOString().split('T')[0],
      items: items.map(i => ({ ...i, recv: 0 })),
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Create Transfer</h2>
            <p className={styles.mSub}>Move stock between locations or receive from a supplier</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        {/* Transfer type selector */}
        <div className={styles.typeSelectorRow}>
          {Object.entries(TYPE).map(([key, cfg]) => (
            <button
              key={key}
              className={`${styles.typeBtn} ${type === key ? styles.typeBtnOn : ''}`}
              onClick={() => setType(key)}
            >
              <Ic d={cfg.icon} size={18} stroke={type === key ? '#fff' : '#6B7280'} />
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.mBody}>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>{type === 'incoming' ? 'Supplier / Origin' : 'Origin Location'} <span className={styles.req}>*</span></label>
              <select value={origin} onChange={e => setOrigin(e.target.value)}>
                <option value="">Select origin</option>
                {origins.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={styles.fg}>
              <label>Destination <span className={styles.req}>*</span></label>
              <select value={dest} onChange={e => setDest(e.target.value)}>
                <option value="">Select destination</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Expected Arrival</label>
              <input type="date" value={eta} onChange={e => setEta(e.target.value)} />
            </div>
            <div className={styles.fg}>
              <label>Reference / PO <span className={styles.opt}>(optional)</span></label>
              <input value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. PO-004" />
            </div>
          </div>

          {/* Items editor */}
          <div className={styles.itemsEditor}>
            <div className={styles.itemsEditorHead}>
              <span className={styles.itemsEditorTitle}>Transfer Items</span>
              <button className={styles.btnAddItem} onClick={addItem}>
                <Ic d="M12 5v14M5 12h14" size={12} stroke="#374151" /> Add Item
              </button>
            </div>

            {items.map((item, i) => (
              <div key={i} className={styles.itemEditRow}>
                <div className={styles.fg} style={{ flex: 2 }}>
                  {i === 0 && <label>Product</label>}
                  <select value={item.name} onChange={e => setItem(i, 'name', e.target.value)}>
                    <option value="">Select product</option>
                    {PRODUCTS.map(p => <option key={p.sku} value={p.name}>{p.name} — {p.sku}</option>)}
                  </select>
                </div>
                <div className={styles.fg} style={{ flex: '0 0 70px' }}>
                  {i === 0 && <label>Qty</label>}
                  <input type="number" min={1} value={item.exp} onChange={e => setItem(i, 'exp', e.target.value)} />
                </div>
                <div className={styles.fg} style={{ flex: 1 }}>
                  {i === 0 && <label>Unit Cost (₦)</label>}
                  <input type="number" value={item.cost} onChange={e => setItem(i, 'cost', e.target.value)} placeholder="0" />
                </div>
                {items.length > 1 && (
                  <button className={styles.removeItemBtn} onClick={() => removeItem(i)}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={13} stroke="#EF4444" />
                  </button>
                )}
              </div>
            ))}

            <div className={styles.itemsEditorTotal}>
              <span>{items.reduce((a, i) => a + Number(i.exp || 0), 0)} units</span>
              <strong>{fmt(total)}</strong>
            </div>
          </div>

          <div className={styles.fg}>
            <label>Notes <span className={styles.opt}>(optional)</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Any special instructions or context for this transfer..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.mFoot}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <div className={styles.mFootR}>
            <BtnOutline onClick={() => save('draft')}>Save as Draft</BtnOutline>
            <BtnPrimary onClick={() => save('pending')} disabled={!origin || !dest}>
              <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#fff" />
              Send Transfer
            </BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function Transfers() {
  const [transfers,    setTransfers]    = useState(SEED_TRANSFERS)
  const [selected,     setSelected]     = useState(null)
  const [showCreate,   setShowCreate]   = useState(false)
  const [search,       setSearch]       = useState('')
  const [filterType,   setFilterType]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Filter transfers based on search + filters
  const filtered = transfers.filter(tr => {
    const q   = search.toLowerCase()
    const ms  = tr.id.toLowerCase().includes(q) || tr.origin.toLowerCase().includes(q) || tr.dest.toLowerCase().includes(q)
    const mt  = filterType   === 'all' || tr.type   === filterType
    const mst = filterStatus === 'all' || tr.status === filterStatus
    return ms && mt && mst
  })

  // Mark transfer as received (full or partial)
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

  const stats = [
    { label: 'Total Transfers', value: transfers.length,                                    accent: '#1a1a2e' },
    { label: 'In Transit',      value: transfers.filter(t => t.status === 'in_transit').length, accent: '#3B82F6' },
    { label: 'Awaiting Action', value: pendingCount,                                         accent: '#F59E0B' },
    { label: 'Completed',       value: transfers.filter(t => t.status === 'received').length,   accent: '#2DBD97' },
    { label: 'Total Value',     value: fmt(totalValue),                                      accent: '#8B5CF6' },
  ]

  return (
    <div className={styles.page}>

      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Transfers</h1>
        <BtnPrimary onClick={() => setShowCreate(true)}>
          <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
          Create Transfer
        </BtnPrimary>
      </header>

      <div className={styles.content}>

        {/* ── Stat cards ── */}
        <div className={styles.statsRow}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statLabel}>{s.label}</div>
              <div className={styles.statValue} style={{ color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Pending alert banner ── */}
        {pendingCount > 0 && (
          <div className={styles.alertBanner}>
            <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={15} stroke="#B45309" />
            <span>
              <strong>{pendingCount} transfer{pendingCount > 1 ? 's' : ''}</strong> awaiting action — review and update status.
            </span>
            <button className={styles.alertBtn} onClick={() => setFilterStatus('pending')}>
              View pending →
            </button>
          </div>
        )}

        {/* ── Search & Filters ── */}
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span className={styles.searchIco}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />
            </span>
            <input
              className={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, origin, destination…"
            />
          </div>
          <div className={styles.controlsR}>
            <select className={styles.filterSel} value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              {Object.entries(TYPE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {(filterType !== 'all' || filterStatus !== 'all') && (
              <button className={styles.clearBtn} onClick={() => { setFilterType('all'); setFilterStatus('all') }}>
                Clear ×
              </button>
            )}
          </div>
        </div>

        {/* ── Transfers table ── */}
        <div className={styles.table}>
          <div className={styles.tHead}>
            <span>Transfer ID</span>
            <span>Type</span>
            <span>Origin</span>
            <span>Destination</span>
            <span>Units</span>
            <span>Value</span>
            <span>Created</span>
            <span>Status</span>
            <span></span>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <rect x="10" y="20" width="52" height="38" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
                <path d="M22 39h28M36 27v24" stroke="#2DBD97" strokeWidth="2" strokeLinecap="round" />
                <circle cx="54" cy="54" r="12" fill="#2DBD97" />
                <path d="M49 54h10M54 49v10" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <h3>No transfers found</h3>
              <p>Create your first transfer to move stock between locations</p>
              <BtnPrimary onClick={() => setShowCreate(true)}>
                <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Create Transfer
              </BtnPrimary>
            </div>
          ) : filtered.map((tr, idx) => {
            const totalVal   = tr.items.reduce((a, i) => a + i.exp * i.cost, 0)
            const totalUnits = tr.items.reduce((a, i) => a + i.exp, 0)
            return (
              <div
                key={tr.id}
                className={styles.tRow}
                onClick={() => setSelected(tr)}
              >
                <span className={styles.transferId}>{tr.id}</span>
                <span><Pill {...TYPE[tr.type]} /></span>
                <span className={styles.locationCell}>{tr.origin}</span>
                <span className={styles.locationCell}>{tr.dest}</span>
                <span className={styles.unitsCell}>{totalUnits}</span>
                <span className={styles.valueCell}>{fmt(totalVal)}</span>
                <span className={styles.dateCell}>{fmtD(tr.date)}</span>
                <span><Pill {...STATUS[tr.status]} /></span>
                <span className={styles.actCell} onClick={e => e.stopPropagation()}>
                  <button className={styles.viewBtn} onClick={() => setSelected(tr)}>
                    <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={13} />
                  </button>
                </span>
              </div>
            )
          })}
        </div>

        <p className={styles.countLine}>
          Showing {filtered.length} of {transfers.length} transfers
        </p>
      </div>

      {/* ── Modals ── */}
      {selected   && <DetailModal transfer={selected} onClose={() => setSelected(null)} onReceive={receive} />}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onSave={data => setTransfers(ts => [data, ...ts])} />}
    </div>
  )
}


