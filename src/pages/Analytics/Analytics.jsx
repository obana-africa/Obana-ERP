import { useState } from 'react'
import s from './Analytics.module.css'

// ── Icon helper ──────────────────────────────────────────
const Ic = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

// ── Helpers ──────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`
const pct = (n) => `${n > 0 ? '+' : ''}${n}%`

// ── Sample Data ──────────────────────────────────────────
const KPI_DATA = {
  'Last 30 days': {
    sessions: { value: 1209, change: 28, up: true },
    grossSales: { value: 3910000, change: 29, up: true },
    orders: { value: 94, change: 18, up: true },
    conversionRate: { value: '0.33%', change: 0, up: null },
    aov: { value: 41600, change: 12, up: true },
    cac: { value: 8200, change: -5, up: false },
    turnover: { value: '2.4x', change: 8, up: true },
    romi: { value: '3.8x', change: 14, up: true },
  },
  'Last 7 days': {
    sessions: { value: 342, change: 11, up: true },
    grossSales: { value: 980000, change: -4, up: false },
    orders: { value: 22, change: -8, up: false },
    conversionRate: { value: '0.28%', change: -2, up: false },
    aov: { value: 44500, change: 6, up: true },
    cac: { value: 9100, change: 3, up: false },
    turnover: { value: '0.6x', change: 2, up: true },
    romi: { value: '2.9x', change: -6, up: false },
  },
  'Today': {
    sessions: { value: 48, change: 15, up: true },
    grossSales: { value: 132000, change: 22, up: true },
    orders: { value: 4, change: 33, up: true },
    conversionRate: { value: '0.42%', change: 18, up: true },
    aov: { value: 33000, change: -4, up: false },
    cac: { value: 7600, change: 8, up: false },
    turnover: { value: '0.1x', change: 5, up: true },
    romi: { value: '4.1x', change: 20, up: true },
  },
}

const SALES_CHART = {
  'Last 30 days': [120, 180, 95, 210, 165, 240, 190, 280, 155, 320, 270, 310, 195, 260, 305, 175, 290, 340, 220, 380, 250, 295, 315, 270, 340, 385, 290, 420, 360, 410],
  'Last 7 days': [180, 240, 165, 310, 275, 195, 260],
  'Today': [45, 82, 60, 95, 110, 75, 88, 120, 95, 140, 105, 132],
}

const CHART_LABELS = {
  'Last 30 days': ['Apr 1','','','Apr 4','','','Apr 7','','','Apr 10','','','Apr 13','','','Apr 16','','','Apr 19','','','Apr 22','','','Apr 25','','','Apr 28','','Apr 30'],
  'Last 7 days': ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  'Today': ['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm'],
}

const TOP_PRODUCTS = [
  { name: 'Classic Ankara Dress', sku: 'AKR-001', revenue: 1200000, units: 80, margin: 40, channel: 'Both' },
  { name: 'Leather Crossbody Bag', sku: 'LCB-002', revenue: 880000, units: 40, margin: 45, channel: 'Online' },
  { name: "Men's Kaftan Set", sku: 'KFT-004', revenue: 756000, units: 27, margin: 43, channel: 'POS' },
  { name: 'Premium Shea Butter', sku: 'SHB-003', revenue: 450000, units: 100, margin: 56, channel: 'Online' },
  { name: 'Ankara Gift Set Bundle', sku: 'GFT-005', revenue: 420000, units: 12, margin: 43, channel: 'Both' },
]

const TRAFFIC_SOURCES = [
  { source: 'Instagram', visits: 482, pct: 40, color: '#E1306C' },
  { source: 'Direct / URL', visits: 242, pct: 20, color: '#1a1a2e' },
  { source: 'WhatsApp', visits: 181, pct: 15, color: '#25D366' },
  { source: 'Google Search', visits: 145, pct: 12, color: '#4285F4' },
  { source: 'Facebook', visits: 109, pct: 9, color: '#1877F2' },
  { source: 'Other', visits: 50, pct: 4, color: '#9CA3AF' },
]

const PAYMENT_METHODS = [
  { method: 'Bank Transfer', count: 42, pct: 45, amount: 1755000, color: '#2DBD97' },
  { method: 'Card (POS)', count: 28, pct: 30, amount: 1170000, color: '#1a1a2e' },
  { method: 'Cash', count: 14, pct: 15, amount: 585000, color: '#E8C547' },
  { method: 'Mobile Wallet', count: 10, pct: 10, amount: 390000, color: '#8B5CF6' },
]

