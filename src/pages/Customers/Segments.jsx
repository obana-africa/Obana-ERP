import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Segments.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Seed data ─────────────────────────────────────────────────── */
const SEED_SEGMENTS = [
  { id: 1,  name: 'Customers added to companies',          pct: 0,   lastActivity: 'Created on 9 Apr 2026',    createdBy: 'taoja',    icon: '#2DBD97' },
  { id: 2,  name: 'Customers not added to companies',      pct: 100, lastActivity: 'Created on 9 Apr 2026',    createdBy: 'taoja',    icon: '#2DBD97' },
  { id: 3,  name: 'Ecomsend',                              pct: 3,   lastActivity: 'Created on 3 Feb 2026',    createdBy: 'SendWILL',icon: '#8B5CF6' },
  { id: 4,  name: 'Active Email List',                     pct: 63,  lastActivity: 'Edited on 7 Jul 2025',     createdBy: 'taoja',    icon: '#E8C547' },
  { id: 5,  name: 'Customers who have purchased at least once', pct: 42, lastActivity: 'Edited on 5 Nov 2024', createdBy: 'taoja',    icon: '#2DBD97' },
  { id: 6,  name: 'Email subscribers',                     pct: 64,  lastActivity: 'Edited on 5 Nov 2024',    createdBy: 'taoja',    icon: '#2DBD97' },
  { id: 7,  name: 'Abandoned checkouts in the last 30 days', pct: 0,  lastActivity: 'Edited on 5 Nov 2024',   createdBy: 'taoja',    icon: '#EF4444' },
  { id: 8,  name: 'Customers who have purchased more than once', pct: 13, lastActivity: 'Edited on 5 Nov 2024', createdBy: 'taoja',  icon: '#2DBD97' },
  { id: 9,  name: "Customers who haven't purchased",       pct: 58,  lastActivity: 'Edited on 5 Nov 2024',    createdBy: 'taoja',    icon: '#F59E0B' },
]

