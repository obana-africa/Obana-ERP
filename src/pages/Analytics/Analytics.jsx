import { useState } from 'react'
import styles from './Analytics.module.css'
import { fmt } from '../../utils/formatters'
import { Sparkline, BarChart, DonutChart } from '../../components/charts/AnalyticsCharts'
import {
  KPI_DATA, SALES_CHART, CHART_LABELS,
  TOP_PRODUCTS, TRAFFIC_SOURCES, PAYMENT_METHODS_DATA,
  STAFF_PERFORMANCE, CART_ABANDONMENT, CUSTOMER_SEGMENTS,
  ANALYTICS_TYPES, KPI_DEFINITIONS,
} from '../../data/analytics'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Reusable change pill ───────────────────────────────────
function ChangePill({ change, up }) {
  if (change === 0 || up === null)
    return <span className={styles.kpiNoChange}>— no change</span>
  return (
    <div className={`${styles.kpiChange} ${up ? styles.kpiUp : styles.kpiDown}`}>
      <Ic d={up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={12} stroke="currentColor" />
      {Math.abs(change)}%
    </div>
  )
}

// ── Static config ─────────────────────────────────────────
const TABS = [
  { key:'overview',    label:'Overview'        },
  { key:'pos',         label:'POS Analytics'   },
  { key:'online',      label:'Online Store'    },
  { key:'omnichannel', label:'Omnichannel'     },
  { key:'types',       label:'Analytics Types' },
]
const PERIODS  = ['Last 30 days', 'Last 7 days', 'Today']
const CHANNELS = ['All channels', 'Online Store', 'Point of Sale']

const SPARKLINES = {
  sessions:       [40,55,48,70,62,80,75,95,82,110,95,120],
  grossSales:     [80,120,95,140,110,160,130,180,155,200,175,220],
  orders:         [8,12,9,15,11,18,14,20,16,22,19,24],
  conversionRate: [0.2,0.3,0.25,0.35,0.28,0.4,0.33,0.42,0.38,0.45,0.4,0.48],
}

// ── Overview Tab ───────────────────────────────────────────
function OverviewTab({ kpi, period }) {
  return (
    <div className={styles.overviewGrid}>

      <div className={styles.chartCard} style={{ gridColumn:'1 / -1' }}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Revenue Over Time</h3>
          <div className={styles.cardMeta}>
            <span className={styles.legendDot} style={{ background:'#1a1a2e' }} /> Online
            <span className={styles.legendDot} style={{ background:'#2DBD97' }} /> POS
          </div>
        </div>
        <div className={styles.chartWrap}>
          <BarChart data={SALES_CHART[period]} labels={CHART_LABELS[period]} />
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Recent Orders</h3></div>
        {[
          { id:'#1042', amount:12500, status:'Paid'    },
          { id:'#1041', amount:8200,  status:'Pending' },
          { id:'#1040', amount:3600,  status:'Paid'    },
          { id:'#1039', amount:22000, status:'Paid'    },
        ].map(o => (
          <div key={o.id} className={styles.recentRow}>
            <span className={styles.orderId}>{o.id}</span>
            <span className={styles.orderAmt}>{fmt(o.amount)}</span>
            <span className={styles.statusPill} style={{
              background: o.status === 'Paid' ? '#ECFDF5' : '#FFFBEB',
              color:      o.status === 'Paid' ? '#059669' : '#D97706',
            }}>{o.status}</span>
          </div>
        ))}
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Top Products</h3></div>
        {TOP_PRODUCTS.slice(0,4).map((p, i) => (
          <div key={p.sku} className={styles.topProdRow}>
            <span className={styles.topProdRank}>{i + 1}</span>
            <div className={styles.topProdInfo}>
              <span className={styles.topProdName}>{p.name}</span>
              <div className={styles.topProdBar}>
                <div className={styles.topProdBarFill} style={{ width:`${(p.revenue / TOP_PRODUCTS[0].revenue) * 100}%` }} />
              </div>
            </div>
            <span className={styles.topProdPct}>{Math.round((p.revenue / TOP_PRODUCTS[0].revenue) * 100)}%</span>
          </div>
        ))}
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Quick Actions</h3></div>
        {['Add new product','Create discount','View inventory','Export reports'].map(a => (
          <div key={a} className={styles.quickAction}>
            <span>{a}</span>
            <span className={styles.actionArrow}>›</span>
          </div>
        ))}
      </div>

      <div className={styles.kpiSecRow} style={{ gridColumn:'1 / -1' }}>
        {[
          { label:'Avg Order Value',       kpiKey:'aov',     icon:'M2 8h20M2 16h20M6 4v16M18 4v16' },
          { label:'Customer Acq. Cost',    kpiKey:'cac',     icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87' },
          { label:'Inventory Turnover',    kpiKey:'turnover',icon:'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15' },
          { label:'Return on Mktg Invest', kpiKey:'romi',    icon:'M22 12h-4l-3 9L9 3l-3 9H2' },
        ].map(({ label, kpiKey, icon }) => {
          const k = kpi[kpiKey]
          return (
            <div key={label} className={styles.kpiSecCard}>
              <div className={styles.kpiSecIco}><Ic d={icon} size={18} /></div>
              <div className={styles.kpiSecVal}>{typeof k.value === 'number' ? fmt(k.value) : k.value}</div>
              <div className={styles.kpiSecLbl}>{label}</div>
              <div style={{ display:'flex', justifyContent:'center', marginTop:4 }}>
                <ChangePill change={k.change} up={k.up} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── POS Tab ────────────────────────────────────────────────
function POSTab({ kpi }) {
  return (
    <div className={styles.sectionGrid}>
      <div className={styles.wideCard}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Staff Performance</h3>
          <span className={styles.cardSub}>Sales productivity per associate</span>
        </div>
        <div className={styles.staffTable}>
          <div className={styles.staffHead}>
            <span>Staff Member</span><span>Total Sales</span>
            <span>Orders</span><span>Avg Order Value</span><span>Items / Txn</span>
          </div>
          {STAFF_PERFORMANCE.map(st => (
            <div key={st.name} className={styles.staffRow}>
              <span className={styles.staffCell}>
                <div className={styles.staffAvatar}>{st.name.split(' ').map(n => n[0]).join('')}</div>
                <div>
                  <div className={styles.staffName}>{st.name}</div>
                  <div className={styles.staffRole}>{st.role}</div>
                </div>
              </span>
              <span className={styles.staffSales}>{fmt(st.sales)}</span>
              <span>{st.orders}</span>
              <span>{fmt(st.aov)}</span>
              <span>
                <div className={styles.itemsBar}>
                  <div className={styles.itemsBarFill} style={{ width:`${(st.itemsPerTx / 3) * 100}%` }} />
                </div>
                <span style={{ fontSize:12 }}>{st.itemsPerTx}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Payment Methods</h3></div>
        <div className={styles.paymentGrid}>
          <DonutChart data={PAYMENT_METHODS_DATA} />
          <div className={styles.paymentLegend}>
            {PAYMENT_METHODS_DATA.map(p => (
              <div key={p.method} className={styles.payLegendRow}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:p.color, flexShrink:0 }} />
                <span className={styles.payMethod}>{p.method}</span>
                <span className={styles.payPct}>{p.pct}%</span>
                <span className={styles.payAmt}>{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>POS Key Metrics</h3></div>
        <div className={styles.metricsList}>
          {[
            { label:'Total POS Revenue',  value:fmt(1950000), up:true,  change:14 },
            { label:'POS Orders',         value:'47',          up:true,  change:8  },
            { label:'Avg Transaction',    value:fmt(41489),   up:false, change:-3 },
            { label:'Cash vs Card Split', value:'15% / 30%',  up:null,  change:0  },
            { label:'Top POS Product',    value:"Men's Kaftan",up:null,  change:0  },
          ].map(m => (
            <div key={m.label} className={styles.metricRow}>
              <span className={styles.metricLbl}>{m.label}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className={styles.metricVal}>{m.value}</span>
                {m.up !== null && <ChangePill change={m.change} up={m.up} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Online Tab ─────────────────────────────────────────────
function OnlineTab() {
  return (
    <div className={styles.sectionGrid}>
      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Traffic Sources</h3></div>
        <div className={styles.trafficList}>
          {TRAFFIC_SOURCES.map(t => (
            <div key={t.source} className={styles.trafficRow}>
              <div className={styles.trafficSource}>
                <span className={styles.trafficDot} style={{ background:t.color }} />
                <span className={styles.trafficName}>{t.source}</span>
              </div>
              <div className={styles.trafficBarWrap}>
                <div className={styles.trafficBar}>
                  <div className={styles.trafficBarFill} style={{ width:`${t.pct}%`, background:t.color }} />
                </div>
                <span className={styles.trafficPct}>{t.pct}%</span>
              </div>
              <span className={styles.trafficCount}>{t.visits}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.halfCard}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Conversion Funnel</h3>
          <span className={styles.cardSub}>Cart abandonment</span>
        </div>
        <div className={styles.funnelList}>
          {CART_ABANDONMENT.map(stage => (
            <div key={stage.stage} className={styles.funnelRow}>
              <div className={styles.funnelLabel}>
                <span className={styles.funnelStage}>{stage.stage}</span>
                {stage.dropOff > 0 && <span className={styles.funnelDrop}>−{stage.dropOff}%</span>}
              </div>
              <div className={styles.funnelBarWrap}>
                <div className={styles.funnelBar} style={{ width:`${(stage.count / CART_ABANDONMENT[0].count) * 100}%`, background:stage.color }} />
              </div>
              <span className={styles.funnelCount}>{stage.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className={styles.abandonRate}>
          <span>Cart Abandonment Rate</span>
          <strong style={{ color:'#DC2626' }}>69.9%</strong>
        </div>
      </div>

      <div className={styles.wideCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Online Store Metrics</h3></div>
        <div className={styles.onlineKpiGrid}>
          {[
            { label:'Online Revenue',      value:fmt(1960000), change:29, up:true },
            { label:'Online Orders',       value:'47',          change:18, up:true },
            { label:'Bounce Rate',         value:'38.4%',       change:-4, up:true },
            { label:'Avg Session Duration',value:'3m 42s',      change:12, up:true },
            { label:'Pages per Session',   value:'4.2',         change:8,  up:true },
            { label:'Mobile Traffic',      value:'74%',         change:6,  up:true },
          ].map(k => (
            <div key={k.label} className={styles.onlineKpiCard}>
              <div className={styles.onlineKpiVal}>{k.value}</div>
              <div className={styles.onlineKpiLbl}>{k.label}</div>
              <div style={{ display:'flex', justifyContent:'center', marginTop:4 }}>
                <ChangePill change={k.change} up={k.up} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Omnichannel Tab ────────────────────────────────────────
function OmnichannelTab() {
  return (
    <div className={styles.sectionGrid}>
      <div className={styles.wideCard}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Customer Segments</h3>
          <span className={styles.cardSub}>Purchase behaviour across all channels</span>
        </div>
        <div className={styles.segmentGrid}>
          {CUSTOMER_SEGMENTS.map(seg => (
            <div key={seg.segment} className={styles.segCard} style={{ borderTop:`3px solid ${seg.color}` }}>
              <div className={styles.segCount} style={{ color:seg.color }}>{seg.count}</div>
              <div className={styles.segName}>{seg.segment}</div>
              <div className={styles.segStats}>
                <div className={styles.segStat}>
                  <div className={styles.segStatVal}>{fmt(seg.revenue)}</div>
                  <div className={styles.segStatLbl}>Revenue</div>
                </div>
                <div className={styles.segStat}>
                  <div className={styles.segStatVal}>{fmt(seg.clv)}</div>
                  <div className={styles.segStatLbl}>Avg CLV</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.wideCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Top Products Across All Channels</h3></div>
        <div className={styles.prodTable}>
          <div className={styles.prodTableHead}>
            <span>Product</span><span>SKU</span><span>Revenue</span>
            <span>Units</span><span>Margin</span><span>Channel</span>
          </div>
          {TOP_PRODUCTS.map(p => (
            <div key={p.sku} className={styles.prodTableRow}>
              <span style={{ fontWeight:600 }}>{p.name}</span>
              <span style={{ fontFamily:'monospace', fontSize:12, color:'#6B7280' }}>{p.sku}</span>
              <span style={{ fontWeight:700 }}>{fmt(p.revenue)}</span>
              <span>{p.units}</span>
              <span>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <div style={{ flex:1, height:6, background:'#E5E7EB', borderRadius:3, overflow:'hidden' }}>
                    <div style={{ width:`${p.margin}%`, height:'100%', background:'#2DBD97', borderRadius:3 }} />
                  </div>
                  <span style={{ fontSize:12, color:'#059669', fontWeight:600 }}>{p.margin}%</span>
                </div>
              </span>
              <span>
                <span style={{
                  background: p.channel==='Both'?'#EEF2FF':p.channel==='Online'?'#ECFDF5':'#FFFBEB',
                  color:      p.channel==='Both'?'#3730A3':p.channel==='Online'?'#059669':'#D97706',
                  padding:'2px 8px', borderRadius:12, fontSize:11.5, fontWeight:600,
                }}>{p.channel}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Types Tab ──────────────────────────────────────────────
function TypesTab({ kpi }) {
  return (
    <div className={styles.typesSection}>
      <p className={styles.typesSub}>Understanding the four levels of retail analytics helps you make better decisions at every stage.</p>
      <div className={styles.typesGrid}>
        {ANALYTICS_TYPES.map(t => (
          <div key={t.type} className={styles.typeCard} style={{ borderTop:`3px solid ${t.color}` }}>
            <div className={styles.typeIco} style={{ color:t.color, background:t.bg }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={t.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {t.iconPaths.map((p, i) => <path key={i} d={p} />)}
              </svg>
            </div>
            <div className={styles.typeName}>{t.type}</div>
            <div className={styles.typeQuestion}>"{t.question}"</div>
            <div className={styles.typeExample}>{t.example}</div>
          </div>
        ))}
      </div>

      <div className={styles.kpiDefGrid}>
        <h3 className={styles.kpiDefTitle}>Key Performance Indicators</h3>
        {KPI_DEFINITIONS.map(k => {
          const liveVal =
            k.kpi === 'AOV'  ? fmt(kpi.aov.value)      :
            k.kpi === 'CAC'  ? fmt(kpi.cac.value)       :
            k.kpi === 'CLV'  ? fmt(k.staticValue)       :
            k.kpi === 'ROMI' ? kpi.romi.value           :
                               kpi.turnover.value
          return (
            <div key={k.kpi} className={styles.kpiDefCard}>
              <div className={styles.kpiDefBadge}>{k.kpi}</div>
              <div>
                <div className={styles.kpiDefName}>{k.full}</div>
                <div className={styles.kpiDefDesc}>{k.desc}</div>
                <div className={styles.kpiDefFormula}>{k.formula}</div>
                <div className={styles.kpiDefCurrent}>Current: <strong>{liveVal}</strong></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────
export default function Analytics() {
  const [period,  setPeriod]  = useState('Last 30 days')
  const [channel, setChannel] = useState('All channels')
  const [tab,     setTab]     = useState('overview')

  const kpi = KPI_DATA[period]

  const primaryKPIs = [
    { label:'Sessions',        kpiKey:'sessions',       sparkKey:'sessions',       format: v => v.toLocaleString() },
    { label:'Gross Sales',     kpiKey:'grossSales',     sparkKey:'grossSales',     format: v => fmt(v)             },
    { label:'Orders',          kpiKey:'orders',         sparkKey:'orders',         format: v => v                  },
    { label:'Conversion Rate', kpiKey:'conversionRate', sparkKey:'conversionRate', format: v => v                  },
  ]

  return (
    <div className={styles.page}>

      {/* Topbar */}
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pgTitle}>Good morning, let's get started.</h1>
          <p className={styles.pgSub}>Here's what's happening with your store today.</p>
        </div>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline}>
            <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 15V3" size={13} />
            Export Report
          </button>
        </div>
      </header>

      <div className={styles.content}>

        {/* Period + Channel */}
        <div className={styles.filterRow}>
          <div className={styles.periodTabs}>
            {PERIODS.map(p => (
              <button key={p}
                className={`${styles.periodTab} ${period === p ? styles.periodTabOn : ''}`}
                onClick={() => setPeriod(p)}>
                {p}
              </button>
            ))}
          </div>
          <select className={styles.channelSel} value={channel} onChange={e => setChannel(e.target.value)}>
            {CHANNELS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Primary KPI cards */}
        <div className={styles.kpiRow}>
          {primaryKPIs.map(({ label, kpiKey, sparkKey, format }) => {
            const k = kpi[kpiKey]
            return (
              <div key={label} className={styles.kpiCard}>
                <div className={styles.kpiTop}>
                  <span className={styles.kpiLabel}>{label}</span>
                  <Sparkline data={SPARKLINES[sparkKey]} color={k.up === false ? '#EF4444' : '#2DBD97'} />
                </div>
                <div className={styles.kpiValue}>{format(k.value)}</div>
                <ChangePill change={k.change} up={k.up} />
              </div>
            )
          })}
        </div>

        {/* Alert strips */}
        <div className={styles.alertStrip}>
          <div className={styles.alertItem} style={{ borderLeftColor:'#EF4444' }}>
            <span className={styles.alertDot} style={{ background:'#EF4444' }} />
            21 orders to fulfil
            <span className={styles.alertArrow}>›</span>
          </div>
          <div className={styles.alertItem} style={{ borderLeftColor:'#F59E0B' }}>
            <span className={styles.alertDot} style={{ background:'#F59E0B' }} />
            50+ payments to capture
            <span className={styles.alertArrow}>›</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {TABS.map(t => (
              <button key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.tabOn : ''}`}
                onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tab === 'overview'    && <OverviewTab    kpi={kpi} period={period} />}
        {tab === 'pos'         && <POSTab         kpi={kpi} />}
        {tab === 'online'      && <OnlineTab />}
        {tab === 'omnichannel' && <OmnichannelTab />}
        {tab === 'types'       && <TypesTab       kpi={kpi} />}
      </div>
    </div>
  )
}
