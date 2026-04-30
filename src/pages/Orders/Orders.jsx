import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Orders.module.css'
import { fmt, fmtD } from '../../utils/formatters'
import {
  SAMPLE_ORDERS, ABANDONED, REVIEWS,
  STATUS_CONFIG, PAYMENT_CONFIG, SHIP_CONFIG,
} from '../../data/orders'
import OrderModal       from './components/OrderModal'
import CreateOrderModal from './components/CreateOrderModal'

/* ─────────────────────────────────────────────────────────────────
   Icon
───────────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none', style: s }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...s }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ─────────────────────────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────────────────────────── */
function Counter({ target, prefix = '', suffix = '', decimals = 0, duration = 1100 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const start = performance.now()
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ''))
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(eased * num)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  const display = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString()
  return <>{prefix}{display}{suffix}</>
}

/* ─────────────────────────────────────────────────────────────────
   Spark line
───────────────────────────────────────────────────────────────── */
function SparkLine({ data, color }) {
  const w = 80, h = 28
  const min = Math.min(...data)
  const max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={styles.spark}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.10" stroke="none" />
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Status pill
───────────────────────────────────────────────────────────────── */
const Pill = ({ cfg, value }) => {
  const c = cfg[value] || { label: value, bg: '#F3F4F6', color: '#6B7280' }
  return (
    <span style={{
      background: c.bg, color: c.color, padding: '3px 10px',
      borderRadius: 20, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap',
      display: 'inline-flex', alignItems: 'center',
    }}>{c.label}</span>
  )
}

const initials = name => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

/* ─────────────────────────────────────────────────────────────────
   Dropdown menu — portal-based so it escapes overflow:hidden parents
───────────────────────────────────────────────────────────────── */
function DropdownMenu({ trigger, items, align = 'right' }) {
  const [open, setOpen]   = useState(false)
  const [pos,  setPos]    = useState({ top: 0, left: 0, width: 0 })
  const triggerRef        = useRef(null)
  const menuRef           = useRef(null)

  // Recalculate position every time the dropdown opens
  const recalc = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + window.scrollY + 6, right: window.innerWidth - r.right, left: r.left })
  }, [])

  const handleOpen = () => {
    recalc()
    setOpen(o => !o)
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (
        menuRef.current    && !menuRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Close on scroll / resize so position doesn't go stale
  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => { window.removeEventListener('scroll', close, true); window.removeEventListener('resize', close) }
  }, [open])

  const menuStyle = {
    position:  'fixed',
    top:       pos.top,
    zIndex:    99999,
    minWidth:  220,
    ...(align === 'right'
      ? { right: window.innerWidth - pos.left - (triggerRef.current?.offsetWidth ?? 0) }
      : { left: pos.left }
    ),
  }

  const menuContent = (
    <div ref={menuRef} className={styles.dropMenu} style={menuStyle}>
      {items.map((item, i) => {
        if (item.type === 'divider') return <div key={i} className={styles.dropDivider} />
        if (item.type === 'label')   return <div key={i} className={styles.dropLabel}>{item.text}</div>
        return (
          <button key={i}
            className={`${styles.dropItem} ${item.danger ? styles.dropItemDanger : ''}`}
            onClick={() => { item.onClick?.(); setOpen(false) }}
            disabled={item.disabled}>
            {item.icon && (
              <span className={styles.dropItemIcon}>
                <Ic d={item.icon} size={14} stroke="currentColor" />
              </span>
            )}
            <span className={styles.dropItemContent}>
              <span className={styles.dropItemLabel}>{item.label}</span>
              {item.sub && <span className={styles.dropItemSub}>{item.sub}</span>}
            </span>
            {item.badge && <span className={styles.dropItemBadge}>{item.badge}</span>}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className={styles.dropWrap} ref={triggerRef}>
      <div onClick={handleOpen}>{trigger(open)}</div>
      {open && createPortal(menuContent, document.body)}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Icon paths
───────────────────────────────────────────────────────────────── */
const ICON = {
  orders:   ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', 'M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2'],
  naira:    ['M2 8h20', 'M2 16h20', 'M6 4v16', 'M18 4v16'],
  check:    'M20 6L9 17l-5-5',
  unpaid:   ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  plus:     'M12 5v14M5 12h14',
  search:   'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  calendar: ['M3 9h18', 'M8 3v4', 'M16 3v4', 'M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  upload:   ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  trash:    ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'],
  alert:    ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  refresh:  ['M1 4v6h6', 'M23 20v-6h-6', 'M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'],
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13',
  chevDown: 'M6 9l6 6 6-6',
  arrowR:   'M9 18l6-6-6-6',
  trending: ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  tag:      ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
  truck:    ['M1 3h15v13H1z', 'M16 8h4l3 3v5h-7V8z', 'M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z', 'M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z'],
  file:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  printer:  ['M6 9V2h12v7', 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2', 'M6 14h12v8H6z'],
  barChart: 'M18 20V10M12 20V4M6 20v-6',
  users:    ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  grid:     ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  copy:     ['M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z', 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
  slash:    ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z', 'M4.93 4.93l14.14 14.14'],
  dots:     'M5 12h.01M12 12h.01M19 12h.01',
  discount: ['M19 5L5 19', 'M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0'],
}

/* ─────────────────────────────────────────────────────────────────
   Spark data
───────────────────────────────────────────────────────────────── */
const SPARK = {
  total:     [22, 28, 24, 31, 27, 35, 30, 38, 33, 41, 37, 45],
  owed:      [120, 180, 95, 210, 160, 240, 190, 280, 220, 310, 260, 340],
  completed: [15, 20, 17, 24, 21, 28, 23, 31, 26, 34, 29, 38],
  unpaid:    [8, 5, 10, 6, 9, 4, 7, 11, 5, 8, 6, 9],
}

/* ═════════════════════════════════════════════════════════════════
   ORDERS PAGE
═════════════════════════════════════════════════════════════════ */
export default function Orders() {
  const navigate = useNavigate()
  const location = useLocation()

  const [tab,            setTab]           = useState('orders')
  const [orders,         setOrders]        = useState(SAMPLE_ORDERS)
  const [abandoned]                        = useState(ABANDONED)
  const [reviews,        setReviews]       = useState(REVIEWS)
  const [search,         setSearch]        = useState('')
  const [dateFrom,       setDateFrom]      = useState('')
  const [dateTo,         setDateTo]        = useState('')
  const [filterStatus,   setFilterStatus]  = useState('all')
  const [filterPayment,  setFilterPayment] = useState('all')
  const [showDatePicker, setShowDatePicker]= useState(false)
  const [selectedOrder,  setSelectedOrder] = useState(null)
  const [showCreate,     setShowCreate]    = useState(false)
  const [selected,       setSelected]      = useState([])
  const [perPage,        setPerPage]       = useState(25)
  const [reminderSent,   setReminderSent]  = useState({})
  const [visible,        setVisible]       = useState(false)
  const [sortKey,        setSortKey]       = useState(null)
  const [sortDir,        setSortDir]       = useState('asc')
  const [page,           setPage]          = useState(1)
  const [toast,          setToast]         = useState(null)

  // Handle navigation state (e.g. Dashboard "New order" quick action opens modal)
  useEffect(() => {
    if (location.state?.openModal === 'create') {
      setShowCreate(true)
      window.history.replaceState({}, '')
    }
  }, [location.state])

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Auto-dismiss toast after 3.2s
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  /* ── Derived stats ─────────────────────────────────────────────── */
  const totalOrders     = orders.length
  const amountOwed      = orders.filter(o => o.payment !== 'paid').reduce((a, o) => a + o.total, 0)
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const unpaidOrders    = orders.filter(o => o.payment === 'unpaid').length

  /* ── Filtering + sorting ───────────────────────────────────────── */
  let filtered = orders.filter(o => {
    const q  = search.toLowerCase()
    const ms = o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
    const mt = filterStatus  === 'all' || o.status  === filterStatus
    const mp = filterPayment === 'all' || o.payment === filterPayment
    const md = (!dateFrom || o.date >= dateFrom) && (!dateTo || o.date <= dateTo)
    return ms && mt && mp && md
  })

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey]
      if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase() }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage)

  /* ── Actions ───────────────────────────────────────────────────── */
  const toggleSelect = id  => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll    = ()  => setSelected(s => s.length === paginated.length ? [] : paginated.map(o => o.id))
  const updateStatus = (id, status, shipping) =>
    setOrders(os => os.map(o => o.id === id ? { ...o, status, shipping } : o))
  const createOrder  = data => { setOrders(os => [...os, data]); showToast('Order created successfully') }
  const sendReminder = id  => { setReminderSent(r => ({ ...r, [id]: (r[id] || 0) + 1 })); showToast('Reminder sent to customer') }

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  /* ── Stat cards ─────────────────────────────────────────────────── */
  const STATS = [
    {
      label: 'Total Orders',  value: totalOrders,       prefix: '', suffix: '',
      accent: '#2DBD97', icon: ICON.orders, spark: SPARK.total,
      change: 18, up: true, desc: 'vs last period',
      onClick: () => { setFilterStatus('all'); setFilterPayment('all') },
    },
    {
      label: 'Amount Owed',   value: amountOwed / 1000, prefix: '₦', suffix: 'K',
      accent: '#E8C547', icon: ICON.naira, spark: SPARK.owed,
      change: -8, up: false, desc: 'uncaptured revenue',
      onClick: () => { setFilterPayment('unpaid'); setTab('orders') },
    },
    {
      label: 'Completed',     value: completedOrders,   prefix: '', suffix: '',
      accent: '#1b3b5f', icon: ICON.check, spark: SPARK.completed,
      change: 22, up: true, desc: 'fulfilled orders',
      onClick: () => { setFilterStatus('completed'); setTab('orders') },
    },
    {
      label: 'Unpaid Orders', value: unpaidOrders,      prefix: '', suffix: '',
      accent: '#EF4444', icon: ICON.unpaid, spark: SPARK.unpaid,
      change: null, up: null, desc: 'awaiting payment',
      onClick: () => { setFilterPayment('unpaid'); setTab('orders') },
    },
  ]

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <Ic d="M8 9l4-4 4 4M16 15l-4 4-4-4" size={10} stroke="#C4C9D4" />
    return sortDir === 'asc'
      ? <Ic d="M18 15l-6-6-6 6" size={10} stroke="#1b3b5f" />
      : <Ic d="M6 9l6 6 6-6"    size={10} stroke="#1b3b5f" />
  }

  /* ── Export dropdown ───────────────────────────────────────────── */
  const exportItems = [
    { type: 'label', text: 'Export Orders' },
    {
      icon: ICON.file,     label: 'Export as CSV',
      sub: 'All filtered orders (.csv)',
      onClick: () => showToast('Exporting orders as CSV…'),
    },
    {
      icon: ICON.file,     label: 'Export as Excel',
      sub: 'Microsoft Excel (.xlsx)',
      onClick: () => showToast('Exporting orders as Excel…'),
    },
    {
      icon: ICON.printer,  label: 'Print Order List',
      sub: 'Send to printer',
      onClick: () => { showToast('Opening print dialog…'); setTimeout(() => window.print(), 300) },
    },
    { type: 'divider' },
    { type: 'label', text: 'Specific Reports' },
    {
      icon: ICON.truck,    label: 'Fulfilment Report',
      sub: 'Pending & processing only',
      onClick: () => showToast('Exporting fulfilment report…'),
    },
    {
      icon: ICON.naira,    label: 'Payment Summary',
      sub: 'Paid, unpaid & refunds',
      onClick: () => showToast('Exporting payment summary…'),
    },
    {
      icon: ICON.barChart, label: 'Full Analytics',
      sub: 'Go to analytics dashboard',
      onClick: () => navigate('/analytics'),
    },
  ]

  /* ── Import dropdown ───────────────────────────────────────────── */
  const importItems = [
    { type: 'label', text: 'Import Orders' },
    {
      icon: ICON.upload, label: 'Import from CSV',
      sub: 'Upload a .csv file',
      onClick: () => showToast('CSV import — coming soon'),
    },
    {
      icon: ICON.upload, label: 'Import from Excel',
      sub: 'Upload a .xlsx file',
      onClick: () => showToast('Excel import — coming soon'),
    },
    { type: 'divider' },
    { type: 'label', text: 'Sync & Connect' },
    {
      icon: ICON.refresh, label: 'Sync from POS',
      sub: 'Pull latest in-store orders',
      onClick: () => navigate('/pos'),
    },
    {
      icon: ICON.grid,    label: 'Connect Integration',
      sub: 'Shopify, WooCommerce, Paystack…',
      onClick: () => navigate('/integrations'),
    },
    { type: 'divider' },
    {
      icon: ICON.download, label: 'Download Template',
      sub: 'Get the CSV import template',
      onClick: () => showToast('Downloading import template…'),
    },
  ]

  /* ── Actions dropdown ──────────────────────────────────────────── */
  const actionsItems = [
    { type: 'label', text: `Bulk Actions${selected.length ? ` (${selected.length} selected)` : ''}` },
    {
      icon: ICON.truck,    label: 'Mark as Fulfilled',
      sub: selected.length ? `${selected.length} orders` : 'Select orders first',
      disabled: selected.length === 0,
      onClick: () => {
        selected.forEach(id => updateStatus(id, 'completed', 'delivered'))
        showToast(`${selected.length} orders marked as fulfilled`)
        setSelected([])
      },
    },
    {
      icon: ICON.mail,     label: 'Send Email Reminders',
      sub: selected.length ? `${selected.length} customers` : 'Select orders first',
      disabled: selected.length === 0,
      onClick: () => { showToast(`Reminders sent to ${selected.length} customers`); setSelected([]) },
    },
    {
      icon: ICON.download, label: 'Export Selected',
      sub: selected.length ? `${selected.length} orders as CSV` : 'Select orders first',
      disabled: selected.length === 0,
      onClick: () => { showToast(`Exporting ${selected.length} orders…`); setSelected([]) },
    },
    {
      icon: ICON.copy,     label: 'Duplicate Orders',
      sub: 'Create copies of selected',
      disabled: selected.length === 0,
      onClick: () => showToast('Duplicate — coming soon'),
    },
    { type: 'divider' },
    { type: 'label', text: 'Navigate' },
    {
      icon: ICON.tag,      label: 'Manage Discounts',
      sub: 'View & edit discount codes',
      onClick: () => navigate('/discounts'),
    },
    {
      icon: ICON.users,    label: 'Customer List',
      sub: 'Browse all customers',
      onClick: () => navigate('/customers'),
    },
    {
      icon: ICON.barChart, label: 'Order Analytics',
      sub: 'Revenue & trends',
      onClick: () => navigate('/analytics'),
    },
    {
      icon: ICON.settings, label: 'Order Settings',
      sub: 'Preferences & automation',
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' },
    {
      icon: ICON.trash, label: 'Delete Selected',
      sub: selected.length ? 'Cannot be undone' : 'Select orders first',
      disabled: selected.length === 0,
      danger: true,
      onClick: () => {
        const count = selected.length
        setOrders(os => os.filter(o => !selected.includes(o.id)))
        setSelected([])
        showToast(`${count} orders deleted`, 'error')
      },
    },
  ]

  /* ── Per-row more dropdown ─────────────────────────────────────── */
  const rowActions = (o) => [
    {
      icon: ICON.download, label: 'Download Invoice',
      onClick: () => showToast(`Invoice for ${o.id} downloading…`),
    },
    {
      icon: ICON.copy,     label: 'Duplicate Order',
      onClick: () => showToast('Duplicate — coming soon'),
    },
    {
      icon: ICON.mail,     label: 'Email Customer',
      onClick: () => navigate('/customers', { state: { emailTo: o.customer } }),
    },
    {
      icon: ICON.truck,    label: 'Track Shipment',
      onClick: () => navigate('/orders', { state: { trackOrder: o.id } }),
    },
    { type: 'divider' },
    {
      icon: ICON.trash,    label: 'Delete Order',
      danger: true,
      onClick: () => {
        setOrders(os => os.filter(x => x.id !== o.id))
        showToast(`Order ${o.id} deleted`, 'error')
      },
    },
  ]

  /* ── Abandoned row more dropdown ────────────────────────────────── */
  const abandonedActions = (a) => [
    {
      icon: ICON.phone,   label: 'Call Customer',
      onClick: () => showToast(`Calling ${a.customer}…`),
    },
    {
      icon: ICON.tag,     label: 'Send Discount Code',
      sub: 'Route to discounts',
      onClick: () => navigate('/discounts', { state: { prefillEmail: a.email } }),
    },
    {
      icon: ICON.users,   label: 'View Customer Profile',
      onClick: () => navigate('/customers', { state: { search: a.customer } }),
    },
    { type: 'divider' },
    {
      icon: ICON.slash,   label: 'Dismiss Cart',
      danger: true,
      onClick: () => showToast(`Cart dismissed for ${a.customer}`, 'error'),
    },
  ]

  return (
    <div className={`${styles.page} ${visible ? styles.pageVisible : ''}`}>

      {/* ── Toast notification ────────────────────────────────────── */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          <Ic
            d={toast.type === 'error' ? ICON.slash : ICON.check}
            size={14}
            stroke={toast.type === 'error' ? '#EF4444' : '#2DBD97'}
          />
          {toast.msg}
        </div>
      )}

      {/* ── Topbar ────────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pgTitle}>Orders</h1>
          <p className={styles.pgSub}>Manage, track and fulfil all your orders</p>
        </div>

        <div className={styles.topbarR}>

          {/* ── Import dropdown ─── */}
          <DropdownMenu
            align="right"
            trigger={(open) => (
              <button className={`${styles.btnOutline} ${open ? styles.btnOutlineActive : ''}`}>
                <Ic d={ICON.upload} size={13} />
                Import
                <Ic d={ICON.chevDown} size={11} stroke="#6B7280"
                  style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
              </button>
            )}
            items={importItems}
          />

          {/* ── Export dropdown ─── */}
          <DropdownMenu
            align="right"
            trigger={(open) => (
              <button className={`${styles.btnOutline} ${open ? styles.btnOutlineActive : ''}`}>
                <Ic d={ICON.download} size={13} />
                Export
                <Ic d={ICON.chevDown} size={11} stroke="#6B7280"
                  style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
              </button>
            )}
            items={exportItems}
          />

          {/* ── Actions dropdown ─── */}
          <DropdownMenu
            align="right"
            trigger={(open) => (
              <button className={`${styles.btnOutline} ${open ? styles.btnOutlineActive : ''}`}>
                Actions
                {selected.length > 0 && (
                  <span className={styles.actionsBadge}>{selected.length}</span>
                )}
                <Ic d={ICON.chevDown} size={11} stroke="#6B7280"
                  style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
              </button>
            )}
            items={actionsItems}
          />

          {/* ── Create Order ─── */}
          <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}>
            <Ic d={ICON.plus} size={14} stroke="#fff" /> Create Order
          </button>
        </div>
      </header>

      <div className={styles.content}>

        {/* ── KPI Stat Cards ──────────────────────────────────────── */}
        <div className={styles.statsRow}>
          {STATS.map((s, i) => (
            <div key={s.label} className={styles.statCard}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={s.onClick}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && s.onClick()}>
              <div className={styles.statTop}>
                <div className={styles.statIconWrap} style={{ background: `${s.accent}18` }}>
                  <Ic d={s.icon} size={15} stroke={s.accent} />
                </div>
                {s.up !== null ? (
                  <span className={`${styles.statBadge} ${s.up ? styles.statUp : styles.statDown}`}>
                    <Ic d={s.up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={9} stroke="currentColor" />
                    {Math.abs(s.change)}%
                  </span>
                ) : (
                  <span className={styles.statFlat}>—</span>
                )}
              </div>
              <div className={styles.statBody}>
                <p className={styles.statLbl}>{s.label}</p>
                <p className={styles.statVal} style={{ color: s.accent }}>
                  <Counter target={s.value} prefix={s.prefix} suffix={s.suffix} decimals={s.suffix === 'K' ? 1 : 0} />
                </p>
                <p className={styles.statDesc}>{s.desc}</p>
              </div>
              <SparkLine data={s.spark} color={s.accent} />
              <div className={styles.statFooter}>
                <span>View details</span>
                <Ic d={ICON.arrowR} size={11} stroke="#9CA3AF" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Tab bar ─────────────────────────────────────────────── */}
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {[
              { key: 'orders',    label: 'Recent Orders',   count: null },
              { key: 'abandoned', label: 'Abandoned Carts', count: abandoned.length },
              { key: 'reviews',   label: 'Reviews',         count: reviews.filter(r => r.status === 'pending').length },
            ].map(t => (
              <button key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabOn : ''}`}
                onClick={() => setTab(t.key)}>
                {t.label}
                {t.count !== null && <span className={styles.tabBadge}>{t.count}</span>}
              </button>
            ))}
          </div>
          <div className={styles.tabRight}>
            <span className={styles.countTxt}>
              <Ic d={ICON.refresh} size={12} />
              {filtered.length} of {orders.length} orders
            </span>
          </div>
        </div>

        {/* ══ ORDERS TAB ══════════════════════════════════════════════ */}
        {tab === 'orders' && (
          <div className={styles.tableSection}>
            {/* Controls */}
            <div className={styles.controls}>
              <div className={styles.filterGroup}>
                <select className={styles.filterSelect} value={filterStatus}
                  onChange={e => { setFilterStatus(e.target.value); setPage(1) }}>
                  <option value="all">All Status</option>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <select className={styles.filterSelect} value={filterPayment}
                  onChange={e => { setFilterPayment(e.target.value); setPage(1) }}>
                  <option value="all">All Payment</option>
                  {Object.entries(PAYMENT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <button className={`${styles.ctrlBtn} ${showDatePicker ? styles.ctrlBtnActive : ''}`}
                  onClick={() => setShowDatePicker(p => !p)}>
                  <Ic d={ICON.calendar} size={13} /> Date Range
                </button>
              </div>
              <div className={styles.searchBox}>
                <span className={styles.searchIco}><Ic d={ICON.search} size={13} /></span>
                <input
                  placeholder="Search by order ID or customer…"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                />
                {search && (
                  <button className={styles.searchClear} onClick={() => { setSearch(''); setPage(1) }}>✕</button>
                )}
              </div>
            </div>

            {/* Date picker */}
            {showDatePicker && (
              <div className={styles.datePicker}>
                <div className={styles.datePickerInner}>
                  <Ic d={ICON.calendar} size={14} stroke="#6B7280" />
                  <label>From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                  <label>To</label>
                  <input type="date" value={dateTo}   onChange={e => setDateTo(e.target.value)} />
                  <button className={styles.btnOutlineSm}
                    onClick={() => { setDateFrom(''); setDateTo(''); setShowDatePicker(false) }}>
                    Clear
                  </button>
                  <button className={styles.btnPrimarySmall} onClick={() => setShowDatePicker(false)}>
                    Apply
                  </button>
                </div>
              </div>
            )}

            {/* Bulk action bar */}
            {selected.length > 0 && (
              <div className={styles.bulkBar}>
                <span className={styles.bulkCount}>{selected.length} selected</span>
                <div className={styles.bulkActions}>
                  <button className={styles.bulkBtn}
                    onClick={() => { showToast(`Exporting ${selected.length} orders…`); setSelected([]) }}>
                    <Ic d={ICON.download} size={13} /> Export
                  </button>
                  <button className={styles.bulkBtn}
                    onClick={() => { showToast(`Reminders sent to ${selected.length} customers`); setSelected([]) }}>
                    <Ic d={ICON.mail} size={13} /> Send Reminder
                  </button>
                  <button className={styles.bulkBtn}
                    onClick={() => {
                      selected.forEach(id => updateStatus(id, 'completed', 'delivered'))
                      showToast(`${selected.length} orders marked as fulfilled`)
                      setSelected([])
                    }}>
                    <Ic d={ICON.check} size={13} /> Mark Fulfilled
                  </button>
                  <button className={`${styles.bulkBtn} ${styles.bulkBtnDanger}`}
                    onClick={() => {
                      const count = selected.length
                      setOrders(os => os.filter(o => !selected.includes(o.id)))
                      showToast(`${count} orders deleted`, 'error')
                      setSelected([])
                    }}>
                    <Ic d={ICON.trash} size={13} /> Delete
                  </button>
                </div>
                <button className={styles.bulkClear} onClick={() => setSelected([])}>✕ Clear</button>
              </div>
            )}

            {/* Table */}
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>
                  <input type="checkbox"
                    checked={selected.length === paginated.length && paginated.length > 0}
                    onChange={toggleAll} />
                </span>
                <span className={styles.sortCol} onClick={() => handleSort('id')}>
                  Order & Customer <SortIcon col="id" />
                </span>
                <span className={styles.sortCol} onClick={() => handleSort('total')}>
                  Total <SortIcon col="total" />
                </span>
                <span className={styles.sortCol} onClick={() => handleSort('status')}>
                  Status <SortIcon col="status" />
                </span>
                <span>Payment</span>
                <span>Shipping</span>
                <span className={styles.sortCol} onClick={() => handleSort('date')}>
                  Date <SortIcon col="date" />
                </span>
                <span></span>
              </div>

              {paginated.length === 0 ? (
                <div className={styles.noRecord}>
                  <div className={styles.emptyIcon}>
                    <Ic d={ICON.orders} size={32} stroke="#2DBD97" sw={1.2} />
                  </div>
                  <p className={styles.emptyTitle}>No orders found</p>
                  <p className={styles.emptySub}>Try adjusting your filters or search query</p>
                  <button className={styles.btnOutline} onClick={() => {
                    setSearch(''); setFilterStatus('all'); setFilterPayment('all')
                  }}>Clear filters</button>
                </div>
              ) : paginated.map((o, idx) => (
                <div key={o.id}
                  className={`${styles.tableRow} ${selected.includes(o.id) ? styles.tableRowSel : ''}`}
                  style={{ animationDelay: `${idx * 30}ms` }}>
                  <span>
                    <input type="checkbox"
                      checked={selected.includes(o.id)}
                      onChange={() => toggleSelect(o.id)} />
                  </span>
                  <span className={styles.orderCell}>
                    <div className={styles.orderNum} onClick={() => setSelectedOrder(o)}>{o.id}</div>
                    <div className={styles.orderCust}
                      title="View customer"
                      onClick={() => navigate('/customers', { state: { search: o.customer } })}>
                      {o.customer}
                    </div>
                    <div className={styles.orderChan}>{o.channel}</div>
                  </span>
                  <span className={styles.orderTotal}>{fmt(o.total)}</span>
                  <span><Pill cfg={STATUS_CONFIG}  value={o.status}  /></span>
                  <span><Pill cfg={PAYMENT_CONFIG} value={o.payment} /></span>
                  <span><Pill cfg={SHIP_CONFIG}    value={o.shipping}/></span>
                  <span className={styles.dateCell}>
                    {new Date(o.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className={styles.actCell}>
                    <button className={styles.iconActBtn} title="View" onClick={() => setSelectedOrder(o)}>
                      <Ic d={ICON.eye} size={13} />
                    </button>
                    <button className={styles.iconActBtn} title="Edit" onClick={() => setSelectedOrder(o)}>
                      <Ic d={ICON.edit} size={13} />
                    </button>
                    <DropdownMenu
                      align="right"
                      trigger={(open) => (
                        <button className={`${styles.iconActBtn} ${open ? styles.iconActBtnActive : ''}`} title="More options">
                          <Ic d={ICON.dots} size={13} sw={2.5} />
                        </button>
                      )}
                      items={rowActions(o)}
                    />
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div className={styles.perPageRow}>
                Show
                <select value={perPage} onChange={e => { setPerPage(Number(e.target.value)); setPage(1) }}
                  className={styles.perPageSelect}>
                  {[10, 25, 50, 100].map(n => <option key={n}>{n}</option>)}
                </select>
                per page ·{' '}
                <span style={{ color: '#1b3b5f', fontWeight: 600 }}>
                  {Math.min((page - 1) * perPage + 1, filtered.length)}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className={styles.pgBtns}>
                <button className={styles.pgBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>←</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pg = totalPages <= 5 ? i + 1
                    : page <= 3 ? i + 1
                    : page >= totalPages - 2 ? totalPages - 4 + i
                    : page - 2 + i
                  return (
                    <button key={pg}
                      className={`${styles.pgBtn} ${pg === page ? styles.pgBtnActive : ''}`}
                      onClick={() => setPage(pg)}>
                      {pg}
                    </button>
                  )
                })}
                <button className={styles.pgBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>→</button>
              </div>
            </div>
          </div>
        )}

        {/* ══ ABANDONED TAB ══════════════════════════════════════════ */}
        {tab === 'abandoned' && (
          <div className={styles.tableSection}>
            <div className={styles.abandonedStrip}>
              <div className={styles.aStrip}>
                <Ic d={ICON.alert} size={18} stroke="#D97706" />
                <div>
                  <strong>{abandoned.length} abandoned carts</strong>
                  <span> · Combined value: </span>
                  <strong>{fmt(abandoned.reduce((a, c) => a + c.cartValue, 0))}</strong>
                </div>
              </div>
              <div className={styles.aStripRight}>
                <span className={styles.recoveryHint}>
                  <Ic d={ICON.trending} size={14} stroke="#059669" />
                  Avg. recovery rate: 12–15% with timely reminders
                </span>
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
                <span>Customer</span><span>Cart Value</span><span>Stage</span>
                <span>Abandoned At</span><span>Items</span><span>Actions</span>
              </div>
              {abandoned.map((a, idx) => (
                <div key={a.id} className={styles.tableRow}
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr', animationDelay: `${idx * 40}ms` }}>
                  <span className={styles.orderCell}>
                    <div className={styles.custAvatar}>{initials(a.customer)}</div>
                    <div>
                      <div className={styles.orderCust}
                        style={{ fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => navigate('/customers', { state: { search: a.customer } })}>
                        {a.customer}
                      </div>
                      <div className={styles.orderChan}>{a.email}</div>
                    </div>
                  </span>
                  <span className={styles.orderTotal}>{fmt(a.cartValue)}</span>
                  <span>
                    <span style={{ background: '#FFF7ED', color: '#C2410C', padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
                      {a.stage}
                    </span>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{a.abandonedAt}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink2)' }}>
                    {a.items.slice(0, 2).map((item, i) => <div key={i}>{item.qty}× {item.name}</div>)}
                    {a.items.length > 2 && <div style={{ color: 'var(--ink4)' }}>+{a.items.length - 2} more</div>}
                  </span>
                  <span className={styles.actCell}>
                    <button
                      className={`${styles.remindBtn} ${reminderSent[a.id] ? styles.remindBtnSent : ''}`}
                      onClick={() => sendReminder(a.id)}>
                      {reminderSent[a.id]
                        ? <><Ic d={ICON.check} size={12} /> Sent ({reminderSent[a.id]})</>
                        : <><Ic d={ICON.mail}  size={12} /> Remind</>
                      }
                    </button>
                    <DropdownMenu
                      align="right"
                      trigger={(open) => (
                        <button className={`${styles.iconActBtn} ${open ? styles.iconActBtnActive : ''}`} title="More">
                          <Ic d={ICON.dots} size={13} sw={2.5} />
                        </button>
                      )}
                      items={abandonedActions(a)}
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ REVIEWS TAB ════════════════════════════════════════════ */}
        {tab === 'reviews' && (
          <div className={styles.tableSection}>
            <div className={styles.reviewsSummary}>
              <div className={styles.ratingBig}>
                <div className={styles.ratingNum}>{avgRating}</div>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <span key={s} style={{ color: Number(avgRating) >= s ? '#F59E0B' : '#E5E7EB', fontSize: 22 }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{reviews.length} total reviews</div>
              </div>
              <div className={styles.ratingBars}>
                {[5, 4, 3, 2, 1].map(r => {
                  const count = reviews.filter(x => x.rating === r).length
                  const pct   = reviews.length ? Math.round((count / reviews.length) * 100) : 0
                  return (
                    <div key={r} className={styles.ratingBarRow}>
                      <span style={{ fontSize: 12, color: 'var(--ink3)', width: 10 }}>{r}</span>
                      <span style={{ fontSize: 11, color: '#F59E0B' }}>★</span>
                      <div className={styles.ratingBarBg}>
                        <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--ink3)', width: 24 }}>{count}</span>
                    </div>
                  )
                })}
              </div>
              <div className={styles.reviewStatusBreakdown}>
                {[
                  { label: 'Published', count: reviews.filter(r => r.status === 'published').length, color: '#059669', bg: '#ECFDF5' },
                  { label: 'Pending',   count: reviews.filter(r => r.status === 'pending').length,   color: '#D97706', bg: '#FFFBEB' },
                  { label: 'Flagged',   count: reviews.filter(r => r.status === 'flagged').length,   color: '#DC2626', bg: '#FEF2F2' },
                ].map(s => (
                  <div key={s.label} className={styles.reviewStatusCard} style={{ background: s.bg }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: s.color, fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.count}</div>
                    <div style={{ fontSize: 11.5, color: s.color, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.reviewsList}>
              {reviews.map((r, idx) => (
                <div key={r.id} className={styles.reviewCard} style={{ animationDelay: `${idx * 50}ms` }}>
                  <div className={styles.reviewTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className={styles.custAvatar} style={{ background: '#1a1a2e', color: '#E8C547' }}>
                        {initials(r.customer)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--navy)', cursor: 'pointer' }}
                          onClick={() => navigate('/customers', { state: { search: r.customer } })}>
                          {r.customer}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink3)' }}>
                          <span style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                            onClick={() => { const o = orders.find(x => x.id === r.orderId); if (o) setSelectedOrder(o) }}>
                            {r.orderId}
                          </span>
                          {' · '}
                          <span style={{ cursor: 'pointer', textDecoration: 'underline dotted' }}
                            onClick={() => navigate('/products', { state: { search: r.product } })}>
                            {r.product}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>{[1,2,3,4,5].map(s => <span key={s} style={{ color: r.rating >= s ? '#F59E0B' : '#E5E7EB', fontSize: 16 }}>★</span>)}</div>
                      <span style={{
                        background: r.status === 'published' ? '#ECFDF5' : r.status === 'pending' ? '#FFFBEB' : '#FEF2F2',
                        color:      r.status === 'published' ? '#059669' : r.status === 'pending' ? '#D97706' : '#DC2626',
                        padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, textTransform: 'capitalize',
                      }}>{r.status}</span>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                  <div className={styles.reviewFoot}>
                    <span style={{ fontSize: 12, color: 'var(--ink4)' }}>
                      {new Date(r.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status !== 'published' && (
                        <button className={styles.actBtn}
                          onClick={() => { setReviews(rs => rs.map(x => x.id === r.id ? { ...x, status: 'published' } : x)); showToast('Review published') }}>
                          <Ic d={ICON.check} size={12} /> Publish
                        </button>
                      )}
                      {r.status !== 'flagged' && (
                        <button className={styles.actBtnWarn}
                          onClick={() => { setReviews(rs => rs.map(x => x.id === r.id ? { ...x, status: 'flagged' } : x)); showToast('Review flagged', 'error') }}>
                          <Ic d={ICON.alert} size={12} /> Flag
                        </button>
                      )}
                      <button className={styles.iconActBtn} title="View product"
                        onClick={() => navigate('/products', { state: { search: r.product } })}>
                        <Ic d={ICON.eye} size={13} />
                      </button>
                      <button className={styles.actBtnRed}
                        onClick={() => { setReviews(rs => rs.filter(x => x.id !== r.id)); showToast('Review deleted', 'error') }}>
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

      {/* ── Modals ──────────────────────────────────────────────────── */}
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
