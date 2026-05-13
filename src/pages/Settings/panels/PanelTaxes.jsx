
import { useState, useCallback } from 'react'
import { useNavigate }           from 'react-router-dom'
import styles from './PanelTaxes.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.6, fill = 'none', style: st }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...st }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Shared primitives ─────────────────────────────────────────── */
function SaveBar({ dirty, saving, onSave, onDiscard }) {
  if (!dirty) return null
  return (
    <div className={styles.saveBar}>
      <span className={styles.saveBarMsg}>You have unsaved changes</span>
      <div className={styles.saveBarActions}>
        <button className={styles.discardBtn} onClick={onDiscard}>Discard</button>
        <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

function Toast({ msg, type = 'success', onDone }) {
  useState(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) })
  return (
    <div className={`${styles.toast} ${type === 'error' ? styles.toastError : ''}`}>
      <Ic d={type === 'error' ? 'M18 6L6 18M6 6l12 12' : 'M20 6L9 17l-5-5'} size={13}
        stroke={type === 'error' ? '#EF4444' : '#2DBD97'} />
      {msg}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={value}
      className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
      onClick={() => onChange?.(!value)}>
      <span className={styles.toggleThumb} />
    </button>
  )
}

function Breadcrumb({ crumbs, onBack }) {
  return (
    <div className={styles.breadcrumb}>
      <button className={styles.breadBtn} onClick={onBack}>
        <Ic d="M19 12H5M12 5l-7 7 7 7" size={14} />
      </button>
      {crumbs.map((c, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:4 }}>
          {i > 0 && <Ic d="M9 18l6-6-6-6" size={11} stroke="#9CA3AF" />}
          <span className={i === crumbs.length - 1 ? styles.breadCurrent : styles.breadPrev}>{c}</span>
        </span>
      ))}
    </div>
  )
}

/* ── Data ──────────────────────────────────────────────────────── */
const TAX_REGIONS = [
  { id:'NG', name:'Nigeria',              flag:'🇳🇬', collecting:'Taxes', service:'Manual Tax', rate:7.5,  vatNum:'' },
  { id:'AU', name:'Australia',            flag:'🇦🇺', collecting:null,    service:'Basic Tax',  rate:10,   vatNum:'' },
  { id:'CA', name:'Canada',               flag:'🇨🇦', collecting:null,    service:'Basic Tax',  rate:5,    vatNum:'' },
  { id:'EU', name:'European Union',       flag:'🇪🇺', collecting:null,    service:'Taja Tax',   rate:20,   vatNum:'' },
  { id:'HK', name:'Hong Kong SAR',        flag:'🇭🇰', collecting:null,    service:'Manual Tax', rate:0,    vatNum:'' },
  { id:'IL', name:'Israel',               flag:'🇮🇱', collecting:null,    service:'Manual Tax', rate:17,   vatNum:'' },
  { id:'JP', name:'Japan',                flag:'🇯🇵', collecting:null,    service:'Manual Tax', rate:10,   vatNum:'' },
  { id:'MY', name:'Malaysia',             flag:'🇲🇾', collecting:null,    service:'Manual Tax', rate:6,    vatNum:'' },
  { id:'NZ', name:'New Zealand',          flag:'🇳🇿', collecting:null,    service:'Basic Tax',  rate:15,   vatNum:'' },
  { id:'NO', name:'Norway',               flag:'🇳🇴', collecting:null,    service:'Basic Tax',  rate:25,   vatNum:'' },
  { id:'SG', name:'Singapore',            flag:'🇸🇬', collecting:null,    service:'Basic Tax',  rate:9,    vatNum:'' },
  { id:'KR', name:'South Korea',          flag:'🇰🇷', collecting:null,    service:'Manual Tax', rate:10,   vatNum:'' },
  { id:'CH', name:'Switzerland',          flag:'🇨🇭', collecting:null,    service:'Basic Tax',  rate:7.7,  vatNum:'' },
  { id:'AE', name:'United Arab Emirates', flag:'🇦🇪', collecting:null,    service:'Manual Tax', rate:5,    vatNum:'' },
  { id:'GB', name:'United Kingdom',       flag:'🇬🇧', collecting:null,    service:'Taja Tax',   rate:20,   vatNum:'' },
]

