import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Marketing.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Sparkline ─────────────────────────────────────────────────── */
function Spark({ data, color = '#2DBD97', w = 80, h = 30 }) {
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  )
}

/* ── Channel icon ──────────────────────────────────────────────── */
function ChannelIcon({ name }) {
  const map = {
    'Direct':        { bg: '#E8EEF5', color: '#1b3b5f', letter: 'D' },
    'Google Search': { bg: '#FEF3C7', color: '#D97706', letter: 'G' },
    'Facebook':      { bg: '#EFF6FF', color: '#3B82F6', letter: 'f' },
    'Instagram':     { bg: '#FDF2F8', color: '#EC4899', letter: 'I' },
    'Chatgpt.com':   { bg: '#F0FDF4', color: '#16A34A', letter: 'C' },
    'Unattributed':  { bg: '#F3F4F6', color: '#6B7280', letter: 'U' },
    'Shopify':       { bg: '#F0FDF4', color: '#2DBD97', letter: 'S' },
    'Chatgpt':       { bg: '#F0FDF4', color: '#16A34A', letter: 'C' },
  }
  const cfg = map[name] || { bg: '#F3F4F6', color: '#6B7280', letter: name[0] }
  return (
    <div className={s.chIcon} style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.letter}
    </div>
  )
}

/* ── Data ──────────────────────────────────────────────────────── */
const CHANNELS = [
  { name: 'Direct',        type: 'direct',  sessions: 556, sales: 0,       orders: 0, conv: '0%',    roas:'—', cpa:'—', ctr:'—' },
  { name: 'Google Search', type: 'organic', sessions: 219, sales: 86000,   orders: 1, conv: '0.46%', roas:'—', cpa:'—', ctr:'—' },
  { name: 'Facebook',      type: 'unknown', sessions: 134, sales: 0,       orders: 0, conv: '0%',    roas:'—', cpa:'—', ctr:'—' },
  { name: 'Facebook',      type: 'paid',    sessions: 120, sales: 0,       orders: 0, conv: '0%',    roas:'—', cpa:'—', ctr:'—' },
  { name: 'Instagram',     type: 'unknown', sessions: 55,  sales: 0,       orders: 0, conv: '0%',    roas:'—', cpa:'—', ctr:'—' },
]

const APP_ACTIVITIES = [
  { name: 'Messaging',  color: '#8B5CF6', statuses: [{ label: 'Draft (2)', cls: 'draft' }, { label: 'Sending (3)', cls: 'sending' }], lastActivity: '8 Apr 2026' },
  { name: 'Smile.io',   color: '#F59E0B', statuses: [{ label: 'No status (1)', cls: 'nostatus' }],                                       lastActivity: '9 Nov 2024' },
]

