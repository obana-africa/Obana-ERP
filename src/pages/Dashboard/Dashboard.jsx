import { useState } from 'react'
import styles from './Dashboard.module.css'
import { fmt } from '../../utils/formatters'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 14, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Static data — driven by Obana catalog ─────────────────
const PERIODS  = ['Last 30 days', 'Last 7 days', 'Today']
const CHANNELS = ['All channels', 'Online Store', 'Point of Sale']

const METRICS = [
  { label: 'Sessions',         value: '1,209', raw: null, change: 28,  up: true  },
  { label: 'Gross Sales',      value: '₦3.91M',raw: null, change: 29,  up: true  },
  { label: 'Orders',           value: '94',     raw: null, change: 18,  up: true  },
  { label: 'Conversion Rate',  value: '0.33%',  raw: null, change: 0,   up: null  },
]

const RECENT_ORDERS = [
  { id: '#1042', amount: 12500, status: 'Paid'      },
  { id: '#1041', amount: 8200,  status: 'Pending'   },
  { id: '#1040', amount: 3600,  status: 'Paid'      },
  { id: '#1039', amount: 22000, status: 'Paid'      },
]

const TOP_PRODUCTS = [
  { name: 'Classic Ankara Dress',   percent: 85 },
  { name: 'Leather Crossbody Bag',  percent: 62 },
  { name: "Men's Kaftan Set",        percent: 48 },
  { name: 'Premium Shea Butter',    percent: 34 },
]

const QUICK_ACTIONS = [
  { label: 'Add new product',  icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' },
  { label: 'Create discount',  icon: 'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0' },
  { label: 'View inventory',   icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  { label: 'Export reports',   icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3' },
]

const STATUS_CFG = {
  Paid:       { bg: '#ECFDF5', color: '#059669' },
  Pending:    { bg: '#FFFBEB', color: '#D97706' },
  Processing: { bg: '#EFF6FF', color: '#2563EB' },
  Cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
}

// ── Dashboard ─────────────────────────────────────────────
export default function Dashboard() {
  const [period,  setPeriod]  = useState('Last 30 days')
  const [channel, setChannel] = useState('All channels')

  return (
    <div className={styles.page}>

      {/* Greeting */}
      <div className={styles.greetRow}>
        <div>
          <h1 className={styles.greeting}>Good morning, let's get started.</h1>
          <p className={styles.sub}>Here's what's happening with your store today.</p>
        </div>
        <button className={styles.exportBtn}>
          <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
          Export
        </button>
      </div>

      {/* Period + channel filters */}
      <div className={styles.filterRow}>
        <div className={styles.periodTabs}>
          {PERIODS.map(p => (
            <button key={p}
              className={`${styles.filterBtn} ${period === p ? styles.filterBtnOn : ''}`}
              onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
        <select className={styles.channelSel} value={channel}
          onChange={e => setChannel(e.target.value)}>
          {CHANNELS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* KPI cards */}
      <div className={styles.metrics}>
        {METRICS.map(m => (
          <div key={m.label} className={styles.metricCard}>
            <p className={styles.metricLabel}>{m.label}</p>
            <p className={styles.metricValue}>{m.value}</p>
            {m.up === null ? (
              <span className={styles.metricFlat}>— no change</span>
            ) : (
              <span className={`${styles.metricChange} ${m.up ? styles.up : styles.down}`}>
                <Ic d={m.up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={11} stroke="currentColor" />
                {Math.abs(m.change)}%
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Alert strips */}
      <div className={styles.alertRow}>
        {[
          { dot: '#EF4444', msg: '21 orders to fulfil',      border: '#FECACA' },
          { dot: '#F59E0B', msg: '50+ payments to capture',  border: '#FDE68A' },
        ].map(a => (
          <button key={a.msg} className={styles.alertCard}
            style={{ borderLeftColor: a.dot }}>
            <span className={styles.dot} style={{ background: a.dot }} />
            <span>{a.msg}</span>
            <span className={styles.arrow}>›</span>
          </button>
        ))}
      </div>

      {/* Bottom 3-col grid */}
      <div className={styles.bottomGrid}>

        {/* Recent orders */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Recent Orders</h3>
            <button className={styles.cardLink}>View all ›</button>
          </div>
          {RECENT_ORDERS.map(o => (
            <div key={o.id} className={styles.orderRow}>
              <span className={styles.orderId}>{o.id}</span>
              <span className={styles.orderAmt}>{fmt(o.amount)}</span>
              <span className={styles.badge}
                style={{ background: STATUS_CFG[o.status]?.bg, color: STATUS_CFG[o.status]?.color }}>
                {o.status}
              </span>
            </div>
          ))}
        </div>

        {/* Top products */}
        <div className={styles.card}>
          <div className={styles.cardHead}>
            <h3 className={styles.cardTitle}>Top Products</h3>
            <button className={styles.cardLink}>View all ›</button>
          </div>
          {TOP_PRODUCTS.map(p => (
            <div key={p.name} className={styles.barRow}>
              <span className={styles.barLabel}>{p.name}</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{ width: `${p.percent}%` }} />
              </div>
              <span className={styles.barVal}>{p.percent}%</span>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Quick Actions</h3>
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} className={styles.quickItem}>
              <Ic d={a.icon} size={14} stroke="#6B7280" />
              <span className={styles.quickLabel}>{a.label}</span>
              <span className={styles.arrow}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
