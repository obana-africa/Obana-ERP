import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Dashboard.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Animated counter ──────────────────────────────────────────── */
function Counter({ target, prefix = '', suffix = '', decimals = 0, duration = 1200 }) {
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

  const display = decimals > 0
    ? val.toFixed(decimals)
    : Math.round(val).toLocaleString()

  return <>{prefix}{display}{suffix}</>
}

/* ── Spark line (pure CSS zig zag) ─────────────────────────────────── */
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
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      {/* Filled area under the line */}
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        opacity="0.08"
        stroke="none"
      />
    </svg>
  )
}


/* ── Mini donut ─────────────────────────────────────────────────── */
function MiniDonut({ pct, color }) {
  const r = 18, circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={44} height={44} viewBox="0 0 44 44">
      <circle cx={22} cy={22} r={r} fill="none" stroke="#E5E7EB" strokeWidth={5} />
      <circle cx={22} cy={22} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
        strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x={22} y={27} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>{pct}%</text>
    </svg>
  )
}

/* ── Status badge ────────────────────────────────────────────────── */
const STATUS = {
  Paid:       { bg: '#ECFDF5', color: '#059669' },
  Pending:    { bg: '#FFFBEB', color: '#D97706' },
  Processing: { bg: '#EFF6FF', color: '#2563EB' },
  Cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
  Fulfilled:  { bg: '#F0FDF4', color: '#16A34A' },
  Refunded:   { bg: '#F5F3FF', color: '#7C3AED' },
}

const StatusBadge = ({ s }) => (
  <span className={styles.statusBadge} style={{ background: STATUS[s]?.bg, color: STATUS[s]?.color }}>
    {s}
  </span>
)

/* ── Data ────────────────────────────────────────────────────────── */
const SPARK_REVENUE  = [42, 58, 45, 70, 63, 88, 74, 95, 82, 110, 98, 127]
const SPARK_ORDERS   = [8, 12, 9, 15, 11, 18, 14, 20, 17, 23, 19, 27]
const SPARK_SESSIONS = [210, 280, 195, 340, 290, 410, 360, 445, 390, 520, 470, 610]
const SPARK_CONV     = [0.28, 0.31, 0.27, 0.34, 0.30, 0.38, 0.33, 0.41, 0.36, 0.44, 0.39, 0.45]

const METRICS = [
  {
    id: 'revenue', label: 'Gross Revenue', value: 3910000, prefix: '₦', suffix: '',
    display: '₦3.91M', change: 29, up: true, route: '/analytics',
    spark: SPARK_REVENUE, color: '#2DBD97',
    icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    desc: 'vs last period',
  },
  {
    id: 'orders', label: 'Total Orders', value: 94, prefix: '', suffix: '',
    display: '94', change: 18, up: true, route: '/orders',
    spark: SPARK_ORDERS, color: '#1b3b5f',
    icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
    desc: 'vs last period',
  },
  {
    id: 'sessions', label: 'Store Sessions', value: 1209, prefix: '', suffix: '',
    display: '1,209', change: 28, up: true, route: '/analytics',
    spark: SPARK_SESSIONS, color: '#E8C547',
    icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    desc: 'unique visitors',
  },
  {
    id: 'conversion', label: 'Conversion Rate', value: 0.33, prefix: '', suffix: '%',
    display: '0.33%', change: 0, up: null, route: '/analytics',
    spark: SPARK_CONV, color: '#9CA3AF',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
    desc: 'no change',
  },
  {
    id: 'inventory', label: 'Inventory Value', value: 8420000, prefix: '₦', suffix: '',
    display: '₦8.42M', change: -4, up: false, route: '/inventory',
    spark: [88, 92, 85, 78, 82, 74, 69, 72, 68, 75, 71, 67], color: '#EF4444',
    icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
    desc: 'stock declining',
  },
  {
    id: 'pos', label: 'POS Revenue', value: 1240000, prefix: '₦', suffix: '',
    display: '₦1.24M', change: 11, up: true, route: '/pos',
    spark: [30, 44, 38, 52, 41, 63, 55, 71, 60, 78, 68, 85], color: '#8B5CF6',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z',
    desc: 'in-store sales',
  },
]

