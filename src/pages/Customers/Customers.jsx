import { useState } from 'react'
import styles from './Customers.module.css'
import { fmt } from '../../utils/formatters'
import { SAMPLE_CUSTOMERS, TAG_CONFIG, STATUS_CFG, AVATAR_COLORS } from '../../data/customers'
import CustomerModal  from './components/CustomerModal'
import CustomerDetail from './components/CustomerDetail'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const getAvatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
const getInitials    = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()

const TagPill = ({ tag }) => {
  const cfg = TAG_CONFIG[tag] || { bg:'#F3F4F6', color:'#6B7280', border:'#E5E7EB' }
  return (
    <span style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`,
      padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:700 }}>
      {tag}
    </span>
  )
}

const I = {
  users:   ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  plus:    'M12 5v14M5 12h14',
  search:  'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  mail:    ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  sms:     'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
  tag:     ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  trash:   ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  edit:    ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  eye:     ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  phone:   'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  refresh: ['M1 4v6h6','M23 20v-6h-6','M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'],
  grid:    ['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z'],
  list:    ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  download:['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  naira:   ['M2 8h20','M2 16h20','M6 4v16','M18 4v16'],
  star:    'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
}

const SEGMENTS = [
  { key:'all',      label:'All Customers', filter:() => true                  },
  { key:'vip',      label:'VIP',           filter:c => c.tag === 'VIP'        },
  { key:'regular',  label:'Regular',       filter:c => c.tag === 'Regular'    },
  { key:'new',      label:'New',           filter:c => c.tag === 'New'         },
  { key:'at-risk',  label:'At Risk',       filter:c => c.tag === 'At Risk'     },
  { key:'inactive', label:'Inactive',      filter:c => c.status === 'inactive' },
]

export default function Customers() {
  const [customers,      setCustomers]      = useState(SAMPLE_CUSTOMERS)
  const [modal,          setModal]          = useState(null)
  const [editCustomer,   setEditCustomer]   = useState(null)
  const [detailCustomer, setDetailCustomer] = useState(null)
  const [search,         setSearch]         = useState('')
  const [segment,        setSegment]        = useState('all')
  const [filterState,    setFilterState]    = useState('all')
  const [sortBy,         setSortBy]         = useState('recent')
  const [view,           setView]           = useState('list')
  const [selected,       setSelected]       = useState([])

  const saveCustomer = data => {
    if (editCustomer) {
      setCustomers(cs => cs.map(c => c.id === editCustomer.id ? { ...c, ...data } : c))
      if (detailCustomer?.id === editCustomer.id) setDetailCustomer(p => ({ ...p, ...data }))
    } else {
      const uid = `CUS-${String(customers.length + 1).padStart(3,'0')}`
      setCustomers(cs => [...cs, { ...data, id:uid, totalOrders:0, totalSpent:0,
        firstOrder:new Date().toISOString().split('T')[0],
        lastOrder:new Date().toISOString().split('T')[0], orders:[] }])
    }
  }

  const deleteCustomer = id => {
    setCustomers(cs => cs.filter(c => c.id !== id))
    if (detailCustomer?.id === id) setDetailCustomer(null)
  }

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = ()  => setSelected(s => s.length === filtered.length && filtered.length > 0 ? [] : filtered.map(c => c.id))

  const segFn = SEGMENTS.find(s => s.key === segment)?.filter || (() => true)
  const filtered = customers
    .filter(segFn)
    .filter(c => {
      const q  = search.toLowerCase()
      const ms = !q || c.name.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone.includes(q) || c.id.includes(q)
      const ml = filterState === 'all' || c.state.toLowerCase().includes(filterState.toLowerCase())
      return ms && ml
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.lastOrder) - new Date(a.lastOrder)
      if (sortBy === 'spent')  return b.totalSpent - a.totalSpent
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders
      if (sortBy === 'name')   return a.name.localeCompare(b.name)
      return 0
    })

  const totalRevenue = customers.reduce((a, c) => a + c.totalSpent, 0)
  const totalOrders  = customers.reduce((a, c) => a + c.totalOrders, 0)
  const avgOrder     = totalRevenue / Math.max(totalOrders, 1)
  const vipCount     = customers.filter(c => c.tag === 'VIP').length

  const STATS = [
    { label:'Total Customers', value:customers.length,          accent:'#1a1a2e', icon:I.users   },
    { label:'Total Revenue',   value:fmt(totalRevenue),         accent:'#2DBD97', icon:I.naira   },
    { label:'VIP Customers',   value:vipCount,                  accent:'#E8C547', icon:I.star    },
    { label:'Avg Order Value', value:fmt(Math.round(avgOrder)), accent:'#3B82F6', icon:I.refresh },
  ]

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Customers</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline}><Ic d={I.download} size={13} /> Export CSV</button>
          <button className={styles.btnPrimary} onClick={() => { setEditCustomer(null); setModal('create') }}>
            <Ic d={I.plus} size={13} stroke="#fff" /> Add Customer
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.statsRow}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLbl}>{s.label}</span>
                <Ic d={s.icon} size={15} stroke={s.accent} />
              </div>
              <div className={styles.statVal} style={{ color:s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className={styles.segmentRow}>
          {SEGMENTS.map(s => {
            const count = customers.filter(s.filter).length
            return (
              <button key={s.key}
                className={`${styles.segPill} ${segment===s.key?styles.segPillOn:''}`}
                onClick={() => setSegment(s.key)}>
                {s.label} <span className={styles.segCount}>{count}</span>
              </button>
            )
          })}
        </div>

        <div className={styles.controls}>
          <div className={styles.controlsL}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}><Ic d={I.search} size={14} /></span>
              <input placeholder="Search by name, phone, email…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className={styles.filterSel} value={filterState} onChange={e => setFilterState(e.target.value)}>
              <option value="all">All States</option>
              {['Lagos','Abuja','Rivers','Kano','Oyo','Enugu'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.controlsR}>
            <select className={styles.filterSel} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="recent">Sort: Recent</option>
              <option value="spent">Sort: Top Spenders</option>
              <option value="orders">Sort: Most Orders</option>
              <option value="name">Sort: Name A–Z</option>
            </select>
            <div className={styles.viewToggle}>
              <button className={`${styles.vBtn} ${view==='list'?styles.vBtnOn:''}`} onClick={() => setView('list')}><Ic d={I.list} size={14} /></button>
              <button className={`${styles.vBtn} ${view==='grid'?styles.vBtnOn:''}`} onClick={() => setView('grid')}><Ic d={I.grid} size={14} /></button>
            </div>
          </div>
        </div>

        {selected.length > 0 && (
          <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>{selected.length} selected</span>
            <div className={styles.bulkActions}>
              <button className={styles.bulkBtn}><Ic d={I.mail}  size={13} /> Send Email</button>
              <button className={styles.bulkBtn}><Ic d={I.sms}   size={13} /> Send SMS</button>
              <button className={styles.bulkBtn}><Ic d={I.tag}   size={13} /> Change Tag</button>
              <button className={styles.bulkBtnDanger} onClick={() => { selected.forEach(deleteCustomer); setSelected([]) }}>
                <Ic d={I.trash} size={13} /> Delete
              </button>
            </div>
          </div>
        )}

        <div className={styles.countRow}>
          <span className={styles.countTxt}><Ic d={I.refresh} size={13} /> Showing {filtered.length} of {customers.length} customers</span>
        </div>

        {view === 'list' && (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span><input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0} onChange={toggleAll} /></span>
              <span>Customer</span><span>Contact</span><span>Location</span>
              <span>Orders</span><span>Total Spent</span><span>Segment</span><span>Status</span><span/>
            </div>
            {filtered.length === 0 ? (
              <div className={styles.noRecord}>
                <Ic d={I.users} size={40} />
                <p>No customers found</p>
                <button className={styles.btnOutline} onClick={() => { setEditCustomer(null); setModal('create') }}>
                  <Ic d={I.plus} size={13} /> Add your first customer
                </button>
              </div>
            ) : filtered.map(c => {
              const av = getAvatarColor(c.name)
              return (
                <div key={c.id} className={`${styles.tableRow} ${selected.includes(c.id)?styles.rowSel:''}`}>
                  <span><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></span>
                  <span className={styles.custCell} onClick={() => setDetailCustomer(c)}>
                    <div className={styles.custAvatar} style={{ background:av.bg, color:av.color }}>{getInitials(c.name)}</div>
                    <div><div className={styles.custName}>{c.name}</div><div className={styles.custId}>{c.id}</div></div>
                  </span>
                  <span className={styles.contactCell}>
                    <div className={styles.contactLine}><Ic d={I.phone} size={11} />{c.phone}</div>
                    {c.email && <div className={styles.contactLine}><Ic d={I.mail} size={11} />{c.email}</div>}
                  </span>
                  <span className={styles.locationCell}>{c.city}, {c.state}</span>
                  <span className={styles.ordersCell}>
                    <div className={styles.orderCount}>{c.totalOrders}</div>
                    <div className={styles.orderLbl}>orders</div>
                  </span>
                  <span className={styles.spentCell}>{fmt(c.totalSpent)}</span>
                  <span><TagPill tag={c.tag} /></span>
                  <span>
                    <span style={{ background:STATUS_CFG[c.status]?.bg, color:STATUS_CFG[c.status]?.color,
                      padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, textTransform:'capitalize' }}>
                      {c.status}
                    </span>
                  </span>
                  <span className={styles.actCell}>
                    <button className={styles.iconActBtn} onClick={() => setDetailCustomer(c)}><Ic d={I.eye} size={13} /></button>
                    <button className={styles.iconActBtn} onClick={() => { setEditCustomer(c); setModal('edit') }}><Ic d={I.edit} size={13} /></button>
                    <button className={styles.iconActBtnRed} onClick={() => deleteCustomer(c.id)}><Ic d={I.trash} size={13} /></button>
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {view === 'grid' && (
          <div className={styles.custGrid}>
            {filtered.map(c => {
              const av = getAvatarColor(c.name)
              return (
                <div key={c.id} className={styles.custCard} onClick={() => setDetailCustomer(c)}>
                  <div className={styles.custCardTop}>
                    <div className={styles.custAvatarLg} style={{ background:av.bg, color:av.color }}>{getInitials(c.name)}</div>
                    <div className={styles.custCardActions} onClick={e => e.stopPropagation()}>
                      <button className={styles.iconActBtn} onClick={() => { setEditCustomer(c); setModal('edit') }}><Ic d={I.edit} size={13} /></button>
                      <button className={styles.iconActBtnRed} onClick={() => deleteCustomer(c.id)}><Ic d={I.trash} size={13} /></button>
                    </div>
                  </div>
                  <div className={styles.custCardName}>{c.name}</div>
                  <div className={styles.custCardSub}>{c.phone}</div>
                  {c.email && <div className={styles.custCardSub} style={{ fontSize:11.5 }}>{c.email}</div>}
                  <div className={styles.custCardTags}>
                    <TagPill tag={c.tag} />
                    <span style={{ background:STATUS_CFG[c.status]?.bg, color:STATUS_CFG[c.status]?.color,
                      padding:'2px 9px', borderRadius:20, fontSize:11, fontWeight:600, textTransform:'capitalize' }}>
                      {c.status}
                    </span>
                  </div>
                  <div className={styles.custCardStats}>
                    <div className={styles.custCardStat}>
                      <div className={styles.custCardStatVal}>{c.totalOrders}</div>
                      <div className={styles.custCardStatLbl}>Orders</div>
                    </div>
                    <div className={styles.custCardStatDiv} />
                    <div className={styles.custCardStat}>
                      <div className={styles.custCardStatVal} style={{ fontSize:13 }}>{fmt(c.totalSpent)}</div>
                      <div className={styles.custCardStatLbl}>Spent</div>
                    </div>
                    <div className={styles.custCardStatDiv} />
                    <div className={styles.custCardStat}>
                      <div className={styles.custCardStatVal}>{c.city}</div>
                      <div className={styles.custCardStatLbl}>City</div>
                    </div>
                  </div>
                </div>
              )
            })}
            <button className={styles.addCustCard} onClick={() => { setEditCustomer(null); setModal('create') }}>
              <Ic d={I.plus} size={24} /><span>Add Customer</span>
            </button>
          </div>
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <CustomerModal customer={editCustomer}
          onClose={() => { setModal(null); setEditCustomer(null) }}
          onSave={saveCustomer} />
      )}

      {detailCustomer && (
        <CustomerDetail customer={detailCustomer}
          onClose={() => setDetailCustomer(null)}
          onEdit={() => { setEditCustomer(detailCustomer); setModal('edit') }}
          onDelete={deleteCustomer} />
      )}
    </div>
  )
}
