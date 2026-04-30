import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Analytics.module.css'
import { fmt } from '../../utils/formatters'
import { Sparkline, BarChart, DonutChart } from '../../components/charts/AnalyticsCharts'
import {
  KPI_DATA, SALES_CHART, CHART_LABELS,
  TOP_PRODUCTS, TRAFFIC_SOURCES, PAYMENT_METHODS_DATA,
  STAFF_PERFORMANCE, CART_ABANDONMENT, CUSTOMER_SEGMENTS,
  ANALYTICS_TYPES, KPI_DEFINITIONS,
} from '../../data/analytics'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

function SparkLine({ data, color, w = 80, h = 28 }) {
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', flexShrink: 0 }}>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.1" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  )
}

function ChangePill({ change, up }) {
  if (change === 0 || up === null)
    return <span className={styles.kpiNoChange}>— no change</span>
  return (
    <div className={`${styles.kpiChange} ${up ? styles.kpiUp : styles.kpiDown}`}>
      <Ic d={up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={11} stroke="currentColor" />
      {Math.abs(change)}%
    </div>
  )
}

const SPARKLINES = {
  sessions:       [40,55,48,70,62,80,75,95,82,110,95,120],
  grossSales:     [80,120,95,140,110,160,130,180,155,200,175,220],
  orders:         [8,12,9,15,11,18,14,20,16,22,19,24],
  conversionRate: [0.2,0.3,0.25,0.35,0.28,0.4,0.33,0.42,0.38,0.45,0.4,0.48],
}
const KPI_COLORS = { sessions:'#1b3b5f', grossSales:'#2DBD97', orders:'#E8C547', conversionRate:'#8B5CF6' }

const TABS = [
  { key:'overview',    label:'Overview',      icon:'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { key:'pos',         label:'POS Analytics', icon:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z' },
  { key:'online',      label:'Online Store',  icon:'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3' },
  { key:'omnichannel', label:'Omnichannel',   icon:'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  { key:'types',       label:'KPI Guide',     icon:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
]
const PERIODS  = ['Today','Last 7 days','Last 30 days']
const CHANNELS = ['All channels','Online Store','Point of Sale']

/* ── Sub-tab components ──────────────────────────────────────── */
function OverviewTab({ kpi, period, nav }) {
  const ORDERS = [
    { id:'#1042', customer:'Amaka Obi',     amount:12500, status:'Paid',    channel:'Online' },
    { id:'#1041', customer:'Emeka Dike',    amount:8200,  status:'Pending', channel:'POS'   },
    { id:'#1040', customer:'Fatima Bello',  amount:3600,  status:'Paid',    channel:'Online' },
    { id:'#1039', customer:'Chidi Okeke',   amount:22000, status:'Paid',    channel:'Online' },
  ]
  return (
    <div className={styles.overviewGrid}>
      <div className={styles.chartCard} style={{ gridColumn:'1 / -1' }}>
        <div className={styles.cardHead}>
          <div>
            <h3 className={styles.cardTitle}>Revenue Over Time</h3>
            <p className={styles.cardSub}>Online Store vs POS performance</p>
          </div>
          <div className={styles.cardHeadRight}>
            <div className={styles.legendRow}>
              <span className={styles.legendDot} style={{ background:'#1b3b5f' }} /><span className={styles.legendLabel}>Online</span>
              <span className={styles.legendDot} style={{ background:'#2DBD97' }} /><span className={styles.legendLabel}>POS</span>
            </div>
            <button className={styles.cardActionBtn} onClick={() => nav('/analytics')}>Full report →</button>
          </div>
        </div>
        <div className={styles.chartWrap} style={{ height: '180px' }}><BarChart data={SALES_CHART[period]} labels={CHART_LABELS[period]} /></div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Recent Orders</h3>
          <button className={styles.cardActionBtn} onClick={() => nav('/orders')}>View all →</button>
        </div>
        {ORDERS.map((o,i) => (
          <div key={o.id} className={styles.recentRow} style={{ animationDelay:`${i*40}ms` }} onClick={() => nav('/orders')}>
            <span className={styles.orderId}>{o.id}</span>
            <span className={styles.orderCustomer}>{o.customer}</span>
            <span className={`${styles.channelChip} ${o.channel==='POS'?styles.chipPOS:styles.chipOnline}`}>{o.channel}</span>
            <span className={styles.orderAmt}>{fmt(o.amount)}</span>
            <span className={styles.statusPill} style={{ background:o.status==='Paid'?'#ECFDF5':'#FFFBEB', color:o.status==='Paid'?'#059669':'#D97706' }}>{o.status}</span>
          </div>
        ))}
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>Top Products</h3>
          <button className={styles.cardActionBtn} onClick={() => nav('/products')}>View all →</button>
        </div>
        {TOP_PRODUCTS.slice(0,5).map((p,i) => (
          <div key={p.sku} className={styles.topProdRow} style={{ animationDelay:`${i*40}ms` }} onClick={() => nav('/products')}>
            <span className={styles.topProdRank}>{i+1}</span>
            <div className={styles.topProdInfo}>
              <span className={styles.topProdName}>{p.name}</span>
              <div className={styles.topProdBar}><div className={styles.topProdBarFill} style={{ width:`${(p.revenue/TOP_PRODUCTS[0].revenue)*100}%` }} /></div>
            </div>
            <span className={styles.topProdAmt}>{fmt(p.revenue)}</span>
          </div>
        ))}
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Quick Actions</h3></div>
        {[
          { label:'Add new product',  icon:'M12 5v14M5 12h14',                                       to:'/products',  state:{ openModal:'add' } },
          { label:'Create discount',  icon:'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0', to:'/discounts', state:null },
          { label:'View inventory',   icon:'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', to:'/inventory', state:null },
          { label:'Manage customers', icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',              to:'/customers', state:null },
          { label:'View all orders',  icon:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', to:'/orders', state:null },
        ].map((a,i) => (
          <button key={a.label} className={styles.quickAction} style={{ animationDelay:`${i*40}ms` }}
            onClick={() => nav(a.to, a.state ? { state:a.state } : undefined)}>
            <Ic d={a.icon} size={14} stroke="#1b3b5f" />
            <span>{a.label}</span>
            <span className={styles.actionArrow}>›</span>
          </button>
        ))}
      </div>

      <div className={styles.kpiSecRow} style={{ gridColumn:'1 / -1' }}>
        {[
          { label:'Avg Order Value',       kpiKey:'aov',     color:'#2DBD97', icon:'M2 8h20M2 16h20M6 4v16M18 4v16', route:'/analytics' },
          { label:'Customer Acq. Cost',    kpiKey:'cac',     color:'#1b3b5f', icon:'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87', route:'/customers' },
          { label:'Inventory Turnover',    kpiKey:'turnover',color:'#E8C547', icon:'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15', route:'/inventory' },
          { label:'Return on Mktg Invest', kpiKey:'romi',    color:'#8B5CF6', icon:'M22 12h-4l-3 9L9 3l-3 9H2', route:'/analytics' },
        ].map(({ label, kpiKey, color, icon, route }, i) => {
          const k = kpi[kpiKey]
          return (
            <div key={label} className={styles.kpiSecCard}
              style={{ animationDelay:`${i*60}ms`, borderTopColor:color }}
              onClick={() => nav(route)}>
              <div className={styles.kpiSecIco} style={{ background:`${color}18`, color }}><Ic d={icon} size={18} stroke={color} /></div>
              <div className={styles.kpiSecVal} style={{ color }}>{typeof k.value==='number'?fmt(k.value):k.value}</div>
              <div className={styles.kpiSecLbl}>{label}</div>
              <div style={{ display:'flex', justifyContent:'center', marginTop:4 }}><ChangePill change={k.change} up={k.up} /></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function POSTab({ kpi, nav }) {
  return (
    <div className={styles.sectionGrid}>
      <div className={styles.wideCard}>
        <div className={styles.cardHead}>
          <div><h3 className={styles.cardTitle}>Staff Performance</h3><p className={styles.cardSub}>Sales productivity per associate</p></div>
          <button className={styles.cardActionBtn} onClick={() => nav('/pos')}>Open POS →</button>
        </div>
        <div className={styles.staffTable}>
          <div className={styles.staffHead}><span>Staff Member</span><span>Total Sales</span><span>Orders</span><span>Avg Order Value</span><span>Items / Txn</span></div>
          {STAFF_PERFORMANCE.map((st,i) => (
            <div key={st.name} className={styles.staffRow} style={{ animationDelay:`${i*50}ms` }}>
              <span className={styles.staffCell}>
                <div className={styles.staffAvatar}>{st.name.split(' ').map(n=>n[0]).join('')}</div>
                <div><div className={styles.staffName}>{st.name}</div><div className={styles.staffRole}>{st.role}</div></div>
              </span>
              <span className={styles.staffSales}>{fmt(st.sales)}</span>
              <span className={styles.staffNum}>{st.orders}</span>
              <span className={styles.staffNum}>{fmt(st.aov)}</span>
              <span><div className={styles.itemsBarWrap}><div className={styles.itemsBar}><div className={styles.itemsBarFill} style={{ width:`${(st.itemsPerTx/3)*100}%` }} /></div><span className={styles.itemsNum}>{st.itemsPerTx}</span></div></span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Payment Methods</h3><button className={styles.cardActionBtn} onClick={() => nav('/settings')}>Configure →</button></div>
        <div className={styles.paymentGrid}>
          <DonutChart data={PAYMENT_METHODS_DATA} />
          <div className={styles.paymentLegend}>
            {PAYMENT_METHODS_DATA.map(p => (
              <div key={p.method} className={styles.payLegendRow}>
                <span style={{ width:10, height:10, borderRadius:'50%', background:p.color, flexShrink:0, display:'inline-block' }} />
                <span className={styles.payMethod}>{p.method}</span>
                <span className={styles.payPct}>{p.pct}%</span>
                <span className={styles.payAmt}>{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>POS Key Metrics</h3><button className={styles.cardActionBtn} onClick={() => nav('/pos')}>Go to POS →</button></div>
        <div className={styles.metricsList}>
          {[
            { label:'Total POS Revenue', value:fmt(1950000), up:true,  change:14 },
            { label:'POS Orders',        value:'47',          up:true,  change:8  },
            { label:'Avg Transaction',   value:fmt(41489),   up:false, change:-3 },
            { label:'Cash vs Card Split',value:'15% / 30%',  up:null,  change:0  },
            { label:'Top POS Product',   value:"Men's Kaftan",up:null,  change:0  },
          ].map((m,i) => (
            <div key={m.label} className={styles.metricRow} style={{ animationDelay:`${i*50}ms` }}>
              <span className={styles.metricLbl}>{m.label}</span>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><span className={styles.metricVal}>{m.value}</span>{m.up!==null&&<ChangePill change={m.change} up={m.up} />}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OnlineTab({ nav }) {
  return (
    <div className={styles.sectionGrid}>
      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Traffic Sources</h3></div>
        <div className={styles.trafficList}>
          {TRAFFIC_SOURCES.map((t,i) => (
            <div key={t.source} className={styles.trafficRow} style={{ animationDelay:`${i*50}ms` }}>
              <div className={styles.trafficSource}><span className={styles.trafficDot} style={{ background:t.color }} /><span className={styles.trafficName}>{t.source}</span></div>
              <div className={styles.trafficBarWrap}><div className={styles.trafficBar}><div className={styles.trafficBarFill} style={{ width:`${t.pct}%`, background:t.color }} /></div><span className={styles.trafficPct}>{t.pct}%</span></div>
              <span className={styles.trafficCount}>{t.visits.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.halfCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Conversion Funnel</h3><span className={styles.cardSub}>Cart abandonment</span></div>
        <div className={styles.funnelList}>
          {CART_ABANDONMENT.map((stage,i) => (
            <div key={stage.stage} className={styles.funnelRow} style={{ animationDelay:`${i*60}ms` }}>
              <div className={styles.funnelLabel}><span className={styles.funnelStage}>{stage.stage}</span>{stage.dropOff>0&&<span className={styles.funnelDrop}>−{stage.dropOff}%</span>}</div>
              <div className={styles.funnelBarWrap}><div className={styles.funnelBar} style={{ width:`${(stage.count/CART_ABANDONMENT[0].count)*100}%`, background:stage.color }} /></div>
              <span className={styles.funnelCount}>{stage.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className={styles.abandonRate}><span>Cart Abandonment Rate</span><strong style={{ color:'#DC2626', fontSize:18, fontWeight:800 }}>69.9%</strong></div>
      </div>
      <div className={styles.wideCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Online Store Metrics</h3><button className={styles.cardActionBtn} onClick={() => nav('/online-store')}>Go to store →</button></div>
        <div className={styles.onlineKpiGrid}>
          {[
            { label:'Online Revenue',       value:fmt(1960000), change:29, up:true,  color:'#2DBD97' },
            { label:'Online Orders',        value:'47',          change:18, up:true,  color:'#1b3b5f' },
            { label:'Bounce Rate',          value:'38.4%',       change:-4, up:true,  color:'#E8C547' },
            { label:'Avg Session Duration', value:'3m 42s',      change:12, up:true,  color:'#8B5CF6' },
            { label:'Pages per Session',    value:'4.2',         change:8,  up:true,  color:'#F59E0B' },
            { label:'Mobile Traffic',       value:'74%',         change:6,  up:true,  color:'#EF4444' },
          ].map((k,i) => (
            <div key={k.label} className={styles.onlineKpiCard} style={{ animationDelay:`${i*50}ms`, borderTopColor:k.color }}>
              <div className={styles.onlineKpiVal} style={{ color:k.color }}>{k.value}</div>
              <div className={styles.onlineKpiLbl}>{k.label}</div>
              <div style={{ display:'flex', justifyContent:'center', marginTop:4 }}><ChangePill change={k.change} up={k.up} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function OmnichannelTab({ nav }) {
  return (
    <div className={styles.sectionGrid}>
      <div className={styles.wideCard}>
        <div className={styles.cardHead}><div><h3 className={styles.cardTitle}>Customer Segments</h3><p className={styles.cardSub}>Purchase behaviour across all channels</p></div><button className={styles.cardActionBtn} onClick={() => nav('/customers')}>View customers →</button></div>
        <div className={styles.segmentGrid}>
          {CUSTOMER_SEGMENTS.map((seg,i) => (
            <div key={seg.segment} className={styles.segCard} style={{ borderTopColor:seg.color, animationDelay:`${i*60}ms` }}>
              <div className={styles.segCount} style={{ color:seg.color }}>{seg.count}</div>
              <div className={styles.segName}>{seg.segment}</div>
              <div className={styles.segStats}>
                <div className={styles.segStat}><div className={styles.segStatVal}>{fmt(seg.revenue)}</div><div className={styles.segStatLbl}>Revenue</div></div>
                <div className={styles.segStat}><div className={styles.segStatVal}>{fmt(seg.clv)}</div><div className={styles.segStatLbl}>Avg CLV</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.wideCard}>
        <div className={styles.cardHead}><h3 className={styles.cardTitle}>Top Products Across All Channels</h3><button className={styles.cardActionBtn} onClick={() => nav('/products')}>Manage →</button></div>
        <div className={styles.prodTable}>
          <div className={styles.prodTableHead}><span>Product</span><span>SKU</span><span>Revenue</span><span>Units</span><span>Margin</span><span>Channel</span></div>
          {TOP_PRODUCTS.map((p,i) => (
            <div key={p.sku} className={styles.prodTableRow} style={{ animationDelay:`${i*40}ms` }} onClick={() => nav('/products')}>
              <span style={{ fontWeight:600 }}>{p.name}</span>
              <span style={{ fontFamily:'monospace', fontSize:12, color:'#6B7280' }}>{p.sku}</span>
              <span style={{ fontWeight:700, color:'#1b3b5f' }}>{fmt(p.revenue)}</span>
              <span>{p.units}</span>
              <span><div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ flex:1, height:6, background:'#E5E7EB', borderRadius:3, overflow:'hidden' }}><div style={{ width:`${p.margin}%`, height:'100%', background:'#2DBD97', borderRadius:3 }} /></div><span style={{ fontSize:12, color:'#059669', fontWeight:600 }}>{p.margin}%</span></div></span>
              <span><span style={{ background:p.channel==='Both'?'#EEF2FF':p.channel==='Online'?'#ECFDF5':'#FFFBEB', color:p.channel==='Both'?'#3730A3':p.channel==='Online'?'#059669':'#D97706', padding:'3px 9px', borderRadius:12, fontSize:11.5, fontWeight:600 }}>{p.channel}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function TypesTab({ kpi }) {
  return (
    <div className={styles.typesSection}>
      <p className={styles.typesSub}>Understanding the four levels of retail analytics helps you make better decisions at every stage.</p>
      <div className={styles.typesGrid}>
        {ANALYTICS_TYPES.map((t,i) => (
          <div key={t.type} className={styles.typeCard} style={{ borderTopColor:t.color, animationDelay:`${i*80}ms` }}>
            <div className={styles.typeIco} style={{ color:t.color, background:t.bg }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {t.iconPaths.map((p,i) => <path key={i} d={p} />)}
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
        {KPI_DEFINITIONS.map((k,i) => {
          const liveVal = k.kpi==='AOV'?fmt(kpi.aov.value):k.kpi==='CAC'?fmt(kpi.cac.value):k.kpi==='CLV'?fmt(k.staticValue):k.kpi==='ROMI'?kpi.romi.value:kpi.turnover.value
          return (
            <div key={k.kpi} className={styles.kpiDefCard} style={{ animationDelay:`${i*60}ms` }}>
              <div className={styles.kpiDefBadge}>{k.kpi}</div>
              <div>
                <div className={styles.kpiDefName}>{k.full}</div>
                <div className={styles.kpiDefDesc}>{k.desc}</div>
                <div className={styles.kpiDefFormula}>{k.formula}</div>
                <div className={styles.kpiDefCurrent}>Current: <strong style={{ color:'#1b3b5f' }}>{liveVal}</strong></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── MAIN ──────────────────────────────────────────────────────── */
export default function Analytics() {
  const [period,  setPeriod]  = useState('Last 30 days')
  const [channel, setChannel] = useState('All channels')
  const [tab,     setTab]     = useState('overview')
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const kpi = KPI_DATA[period] || KPI_DATA['Last 30 days']
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const primaryKPIs = [
    { label:'Sessions',        kpiKey:'sessions',       sparkKey:'sessions',       format: v => v.toLocaleString() },
    { label:'Gross Sales',     kpiKey:'grossSales',     sparkKey:'grossSales',     format: v => fmt(v)             },
    { label:'Orders',          kpiKey:'orders',         sparkKey:'orders',         format: v => v                  },
    { label:'Conversion Rate', kpiKey:'conversionRate', sparkKey:'conversionRate', format: v => v                  },
  ]

  return (
    <div className={`${styles.page} ${visible ? styles.pageVisible : ''}`}>

      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pgTitle}>{greeting} 👋</h1>
          <p className={styles.pgSub}>Here's what's happening with your store today.</p>
        </div>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline} onClick={() => navigate('/settings')}>
            <Ic d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} />
            Settings
          </button>
          <button className={styles.btnExport}>
            <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 15V3" size={13} stroke="#fff" />
            Export Report
          </button>
        </div>
      </header>

      <div className={styles.content}>

        <div className={styles.filterRow}>
          <div className={styles.periodTabs}>
            {PERIODS.map(p => (
              <button key={p} className={`${styles.periodTab} ${period===p?styles.periodTabOn:''}`}
                onClick={() => setPeriod(p)}>{p}</button>
            ))}
          </div>
          <select className={styles.channelSel} value={channel} onChange={e => setChannel(e.target.value)}>
            {CHANNELS.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className={styles.kpiRow}>
          {primaryKPIs.map(({ label, kpiKey, sparkKey, format }, i) => {
            const k = kpi[kpiKey]
            const color = KPI_COLORS[kpiKey]
            return (
              <div key={label} className={styles.kpiCard}
                style={{ animationDelay:`${i*60}ms` }}
                onClick={() => navigate('/analytics')}>
                <div className={styles.kpiTop}>
                  <div>
                    <span className={styles.kpiLabel}>{label}</span>
                    <div className={styles.kpiValue} style={{ color }}>{format(k.value)}</div>
                    <ChangePill change={k.change} up={k.up} />
                  </div>
                  <SparkLine data={SPARKLINES[sparkKey]} color={color} />
                </div>
                <div className={styles.kpiFooter}>
                  <span>View details</span>
                  <Ic d="M9 18l6-6-6-6" size={11} stroke="#9CA3AF" />
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.alertStrip}>
          {[
            { dot:'#EF4444', msg:'21 orders need fulfilment', route:'/orders' },
            { dot:'#F59E0B', msg:'50+ payments to capture',   route:'/orders' },
            { dot:'#2DBD97', msg:'4 low-stock items',         route:'/inventory' },
          ].map((a,i) => (
            <button key={i} className={styles.alertItem}
              style={{ borderLeftColor:a.dot, animationDelay:`${i*60}ms` }}
              onClick={() => navigate(a.route)}>
              <span className={styles.alertDot} style={{ background:a.dot }} />
              <span className={styles.alertMsg}>{a.msg}</span>
              <Ic d="M9 18l6-6-6-6" size={13} stroke={a.dot} style={{ marginLeft:'auto' }} />
            </button>
          ))}
        </div>

        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {TABS.map(t => (
              <button key={t.key} className={`${styles.tab} ${tab===t.key?styles.tabOn:''}`}
                onClick={() => setTab(t.key)}>
                <Ic d={t.icon} size={13} stroke={tab===t.key?'#1b3b5f':'#9CA3AF'} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tabContent}>
          {tab==='overview'    && <OverviewTab    kpi={kpi} period={period} nav={navigate} />}
          {tab==='pos'         && <POSTab         kpi={kpi} nav={navigate} />}
          {tab==='online'      && <OnlineTab      nav={navigate} />}
          {tab==='omnichannel' && <OmnichannelTab nav={navigate} />}
          {tab==='types'       && <TypesTab       kpi={kpi} />}
        </div>
      </div>
    </div>
  )
}