const RECENT_ORDERS = [
  { id: '#1042', customer: 'Amaka Obi',    amount: 12500,  status: 'Paid',       time: '2 min ago',  channel: 'Online' },
  { id: '#1041', customer: 'Emeka Dike',   amount: 8200,   status: 'Pending',    time: '14 min ago', channel: 'POS'    },
  { id: '#1040', customer: 'Fatima Bello', amount: 3600,   status: 'Fulfilled',  time: '1 hr ago',   channel: 'Online' },
  { id: '#1039', customer: 'Chidi Okeke',  amount: 22000,  status: 'Paid',       time: '2 hr ago',   channel: 'Online' },
  { id: '#1038', customer: 'Ngozi Adeyemi',amount: 5400,   status: 'Processing', time: '3 hr ago',   channel: 'POS'    },
]

const TOP_PRODUCTS = [
  { name: 'Classic Ankara Dress',   sold: 47, revenue: 658000, stock: 12, pct: 85 },
  { name: 'Leather Crossbody Bag',  sold: 34, revenue: 442000, stock: 8,  pct: 62 },
  { name: "Men's Kaftan Set",        sold: 26, revenue: 364000, stock: 21, pct: 48 },
  { name: 'Premium Shea Butter',    sold: 19, revenue: 190000, stock: 44, pct: 34 },
  { name: 'Adire Print Sneakers',   sold: 15, revenue: 285000, stock: 6,  pct: 27 },
]

const LOW_STOCK = [
  { name: 'Leather Crossbody Bag',  stock: 3,  threshold: 10, sku: 'LCB-001' },
  { name: 'Adire Print Sneakers',   stock: 6,  threshold: 10, sku: 'APS-042' },
  { name: 'Silk Headwrap – Navy',   stock: 2,  threshold: 5,  sku: 'SHW-007' },
  { name: 'Classic Ankara Dress',   stock: 12, threshold: 15, sku: 'CAD-019' },
]

const SALES_CHANNELS = [
  { label: 'Online Store', pct: 62, color: '#1b3b5f', amount: '₦2.42M' },
  { label: 'Point of Sale', pct: 28, color: '#2DBD97', amount: '₦1.24M' },
  { label: 'Wholesale',    pct: 10, color: '#E8C547', amount: '₦249K'  },
]

