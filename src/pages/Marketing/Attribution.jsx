import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Attribution.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Channel icon ──────────────────────────────────────────────── */
function ChannelIcon({ name }) {
  const map = {
    'Direct':            { bg: '#E8EEF5', color: '#1b3b5f' },
    'Google Search':     { bg: '#FEF3C7', color: '#D97706' },
    'Facebook':          { bg: '#EFF6FF', color: '#3B82F6' },
    'Instagram':         { bg: '#FDF2F8', color: '#EC4899' },
    'Chatgpt.com':       { bg: '#F0FDF4', color: '#16A34A' },
    'Unattributed':      { bg: '#F3F4F6', color: '#6B7280' },
    'Shopify':           { bg: '#E6F7F2', color: '#2DBD97' },
    'Chatgpt':           { bg: '#F0FDF4', color: '#16A34A' },
    'Shopify Messaging': { bg: '#E6F7F2', color: '#2DBD97' },
  }
  const cfg = map[name] || { bg: '#F3F4F6', color: '#6B7280' }
  return (
    <div className={s.chIcon} style={{ background: cfg.bg, color: cfg.color }}>
      {name[0].toUpperCase()}
    </div>
  )
}

/* ── Attribution data ──────────────────────────────────────────── */
const ATTRIBUTION_DATA = [
  { channel:'Direct',           type:'direct',  sessions:556, sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Google Search',    type:'organic', sessions:219, sales:86000, orders:1, conv:'0.46%',cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'₦86,000',  newOrders:1, retOrders:0 },
  { channel:'Facebook',         type:'unknown', sessions:134, sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Facebook',         type:'paid',    sessions:120, sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Instagram',        type:'unknown', sessions:55,  sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Instagram',        type:'paid',    sessions:21,  sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Chatgpt.com',      type:'unknown', sessions:13,  sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Unattributed',     type:'unknown', sessions:7,   sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Shopify',          type:'organic', sessions:3,   sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Chatgpt',          type:'unknown', sessions:2,   sales:0,     orders:0, conv:'0%',   cost:'—',     roas:'—', cpa:'—', ctr:'—', aov:'—',       newOrders:0, retOrders:0 },
  { channel:'Shopify Messaging',type:'paid',    sessions:2,   sales:0,     orders:0, conv:'0%',   cost:'₦0.00', roas:'—', cpa:'—', ctr:'0.17%', aov:'—', newOrders:0, retOrders:0 },
]

/* ── Multi-line chart ──────────────────────────────────────────── */
const CHART_COLORS = ['#1b3b5f', '#8B5CF6', '#EC4899', '#E8C547', '#2DBD97']
const CHANNELS_SHOWN = ['Direct','Facebook (paid)','Facebook (unknown)','Google Search (organic)','Instagram (unknown)']

function MultiLineChart({ data, labels }) {
  const w = 900, h = 220
  const margin = { top: 20, right: 20, bottom: 40, left: 40 }
  const chartW = w - margin.left - margin.right
  const chartH = h - margin.top - margin.bottom

  const allVals = data.flat()
  const maxVal = Math.max(...allVals, 1)

  const getPath = (series) => {
    return series.map((v, i) => {
      const x = (i / (series.length - 1)) * chartW + margin.left
      const y = chartH - (v / maxVal) * chartH + margin.top
      return `${i === 0 ? 'M' : 'L'}${x},${y}`
    }).join(' ')
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={s.chartSvg} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(frac => {
        const y = chartH - frac * chartH + margin.top
        const val = Math.round(frac * maxVal)
        return (
          <g key={frac}>
            <line x1={margin.left} y1={y} x2={w - margin.right} y2={y}
              stroke="#E5E7EB" strokeWidth="1" />
            <text x={margin.left - 6} y={y + 4} textAnchor="end"
              fontSize="10" fill="#9CA3AF">{val}</text>
          </g>
        )
      })}

      {/* X axis labels */}
      {labels.filter((_, i) => i % 4 === 0).map((label, i) => {
        const origIdx = i * 4
        const x = (origIdx / (labels.length - 1)) * chartW + margin.left
        return (
          <text key={label} x={x} y={h - 8}
            textAnchor="middle" fontSize="10" fill="#9CA3AF">{label}</text>
        )
      })}

      {/* Lines */}
      {data.map((series, i) => (
        <path key={i} d={getPath(series)} fill="none"
          stroke={CHART_COLORS[i]} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      ))}
    </svg>
  )
}

/* Generate chart data */
function genData(points = 30) {
  return CHANNELS_SHOWN.map((_, ci) =>
    Array.from({ length: points }, (_, i) => {
      const base = [30, 15, 12, 8, 5][ci]
      return Math.max(0, base + Math.sin(i * 0.3 + ci) * base * 0.6 + Math.random() * base * 0.4)
    })
  )
}

const LABELS = ['3 Apr','4 Apr','5 Apr','6 Apr','7 Apr','8 Apr','9 Apr','10 Apr','11 Apr','12 Apr',
  '13 Apr','14 Apr','15 Apr','16 Apr','17 Apr','18 Apr','19 Apr','20 Apr','21 Apr','22 Apr',
  '23 Apr','24 Apr','25 Apr','26 Apr','27 Apr','28 Apr','29 Apr','30 Apr','1 May','2 May']

export default function Attribution() {
  const navigate  = useNavigate()
  const [period,  setPeriod]  = useState('Last 30 days')
  const [granularity, setGranularity] = useState('Daily')
  const [model,   setModel]   = useState('Last non-direct click')
  const [view,    setView]    = useState('Channels')
  const [sortKey, setSortKey] = useState('sessions')
  const [sortDir, setSortDir] = useState('desc')
  const [visible, setVisible] = useState(false)

  const chartData = genData(30)
  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const sorted = [...ATTRIBUTION_DATA].sort((a, b) => {
    const va = typeof a[sortKey] === 'number' ? a[sortKey] : 0
    const vb = typeof b[sortKey] === 'number' ? b[sortKey] : 0
    return sortDir === 'desc' ? vb - va : va - vb
  })

  const fmt = n => n > 0 ? `₦${n.toLocaleString()}.00` : '₦0.00'
  const SortHead = ({ col, label }) => (
    <span className={s.sortHead}
      onClick={() => { if (sortKey === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(col); setSortDir('desc') } }}>
      {label}
      {sortKey === col && <Ic d={sortDir === 'asc' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={11} />}
    </span>
  )

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.titleIco}>
            <Ic d="M22 12h-4l-3 9L9 3l-3 9H2" size={16} stroke="#1b3b5f" />
          </div>
          <h1 className={s.title}>Attribution</h1>
          <button className={s.viewBtn}>
            {view} <Ic d="M6 9l6 6 6-6" size={12} />
          </button>
        </div>
        <div className={s.headerRight}>
          <button className={s.secBtn}>Print</button>
          <button className={s.secBtn}>Export</button>
        </div>
      </div>

      {/* ── Sub filters ────────────────────────────────────── */}
      <div className={s.subFilters}>
        <select className={s.filterSel} value={period} onChange={e => setPeriod(e.target.value)}>
          {['Today','Last 7 days','Last 30 days','Last 90 days'].map(p => <option key={p}>{p}</option>)}
        </select>
        <select className={s.filterSel} value={granularity} onChange={e => setGranularity(e.target.value)}>
          {['Daily','Weekly','Monthly'].map(g => <option key={g}>{g}</option>)}
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className={s.modelBtn}>
            <Ic d="M18 20V10M12 20V4M6 20v-6" size={13} />
            {model} <Ic d="M6 9l6 6 6-6" size={12} />
          </button>
        </div>
      </div>

      {/* ── Chart ──────────────────────────────────────────── */}
      <div className={s.chartCard}>
        <div className={s.chartHead}>
          <button className={s.chartTitleBtn}>
            Sessions by top 5 channels over time
            <Ic d="M6 9l6 6 6-6" size={13} />
          </button>
        </div>
        <div className={s.chartWrap}>
          <MultiLineChart data={chartData} labels={LABELS} />
        </div>
        <div className={s.chartLegend}>
          {CHANNELS_SHOWN.map((ch, i) => (
            <div key={ch} className={s.legendItem}>
              <div className={s.legendDot} style={{ background: CHART_COLORS[i] }} />
              <span>{ch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Attribution table ──────────────────────────────── */}
      <div className={s.tableCard}>
        <div className={s.tableFilters}>
          <button className={s.filterIconBtn}>
            <Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={14} />
          </button>
          <button className={s.filterIconBtn} style={{ marginLeft: 'auto' }}>
            <Ic d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" size={14} />
          </button>
        </div>

        <div className={s.tWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Channel</th>
                <th>Type</th>
                <th><SortHead col="sessions" label="Sessions" /></th>
                <th><SortHead col="sales"    label="Sales" /></th>
                <th><SortHead col="orders"   label="Orders" /></th>
                <th>Conv. rate</th>
                <th>Cost</th>
                <th>ROAS</th>
                <th>CPA</th>
                <th>CTR</th>
                <th>AOV</th>
                <th>New</th>
                <th>Returning</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row, i) => (
                <tr key={`${row.channel}-${row.type}-${i}`} className={s.tr}
                  style={{ animationDelay: `${i * 25}ms` }}>
                  <td>
                    <div className={s.channelCell}>
                      <ChannelIcon name={row.channel} />
                      {row.channel}
                    </div>
                  </td>
                  <td><span className={s.typePill}>{row.type}</span></td>
                  <td className={s.num}>{row.sessions.toLocaleString()}</td>
                  <td className={s.num} style={{ color: row.sales > 0 ? '#059669' : undefined }}>
                    {fmt(row.sales)}
                  </td>
                  <td className={s.num}>{row.orders}</td>
                  <td className={row.conv !== '0%' ? s.convGreen : s.num}>{row.conv}</td>
                  <td className={s.dash}>{row.cost}</td>
                  <td className={s.dash}>{row.roas}</td>
                  <td className={s.dash}>{row.cpa}</td>
                  <td className={row.ctr !== '—' ? s.convGreen : s.dash}>{row.ctr}</td>
                  <td className={row.aov !== '—' ? s.num : s.dash}>{row.aov}</td>
                  <td className={s.num}>{row.newOrders}</td>
                  <td className={s.num}>{row.retOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
