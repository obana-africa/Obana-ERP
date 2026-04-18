import { useState } from 'react'
import styles from './Orders.module.css'
import { fmt, fmtD } from '../../utils/formatters'
import {
  SAMPLE_ORDERS, ABANDONED, REVIEWS,
  STATUS_CONFIG, PAYMENT_CONFIG, SHIP_CONFIG,
} from '../../data/orders'
import OrderModal       from './components/OrderModal'
import CreateOrderModal from './components/CreateOrderModal'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Status pill ───────────────────────────────────────────
const Pill = ({ cfg, value }) => {
  const c = cfg[value] || { label:value, bg:'#F3F4F6', color:'#6B7280' }
  return (
    <span style={{ background:c.bg, color:c.color, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, whiteSpace:'nowrap' }}>
      {c.label}
    </span>
  )
}

const initials = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()

// ── Icon paths ────────────────────────────────────────────
const ICON = {
  orders:   ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2','M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2'],
  naira:    ['M2 8h20','M2 16h20','M6 4v16','M18 4v16'],
  check:    'M20 6L9 17l-5-5',
  unpaid:   ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6'],
  plus:     'M12 5v14M5 12h14',
  search:   'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  calendar: ['M3 9h18','M8 3v4','M16 3v4','M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  trash:    ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'],
  alert:    ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  refresh:  ['M1 4v6h6','M23 20v-6h-6','M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13',
  chevDown: 'M6 9l6 6 6-6',
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Orders() {
  const [tab,           setTab]           = useState('orders')
  const [orders,        setOrders]        = useState(SAMPLE_ORDERS)
  const [abandoned]                       = useState(ABANDONED)
  const [reviews,       setReviews]       = useState(REVIEWS)
  const [search,        setSearch]        = useState('')
  const [dateFrom,      setDateFrom]      = useState('')
  const [dateTo,        setDateTo]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [showDatePicker,setShowDatePicker]= useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showCreate,    setShowCreate]    = useState(false)
  const [selected,      setSelected]      = useState([])
  const [perPage,       setPerPage]       = useState(25)
  const [reminderSent,  setReminderSent]  = useState({})

  // ── Derived stats ─────────────────────────────────────
  const totalOrders     = orders.length
  const amountOwed      = orders.filter(o => o.payment !== 'paid').reduce((a,o) => a+o.total, 0)
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const unpaidOrders    = orders.filter(o => o.payment === 'unpaid').length

  const filtered = orders.filter(o => {
    const q  = search.toLowerCase()
    const ms = o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
    const mt = filterStatus  === 'all' || o.status  === filterStatus
    const mp = filterPayment === 'all' || o.payment === filterPayment
    const md = (!dateFrom || o.date >= dateFrom) && (!dateTo || o.date <= dateTo)
    return ms && mt && mp && md
  })

  // ── Actions ────────────────────────────────────────────
  const toggleSelect  = id => setSelected(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])
  const toggleAll     = ()  => setSelected(s => s.length === filtered.length ? [] : filtered.map(o=>o.id))
  const updateStatus  = (id, status, shipping) =>
    setOrders(os => os.map(o => o.id===id ? { ...o, status, shipping } : o))
  const createOrder   = data => setOrders(os => [...os, data])
  const sendReminder  = id  => setReminderSent(r => ({ ...r, [id]: (r[id]||0)+1 }))

  const avgRating = reviews.length
    ? (reviews.reduce((a,r) => a+r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const STATS = [
    { label:'Total Orders',    value:totalOrders,        accent:'#2DBD97', icon:ICON.orders },
    { label:'Amount Owed',     value:fmt(amountOwed),    accent:'#E8C547', icon:ICON.naira  },
    { label:'Completed',       value:completedOrders,    accent:'#2DBD97', icon:ICON.check  },
    { label:'Unpaid Orders',   value:unpaidOrders,       accent:'#EF4444', icon:ICON.unpaid },
  ]

  return (
    <div className={styles.page}>

      {/* Topbar */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Orders</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline}>
            <Ic d={ICON.chevDown} size={13} /> Actions
          </button>
          <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
            <Ic d={ICON.plus} size={14} stroke="#fff" /> Create Order
          </button>
        </div>
      </header>

      <div className={styles.content}>

        {/* Stats */}
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

        {/* Tab bar */}
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab==='orders'?styles.tabOn:''}`}
              onClick={() => setTab('orders')}>Recent Orders</button>
            <button className={`${styles.tab} ${tab==='abandoned'?styles.tabOn:''}`}
              onClick={() => setTab('abandoned')}>
              Abandoned Orders <span className={styles.tabBadge}>{abandoned.length}</span>
            </button>
            <button className={`${styles.tab} ${tab==='reviews'?styles.tabOn:''}`}
              onClick={() => setTab('reviews')}>
              Reviews <span className={styles.tabBadge}>{reviews.filter(r=>r.status==='pending').length}</span>
            </button>
          </div>
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className={styles.tableSection}>
            <div className={styles.controls}>
              <div className={styles.controlsL}>
                <span className={styles.countTxt}>
                  <Ic d={ICON.refresh} size={13} />
                  Showing {filtered.length} of {orders.length} orders
                </span>
              </div>
              <div className={styles.controlsR}>
                <div className={styles.filterGroup}>
                  <select className={styles.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select className={styles.filterSelect} value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
                    <option value="all">All Payment</option>
                    {Object.entries(PAYMENT_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <button className={styles.ctrlBtn} onClick={() => setShowDatePicker(p => !p)}>
                  <Ic d={ICON.calendar} size={14} /> Date Range
                </button>
                <div className={styles.searchBox}>
                  <span className={styles.searchIco}><Ic d={ICON.search} size={14} /></span>
                  <input placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            {showDatePicker && (
              <div className={styles.datePicker}>
                <div className={styles.datePickerInner}>
                  <label>From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                  <label>To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                  <button className={styles.btnOutlineSm}
                    onClick={() => { setDateFrom(''); setDateTo(''); setShowDatePicker(false) }}>
                    Clear
                  </button>
                </div>
              </div>
            )}

            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span><input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0} onChange={toggleAll} /></span>
                <span>Order & Customer</span>
                <span>Total</span>
                <span>Status</span>
                <span>Payment</span>
                <span>Shipping</span>
                <span>Date</span>
                <span></span>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.noRecord}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ opacity:0.25 }}>
                    <path d="M10 20 L10 50 L50 50 L50 20 L30 8 Z" stroke="#2DBD97" strokeWidth="2" fill="none"/>
                    <line x1="20" y1="30" x2="40" y2="30" stroke="#2DBD97" strokeWidth="2"/>
                    <line x1="20" y1="38" x2="35" y2="38" stroke="#2DBD97" strokeWidth="2"/>
                  </svg>
                  <p>No orders found</p>
                </div>
              ) : filtered.map(o => (
                <div key={o.id} className={`${styles.tableRow} ${selected.includes(o.id)?styles.tableRowSel:''}`}>
                  <span><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} /></span>
                  <span className={styles.orderCell}>
                    <div className={styles.orderNum} onClick={() => setSelectedOrder(o)}>{o.id}</div>
                    <div className={styles.orderCust}>{o.customer}</div>
                    <div className={styles.orderChan}>{o.channel}</div>
                  </span>
                  <span className={styles.orderTotal}>{fmt(o.total)}</span>
                  <span><Pill cfg={STATUS_CONFIG}  value={o.status} /></span>
                  <span><Pill cfg={PAYMENT_CONFIG} value={o.payment} /></span>
                  <span><Pill cfg={SHIP_CONFIG}    value={o.shipping} /></span>
                  <span className={styles.dateCell}>
                    {new Date(o.date).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })}
                  </span>
                  <span className={styles.actCell}>
                    <button className={styles.iconActBtn} title="View"     onClick={() => setSelectedOrder(o)}><Ic d={ICON.eye}      size={13} /></button>
                    <button className={styles.iconActBtn} title="Edit"     onClick={() => setSelectedOrder(o)}><Ic d={ICON.edit}     size={13} /></button>
                    <button className={styles.iconActBtn} title="Download">                                   <Ic d={ICON.download} size={13} /></button>
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.pagination}>
              <div className={styles.perPageRow}>
                Show
                <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className={styles.perPageSelect}>
                  {[10,25,50,100].map(n => <option key={n}>{n}</option>)}
                </select>
                Entries
              </div>
              <div className={styles.pgBtns}>
                {['←','1','→'].map(p => (
                  <button key={p} className={`${styles.pgBtn} ${p==='1'?styles.pgBtnActive:''}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ABANDONED TAB ── */}
        {tab === 'abandoned' && (
          <div className={styles.tableSection}>
            <div className={styles.infoAlert}>
              <Ic d={ICON.alert} size={14} />
              <span>
                <strong>{abandoned.length} abandoned carts</strong> with a combined value of{' '}
                <strong>{fmt(abandoned.reduce((a,c) => a+c.cartValue, 0))}</strong>.
                Send reminders to recover these sales.
              </span>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHead} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
                <span>Customer</span><span>Cart Value</span><span>Stage</span>
                <span>Abandoned At</span><span>Items</span><span>Actions</span>
              </div>
              {abandoned.map(a => (
                <div key={a.id} className={styles.tableRow} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
                  <span className={styles.orderCell}>
                    <div className={styles.custAvatar} style={{ width:32, height:32, fontSize:11 }}>
                      {initials(a.customer)}
                    </div>
                    <div>
                      <div className={styles.orderCust} style={{ fontWeight:600 }}>{a.customer}</div>
                      <div className={styles.orderChan}>{a.email}</div>
                    </div>
                  </span>
                  <span className={styles.orderTotal}>{fmt(a.cartValue)}</span>
                  <span>
                    <span style={{ background:'#FFF7ED', color:'#C2410C', padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600 }}>
                      {a.stage}
                    </span>
                  </span>
                  <span style={{ fontSize:12, color:'var(--ink3)' }}>{a.abandonedAt}</span>
                  <span style={{ fontSize:12, color:'var(--ink2)' }}>
                    {a.items.slice(0,2).map((item,i) => <div key={i}>{item.qty}× {item.name}</div>)}
                    {a.items.length > 2 && <div style={{ color:'var(--ink4)' }}>+{a.items.length-2} more</div>}
                  </span>
                  <span className={styles.actCell}>
                    <button
                      className={`${styles.remindBtn} ${reminderSent[a.id]?styles.remindBtnSent:''}`}
                      onClick={() => sendReminder(a.id)}>
                      {reminderSent[a.id]
                        ? <><Ic d={ICON.check} size={12} /> Sent ({reminderSent[a.id]})</>
                        : <><Ic d={ICON.mail}  size={12} /> Remind</>
                      }
                    </button>
                    <button className={styles.iconActBtn} title="Call">
                      <Ic d={ICON.phone} size={13} />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div className={styles.tableSection}>
            <div className={styles.reviewsSummary}>
              <div className={styles.ratingBig}>
                <div className={styles.ratingNum}>{avgRating}</div>
                <div className={styles.ratingStars}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color:Number(avgRating)>=s?'#F59E0B':'#E5E7EB', fontSize:20 }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize:12, color:'var(--ink3)' }}>{reviews.length} reviews</div>
              </div>
              <div className={styles.ratingBars}>
                {[5,4,3,2,1].map(r => {
                  const count = reviews.filter(x => x.rating===r).length
                  const pct   = reviews.length ? Math.round((count/reviews.length)*100) : 0
                  return (
                    <div key={r} className={styles.ratingBarRow}>
                      <span style={{ fontSize:12, color:'var(--ink3)', width:8 }}>{r}</span>
                      <span style={{ fontSize:11, color:'#F59E0B' }}>★</span>
                      <div className={styles.ratingBarBg}>
                        <div className={styles.ratingBarFill} style={{ width:`${pct}%` }} />
                      </div>
                      <span style={{ fontSize:12, color:'var(--ink3)', width:24 }}>{count}</span>
                    </div>
                  )
                })}
              </div>
              <div className={styles.reviewStatusBreakdown}>
                {[
                  { label:'Published', count:reviews.filter(r=>r.status==='published').length, color:'#059669', bg:'#ECFDF5' },
                  { label:'Pending',   count:reviews.filter(r=>r.status==='pending').length,   color:'#D97706', bg:'#FFFBEB' },
                  { label:'Flagged',   count:reviews.filter(r=>r.status==='flagged').length,   color:'#DC2626', bg:'#FEF2F2' },
                ].map(s => (
                  <div key={s.label} className={styles.reviewStatusCard} style={{ background:s.bg }}>
                    <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.count}</div>
                    <div style={{ fontSize:11.5, color:s.color, fontWeight:500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.reviewsList}>
              {reviews.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div className={styles.custAvatar} style={{ background:'#1a1a2e', color:'#E8C547' }}>
                        {initials(r.customer)}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:14, color:'var(--ink)' }}>{r.customer}</div>
                        <div style={{ fontSize:11.5, color:'var(--ink3)' }}>{r.orderId} · {r.product}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color:r.rating>=s?'#F59E0B':'#E5E7EB', fontSize:16 }}>★</span>
                        ))}
                      </div>
                      <span style={{
                        background:r.status==='published'?'#ECFDF5':r.status==='pending'?'#FFFBEB':'#FEF2F2',
                        color:r.status==='published'?'#059669':r.status==='pending'?'#D97706':'#DC2626',
                        padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, textTransform:'capitalize',
                      }}>{r.status}</span>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                  <div className={styles.reviewFoot}>
                    <span style={{ fontSize:12, color:'var(--ink4)' }}>
                      {new Date(r.date).toLocaleDateString('en-NG', { dateStyle:'medium' })}
                    </span>
                    <div style={{ display:'flex', gap:6 }}>
                      {r.status !== 'published' && (
                        <button className={styles.actBtn}
                          onClick={() => setReviews(rs => rs.map(x => x.id===r.id ? { ...x, status:'published' } : x))}>
                          <Ic d={ICON.check} size={12} /> Publish
                        </button>
                      )}
                      {r.status !== 'flagged' && (
                        <button className={styles.actBtnWarn}
                          onClick={() => setReviews(rs => rs.map(x => x.id===r.id ? { ...x, status:'flagged' } : x))}>
                          <Ic d={ICON.alert} size={12} /> Flag
                        </button>
                      )}
                      <button className={styles.actBtnRed}
                        onClick={() => setReviews(rs => rs.filter(x => x.id !== r.id))}>
                        <Ic d={ICON.trash} size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
        />
      )}
      {showCreate && (
        <CreateOrderModal
          onClose={() => setShowCreate(false)}
          onSave={createOrder}
        />
      )}
    </div>
  )
}