const QUICK_ACTIONS = [
  { label: 'Add product',    icon: 'M12 5v14M5 12h14', to: '/products',   state: { openModal: 'add' },    color: '#1b3b5f' },
  { label: 'New order',      icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M12 12h.01M12 16h.01', to: '/orders',    state: { openModal: 'create' }, color: '#2DBD97' },
  { label: 'Create discount', icon: 'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0', to: '/discounts', state: null,                    color: '#E8C547' },
  { label: 'View analytics', icon: 'M18 20V10M12 20V4M6 20v-6', to: '/analytics', state: null,                    color: '#8B5CF6' },
  { label: 'Open POS',       icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z', to: '/pos', state: null, color: '#EF4444' },
  { label: 'Export report',  icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3', to: '/analytics', state: { openExport: true }, color: '#059669' },
]

const PERIODS = ['Today', 'Last 7 days', 'Last 30 days', 'Last 90 days']

const fmt = (n) => `₦${Number(n).toLocaleString()}`

/* ════════════════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [period, setPeriod] = useState('Last 30 days')
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className={`${styles.page} ${visible ? styles.pageVisible : ''}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.greeting}>{greeting} 👋</h1>
          <p className={styles.sub}>Here's what's happening with your store today.</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.periodTabs}>
            {PERIODS.map(p => (
              <button key={p}
                className={`${styles.periodBtn} ${period === p ? styles.periodBtnOn : ''}`}
                onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Alert strips ───────────────────────────────────────── */}
      <div className={styles.alertStrip}>
        {[
          { dot: '#EF4444', msg: '21 orders need fulfilment', route: '/orders',    border: '#EF4444' },
          { dot: '#F59E0B', msg: '4 products critically low on stock', route: '/inventory', border: '#F59E0B' },
          { dot: '#2DBD97', msg: '₦50,000+ in uncaptured payments', route: '/orders', border: '#2DBD97' },
        ].map((a, i) => (
          <button key={i} className={styles.alert}
            style={{ borderLeftColor: a.border, animationDelay: `${i * 80}ms` }}
            onClick={() => navigate(a.route)}>
            <span className={styles.alertDot} style={{ background: a.dot }} />
            <span className={styles.alertMsg}>{a.msg}</span>
            <Ic d="M9 18l6-6-6-6" size={14} stroke={a.dot} />
          </button>
        ))}
      </div>

      {/* ── KPI Metrics ────────────────────────────────────────── */}
      <div className={styles.metrics}>
        {METRICS.map((m, i) => (
          <div key={m.id}
            className={styles.metricCard}
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => navigate(m.route)}
            role="button" tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && navigate(m.route)}>

            <div className={styles.metricTop}>
              <div className={styles.metricIconWrap} style={{ background: `${m.color}18` }}>
                <Ic d={m.icon} size={16} stroke={m.color} />
              </div>
              {m.up !== null ? (
                <span className={`${styles.metricBadge} ${m.up ? styles.metricUp : styles.metricDown}`}>
                  <Ic d={m.up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={10} stroke="currentColor" />
                  {Math.abs(m.change)}%
                </span>
              ) : (
                <span className={styles.metricFlat}>—</span>
              )}
            </div>

            <div className={styles.metricBody}>
              <p className={styles.metricLabel}>{m.label}</p>
              <p className={styles.metricValue} style={{ color: m.color }}>
                <Counter target={parseFloat(m.display.replace(/[^0-9.]/g, ''))}
                  prefix={m.display.startsWith('₦') ? '₦' : ''}
                  suffix={m.display.endsWith('%') ? '%' : m.display.endsWith('M') ? 'M' : ''}
                  decimals={m.display.includes('.') && !m.display.endsWith('M') ? 2 : m.display.endsWith('M') ? 2 : 0}
                />
              </p>
              <p className={styles.metricDesc}>{m.desc}</p>
            </div>

            <SparkLine data={m.spark} color={m.color} />

            <div className={styles.metricFooter}>
              <span>View details</span>
              <Ic d="M9 18l6-6-6-6" size={12} stroke="#9CA3AF" />
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────────────────── */}
      <div className={styles.mainGrid}>

        {/* Recent Orders */}
        <div className={styles.card} style={{ animationDelay: '360ms' }}>
          <div className={styles.cardHead}>
            <div>
              <h3 className={styles.cardTitle}>Recent Orders</h3>
              <p className={styles.cardSub}>Last 5 transactions</p>
            </div>
            <button className={styles.viewAllBtn} onClick={() => navigate('/orders')}>
              View all <Ic d="M9 18l6-6-6-6" size={12} stroke="#2DBD97" />
            </button>
          </div>

          <div className={styles.orderTable}>
            <div className={styles.orderHeader}>
              <span>Order</span>
              <span>Customer</span>
              <span>Channel</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Time</span>
            </div>
            {RECENT_ORDERS.map((o, i) => (
              <div key={o.id} className={styles.orderRow}
                style={{ animationDelay: `${380 + i * 50}ms` }}
                onClick={() => navigate('/orders')}>
                <span className={styles.orderId}>{o.id}</span>
                <span className={styles.orderCustomer}>{o.customer}</span>
                <span className={`${styles.channelTag} ${o.channel === 'POS' ? styles.channelPOS : styles.channelOnline}`}>
                  {o.channel}
                </span>
                <span className={styles.orderAmt}>{fmt(o.amount)}</span>
                <StatusBadge s={o.status} />
                <span className={styles.orderTime}>{o.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>

          {/* Sales by channel */}
          <div className={styles.card} style={{ animationDelay: '420ms' }}>
            <div className={styles.cardHead}>
              <div>
                <h3 className={styles.cardTitle}>Sales by Channel</h3>
                <p className={styles.cardSub}>Revenue distribution</p>
              </div>
              <button className={styles.viewAllBtn} onClick={() => navigate('/analytics')}>
                Analytics <Ic d="M9 18l6-6-6-6" size={12} stroke="#2DBD97" />
              </button>
            </div>
            <div className={styles.channelList}>
              {SALES_CHANNELS.map((c, i) => (
                <div key={c.label} className={styles.channelRow}>
                  <div className={styles.channelInfo}>
                    <MiniDonut pct={c.pct} color={c.color} />
                    <div>
                      <p className={styles.channelName}>{c.label}</p>
                      <p className={styles.channelAmt}>{c.amount}</p>
                    </div>
                  </div>
                  <div className={styles.channelBarWrap}>
                    <div className={styles.channelBar}
                      style={{ width: `${c.pct}%`, background: c.color, animationDelay: `${450 + i * 100}ms` }} />
                    <span className={styles.channelPct}>{c.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className={styles.card} style={{ animationDelay: '480ms' }}>
            <h3 className={styles.cardTitle}>Quick Actions</h3>
            <div className={styles.quickGrid}>
              {QUICK_ACTIONS.map((a, i) => (
                <button key={a.label} className={styles.quickBtn}
                  style={{ animationDelay: `${500 + i * 40}ms` }}
                  onClick={() => navigate(a.to, a.state ? { state: a.state } : undefined)}>
                  <span className={styles.quickIcon} style={{ background: `${a.color}18` }}>
                    <Ic d={a.icon} size={15} stroke={a.color} />
                  </span>
                  <span className={styles.quickLabel}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom grid ────────────────────────────────────────── */}
      <div className={styles.bottomGrid}>

        {/* Top products */}
        <div className={styles.card} style={{ animationDelay: '540ms' }}>
          <div className={styles.cardHead}>
            <div>
              <h3 className={styles.cardTitle}>Top Products</h3>
              <p className={styles.cardSub}>By revenue this period</p>
            </div>
            <button className={styles.viewAllBtn} onClick={() => navigate('/products')}>
              View all <Ic d="M9 18l6-6-6-6" size={12} stroke="#2DBD97" />
            </button>
          </div>
          <div className={styles.productTable}>
            <div className={styles.productHeader}>
              <span>Product</span><span>Sold</span><span>Revenue</span><span>Stock</span>
            </div>
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className={styles.productRow}
                style={{ animationDelay: `${560 + i * 50}ms` }}
                onClick={() => navigate('/products')}>
                <div className={styles.productName}>
                  <div className={styles.productBar}>
                    <div className={styles.productBarFill}
                      style={{ width: `${p.pct}%`, animationDelay: `${580 + i * 50}ms` }} />
                  </div>
                  <span>{p.name}</span>
                </div>
                <span className={styles.productSold}>{p.sold}</span>
                <span className={styles.productRevenue}>{fmt(p.revenue)}</span>
                <span className={`${styles.productStock} ${p.stock < 10 ? styles.stockLow : ''}`}>
                  {p.stock} units
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className={styles.card} style={{ animationDelay: '600ms' }}>
          <div className={styles.cardHead}>
            <div>
              <h3 className={styles.cardTitle}>Low Stock Alerts</h3>
              <p className={styles.cardSub}>{LOW_STOCK.length} items need restocking</p>
            </div>
            <button className={styles.viewAllBtn} onClick={() => navigate('/inventory')}>
              Inventory <Ic d="M9 18l6-6-6-6" size={12} stroke="#2DBD97" />
            </button>
          </div>
          <div className={styles.stockList}>
            {LOW_STOCK.map((s, i) => {
              const pct = Math.round((s.stock / s.threshold) * 100)
              const critical = s.stock <= 5
              return (
                <div key={s.sku} className={styles.stockRow}
                  style={{ animationDelay: `${620 + i * 60}ms` }}
                  onClick={() => navigate('/inventory')}>
                  <div className={styles.stockInfo}>
                    <p className={styles.stockName}>{s.name}</p>
                    <p className={styles.stockSku}>{s.sku}</p>
                    <div className={styles.stockBarTrack}>
                      <div className={styles.stockBarFill}
                        style={{ width: `${pct}%`, background: critical ? '#EF4444' : '#F59E0B',
                          animationDelay: `${640 + i * 60}ms` }} />
                    </div>
                  </div>
                  <div className={styles.stockRight}>
                    <span className={`${styles.stockCount} ${critical ? styles.stockCritical : styles.stockWarn}`}>
                      {s.stock}
                    </span>
                    <span className={styles.stockThreshold}>/ {s.threshold}</span>
                    <span className={`${styles.stockLabel} ${critical ? styles.stockLabelCrit : styles.stockLabelWarn}`}>
                      {critical ? 'Critical' : 'Low'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
          <button className={styles.restockBtn} onClick={() => navigate('/inventory')}>
            Restock all low items →
          </button>
        </div>

      </div>
    </div>
  )
}