const STAT_SPARKS = {
  sessions: [12,18,15,22,19,28,24,33,28,38,32,42,35,48,42,55,48,62,55,68,60,72,65,78,70,82,75,85,80,88],
  sales:    [0,0,0,86,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  orders:   [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  conv:     [0,0,0,0.46,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
}

const fmt = n => n >= 1000 ? `₦${(n/1000).toFixed(0)}K` : `₦${n.toLocaleString()}`

/* ════════════════════════════════════════════════════════════════
   MARKETING OVERVIEW
   ════════════════════════════════════════════════════════════════ */
export default function Marketing() {
  const navigate = useNavigate()
  const [period,   setPeriod]   = useState('Last 30 days')
  const [compare,  setCompare]  = useState('No comparison')
  const [visible,  setVisible]  = useState(false)
  const [sortSess, setSortSess] = useState('desc')

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const sortedChannels = [...CHANNELS].sort((a, b) =>
    sortSess === 'desc' ? b.sessions - a.sessions : a.sessions - b.sessions)

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <div className={s.titleIcon}>
            <Ic d="M11 3.055A9.001 9.001 0 1 0 20.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0 1 20.488 9z" size={18} stroke="#1b3b5f" />
          </div>
          <h1 className={s.title}>Marketing</h1>
        </div>
        <div className={s.headerRight}>
          <select className={s.filterSel} value={period} onChange={e => setPeriod(e.target.value)}>
            {['Today','Last 7 days','Last 30 days','Last 90 days'].map(p => <option key={p}>{p}</option>)}
          </select>
          <select className={s.filterSel} value={compare} onChange={e => setCompare(e.target.value)}>
            {['No comparison','Previous period','Previous year'].map(c => <option key={c}>{c}</option>)}
          </select>
          <button className={s.attrBtn}>
            <Ic d="M18 20V10M12 20V4M6 20v-6" size={13} />
            Last non-direct click
            <Ic d="M6 9l6 6 6-6" size={12} />
          </button>
        </div>
      </div>

      {/* ── KPI strip ──────────────────────────────────────────── */}
      <div className={s.kpiStrip}>
        {[
          { label: 'Sessions', value: '1,146', spark: STAT_SPARKS.sessions, color: '#1b3b5f' },
          { label: 'Sales attributed to marketing', value: '₦86K', spark: STAT_SPARKS.sales, color: '#2DBD97' },
          { label: 'Orders attributed to marketing', value: '1', spark: STAT_SPARKS.orders, color: '#E8C547' },
          { label: 'Conversion rate', value: '0.08%', spark: STAT_SPARKS.conv, color: '#8B5CF6' },
          { label: 'Avg order value', value: '₦86K', spark: STAT_SPARKS.sales, color: '#F59E0B' },
        ].map((kpi, i) => (
          <div key={kpi.label} className={s.kpiCard} style={{ animationDelay: `${i * 60}ms` }}>
            <div className={s.kpiLabel}>{kpi.label}</div>
            <div className={s.kpiValue} style={{ color: kpi.color }}>{kpi.value}</div>
            <Spark data={kpi.spark} color={kpi.color} />
          </div>
        ))}
      </div>

      {/* ── Top marketing channels ─────────────────────────────── */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h3 className={s.cardTitle}>Top marketing channels</h3>
          <button className={s.viewReportBtn} onClick={() => navigate('/marketing/attribution')}>
            View report →
          </button>
        </div>
        <div className={s.channelTable}>
          <div className={s.channelTHead}>
            <span>Channel</span><span>Type</span>
            <span className={s.sortableHead} onClick={() => setSortSess(d => d === 'asc' ? 'desc' : 'asc')}>
              Sessions <Ic d={sortSess === 'asc' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={12} />
            </span>
            <span>Sales</span><span>Orders</span><span>Conv. rate</span>
            <span>ROAS</span><span>CPA</span><span>CTR</span>
          </div>
          {sortedChannels.map((ch, i) => (
            <div key={`${ch.name}-${ch.type}`} className={s.channelRow}
              style={{ animationDelay: `${i * 35}ms` }}>
              <span className={s.channelName}>
                <ChannelIcon name={ch.name} />
                {ch.name}
              </span>
              <span><span className={s.typePill}>{ch.type}</span></span>
              <span className={s.bold}>{ch.sessions.toLocaleString()}</span>
              <span className={s.bold} style={{ color: ch.sales > 0 ? '#059669' : undefined }}>
                {ch.sales > 0 ? fmt(ch.sales) : '₦0.00'}
              </span>
              <span>{ch.orders}</span>
              <span className={ch.conv !== '0%' ? s.convGreen : undefined}>{ch.conv}</span>
              <span className={s.dash}>{ch.roas}</span>
              <span className={s.dash}>{ch.cpa}</span>
              <span className={s.dash}>{ch.ctr}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Campaign tracking CTA ──────────────────────────────── */}
      <div className={s.ctaCard}>
        <div className={s.ctaLeft}>
          <h3 className={s.ctaTitle}>Centralize your campaign tracking</h3>
          <p className={s.ctaSub}>
            Create campaigns to evaluate how marketing initiatives drive business goals.
            Capture online and offline touchpoints, add campaign activities from multiple
            marketing channels, and monitor results.
          </p>
          <button className={s.createCampaignBtn}
            onClick={() => navigate('/marketing/campaigns')}>
            Create campaign
          </button>
        </div>
        <div className={s.ctaIllo}>
          <div className={s.illoFolder}>
            <div className={s.illoFolderTab} />
            <div className={s.illoFolderBody}>
              <div className={s.illoIcon}>
                <Ic d={['M12 2L2 7l10 5 10-5-10-5z','M2 17l10 5 10-5','M2 12l10 5 10-5']} size={32} stroke="#fff" sw={1.2} />
              </div>
            </div>
          </div>
          <div className={s.illoSearch}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={16} stroke="#E8C547" />
          </div>
          <div className={s.illoGrid}>
            {[0,1,2,3].map(i => <div key={i} className={s.illoGridDot} />)}
          </div>
        </div>
      </div>

      {/* ── Marketing app activities ────────────────────────────── */}
      <div className={s.card}>
        <div className={s.cardHead}>
          <h3 className={s.cardTitle}>Marketing app activities</h3>
          <button className={s.viewReportBtn} onClick={() => navigate('/integrations')}>
            Explore apps →
          </button>
        </div>
        <div className={s.appTable}>
          <div className={s.appTHead}>
            <span>App</span>
            <span>Activities in progress</span>
            <span>Last activity</span>
          </div>
          {APP_ACTIVITIES.map((app, i) => (
            <div key={app.name} className={s.appRow}
              style={{ animationDelay: `${i * 40}ms` }}>
              <span className={s.appName}>
                <div className={s.appIcon} style={{ background: `${app.color}20`, color: app.color }}>
                  {app.name[0]}
                </div>
                {app.name}
              </span>
              <span className={s.statusRow}>
                {app.statuses.map(st => (
                  <span key={st.label} className={`${s.statusPill} ${s[st.cls]}`}>{st.label}</span>
                ))}
                <span className={s.moreBtn}>···</span>
              </span>
              <span className={s.lastAct}>{app.lastActivity}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.footer}>
        Learn more about{' '}
        <a href="#" className={s.footerLink}>marketing campaigns</a>
        {' '}and how{' '}
        <a href="#" className={s.footerLink}>Taja syncs report data</a>.
      </div>
    </div>
  )
}