const SERVICE_COLORS = {
  'Manual Tax': { bg:'#F3F4F6', color:'#374151' },
  'Basic Tax':  { bg:'#EFF6FF', color:'#1D4ED8' },
  'Taja Tax':   { bg:'#E6F7F2', color:'#047857' },
}

const APP_PARTNERS = [
  { id:'quaderno', name:'Quaderno', logo:'Q',  logoColor:'#7C3AED', logoBg:'#F5F3FF',
    desc:'Automated tax compliance — VAT, GST, and US sales tax.',
    badge:'Popular', badgeColor:'#7C3AED', badgeBg:'#F5F3FF' },
  { id:'taxjar',   name:'TaxJar',   logo:'TJ', logoColor:'#059669', logoBg:'#ECFDF5',
    desc:'Sales tax automation. AutoFile and real-time calculations.',
    badge:null, badgeColor:'', badgeBg:'' },
]

const PER_PAGE = 10

/* ═══════════════════════════════════════════════════════════════
   SUB-VIEW: TAX SERVICE
════════════════════════════════════════════════════════════════ */
function ViewTaxService({ onBack, showToast }) {
  const [connected, setConnected] = useState(null)

  const connect = (id) => {
    setConnected(id)
    showToast(`Connected to ${APP_PARTNERS.find(p => p.id === id)?.name}`)
    // API: await api.post('/api/settings/taxes/service', { provider: id })
  }
  const disconnect = () => {
    setConnected(null)
    showToast('Tax service disconnected', 'error')
    // API: await api.delete('/api/settings/taxes/service')
  }

  return (
    <div className={styles.panel}>
      <Breadcrumb crumbs={['Taxes & Duties', 'Tax service']} onBack={onBack} />

      {/* Built by Taja */}
      <div className={styles.section}>
        <div className={styles.builtByLabel}>Built by Taja</div>
        <div className={styles.serviceRow}>
          <div className={styles.serviceLogo}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#2DBD97">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9H13V8.5a1.5 1.5 0 0 0-3 0V11H7.5a1.5 1.5 0 0 0 0 3H10v2.5a1.5 1.5 0 0 0 3 0V14h2.5a1.5 1.5 0 0 0 0-3z"/>
            </svg>
          </div>
          <div className={styles.serviceInfo}>
            <div className={styles.serviceNameRow}>
              <span className={styles.serviceName}>Taja tax services</span>
              <span className={styles.activeBadge}><span className={styles.activeDot} /> Active</span>
            </div>
            <div className={styles.serviceDesc}>
              Tax compliance, simplified · <a href="#" className={styles.link}>Free and paid services</a>
            </div>
          </div>
          <button className={styles.outlineBtn} onClick={onBack}>Configure</button>
        </div>
      </div>

      {/* Partner apps */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Apps</h2>
            <p className={styles.sectionSub}>Connect your preferred sales tax service. More partners coming soon.</p>
          </div>
        </div>
        <div className={styles.sectionBody}>
          {APP_PARTNERS.map((app, i) => (
            <div key={app.id} className={styles.appRow} style={{ animationDelay:`${i*60}ms` }}>
              <div className={styles.appLogo} style={{ background: app.logoBg, color: app.logoColor }}>
                {app.logo}
              </div>
              <div className={styles.appInfo}>
                <div className={styles.appNameRow}>
                  <span className={styles.appName}>{app.name}</span>
                  {app.badge && (
                    <span className={styles.appBadge} style={{ background:app.badgeBg, color:app.badgeColor }}>
                      {app.badge}
                    </span>
                  )}
                  {connected === app.id && (
                    <span className={styles.connectedBadge}><span className={styles.activeDot} /> Connected</span>
                  )}
                </div>
                <div className={styles.appDesc}>{app.desc}</div>
              </div>
              {connected === app.id
                ? <button className={styles.disconnectBtn} onClick={disconnect}>Disconnect</button>
                : <button className={styles.connectBtn} onClick={() => connect(app.id)}>Connect</button>
              }
            </div>
          ))}
          {[0,1].map(i => (
            <div key={i} className={styles.skeletonRow}>
              <div className={styles.skeletonLogo} />
              <div className={styles.skeletonLines}>
                <div className={styles.skeletonLine} style={{ width: i===0?'55%':'45%' }} />
                <div className={styles.skeletonLine} style={{ width: i===0?'75%':'65%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.infoNote}>
        <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#6B7280" />
        <span>Changes to your tax service may affect your store's tax calculations at checkout.</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SUB-VIEW: TAX REGION
════════════════════════════════════════════════════════════════ */
function ViewTaxRegion({ region, onBack, onSave, showToast }) {
  const [collecting, setCollecting] = useState(!!region.collecting)
  const [rate,       setRate]       = useState(region.rate)
  const [vatNum,     setVatNum]     = useState(region.vatNum)
  const [saving,     setSaving]     = useState(false)

  const init  = JSON.stringify({ collecting: !!region.collecting, rate: region.rate, vatNum: region.vatNum })
  const curr  = JSON.stringify({ collecting, rate, vatNum })
  const dirty = curr !== init

  const save = async () => {
    setSaving(true)
    // API: await api.put(`/api/settings/taxes/regions/${region.id}`, { collecting, rate, vatNum })
    await new Promise(r => setTimeout(r, 700))
    onSave({ ...region, collecting: collecting ? 'Taxes' : null, rate, vatNum })
    setSaving(false)
    showToast(`${region.name} saved`)
    onBack()
  }

  const discard = () => {
    setCollecting(!!region.collecting)
    setRate(region.rate)
    setVatNum(region.vatNum)
  }

  return (
    <div className={styles.panel}>
      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
      <Breadcrumb crumbs={['Taxes & Duties', `${region.flag} ${region.name}`]} onBack={onBack} />

      <div className={styles.section}>
        {/* Collecting */}
        <div className={styles.regionSettingRow}>
          <div>
            <div className={styles.regionSettingLabel}>Collecting tax</div>
            <div className={styles.regionSettingDesc}>Enable to collect and remit tax for {region.name}</div>
          </div>
          <Toggle value={collecting} onChange={setCollecting} />
        </div>

        {/* Rate */}
        {collecting && (
          <div className={styles.regionSettingRow}>
            <label className={styles.regionSettingLabel}>Tax rate</label>
            <div className={styles.rateInput}>
              <input type="number" min={0} max={100} step={0.1}
                className={styles.rateField} value={rate}
                onChange={e => setRate(parseFloat(e.target.value) || 0)} />
              <span className={styles.rateSuffix}>%</span>
            </div>
          </div>
        )}

        {/* Service */}
        <div className={styles.regionSettingRow}>
          <div>
            <div className={styles.regionSettingLabel}>Tax service</div>
            <div className={styles.regionSettingDesc}>{region.service}</div>
          </div>
          <button className={styles.outlineBtn} onClick={() => onBack('service')}>Change</button>
        </div>

        {/* VAT number */}
        <div className={styles.regionSettingCol}>
          <label className={styles.fieldLabel}>VAT / Tax registration number</label>
          <input className={styles.fieldInput} value={vatNum}
            onChange={e => setVatNum(e.target.value)} placeholder="e.g. NG12345678" />
          <span className={styles.fieldHint}>Optional. Displayed on invoices if provided.</span>
        </div>
      </div>

      <div className={styles.formFooter}>
        <button className={styles.cancelBtn} onClick={onBack}>Cancel</button>
        <button className={styles.saveBtn} onClick={save} disabled={saving || !dirty}>
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PANEL
════════════════════════════════════════════════════════════════ */
export default function PanelTaxes() {
  const navigate = useNavigate()

  const [view,   setView]   = useState('main') // 'main' | 'service' | {type:'region',region}
  const [regions, setRegions] = useState(TAX_REGIONS)
  const [toast,   setToast]   = useState(null)
  const [page,    setPage]    = useState(1)
  const [query,   setQuery]   = useState('')
  const [dutiesOpen, setDutiesOpen] = useState(true)
  const [custOpen,   setCustOpen]   = useState(true)

  /* Global settings */
  const [inclSalesTax,   setInclSalesTax]   = useState(false)
  const [chargeShipTax,  setChargeShipTax]  = useState(false)
  const [chargeVatGoods, setChargeVatGoods] = useState(false)
  const globalState = JSON.stringify({ inclSalesTax, chargeShipTax, chargeVatGoods })
  const [globalSaved,   setGlobalSaved]  = useState(globalState)
  const [globalSaving,  setGlobalSaving] = useState(false)
  const globalDirty = globalState !== globalSaved

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const saveGlobal = async () => {
    setGlobalSaving(true)
    // API: await api.put('/api/settings/taxes/global', { inclSalesTax, chargeShipTax, chargeVatGoods })
    await new Promise(r => setTimeout(r, 700))
    setGlobalSaved(globalState)
    setGlobalSaving(false)
    showToast('Global tax settings saved')
  }

  const updateRegion = useCallback((updated) => {
    setRegions(rs => rs.map(r => r.id === updated.id ? updated : r))
  }, [])

  /* Derived */
  const filtered  = regions.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
  const paginated = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))

  /* ── Sub-views ──────────────────────────────────────────────── */
  if (view === 'service') {
    return <ViewTaxService onBack={() => setView('main')} showToast={showToast} />
  }
  if (view?.type === 'region') {
    return (
      <ViewTaxRegion
        region={view.region}
        onBack={(dest) => dest === 'service' ? setView('service') : setView('main')}
        onSave={updateRegion}
        showToast={showToast}
      />
    )
  }

  return (
    <div className={styles.panel}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      {/* ── TAX SERVICE ────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Tax service</h2>
          <button className={styles.outlineBtn} onClick={() => setView('service')}>Manage</button>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.taxServiceRow}>
            <div className={styles.tsBadgeWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#2DBD97">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9H13V8.5a1.5 1.5 0 0 0-3 0V11H7.5a1.5 1.5 0 0 0 0 3H10v2.5a1.5 1.5 0 0 0 3 0V14h2.5a1.5 1.5 0 0 0 0-3z"/>
              </svg>
            </div>
            <span className={styles.tsName}>Taja tax services</span>
            <span className={styles.activeDot} />
            <span className={styles.tsActive}>Active</span>
          </div>
        </div>
      </div>

      {/* ── TAX REGIONS ────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Tax regions</h2>
            <p className={styles.sectionSub}>
              Areas where your customers will pay tax.{' '}
              <a href="#" className={styles.link}>Create a shipping zone</a>{' '}
              to add a new tax region.
            </p>
          </div>
          <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={15} stroke="#9CA3AF" />
        </div>

        {/* Toolbar */}
        <div className={styles.regionToolbar}>
          <div className={styles.searchWrap}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={13} stroke="#9CA3AF" />
            <input className={styles.searchInput} placeholder="Search regions…"
              value={query} onChange={e => { setQuery(e.target.value); setPage(1) }} />
            {query && (
              <button className={styles.clearSearch}
                onClick={() => { setQuery(''); setPage(1) }}>
                <Ic d="M18 6L6 18M6 6l12 12" size={11} />
              </button>
            )}
          </div>
          <button className={styles.iconBtn}><Ic d="M22 3H2l8 9.46V19l4 2v-8.54L22 3" size={13} /></button>
          <button className={styles.iconBtn}><Ic d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" size={13} /></button>
        </div>

        {/* Table head */}
        <div className={styles.regionTHead}>
          <span>Region</span>
          <span>Collecting</span>
          <span>Tax service</span>
        </div>

        {/* Rows */}
        {paginated.length === 0
          ? <div className={styles.emptyRegion}>No regions match "{query}"</div>
          : paginated.map((r, i) => (
            <div key={r.id} className={styles.regionRow}
              style={{ animationDelay:`${i*25}ms` }}
              onClick={() => setView({ type:'region', region: r })}>
              <span className={styles.regionName}>
                <span className={styles.regionFlag}>{r.flag}</span>{r.name}
              </span>
              <span>
                {r.collecting
                  ? <span className={styles.collectingPill}>{r.collecting}</span>
                  : <span className={styles.dash}>—</span>}
              </span>
              <span className={styles.regionRowRight}>
                <span className={styles.servicePill}
                  style={{ background:SERVICE_COLORS[r.service]?.bg, color:SERVICE_COLORS[r.service]?.color }}>
                  {r.service}
                </span>
                <Ic d="M9 18l6-6-6-6" size={13} stroke="#D1D5DB" />
              </span>
            </div>
          ))}

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.pgLabel}>
            {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
          </span>
          <div style={{ display:'flex', gap:4 }}>
            <button className={styles.pgBtn} disabled={page===1} onClick={() => setPage(p => p-1)}>
              <Ic d="M15 18l-6-6 6-6" size={13} />
            </button>
            <button className={styles.pgBtn} disabled={page>=totalPages} onClick={() => setPage(p => p+1)}>
              <Ic d="M9 18l6-6-6-6" size={13} />
            </button>
          </div>
        </div>

        {/* Tax report */}
        <button className={styles.globalTaxReport} onClick={() => navigate('/analytics')}>
          <Ic d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" size={15} stroke="#6B7280" />
          <span>Global collected tax report</span>
          <Ic d="M9 18l6-6-6-6" size={14} stroke="#9CA3AF" style={{ marginLeft:'auto' }} />
        </button>
      </div>

      {/* ── DUTIES ─────────────────────────────────────────────── */}
      <div className={styles.section}>
        <button className={styles.collapsibleHead} onClick={() => setDutiesOpen(o => !o)}>
          <h2 className={styles.sectionTitle}>Duties and import taxes</h2>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#9CA3AF" />
            <Ic d={dutiesOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={14} />
          </div>
        </button>
        {dutiesOpen && (
          <div className={styles.collapsibleBody}>
            <div className={styles.dutiesRow}>
              <div>
                <div className={styles.dutiesTitle}>Collect duties and import taxes at checkout</div>
                <div className={styles.dutiesDesc}>Prevent surprise fees for international customers · 0.5% transaction fee</div>
              </div>
              <button className={styles.outlineBtn} onClick={() => showToast('Duties setup — coming soon')}>Set up</button>
            </div>
            <div className={styles.infoBanner}>
              <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#1D4ED8" />
              <span>Ensure carriers offer <a href="#" className={styles.link}>Delivered Duty Paid (DDP)</a> shipping labels</span>
            </div>
          </div>
        )}
      </div>

      {/* ── CUSTOMS ────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <button className={styles.collapsibleHeadInline} onClick={() => setCustOpen(o => !o)}>
            <h2 className={styles.sectionTitle}>Customs information</h2>
            <Ic d={custOpen ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={14} />
          </button>
          <button className={styles.iconBtn}>
            <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={14} sw={2.5} />
          </button>
        </div>
        {custOpen && (
          <>
            {[
              { title:'Country of origin',              desc:'Included in 190 out of 5,608 variants · No default set' },
              { title:'Harmonized System (HS) codes',   desc:'Included in 47 out of 5,608 variants' },
            ].map(item => (
              <div key={item.title} className={styles.custRow}
                onClick={() => navigate('/products')}>
                <div>
                  <div className={styles.custTitle}>{item.title}</div>
                  <div className={styles.custDesc}>{item.desc}</div>
                </div>
                <Ic d="M9 18l6-6-6-6" size={14} stroke="#9CA3AF" />
              </div>
            ))}
          </>
        )}
      </div>

      {/* ── GLOBAL SETTINGS ────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHead} style={{ paddingBottom:16 }}>
          <h2 className={styles.sectionTitle}>Global settings</h2>
        </div>
        {globalDirty && (
          <SaveBar dirty={globalDirty} saving={globalSaving} onSave={saveGlobal}
            onDiscard={() => {
              const s = JSON.parse(globalSaved)
              setInclSalesTax(s.inclSalesTax); setChargeShipTax(s.chargeShipTax); setChargeVatGoods(s.chargeVatGoods)
            }} />
        )}
        {[
          { state:inclSalesTax,   set:setInclSalesTax,
            label:'Include sales tax in product price and shipping rate',
            desc:'Assumes a 7.5% tax rate, adjusted to local rates in markets with dynamic tax inclusion.' },
          { state:chargeShipTax,  set:setChargeShipTax,
            label:'Charge sales tax on shipping',
            desc:'Automatically calculated for Canada, European Union, and United States.' },
          { state:chargeVatGoods, set:setChargeVatGoods,
            label:'Charge VAT on digital goods',
            desc:'Creates a collection of digital goods charged VAT at checkout (for European customers).' },
        ].map((item, i) => (
          <label key={i} className={styles.checkRow}>
            <input type="checkbox" className={styles.checkbox}
              checked={item.state} onChange={e => item.set(e.target.checked)} />
            <div>
              <div className={styles.checkLabel}>{item.label}</div>
              <div className={styles.checkDesc}>{item.desc}</div>
            </div>
          </label>
        ))}
        <div className={styles.saveRow}>
          <button className={styles.primaryBtn} onClick={saveGlobal}
            disabled={globalSaving || !globalDirty}>
            {globalSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.learnMore}>
        <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#9CA3AF" />
        <a href="#" className={styles.learnLink}>Learn more about sales tax</a>
      </div>
    </div>
  )
}
