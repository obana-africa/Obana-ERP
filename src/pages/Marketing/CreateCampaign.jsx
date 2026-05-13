import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './CreateCampaign.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* Mini empty chart */
function EmptyChart({ label }) {
  return (
    <div className={s.emptyChart}>
      <div className={s.chartLabel}>{label}</div>
      <div className={s.chartEmpty}>No data for this date range</div>
    </div>
  )
}

const CAMPAIGN_ID = Math.floor(Math.random() * 999999)

export default function CreateCampaign() {
  const navigate  = useNavigate()
  const [name,    setName]    = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [saving,  setSaving]  = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [period,  setPeriod]  = useState('Year to date')
  const [shareOpen, setShareOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [actOpen,   setActOpen]   = useState(false)

  useEffect(() => { if (name) setIsDirty(true) }, [name])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false); setSaved(true); setIsDirty(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDiscard = () => {
    if (isDirty && !window.confirm('Discard unsaved changes?')) return
    navigate('/marketing/campaigns')
  }

  return (
    <div className={s.page}>
      {/* ── Unsaved bar ──────────────────────────────────────── */}
      {isDirty && (
        <div className={s.unsavedBar}>
          <span className={s.unsavedDot} />
          <span>Unsaved changes</span>
          <div className={s.unsavedRight}>
            <button className={s.discardBtn} onClick={handleDiscard}>Discard</button>
            <button className={s.saveTopBtn} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <button className={s.breadBack} onClick={() => navigate('/marketing/campaigns')}>
            <Ic d="M19 12H5" size={14} />
          </button>
          <span className={s.breadSep}>›</span>
          <input className={s.campaignNameInput}
            value={name} placeholder="Create campaign"
            onChange={e => setName(e.target.value)} />
          <span className={s.draftBadge}>Draft</span>
        </div>
        <div className={s.headerRight}>
          <select className={s.periodSel} value={period} onChange={e => setPeriod(e.target.value)}>
            {['Year to date','Last 30 days','Last 7 days','Last 90 days'].map(p => <option key={p}>{p}</option>)}
          </select>
          <button className={s.attrBtn}>
            <Ic d="M18 20V10M12 20V4M6 20v-6" size={12} />
            Last non-direct click
            <Ic d="M6 9l6 6 6-6" size={11} />
          </button>
        </div>
      </div>

      <div className={s.body}>
        <div className={s.main}>

          {/* ── KPI row ────────────────────────────────────── */}
          <div className={s.kpiRow}>
            {['Sessions','Sales','Orders','Average order value'].map(k => (
              <div key={k} className={s.kpiCard}>
                <div className={s.kpiLabel}>{k}</div>
                <div className={s.kpiEmpty}>No data for this date range</div>
              </div>
            ))}
          </div>

          {/* ── Charts grid ────────────────────────────────── */}
          <div className={s.chartsGrid}>
            <EmptyChart label="Sessions by channel" />
            <EmptyChart label="Sales by channel" />
            <EmptyChart label="Sessions by UTM parameters" />
            <EmptyChart label="Sales by UTM parameters" />
            <EmptyChart label="Orders from new vs. returning customers" />
            <EmptyChart label="Sales by order" />
            <EmptyChart label="Items sold by product" />
            <EmptyChart label="Sessions by device" />
          </div>
        </div>

        {/* ── Right sidebar ──────────────────────────────── */}
        <aside className={s.aside}>

          {/* Campaign name */}
          <div className={s.asideCard}>
            <input className={s.asideInput} placeholder="Campaign name"
              value={name} onChange={e => setName(e.target.value)} />
            <div className={s.idRow}>
              <span className={s.idLabel}>ID</span>
              <span className={s.idVal}>{CAMPAIGN_ID}</span>
              <button className={s.copyBtn} title="Copy">
                <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
              </button>
            </div>
          </div>

          {/* Shareable links */}
          <div className={s.asideCard}>
            <button className={s.asideSectionBtn} onClick={() => setShareOpen(o => !o)}>
              <span className={s.asideSectionTitle}>Shareable links</span>
              <div className={s.asideSectionRight}>
                <Ic d="M12 5v14M5 12h14" size={14} />
                <Ic d={shareOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={14} />
              </div>
            </button>
            {shareOpen && (
              <div className={s.shareLink}>
                <div className={s.shareLinkIcon}>
                  <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={14} />
                </div>
                <span className={s.shareLinkUrl}>/s/{CAMPAIGN_ID}/?utm_campaign={CAMPAIGN_ID}&utm_s…</span>
                <button className={s.copyBtn}>
                  <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Auto-match rules */}
          <div className={s.asideCard}>
            <button className={s.asideSectionBtn} onClick={() => setRulesOpen(o => !o)}>
              <div>
                <div className={s.asideSectionTitle}>Auto-match rules</div>
                <div className={s.asideSectionSub}>Create rules to automatically assign traffic</div>
              </div>
              <Ic d={rulesOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={14} />
            </button>
            {rulesOpen && (
              <div className={s.rulesBody}>
                <button className={s.addRuleBtn}>
                  <Ic d="M12 5v14M5 12h14" size={13} />
                  Add rule
                </button>
              </div>
            )}
          </div>

          {/* Campaign activities */}
          <div className={s.asideCard}>
            <button className={s.asideSectionBtn} onClick={() => setActOpen(o => !o)}>
              <div>
                <div className={s.asideSectionTitle}>Campaign activities</div>
                <div className={s.asideSectionSub}>Manually assign existing marketing traffic</div>
              </div>
              <Ic d={actOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={14} />
            </button>
            {actOpen && (
              <div className={s.actBody}>
                <p className={s.actHint}>
                  Add marketing activities to this campaign to track their performance.
                </p>
                <button className={s.addActBtn}>
                  <Ic d="M12 5v14M5 12h14" size={13} />
                  Add activity
                </button>
              </div>
            )}
          </div>

          {/* Save / delete */}
          <div className={s.asideActions}>
            <button className={s.btnPrimary} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save campaign'}
            </button>
            <button className={s.btnDanger}
              onClick={() => { if (window.confirm('Delete this campaign?')) navigate('/marketing/campaigns') }}>
              Delete campaign
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