const STAFF_PERFORMANCE = [
  { name: 'Tomiwa A.', role: 'Manager', sales: 1800000, orders: 42, aov: 42857, itemsPerTx: 2.8 },
  { name: 'Emeka O.', role: 'Sales Associate', sales: 1200000, orders: 31, aov: 38710, itemsPerTx: 2.2 },
  { name: 'Kemi B.', role: 'Cashier', sales: 910000, orders: 21, aov: 43333, itemsPerTx: 1.9 },
]

const CART_ABANDONMENT = [
  { stage: 'Visited Store', count: 1209, dropOff: 0, color: '#2DBD97' },
  { stage: 'Viewed Product', count: 864, dropOff: 29, color: '#1a1a2e' },
  { stage: 'Added to Cart', count: 312, dropOff: 64, color: '#E8C547' },
  { stage: 'Reached Checkout', count: 148, dropOff: 53, color: '#F59E0B' },
  { stage: 'Completed Order', count: 94, dropOff: 36, color: '#EF4444' },
]

const CUSTOMER_SEGMENTS = [
  { segment: 'New Customers', count: 38, revenue: 1140000, clv: 30000, color: '#2DBD97', bg: '#ECFDF5' },
  { segment: 'Returning Customers', count: 41, revenue: 1968000, clv: 48000, color: '#1a1a2e', bg: '#EEF2FF' },
  { segment: 'VIP (Omnichannel)', count: 15, revenue: 802000, clv: 186000, color: '#E8C547', bg: '#FFFBEB' },
]

