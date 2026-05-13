import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Campaigns.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Seed campaigns ────────────────────────────────────────────── */
const SEED_CAMPAIGNS = [
  {
    id: 1, name: 'Summer Sale 2026', status: 'active',
    start: '1 Jun 2026', end: '30 Jun 2026',
    sessions: 1240, sales: 320000, orders: 14, conv: '1.13%',
    channels: ['Google', 'Facebook', 'Instagram'],
  },
  {
    id: 2, name: 'Easter Campaign', status: 'completed',
    start: '1 Apr 2026', end: '20 Apr 2026',
    sessions: 890, sales: 180000, orders: 9, conv: '1.01%',
    channels: ['Facebook', 'Email'],
  },
  {
    id: 3, name: 'New Arrivals Launch', status: 'draft',
    start: '15 Jun 2026', end: '30 Jun 2026',
    sessions: 0, sales: 0, orders: 0, conv: '0%',
    channels: [],
  },
]

const STATUS_CFG = {
  active:    { bg: '#ECFDF5', color: '#059669', label: 'Active' },
  completed: { bg: '#F3F4F6', color: '#374151', label: 'Completed' },
  draft:     { bg: '#FEF3C7', color: '#92400E', label: 'Draft' },
  paused:    { bg: '#FEF2F2', color: '#DC2626', label: 'Paused' },
}

const fmt = n => n >= 1000 ? `₦${(n/1000).toFixed(0)}K` : `₦${n}`

export default function Campaigns() {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState(SEED_CAMPAIGNS)
  const [filter,    setFilter]    = useState('All')
  const [visible,   setVisible]   = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const unassigned = 50
  const filtered = filter === 'All' ? campaigns
    : campaigns.filter(c => c.status === filter.toLowerCase())

  const deleteCampaign = id => {
    if (window.confirm('Delete this campaign?'))
      setCampaigns(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.breadBack} onClick={() => navigate('/marketing')}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
          </button>
          <h1 className={s.title}>Campaigns</h1>
        </div>
        <button className={s.btnPrimary} onClick={() => navigate('/marketing/campaigns/new')}>
          Create campaign
        </button>
      </div>

      {/* ── Unassigned badge ───────────────────────────────────── */}
      {unassigned > 0 && (
        <button className={s.unassignedBadge} onClick={() => navigate('/marketing/attribution')}>
          <Ic d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87" size={13} />
          {unassigned}+ unassigned activities
        </button>
      )}

      {/* ── Filter tabs ────────────────────────────────────────── */}
      <div className={s.filterRow}>
        <div className={s.filterTabs}>
          {['All', 'Active', 'Draft', 'Completed', 'Paused'].map(f => (
            <button key={f}
              className={`${s.filterTab} ${filter === f ? s.filterTabOn : ''}`}
              onClick={() => setFilter(f)}>
              {f}
              {f !== 'All' && (
                <span className={s.filterCount}>
                  {campaigns.filter(c => c.status === f.toLowerCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button className={s.configBtn}>
          <Ic d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={14} />
        </button>
      </div>

      {/* ── Empty / campaign list ──────────────────────────────── */}
      {filtered.length === 0 || campaigns.length === 0 ? (
        <div className={s.emptyCard}>
          <div className={s.emptyCta}>
            <div className={s.emptyLeft}>
              <h3 className={s.emptyTitle}>Centralize your campaign tracking</h3>
              <p className={s.emptySub}>
                Create campaigns to evaluate how marketing initiatives drive business goals.
                Capture online and offline touchpoints, add campaign activities from multiple
                marketing channels, and monitor results.
              </p>
              <div className={s.emptyBtns}>
                <button className={s.btnPrimary}
                  onClick={() => navigate('/marketing/campaigns/new')}>
                  Create campaign
                </button>
                <button className={s.btnOutline}>Learn more</button>
              </div>
            </div>
            <div className={s.emptyIllo}>
              <div className={s.illoFolder}>
                <div className={s.illoFolderTab} />
                <div className={s.illoFolderBody}>
                  <div className={s.illoInner}>
                    <Ic d={['M12 2L2 7l10 5 10-5-10-5z','M2 17l10 5 10-5','M2 12l10 5 10-5']} size={36} stroke="#fff" sw={1.2} />
                  </div>
                </div>
              </div>
              <div className={s.illoSearch}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={18} stroke="#E8C547" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Campaign table */
        <div className={s.tableWrap}>
          <div className={s.tHead}>
            <span>Campaign</span><span>Status</span>
            <span>Sessions</span><span>Sales</span>
            <span>Orders</span><span>Conv.</span>
            <span>Channels</span><span style={{ width: 50 }} />
          </div>
          {filtered.map((c, i) => {
            const st = STATUS_CFG[c.status] || STATUS_CFG.draft
            return (
              <div key={c.id} className={s.tRow}
                style={{ animationDelay: `${i * 35}ms` }}
                onClick={() => navigate(`/marketing/campaigns/${c.id}`)}>
                <span>
                  <div className={s.campaignName}>{c.name}</div>
                  <div className={s.campaignDates}>{c.start} – {c.end}</div>
                </span>
                <span>
                  <span className={s.statusPill} style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                </span>
                <span className={s.num}>{c.sessions.toLocaleString()}</span>
                <span className={s.num} style={{ color: c.sales > 0 ? '#059669' : undefined }}>
                  {fmt(c.sales)}
                </span>
                <span className={s.num}>{c.orders}</span>
                <span className={c.conv !== '0%' ? s.convGreen : s.num}>{c.conv}</span>
                <span>
                  <div className={s.channelTags}>
                    {c.channels.slice(0, 2).map(ch => (
                      <span key={ch} className={s.channelTag}>{ch}</span>
                    ))}
                    {c.channels.length > 2 && (
                      <span className={s.channelTag}>+{c.channels.length - 2}</span>
                    )}
                    {c.channels.length === 0 && <span className={s.noChannels}>—</span>}
                  </div>
                </span>
                <span onClick={e => e.stopPropagation()}>
                  <button className={s.deleteBtn}
                    onClick={() => deleteCampaign(c.id)} title="Delete">
                    <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} stroke="#9CA3AF" />
                  </button>
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