/* ── Create segment modal ──────────────────────────────────────── */
function CreateSegmentModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [query, setQuery] = useState('')
  const [condition, setCondition] = useState('email_subscription')
  const [operator, setOperator] = useState('equals')
  const [value, setValue] = useState('subscribed')

  const CONDITIONS = [
    { v: 'email_subscription',   l: 'Email subscription' },
    { v: 'number_of_orders',     l: 'Number of orders' },
    { v: 'total_spent',          l: 'Total spent' },
    { v: 'last_order_date',      l: 'Last order date' },
    { v: 'customer_location',    l: 'Customer location' },
    { v: 'customer_tag',         l: 'Customer tag' },
    { v: 'predicted_spend_tier', l: 'Predicted spend tier' },
  ]
  const OPERATORS = [
    { v: 'equals',       l: 'equals' },
    { v: 'not_equals',   l: 'does not equal' },
    { v: 'contains',     l: 'contains' },
    { v: 'greater_than', l: 'is greater than' },
    { v: 'less_than',    l: 'is less than' },
  ]

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHead}>
          <h2 className={s.modalTitle}>New segment</h2>
          <button className={s.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={s.modalBody}>
          <div className={s.field}>
            <label className={s.label}>Segment name <span className={s.req}>*</span></label>
            <input className={s.input} placeholder="e.g. VIP Customers"
              value={name} onChange={e => setName(e.target.value)} autoFocus />
          </div>

          <div className={s.field}>
            <label className={s.label}>Description</label>
            <input className={s.input} placeholder="Describe this segment…"
              value={query} onChange={e => setQuery(e.target.value)} />
          </div>

          <div className={s.conditionBlock}>
            <div className={s.conditionHead}>
              <Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={14} stroke="#1b3b5f" />
              <span className={s.conditionTitle}>Filter conditions</span>
            </div>
            <div className={s.conditionRow}>
              <select className={s.select} value={condition} onChange={e => setCondition(e.target.value)}>
                {CONDITIONS.map(c => <option key={c.v} value={c.v}>{c.l}</option>)}
              </select>
              <select className={s.select} value={operator} onChange={e => setOperator(e.target.value)}>
                {OPERATORS.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
              <input className={s.input} placeholder="Value" value={value}
                onChange={e => setValue(e.target.value)} />
              <button className={s.removeCondBtn}>
                <Ic d="M18 6L6 18M6 6l12 12" size={13} />
              </button>
            </div>
            <button className={s.addCondBtn}>
              <Ic d="M12 5v14M5 12h14" size={13} />
              Add condition
            </button>
          </div>

          <div className={s.queryPreview}>
            <div className={s.queryPreviewLabel}>Query preview</div>
            <code className={s.queryCode}>
              {`${condition} ${operator} "${value}"`}
            </code>
          </div>
        </div>

        <div className={s.modalFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!name.trim()}
            onClick={() => { onSave({ name, query, condition, operator, value }); onClose() }}>
            Create segment
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Segment row actions dropdown ──────────────────────────────── */
function RowMenu({ id, onEdit, onDuplicate, onDelete, onClose }) {
  return (
    <div className={s.rowMenu}>
      <button className={s.rowMenuItem} onClick={onEdit}>
        <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
        Edit
      </button>
      <button className={s.rowMenuItem} onClick={onDuplicate}>
        <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
        Duplicate
      </button>
      <hr className={s.rowMenuDivider} />
      <button className={`${s.rowMenuItem} ${s.rowMenuDanger}`} onClick={onDelete}>
        <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} stroke="currentColor" />
        Delete
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Segments() {
  const navigate = useNavigate()
  const [segments,  setSegments]  = useState(SEED_SEGMENTS)
  const [search,    setSearch]    = useState('')
  const [showModal, setShowModal] = useState(false)
  const [sortDir,   setSortDir]   = useState('desc')
  const [selected,  setSelected]  = useState([])
  const [openMenu,  setOpenMenu]  = useState(null)
  const [visible,   setVisible]   = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  /* close menu on outside click */
  useEffect(() => {
    const fn = () => setOpenMenu(null)
    document.addEventListener('click', fn)
    return () => document.removeEventListener('click', fn)
  }, [])

  const filtered = segments
    .filter(seg => seg.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDir === 'asc'
      ? a.lastActivity.localeCompare(b.lastActivity)
      : b.lastActivity.localeCompare(a.lastActivity))

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(c => c.id))

  const addSegment = data => setSegments(prev => [...prev, {
    id:           Date.now(),
    name:         data.name,
    pct:          0,
    lastActivity: `Created on ${new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}`,
    createdBy:    'taoja',
    icon:         '#2DBD97',
  }])

  const deleteSegment = id => {
    if (window.confirm('Delete this segment?')) setSegments(prev => prev.filter(s => s.id !== id))
  }

  const duplicateSegment = id => {
    const seg = segments.find(s => s.id === id)
    if (seg) setSegments(prev => [...prev, { ...seg, id: Date.now(), name: `${seg.name} (copy)` }])
  }

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.title}>Segments</h1>
          <span className={s.count}>{segments.length} segments</span>
        </div>
        <button className={s.btnPrimary} onClick={() => setShowModal(true)}>
          <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
          Create segment
        </button>
      </div>

      {/* ── Bulk action bar ────────────────────────────────────── */}
      {selected.length > 0 && (
        <div className={s.bulkBar}>
          <span className={s.bulkCount}>{selected.length} selected</span>
          <button className={s.bulkBtn}
            onClick={() => { selected.forEach(deleteSegment); setSelected([]) }}>
            <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} />
            Delete
          </button>
          <button className={s.bulkBtnOutline} onClick={() => setSelected([])}>Deselect all</button>
        </div>
      )}

      {/* ── Search ─────────────────────────────────────────────── */}
      <div className={s.searchWrap}>
        <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={15} stroke="#9CA3AF" />
        <input className={s.searchInput} placeholder="Search segments"
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && (
          <button className={s.searchClear} onClick={() => setSearch('')}>
            <Ic d="M18 6L6 18M6 6l12 12" size={13} stroke="#9CA3AF" />
          </button>
        )}
      </div>

      {/* ── Table ──────────────────────────────────────────────── */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={toggleAll} className={s.checkbox} />
              </th>
              <th className={s.thName}>Name</th>
              <th>% of customers</th>
              <th>
                <button className={s.sortBtn}
                  onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
                  Last activity
                  <Ic d={sortDir === 'asc' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={13} />
                </button>
              </th>
              <th>Created by</th>
              <th style={{ width: 50 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className={s.emptyTd}>
                  <div className={s.empty}>
                    <Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={36} stroke="#D1D5DB" />
                    <p className={s.emptyTitle}>No segments found</p>
                    <p className={s.emptySub}>{search ? `No match for "${search}"` : 'Create your first segment to get started'}</p>
                    {!search && (
                      <button className={s.btnPrimary} onClick={() => setShowModal(true)}>
                        Create segment
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filtered.map((seg, i) => (
              <tr key={seg.id} className={s.tr}
                style={{ animationDelay: `${i * 25}ms` }}>
                <td>
                  <input type="checkbox" checked={selected.includes(seg.id)}
                    onChange={() => toggleSelect(seg.id)} className={s.checkbox} />
                </td>
                <td>
                  <div className={s.nameCell}>
                    <div className={s.segIcon}
                      style={{ background: `${seg.icon}18`, color: seg.icon }}>
                      <Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={12} stroke={seg.icon} />
                    </div>
                    <button className={s.segNameBtn}
                      onClick={() => navigate('/customers/segments/new', { state: { segment: seg } })}>
                      {seg.name}
                    </button>
                  </div>
                </td>
                <td>
                  <div className={s.pctCell}>
                    <div className={s.pctBar}>
                      <div className={s.pctBarFill} style={{ width: `${seg.pct}%`, background: seg.icon }} />
                    </div>
                    <span className={s.pctNum}>{seg.pct}%</span>
                  </div>
                </td>
                <td className={s.activityCell}>{seg.lastActivity}</td>
                <td>
                  <div className={s.createdByCell}>
                    <div className={s.creatorAvatar}
                      style={{ background: seg.createdBy === 'taoja' ? '#1b3b5f18' : '#8B5CF618',
                               color: seg.createdBy === 'taoja' ? '#1b3b5f' : '#8B5CF6' }}>
                      {seg.createdBy[0]}
                    </div>
                    <span>{seg.createdBy}</span>
                  </div>
                </td>
                <td>
                  <div className={s.rowMenuWrap} onClick={e => e.stopPropagation()}>
                    <button className={s.moreBtn}
                      onClick={() => setOpenMenu(openMenu === seg.id ? null : seg.id)}>
                      <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
                    </button>
                    {openMenu === seg.id && (
                      <RowMenu
                        id={seg.id}
                        onEdit={() => { setOpenMenu(null); navigate('/customers/segments/new', { state: { segment: seg } }) }}
                        onDuplicate={() => { duplicateSegment(seg.id); setOpenMenu(null) }}
                        onDelete={() => { deleteSegment(seg.id); setOpenMenu(null) }}
                        onClose={() => setOpenMenu(null)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.learnMore}>
        <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#6B7280" />
        <a href="#" className={s.learnMoreLink}>Learn more about segments</a>
      </div>

      {showModal && <CreateSegmentModal onClose={() => setShowModal(false)} onSave={addSegment} />}
    </div>
  )
}