const ANALYTICS_TYPES = [
  { type: 'Descriptive', question: 'What happened?', example: 'Sales reports, revenue totals, order counts', icon: <><path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" /></>, color: '#2DBD97', bg: '#ECFDF5' },
  { type: 'Diagnostic', question: 'Why did it happen?', example: 'High return rates, low conversion on mobile', icon: <><circle cx="12" cy="12" r="10" /><path d="M12 8h.01M12 12v4" /></>, color: '#3B82F6', bg: '#EFF6FF' },
  { type: 'Predictive', question: 'What will happen?', example: 'Demand forecasting, restock predictions', icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></>, color: '#8B5CF6', bg: '#F5F3FF' },
  { type: 'Prescriptive', question: 'What should I do?', example: 'Reorder inventory alerts, discount triggers', icon: <><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></>, color: '#F59E0B', bg: '#FFFBEB' },
]

// ── Mini Sparkline ────────────────────────────────────────
function Sparkline({ data, color = '#2DBD97', height = 48 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w = 120, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Bar Chart ─────────────────────────────────────────────
function BarChart({ data, labels, color = '#1a1a2e', accentColor = '#2DBD97' }) {
  const max = Math.max(...data)
  const h = 160, w = 600
  const barW = Math.min(28, (w / data.length) - 4)
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} preserveAspectRatio="xMidYMid meet">
      {data.map((v, i) => {
        const barH = ((v / max) * h)
        const x = (i / data.length) * w + (w / data.length - barW) / 2
        const y = h - barH
        const isLast = i === data.length - 1
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH}
              fill={isLast ? accentColor : color} rx="3" opacity={isLast ? 1 : 0.75} />
            {labels[i] && (
              <text x={x + barW / 2} y={h + 16} textAnchor="middle"
                fontSize="9" fill="#9CA3AF" fontFamily="DM Sans, sans-serif">
                {labels[i]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Donut Chart ───────────────────────────────────────────
function DonutChart({ data }) {
  const total = data.reduce((a, d) => a + d.pct, 0)
  let cumulative = 0
  const r = 60, cx = 80, cy = 80, strokeW = 22
  const circumference = 2 * Math.PI * r
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {data.map((d, i) => {
        const dash = (d.pct / total) * circumference
        const gap = circumference - dash
        const offset = circumference - (cumulative / total) * circumference
        cumulative += d.pct
        return (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={d.color} strokeWidth={strokeW}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }} />
        )
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fill="#6B7280" fontFamily="DM Sans, sans-serif">Total</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="16" fontWeight="700" fill="#111827" fontFamily="DM Sans, sans-serif">
        {data.reduce((a, d) => a + d.count, 0)}
      </text>
    </svg>
  )
}

// ── MAIN ─────────────────────────────────────────────────
export default function Analytics() {
  const [period, setPeriod] = useState('Last 30 days')
  const [channel, setChannel] = useState('All channels')
  const [tab, setTab] = useState('overview')

  const kpi = KPI_DATA[period]
  const chartData = SALES_CHART[period]
  const chartLabels = CHART_LABELS[period]

  return (
    <div className={s.page}>
      {/* Topbar */}
      <header className={s.topbar}>
        <div>
          <h1 className={s.pgTitle}>Good morning, let's get started.</h1>
          <p className={s.pgSub}>Here's what's happening with your store today.</p>
        </div>
        <div className={s.topbarR}>
          <button className={s.btnOutline}>
            <Ic size={13}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5M12 15V3" /></Ic>
            Export Report
          </button>
        </div>
      </header>

      <div className={s.content}>

        {/* Period + Channel filters */}
        <div className={s.filterRow}>
          <div className={s.periodTabs}>
            {['Last 30 days', 'Last 7 days', 'Today'].map(p => (
              <button key={p} className={`${s.periodTab} ${period === p ? s.periodTabOn : ''}`} onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <select className={s.channelSel} value={channel} onChange={e => setChannel(e.target.value)}>
            {['All channels', 'Online Store', 'Point of Sale'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* KPI Cards */}
        <div className={s.kpiRow}>
          {[
            { label: 'Sessions', ...kpi.sessions, sparkData: [40, 55, 48, 70, 62, 80, 75, 95, 82, 110, 95, 120], format: v => v.toLocaleString() },
            { label: 'Gross Sales', ...kpi.grossSales, sparkData: [80, 120, 95, 140, 110, 160, 130, 180, 155, 200, 175, 220], format: v => fmt(v) },
            { label: 'Orders', ...kpi.orders, sparkData: [8, 12, 9, 15, 11, 18, 14, 20, 16, 22, 19, 24], format: v => v },
            { label: 'Conversion Rate', ...kpi.conversionRate, sparkData: [0.2, 0.3, 0.25, 0.35, 0.28, 0.4, 0.33, 0.42, 0.38, 0.45, 0.4, 0.48], format: v => v },
          ].map(k => (
            <div key={k.label} className={s.kpiCard}>
              <div className={s.kpiTop}>
                <span className={s.kpiLabel}>{k.label}</span>
                <Sparkline data={k.sparkData} color={k.up === false ? '#EF4444' : '#2DBD97'} />
              </div>
              <div className={s.kpiValue}>{k.format(k.value)}</div>
              {k.change !== 0 && k.up !== null ? (
                <div className={`${s.kpiChange} ${k.up ? s.kpiUp : s.kpiDown}`}>
                  {k.up
                    ? <Ic size={12}><path d="M18 15l-6-6-6 6" /></Ic>
                    : <Ic size={12}><path d="M6 9l6 6 6-6" /></Ic>
                  }
                  {Math.abs(k.change)}%
                </div>
              ) : (
                <div className={s.kpiNoChange}>— no change</div>
              )}
            </div>
          ))}
        </div>

        {/* Alert strips */}
        <div className={s.alertStrip}>
          <div className={s.alertItem} style={{ borderLeftColor: '#EF4444' }}>
            <span className={s.alertDot} style={{ background: '#EF4444' }} />
            21 orders to fulfil
            <span className={s.alertArrow}>›</span>
          </div>
          <div className={s.alertItem} style={{ borderLeftColor: '#F59E0B' }}>
            <span className={s.alertDot} style={{ background: '#F59E0B' }} />
            50+ payments to capture
            <span className={s.alertArrow}>›</span>
          </div>
        </div>

        {/* Main tabs */}
        <div className={s.tabBar}>
          <div className={s.tabs}>
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'pos', label: 'POS Analytics' },
              { key: 'online', label: 'Online Store' },
              { key: 'omnichannel', label: 'Omnichannel' },
              { key: 'types', label: 'Analytics Types' },
            ].map(t => (
              <button key={t.key} className={`${s.tab} ${tab === t.key ? s.tabOn : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div className={s.overviewGrid}>

            {/* Sales chart */}
            <div className={s.chartCard} style={{ gridColumn: '1 / -1' }}>
              <div className={s.cardHead}>
                <h3 className={s.cardTitle}>Revenue Over Time</h3>
                <div className={s.cardMeta}>
                  <span className={s.legendDot} style={{ background: '#1a1a2e' }} />Online
                  <span className={s.legendDot} style={{ background: '#2DBD97' }} />POS
                </div>
              </div>
              <div className={s.chartWrap}>
                <BarChart data={chartData} labels={chartLabels} />
              </div>
            </div>

            {/* Recent orders */}
            <div className={s.sectionCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Recent Orders</h3></div>
              {[
                { id: '#1042', amount: 12500, status: 'Paid' },
                { id: '#1041', amount: 8200, status: 'Pending' },
                { id: '#1040', amount: 3600, status: 'Paid' },
                { id: '#1039', amount: 22000, status: 'Paid' },
              ].map(o => (
                <div key={o.id} className={s.recentRow}>
                  <span className={s.orderId}>{o.id}</span>
                  <span className={s.orderAmt}>{fmt(o.amount)}</span>
                  <span className={s.statusPill} style={{ background: o.status === 'Paid' ? '#ECFDF5' : '#FFFBEB', color: o.status === 'Paid' ? '#059669' : '#D97706' }}>{o.status}</span>
                </div>
              ))}
            </div>

            {/* Top products */}
            <div className={s.sectionCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Top Products</h3></div>
              {TOP_PRODUCTS.slice(0, 4).map((p, i) => (
                <div key={p.sku} className={s.topProdRow}>
                  <span className={s.topProdRank}>{i + 1}</span>
                  <div className={s.topProdInfo}>
                    <span className={s.topProdName}>{p.name}</span>
                    <div className={s.topProdBar}>
                      <div className={s.topProdBarFill} style={{ width: `${(p.revenue / TOP_PRODUCTS[0].revenue) * 100}%` }} />
                    </div>
                  </div>
                  <span className={s.topProdPct}>{Math.round((p.revenue / TOP_PRODUCTS[0].revenue) * 100)}%</span>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className={s.sectionCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Quick Actions</h3></div>
              {['Add new product', 'Create discount', 'View inventory', 'Export reports'].map(a => (
                <div key={a} className={s.quickAction}>
                  <span>{a}</span>
                  <span className={s.actionArrow}>›</span>
                </div>
              ))}
            </div>

            {/* Secondary KPIs */}
            <div className={s.kpiSecRow} style={{ gridColumn: '1 / -1' }}>
              {[
                { label: 'Avg Order Value', value: fmt(kpi.aov.value), change: kpi.aov.change, up: kpi.aov.up, icon: <><path d="M2 8h20M2 16h20M6 4v16M18 4v16" /></> },
                { label: 'Customer Acq. Cost', value: fmt(kpi.cac.value), change: kpi.cac.change, up: kpi.cac.up, icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></> },
                { label: 'Inventory Turnover', value: kpi.turnover.value, change: kpi.turnover.change, up: kpi.turnover.up, icon: <><path d="M1 4v6h6" /><path d="M23 20v-6h-6" /><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" /></> },
                { label: 'Return on Mktg Invest', value: kpi.romi.value, change: kpi.romi.change, up: kpi.romi.up, icon: <><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></> },
              ].map(k => (
                <div key={k.label} className={s.kpiSecCard}>
                  <div className={s.kpiSecIco}><Ic size={18}>{k.icon}</Ic></div>
                  <div className={s.kpiSecVal}>{k.value}</div>
                  <div className={s.kpiSecLbl}>{k.label}</div>
                  <div className={`${s.kpiChange} ${k.up ? s.kpiUp : s.kpiDown}`} style={{ justifyContent: 'center', marginTop: 4 }}>
                    {k.up ? <Ic size={11}><path d="M18 15l-6-6-6 6" /></Ic> : <Ic size={11}><path d="M6 9l6 6 6-6" /></Ic>}
                    {Math.abs(k.change)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── POS ANALYTICS TAB ── */}
        {tab === 'pos' && (
          <div className={s.sectionGrid}>

            {/* Staff performance */}
            <div className={s.wideCard}>
              <div className={s.cardHead}>
                <h3 className={s.cardTitle}>Staff Performance</h3>
                <span className={s.cardSub}>Sales productivity per associate</span>
              </div>
              <div className={s.staffTable}>
                <div className={s.staffHead}>
                  <span>Staff Member</span><span>Total Sales</span><span>Orders</span><span>Avg Order Value</span><span>Items / Txn</span>
                </div>
                {STAFF_PERFORMANCE.map(st => (
                  <div key={st.name} className={s.staffRow}>
                    <span className={s.staffCell}>
                      <div className={s.staffAvatar}>{st.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <div className={s.staffName}>{st.name}</div>
                        <div className={s.staffRole}>{st.role}</div>
                      </div>
                    </span>
                    <span className={s.staffSales}>{fmt(st.sales)}</span>
                    <span>{st.orders}</span>
                    <span>{fmt(st.aov)}</span>
                    <span>
                      <div className={s.itemsBar}>
                        <div className={s.itemsBarFill} style={{ width: `${(st.itemsPerTx / 3) * 100}%` }} />
                      </div>
                      <span style={{ fontSize: 12 }}>{st.itemsPerTx}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment methods */}
            <div className={s.halfCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Payment Methods</h3></div>
              <div className={s.paymentGrid}>
                <DonutChart data={PAYMENT_METHODS} />
                <div className={s.paymentLegend}>
                  {PAYMENT_METHODS.map(p => (
                    <div key={p.method} className={s.payLegendRow}>
                      <span className={s.legendDot} style={{ background: p.color, width: 10, height: 10, borderRadius: '50%', flexShrink: 0 }} />
                      <span className={s.payMethod}>{p.method}</span>
                      <span className={s.payPct}>{p.pct}%</span>
                      <span className={s.payAmt}>{fmt(p.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* POS KPIs */}
            <div className={s.halfCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>POS Key Metrics</h3></div>
              <div className={s.metricsList}>
                {[
                  { label: 'Total POS Revenue', value: fmt(1950000), up: true, change: 14 },
                  { label: 'POS Orders', value: '47', up: true, change: 8 },
                  { label: 'Avg Transaction Value', value: fmt(41489), up: false, change: -3 },
                  { label: 'Cash vs Card Split', value: '15% / 30%', up: null, change: 0 },
                  { label: 'Top POS Product', value: "Men's Kaftan Set", up: null, change: 0 },
                ].map(m => (
                  <div key={m.label} className={s.metricRow}>
                    <span className={s.metricLbl}>{m.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className={s.metricVal}>{m.value}</span>
                      {m.up !== null && (
                        <span className={`${s.kpiChange} ${m.up ? s.kpiUp : s.kpiDown}`}>
                          {m.up ? <Ic size={10}><path d="M18 15l-6-6-6 6" /></Ic> : <Ic size={10}><path d="M6 9l6 6 6-6" /></Ic>}
                          {Math.abs(m.change)}%
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ONLINE STORE TAB ── */}
        {tab === 'online' && (
          <div className={s.sectionGrid}>

            {/* Traffic sources */}
            <div className={s.halfCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Traffic Sources</h3></div>
              <div className={s.trafficList}>
                {TRAFFIC_SOURCES.map(t => (
                  <div key={t.source} className={s.trafficRow}>
                    <div className={s.trafficSource}>
                      <span className={s.trafficDot} style={{ background: t.color }} />
                      <span className={s.trafficName}>{t.source}</span>
                    </div>
                    <div className={s.trafficBarWrap}>
                      <div className={s.trafficBar}>
                        <div className={s.trafficBarFill} style={{ width: `${t.pct}%`, background: t.color }} />
                      </div>
                      <span className={s.trafficPct}>{t.pct}%</span>
                    </div>
                    <span className={s.trafficCount}>{t.visits}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart abandonment funnel */}
            <div className={s.halfCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Conversion Funnel</h3><span className={s.cardSub}>Cart abandonment analysis</span></div>
              <div className={s.funnelList}>
                {CART_ABANDONMENT.map((stage, i) => (
                  <div key={stage.stage} className={s.funnelRow}>
                    <div className={s.funnelLabel}>
                      <span className={s.funnelStage}>{stage.stage}</span>
                      {stage.dropOff > 0 && <span className={s.funnelDrop}>-{stage.dropOff}%</span>}
                    </div>
                    <div className={s.funnelBarWrap}>
                      <div className={s.funnelBar} style={{ width: `${(stage.count / CART_ABANDONMENT[0].count) * 100}%`, background: stage.color }} />
                    </div>
                    <span className={s.funnelCount}>{stage.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className={s.abandonRate}>
                <span>Cart Abandonment Rate</span>
                <strong style={{ color: '#DC2626' }}>69.9%</strong>
              </div>
            </div>

            {/* Online KPIs */}
            <div className={s.wideCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Online Store Metrics</h3></div>
              <div className={s.onlineKpiGrid}>
                {[
                  { label: 'Online Revenue', value: fmt(1960000), change: 29, up: true },
                  { label: 'Online Orders', value: '47', change: 18, up: true },
                  { label: 'Bounce Rate', value: '38.4%', change: -4, up: true },
                  { label: 'Avg Session Duration', value: '3m 42s', change: 12, up: true },
                  { label: 'Pages per Session', value: '4.2', change: 8, up: true },
                  { label: 'Mobile Traffic', value: '74%', change: 6, up: true },
                ].map(k => (
                  <div key={k.label} className={s.onlineKpiCard}>
                    <div className={s.onlineKpiVal}>{k.value}</div>
                    <div className={s.onlineKpiLbl}>{k.label}</div>
                    <div className={`${s.kpiChange} ${k.up ? s.kpiUp : s.kpiDown}`} style={{ justifyContent: 'center', marginTop: 4 }}>
                      {k.up ? <Ic size={10}><path d="M18 15l-6-6-6 6" /></Ic> : <Ic size={10}><path d="M6 9l6 6 6-6" /></Ic>}
                      {Math.abs(k.change)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── OMNICHANNEL TAB ── */}
        {tab === 'omnichannel' && (
          <div className={s.sectionGrid}>

            {/* Customer segments */}
            <div className={s.wideCard}>
              <div className={s.cardHead}>
                <h3 className={s.cardTitle}>Customer Segments</h3>
                <span className={s.cardSub}>Purchase behavior across all channels</span>
              </div>
              <div className={s.segmentGrid}>
                {CUSTOMER_SEGMENTS.map(seg => (
                  <div key={seg.segment} className={s.segCard} style={{ borderTop: `3px solid ${seg.color}` }}>
                    <div className={s.segCount} style={{ color: seg.color }}>{seg.count}</div>
                    <div className={s.segName}>{seg.segment}</div>
                    <div className={s.segStats}>
                      <div className={s.segStat}>
                        <div className={s.segStatVal}>{fmt(seg.revenue)}</div>
                        <div className={s.segStatLbl}>Revenue</div>
                      </div>
                      <div className={s.segStat}>
                        <div className={s.segStatVal}>{fmt(seg.clv)}</div>
                        <div className={s.segStatLbl}>Avg CLV</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel comparison */}
            <div className={s.halfCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Channel Comparison</h3></div>
              <div className={s.channelCompare}>
                {[
                  { label: 'Revenue', online: 1960000, pos: 1950000 },
                  { label: 'Orders', online: 47, pos: 47 },
                  { label: 'Avg Order Value', online: 41702, pos: 41489 },
                ].map(c => (
                  <div key={c.label} className={s.channelRow}>
                    <span className={s.channelLbl}>{c.label}</span>
                    <div className={s.channelBars}>
                      <div className={s.channelBar}>
                        <div className={s.channelBarLbl}>Online</div>
                        <div className={s.channelBarTrack}>
                          <div className={s.channelBarFill} style={{ width: '50%', background: '#1a1a2e' }} />
                        </div>
                        <span className={s.channelBarVal}>{typeof c.online === 'number' && c.online > 1000 ? fmt(c.online) : c.online}</span>
                      </div>
                      <div className={s.channelBar}>
                        <div className={s.channelBarLbl}>POS</div>
                        <div className={s.channelBarTrack}>
                          <div className={s.channelBarFill} style={{ width: '49%', background: '#2DBD97' }} />
                        </div>
                        <span className={s.channelBarVal}>{typeof c.pos === 'number' && c.pos > 1000 ? fmt(c.pos) : c.pos}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Omnichannel insights */}
            <div className={s.halfCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Omnichannel Insights</h3></div>
              <div className={s.insightsList}>
                {[
                  { label: 'Customers on both channels', value: '15', icon: '🔗', note: 'spend 2.4× more on avg' },
                  { label: 'Inventory sync events today', value: '248', icon: '🔄', note: 'real-time across channels' },
                  { label: 'Cross-channel loyalty rate', value: '78%', icon: '⭐', note: 'returning customers' },
                  { label: 'Oversell incidents this month', value: '0', icon: '✅', note: 'inventory sync working' },
                ].map(ins => (
                  <div key={ins.label} className={s.insightRow}>
                    <span className={s.insightIcon}>{ins.icon}</span>
                    <div className={s.insightInfo}>
                      <span className={s.insightVal}>{ins.value}</span>
                      <span className={s.insightLbl}>{ins.label}</span>
                      <span className={s.insightNote}>{ins.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top products across channels */}
            <div className={s.wideCard}>
              <div className={s.cardHead}><h3 className={s.cardTitle}>Top Products Across All Channels</h3></div>
              <div className={s.prodTable}>
                <div className={s.prodTableHead}>
                  <span>Product</span><span>SKU</span><span>Revenue</span><span>Units Sold</span><span>Margin</span><span>Channel</span>
                </div>
                {TOP_PRODUCTS.map(p => (
                  <div key={p.sku} className={s.prodTableRow}>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#6B7280' }}>{p.sku}</span>
                    <span style={{ fontWeight: 700 }}>{fmt(p.revenue)}</span>
                    <span>{p.units}</span>
                    <span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ flex: 1, height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: `${p.margin}%`, height: '100%', background: '#2DBD97', borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#059669', fontWeight: 600 }}>{p.margin}%</span>
                      </div>
                    </span>
                    <span>
                      <span style={{ background: p.channel === 'Both' ? '#EEF2FF' : p.channel === 'Online' ? '#ECFDF5' : '#FFFBEB', color: p.channel === 'Both' ? '#3730A3' : p.channel === 'Online' ? '#059669' : '#D97706', padding: '2px 8px', borderRadius: 12, fontSize: 11.5, fontWeight: 600 }}>{p.channel}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS TYPES TAB ── */}
        {tab === 'types' && (
          <div className={s.typesSection}>
            <p className={s.typesSub}>Understanding the four levels of retail analytics helps you make better decisions at every stage.</p>
            <div className={s.typesGrid}>
              {ANALYTICS_TYPES.map(t => (
                <div key={t.type} className={s.typeCard} style={{ borderTop: `3px solid ${t.color}` }}>
                  <div className={s.typeIco} style={{ color: t.color, background: t.bg }}>
                    <Ic size={22}>{t.icon}</Ic>
                  </div>
                  <div className={s.typeName}>{t.type}</div>
                  <div className={s.typeQuestion}>"{t.question}"</div>
                  <div className={s.typeExample}>{t.example}</div>
                </div>
              ))}
            </div>

            <div className={s.kpiDefGrid}>
              <h3 className={s.kpiDefTitle}>Key Performance Indicators</h3>
              {[
                { kpi: 'AOV', full: 'Average Order Value', desc: 'Average amount spent per transaction across all channels', formula: 'Total Revenue ÷ Number of Orders', value: fmt(kpi.aov.value) },
                { kpi: 'CAC', full: 'Customer Acquisition Cost', desc: 'Total marketing spend divided by new customers acquired', formula: 'Marketing Spend ÷ New Customers', value: fmt(kpi.cac.value) },
                { kpi: 'CLV', full: 'Customer Lifetime Value', desc: 'Predicted total revenue from a customer over their lifetime', formula: 'AOV × Purchase Frequency × Customer Lifespan', value: fmt(48000) },
                { kpi: 'ROMI', full: 'Return on Marketing Investment', desc: 'Profitability of marketing campaigns', formula: '(Revenue from Marketing - Cost) ÷ Cost', value: kpi.romi.value },
                { kpi: 'ITR', full: 'Inventory Turnover Ratio', desc: 'How quickly inventory is sold and replaced', formula: 'COGS ÷ Average Inventory Value', value: kpi.turnover.value },
              ].map(k => (
                <div key={k.kpi} className={s.kpiDefCard}>
                  <div className={s.kpiDefBadge}>{k.kpi}</div>
                  <div>
                    <div className={s.kpiDefName}>{k.full}</div>
                    <div className={s.kpiDefDesc}>{k.desc}</div>
                    <div className={s.kpiDefFormula}>{k.formula}</div>
                    <div className={s.kpiDefCurrent}>Current: <strong>{k.value}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
