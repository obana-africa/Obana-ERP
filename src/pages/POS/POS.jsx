import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './POS.module.css'
import ProductGrid from './components/ProductGrid'

/* ─── Icon ───────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ─── Helpers ────────────────────────────────────────────── */
const fmt  = n => `₦${Number(n || 0).toLocaleString()}`
const uid  = () => `${Date.now()}-${Math.random().toString(36).slice(2,6)}`
const now  = () => new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })
const nowFull = () => new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })

/* ─────────────────────────────────────────────────────────
   ERP DATA  — mirrors your Product, Inventory & Discount modules
───────────────────────────────────────────────────────── */
const LOCATIONS = [
  { id: 'loc-1', name: 'Main Store', city: 'Lagos'  },
  { id: 'loc-2', name: 'POS Outlet', city: 'Abuja'  },
  { id: 'loc-3', name: 'POS Kiosk',  city: 'Kano'   },
]

const COLLECTIONS = ['All','Fashion','Beauty','Accessories','Sale','New Arrivals']

// Full variant-aware product catalog
const CATALOG = [
  {
    id: 'p1', name: 'Classic Ankara Dress', category: 'Fashion',
    collection: 'Spring/Summer', badge: 'Bestseller',
    basePrice: 15000, compareAt: 18500,
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=70',
    variants: [
      { sku:'AKR-001-RED-S',  size:'S',  color:'Red',   style:'Regular', stock:{ 'loc-1':8, 'loc-2':3, 'loc-3':2 } },
      { sku:'AKR-001-RED-M',  size:'M',  color:'Red',   style:'Regular', stock:{ 'loc-1':12,'loc-2':5, 'loc-3':3 } },
      { sku:'AKR-001-RED-L',  size:'L',  color:'Red',   style:'Regular', stock:{ 'loc-1':6, 'loc-2':2, 'loc-3':1 } },
      { sku:'AKR-001-BLK-S',  size:'S',  color:'Black', style:'Slim',    stock:{ 'loc-1':4, 'loc-2':2, 'loc-3':0 } },
      { sku:'AKR-001-BLK-M',  size:'M',  color:'Black', style:'Slim',    stock:{ 'loc-1':10,'loc-2':4, 'loc-3':2 } },
      { sku:'AKR-001-BLK-L',  size:'L',  color:'Black', style:'Slim',    stock:{ 'loc-1':7, 'loc-2':3, 'loc-3':1 } },
      { sku:'AKR-001-WHT-M',  size:'M',  color:'White', style:'Regular', stock:{ 'loc-1':5, 'loc-2':0, 'loc-3':0 } },
      { sku:'AKR-001-WHT-L',  size:'L',  color:'White', style:'Regular', stock:{ 'loc-1':3, 'loc-2':1, 'loc-3':0 } },
    ],
    sizes: ['S','M','L'], colors: ['Red','Black','White'], styles: ['Regular','Slim'],
  },
  {
    id: 'p2', name: "Men's Kaftan Set", category: 'Fashion',
    collection: 'Fall/Winter', badge: null,
    basePrice: 28000, compareAt: null,
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b1d7a?w=300&q=70',
    variants: [
      { sku:'KFT-004-WHT-S',  size:'S',  color:'White',  style:'Regular', stock:{ 'loc-1':5,'loc-2':2,'loc-3':1 } },
      { sku:'KFT-004-WHT-M',  size:'M',  color:'White',  style:'Regular', stock:{ 'loc-1':8,'loc-2':3,'loc-3':2 } },
      { sku:'KFT-004-WHT-L',  size:'L',  color:'White',  style:'Regular', stock:{ 'loc-1':6,'loc-2':2,'loc-3':1 } },
      { sku:'KFT-004-BLU-M',  size:'M',  color:'Navy',   style:'Regular', stock:{ 'loc-1':4,'loc-2':1,'loc-3':0 } },
      { sku:'KFT-004-BLU-L',  size:'L',  color:'Navy',   style:'Regular', stock:{ 'loc-1':6,'loc-2':2,'loc-3':1 } },
      { sku:'KFT-004-GRN-L',  size:'L',  color:'Forest', style:'Slim',    stock:{ 'loc-1':3,'loc-2':1,'loc-3':0 } },
      { sku:'KFT-004-GRN-XL', size:'XL', color:'Forest', style:'Slim',    stock:{ 'loc-1':5,'loc-2':0,'loc-3':0 } },
    ],
    sizes: ['S','M','L','XL'], colors: ['White','Navy','Forest'], styles: ['Regular','Slim'],
  },
  {
    id: 'p3', name: 'Leather Crossbody Bag', category: 'Accessories',
    collection: 'All Season', badge: 'New',
    basePrice: 22000, compareAt: null,
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70',
    variants: [
      { sku:'LCB-002-TAN-OS',  size:'One Size', color:'Tan',   style:'Regular', stock:{ 'loc-1':7,'loc-2':3,'loc-3':2 } },
      { sku:'LCB-002-BLK-OS',  size:'One Size', color:'Black', style:'Regular', stock:{ 'loc-1':5,'loc-2':2,'loc-3':1 } },
      { sku:'LCB-002-BRN-OS',  size:'One Size', color:'Brown', style:'Regular', stock:{ 'loc-1':4,'loc-2':1,'loc-3':0 } },
    ],
    sizes: ['One Size'], colors: ['Tan','Black','Brown'], styles: ['Regular'],
  },
  {
    id: 'p4', name: 'Premium Shea Butter', category: 'Beauty',
    collection: 'All Season', badge: 'Sale',
    basePrice: 4500, compareAt: 5800,
    img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300&q=70',
    variants: [
      { sku:'SHB-003-100ML', size:'100ml', color:'Natural', style:'Regular', stock:{ 'loc-1':30,'loc-2':15,'loc-3':10 } },
      { sku:'SHB-003-200ML', size:'200ml', color:'Natural', style:'Regular', stock:{ 'loc-1':20,'loc-2':8, 'loc-3':6  } },
      { sku:'SHB-003-500ML', size:'500ml', color:'Natural', style:'Regular', stock:{ 'loc-1':12,'loc-2':4, 'loc-3':2  } },
    ],
    sizes: ['100ml','200ml','500ml'], colors: ['Natural'], styles: ['Regular'],
  },
  {
    id: 'p5', name: 'Natural Body Cream', category: 'Beauty',
    collection: 'All Season', badge: null,
    basePrice: 3800, compareAt: null,
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&q=70',
    variants: [
      { sku:'NBC-006-150ML', size:'150ml', color:'Cream', style:'Regular', stock:{ 'loc-1':25,'loc-2':10,'loc-3':8 } },
      { sku:'NBC-006-300ML', size:'300ml', color:'Cream', style:'Regular', stock:{ 'loc-1':15,'loc-2':6, 'loc-3':4 } },
    ],
    sizes: ['150ml','300ml'], colors: ['Cream'], styles: ['Regular'],
  },
  {
    id: 'p6', name: 'Ankara Gift Set Bundle', category: 'Fashion',
    collection: 'Spring/Summer', badge: 'Limited',
    basePrice: 35000, compareAt: 42000,
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&q=70',
    variants: [
      { sku:'GFT-005-RED-SM', size:'S/M', color:'Red',   style:'Regular', stock:{ 'loc-1':4,'loc-2':2,'loc-3':1 } },
      { sku:'GFT-005-BLK-SM', size:'S/M', color:'Black', style:'Regular', stock:{ 'loc-1':3,'loc-2':1,'loc-3':0 } },
      { sku:'GFT-005-RED-LX', size:'L/XL',color:'Red',   style:'Regular', stock:{ 'loc-1':3,'loc-2':1,'loc-3':0 } },
    ],
    sizes: ['S/M','L/XL'], colors: ['Red','Black'], styles: ['Regular'],
  },
]

// Discount engine (from Discounts module)
const POS_DISCOUNTS = [
  { code:'STAFF10',  type:'percentage', value:10, label:'Staff 10% off',    minOrder:0 },
  { code:'SUMMER25', type:'percentage', value:25, label:'Summer 25% off',   minOrder:10000 },
  { code:'VIPFLAT5K',type:'fixed',      value:5000,label:'VIP ₦5,000 off',  minOrder:30000 },
  { code:'CLEAR50',  type:'percentage', value:50, label:'Clearance 50% off',minOrder:0 },
  { code:'BUY2GET1', type:'bogo',       buyQty:2, getQty:1, label:'Buy 2 Get 1 Free', minOrder:0 },
]

// CRM customers (from Customers module)
const CRM_CUSTOMERS = [
  { id:'c1', name:'Adaeze Okonkwo', phone:'08031234567', email:'adaeze@gmail.com', tier:'VIP',     totalSpend:420000, orders:14, points:2100 },
  { id:'c2', name:'Emeka Eze',      phone:'07054321098', email:'emeka@yahoo.com',  tier:'Regular', totalSpend:85000,  orders:4,  points:425  },
  { id:'c3', name:'Kemi Adeyemi',   phone:'09012345678', email:'kemi@hotmail.com', tier:'VIP',     totalSpend:650000, orders:22, points:3250 },
  { id:'c4', name:'Tunde Bello',    phone:'08098765432', email:'tunde@gmail.com',  tier:'New',     totalSpend:12000,  orders:1,  points:60   },
]

const TAX_RATE = 0.075 // 7.5% VAT Nigeria

/* ─── Variant Picker Modal ───────────────────────────────── */
function VariantPicker({ product, location, onAdd, onClose }) {
  const [selColor, setSelColor]  = useState(product.colors[0])
  const [selSize,  setSelSize]   = useState(null)
  const [selStyle, setSelStyle]  = useState(product.styles[0])
  const [qty,      setQty]       = useState(1)
  const [customPrice, setCustomPrice] = useState(null)

  const getVariant = () =>
    product.variants.find(v =>
      v.color === selColor &&
      (selSize === null || v.size === selSize) &&
      v.style === selStyle
    )

  const variant   = getVariant()
  const stockHere = variant?.stock?.[location] ?? 0
  const canAdd    = variant && stockHere >= qty

  const availSizes = product.variants
    .filter(v => v.color === selColor && v.style === selStyle)
    .map(v => v.size)

  useEffect(() => {
    if (availSizes.length > 0 && !availSizes.includes(selSize)) setSelSize(availSizes[0])
  }, [selColor, selStyle])

  const COLOR_MAP = {
    Red:'#DC2626', Black:'#1C1C1C', White:'#F9FAFB', Navy:'#1E3A8A',
    Forest:'#166534', Tan:'#D97706', Brown:'#92400E', Cream:'#FEF3C7',
    Natural:'#D4A574',
  }

  return (
    <div className={styles.vpOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.vpModal}>
        <button className={styles.vpClose} onClick={onClose}>
          <Ic d="M18 6L6 18M6 6l12 12" size={18} />
        </button>

        <div className={styles.vpGrid}>
          <div className={styles.vpImg}>
            <img src={product.img} alt={product.name} />
            {product.badge && <span className={styles.vpBadge}>{product.badge}</span>}
          </div>

          <div className={styles.vpInfo}>
            <p className={styles.vpCat}>{product.category} · {product.collection}</p>
            <h3 className={styles.vpName}>{product.name}</h3>

            <div className={styles.vpPriceRow}>
              <span className={styles.vpPrice}>{fmt(customPrice ?? product.basePrice)}</span>
              {product.compareAt && !customPrice && <span className={styles.vpCompare}>{fmt(product.compareAt)}</span>}
            </div>

            {variant && (
              <div className={styles.vpSku}>
                <Ic d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" size={12} />
                {variant.sku}
                <span className={styles.vpStock} style={{ color: stockHere === 0 ? '#DC2626' : stockHere <= 3 ? '#D97706' : '#059669' }}>
                  · {stockHere === 0 ? 'Out of stock' : `${stockHere} in stock here`}
                </span>
              </div>
            )}

            {/* Color */}
            <div className={styles.vpSection}>
              <p className={styles.vpSectionLabel}>Colour: <strong>{selColor}</strong></p>
              <div className={styles.vpColors}>
                {product.colors.map(c => (
                  <button key={c}
                    className={`${styles.colorSwatch} ${selColor === c ? styles.colorSwatchOn : ''}`}
                    style={{ background: COLOR_MAP[c] || '#ccc' }}
                    onClick={() => setSelColor(c)}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            {!(product.sizes.length === 1 && product.sizes[0] === 'One Size') && (
              <div className={styles.vpSection}>
                <p className={styles.vpSectionLabel}>Size</p>
                <div className={styles.vpSizes}>
                  {product.sizes.map(s => {
                    const inStock = product.variants.some(v => v.size === s && v.color === selColor && (v.stock[location] ?? 0) > 0)
                    return (
                      <button key={s}
                        className={`${styles.sizeBtn} ${selSize === s ? styles.sizeBtnOn : ''} ${!inStock ? styles.sizeBtnOut : ''}`}
                        onClick={() => setSelSize(s)}
                        disabled={!inStock}>
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Style */}
            {product.styles.length > 1 && (
              <div className={styles.vpSection}>
                <p className={styles.vpSectionLabel}>Style</p>
                <div className={styles.vpStyles}>
                  {product.styles.map(st => (
                    <button key={st}
                      className={`${styles.styleBtn} ${selStyle === st ? styles.styleBtnOn : ''}`}
                      onClick={() => setSelStyle(st)}>
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Custom price */}
            <div className={styles.vpActions}>
              <div className={styles.vpQty}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(stockHere, q + 1))}>+</button>
              </div>
              <div className={styles.vpCustomPrice}>
                <Ic d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={12} />
                <input type="number" placeholder="Custom price" value={customPrice || ''}
                  onChange={e => setCustomPrice(e.target.value ? Number(e.target.value) : null)} />
              </div>
            </div>

            {/* All location stock */}
            <div className={styles.vpAllStock}>
              {variant && LOCATIONS.map(loc => (
                <div key={loc.id} className={styles.vpStockRow}>
                  <span>{loc.name}</span>
                  <span style={{ color: (variant.stock[loc.id] ?? 0) > 0 ? '#059669' : '#DC2626', fontWeight: 600 }}>
                    {variant.stock[loc.id] ?? 0} units
                  </span>
                </div>
              ))}
            </div>

            <button
              className={styles.vpAddBtn}
              disabled={!canAdd}
              onClick={() => { onAdd(product, variant, qty, customPrice ?? product.basePrice); onClose() }}>
              <Ic d="M12 5v14M5 12h14" size={15} stroke="#fff" />
              Add to Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Customer Search / Create ───────────────────────────── */
function CustomerPanel({ onSelect, onClose }) {
  const [q,      setQ]      = useState('')
  const [mode,   setMode]   = useState('search') // 'search' | 'create'
  const [form,   setForm]   = useState({ name:'', phone:'', email:'' })

  const results = CRM_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(q.toLowerCase()) ||
    c.phone.includes(q) ||
    c.email.toLowerCase().includes(q.toLowerCase())
  )

  const TIER_CFG = {
    VIP:     { bg:'#FFFBEB', color:'#B45309' },
    Regular: { bg:'#EFF6FF', color:'#1D4ED8' },
    New:     { bg:'#ECFDF5', color:'#047857' },
  }

  return (
    <div className={styles.cpOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.cpPanel}>
        <div className={styles.cpHead}>
          <h3 className={styles.cpTitle}>Customer</h3>
          <div className={styles.cpTabs}>
            <button className={`${styles.cpTab} ${mode === 'search' ? styles.cpTabOn : ''}`} onClick={() => setMode('search')}>Search</button>
            <button className={`${styles.cpTab} ${mode === 'create' ? styles.cpTabOn : ''}`} onClick={() => setMode('create')}>New Customer</button>
          </div>
          <button className={styles.cpClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        {mode === 'search' ? (
          <div className={styles.cpBody}>
            <div className={styles.cpSearch}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Name, phone or email…" />
            </div>
            <div className={styles.cpResults}>
              {(q ? results : CRM_CUSTOMERS).map(c => (
                <button key={c.id} className={styles.cpCustomer} onClick={() => { onSelect(c); onClose() }}>
                  <div className={styles.cpAvatar}>{c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div className={styles.cpCustInfo}>
                    <div className={styles.cpCustName}>{c.name}</div>
                    <div className={styles.cpCustMeta}>{c.phone} · {c.orders} orders · {fmt(c.totalSpend)}</div>
                  </div>
                  <span className={styles.cpTierBadge} style={TIER_CFG[c.tier]}>
                    {c.tier}
                  </span>
                </button>
              ))}
              {q && results.length === 0 && (
                <div className={styles.cpNoResult}>No customer found. <button onClick={() => setMode('create')}>Create new →</button></div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.cpBody}>
            {['name','phone','email'].map(f => (
              <div key={f} className={styles.cpFg}>
                <label>{f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <input value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                  placeholder={f === 'phone' ? '08012345678' : f === 'email' ? 'customer@email.com' : 'Full name'} />
              </div>
            ))}
            <button className={styles.cpCreateBtn} disabled={!form.name || !form.phone}
              onClick={() => {
                const newC = { id: uid(), ...form, tier:'New', totalSpend:0, orders:0, points:0 }
                onSelect(newC); onClose()
              }}>
              Create & Select Customer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Payment Modal ──────────────────────────────────────── */
function PaymentModal({ total, change, onComplete, onClose }) {
  const [method,  setMethod]  = useState('cash')
  const [split,   setSplit]   = useState(false)
  const [cash,    setCash]    = useState('')
  const [card,    setCard]    = useState('')
  const [mobile,  setMobile]  = useState('')
  const [processing, setProc] = useState(false)

  const cashAmt   = Number(cash) || 0
  const cardAmt   = Number(card) || 0
  const mobileAmt = Number(mobile) || 0
  const splitTotal = cashAmt + cardAmt + mobileAmt
  const cashChange = method === 'cash' ? Math.max(0, Number(cash) - total) : 0
  const splitChange = split ? Math.max(0, splitTotal - total) : 0

  const canPay = split
    ? splitTotal >= total
    : method === 'cash' ? Number(cash) >= total : true

  const process = () => {
    setProc(true)
    setTimeout(() => {
      onComplete({
        method: split ? 'Split' : method,
        cashTendered: method === 'cash' ? Number(cash) : 0,
        change: split ? splitChange : cashChange,
        splitDetail: split ? { cash: cashAmt, card: cardAmt, mobile: mobileAmt } : null,
      })
    }, 1000)
  }

  const METHODS = [
    { id:'cash',   label:'Cash',         icon:'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { id:'card',   label:'Card (POS)',   icon:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z' },
    { id:'mobile', label:'Mobile Money', icon:'M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z' },
    { id:'transfer',label:'Bank Transfer',icon:'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
  ]

  return (
    <div className={styles.pmOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.pmModal}>
        <div className={styles.pmHead}>
          <h2 className={styles.pmTitle}>Collect Payment</h2>
          <div className={styles.pmTotal}>{fmt(total)}</div>
        </div>

        <div className={styles.pmBody}>
          <div className={styles.pmSplitToggle}>
            <label className={styles.pmSplitLbl}>
              <div className={`${styles.toggle} ${split ? styles.toggleOn : ''}`} onClick={() => setSplit(s => !s)}>
                <div className={styles.toggleThumb} />
              </div>
              Split payment
            </label>
          </div>

          {!split ? (
            <>
              <div className={styles.pmMethods}>
                {METHODS.map(m => (
                  <button key={m.id}
                    className={`${styles.pmMethod} ${method === m.id ? styles.pmMethodOn : ''}`}
                    onClick={() => setMethod(m.id)}>
                    <Ic d={m.icon} size={20} stroke={method === m.id ? '#2DBD97' : '#6B7280'} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {method === 'cash' && (
                <div className={styles.pmCashSection}>
                  <div className={styles.pmFg}>
                    <label>Cash Tendered</label>
                    <div className={styles.pmCashInput}>
                      <span>₦</span>
                      <input type="number" value={cash} onChange={e => setCash(e.target.value)}
                        placeholder="0" autoFocus />
                    </div>
                  </div>
                  <div className={styles.pmQuickCash}>
                    {[total, Math.ceil(total/1000)*1000, Math.ceil(total/5000)*5000, Math.ceil(total/10000)*10000]
                      .filter((v,i,a) => a.indexOf(v) === i)
                      .slice(0,4)
                      .map(v => (
                        <button key={v} className={styles.pmQuickBtn} onClick={() => setCash(String(v))}>
                          {fmt(v)}
                        </button>
                      ))
                    }
                  </div>
                  {cashChange > 0 && (
                    <div className={styles.pmChange}>
                      Change: <strong>{fmt(cashChange)}</strong>
                    </div>
                  )}
                </div>
              )}

              {method === 'mobile' && (
                <div className={styles.pmFg}>
                  <label>Mobile Wallet Reference</label>
                  <input placeholder="e.g. Opay / Kuda / Palmpay ref" />
                </div>
              )}

              {method === 'transfer' && (
                <div className={styles.pmTransfer}>
                  <p className={styles.pmTransferTitle}>Transfer to:</p>
                  <div className={styles.pmTransferRow}><span>Account Name</span><strong>Obana Africa Ltd</strong></div>
                  <div className={styles.pmTransferRow}><span>Bank</span><strong>Access Bank</strong></div>
                  <div className={styles.pmTransferRow}><span>Account No.</span><strong>0123456789</strong></div>
                  <div className={styles.pmTransferRow}><span>Amount</span><strong style={{color:'#2DBD97'}}>{fmt(total)}</strong></div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.pmSplitGrid}>
              {[['Cash','cash',cash,setCash],['Card','card',card,setCard],['Mobile','mobile',mobile,setMobile]].map(([lbl,,val,setter]) => (
                <div key={lbl} className={styles.pmFg}>
                  <label>{lbl} (₦)</label>
                  <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder="0" />
                </div>
              ))}
              <div className={`${styles.pmSplitStatus} ${splitTotal >= total ? styles.pmSplitOk : styles.pmSplitShort}`}>
                {splitTotal >= total
                  ? `✓ Covered · Change: ${fmt(splitChange)}`
                  : `Remaining: ${fmt(total - splitTotal)}`
                }
              </div>
            </div>
          )}
        </div>

        <div className={styles.pmFoot}>
          <button className={styles.pmCancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.pmChargeBtn} disabled={!canPay || processing} onClick={process}>
            {processing ? (
              <span className={styles.pmProcessing}>Processing…</span>
            ) : (
              <><Ic d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={16} stroke="#fff" /> Charge {fmt(total)}</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Receipt Modal ──────────────────────────────────────── */
function Receipt({ order, onClose }) {
  const receiptRef = useRef()

  return (
    <div className={styles.rcOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.rcModal}>
        <div ref={receiptRef} className={styles.rcContent}>
          <div className={styles.rcHeader}>
            <div className={styles.rcLogo}>OBANA</div>
            <p className={styles.rcAddr}>Main Store, Lagos</p>
            <p className={styles.rcAddr}>Tel: 08012345678</p>
            <div className={styles.rcDivider} />
          </div>

          <div className={styles.rcMeta}>
            <div className={styles.rcMetaRow}><span>Order #</span><strong>{order.id}</strong></div>
            <div className={styles.rcMetaRow}><span>Date</span><span>{order.date}</span></div>
            <div className={styles.rcMetaRow}><span>Cashier</span><span>{order.cashier}</span></div>
            {order.customer && <div className={styles.rcMetaRow}><span>Customer</span><span>{order.customer.name}</span></div>}
          </div>
          <div className={styles.rcDivider} />

          <div className={styles.rcItems}>
            {order.items.map((item, i) => (
              <div key={i} className={styles.rcItem}>
                <div className={styles.rcItemLeft}>
                  <span className={styles.rcItemName}>{item.name}</span>
                  <span className={styles.rcItemSku}>{item.variant?.sku} · {item.variant?.color} / {item.variant?.size}</span>
                </div>
                <div className={styles.rcItemRight}>
                  <span className={styles.rcItemQty}>{item.qty}×</span>
                  <span className={styles.rcItemPrice}>{fmt(item.price)}</span>
                  <span className={styles.rcItemTotal}>{fmt(item.qty * item.price)}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.rcDivider} />

          <div className={styles.rcSummary}>
            <div className={styles.rcSumRow}><span>Subtotal</span><span>{fmt(order.subtotal)}</span></div>
            {order.discountAmt > 0 && <div className={`${styles.rcSumRow} ${styles.rcDiscount}`}><span>Discount</span><span>−{fmt(order.discountAmt)}</span></div>}
            <div className={styles.rcSumRow}><span>VAT (7.5%)</span><span>{fmt(Math.round(order.tax))}</span></div>
            <div className={`${styles.rcSumRow} ${styles.rcTotal}`}><span>TOTAL</span><strong>{fmt(order.total)}</strong></div>
          </div>
          <div className={styles.rcDivider} />

          <div className={styles.rcPayment}>
            <div className={styles.rcPayRow}><span>Payment</span><strong>{order.payment.method}</strong></div>
            {order.payment.change > 0 && <div className={styles.rcPayRow}><span>Change Given</span><span>{fmt(order.payment.change)}</span></div>}
          </div>

          <div className={styles.rcFooter}>
            <p>Thank you for shopping at Obana!</p>
            <p>Returns accepted within 7 days with receipt.</p>
            <p className={styles.rcWebsite}>www.obana.africa</p>
          </div>
        </div>

        <div className={styles.rcActions}>
          <button className={styles.rcPrintBtn} onClick={() => window.print()}>
            <Ic d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6v-8z" size={15} />
            Print Receipt
          </button>
          <button className={styles.rcSmsBtn}>
            <Ic d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" size={15} />
            Send SMS
          </button>
          <button className={styles.rcDoneBtn} onClick={onClose}>
            New Sale
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN POS PAGE
───────────────────────────────────────────────────────── */
export default function POS() {
  const [location,    setLocation]    = useState('loc-1')
  const [search,      setSearch]      = useState('')
  const [collection,  setCollection]  = useState('All')
  const [cart,        setCart]        = useState([])
  const [customer,    setCustomer]    = useState(null)
  const [discCode,    setDiscCode]    = useState('')
  const [discResult,  setDiscResult]  = useState(null)
  const [staffDisc,   setStaffDisc]   = useState(null) // staff-applied %
  const [tax,         setTax]         = useState(true)
  const [showVP,      setShowVP]      = useState(null) // product for variant picker
  const [showCP,      setShowCP]      = useState(false)
  const [showPM,      setShowPM]      = useState(false)
  const [receipt,     setReceipt]     = useState(null)
  const [recentOrders,setRecentOrders]= useState([])
  const [cashier]     = useState('Tomiwa A.')
  const [note,        setNote]        = useState('')
  const searchRef = useRef()

  // ── Inventory: deduct on add (mirror ERP) ──
  const [inventory, setInventory] = useState(() => {
    const inv = {}
    CATALOG.forEach(p => {
      p.variants.forEach(v => { inv[v.sku] = { ...v.stock } })
    })
    return inv
  })

  const getStock = (sku, loc) => inventory[sku]?.[loc] ?? 0

  // ── Filtered catalog ──
  const visible = CATALOG.filter(p => {
    const q = search.toLowerCase()
    const ms = p.name.toLowerCase().includes(q) ||
               p.variants.some(v => v.sku.toLowerCase().includes(q))
    const mc = collection === 'All' || p.category === collection || p.collection === collection
    return ms && mc
  })

  // ── Cart helpers ──
  const addToCart = (product, variant, qty, price) => {
    const key = `${variant.sku}`
    setCart(c => {
      const idx = c.findIndex(i => i.key === key)
      if (idx >= 0) {
        const updated = [...c]
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty }
        return updated
      }
      return [...c, { key, product, variant, qty, price, id: uid() }]
    })
    // Deduct from inventory immediately (ERP sync)
    setInventory(inv => ({
      ...inv,
      [variant.sku]: { ...inv[variant.sku], [location]: Math.max(0, (inv[variant.sku]?.[location] ?? 0) - qty) }
    }))
  }

  const removeFromCart = (key) => {
    const item = cart.find(i => i.key === key)
    if (item) {
      setInventory(inv => ({
        ...inv,
        [item.variant.sku]: { ...inv[item.variant.sku], [location]: (inv[item.variant.sku]?.[location] ?? 0) + item.qty }
      }))
    }
    setCart(c => c.filter(i => i.key !== key))
  }

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeFromCart(key)
    setCart(c => c.map(i => i.key === key ? { ...i, qty } : i))
  }

  const clearCart = () => {
    cart.forEach(item => {
      setInventory(inv => ({
        ...inv,
        [item.variant.sku]: { ...inv[item.variant.sku], [location]: (inv[item.variant.sku]?.[location] ?? 0) + item.qty }
      }))
    })
    setCart([])
    setDiscResult(null)
    setStaffDisc(null)
    setCustomer(null)
    setNote('')
    setDiscCode('')
  }

  // ── Pricing engine ──
  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const totalQty = cart.reduce((a, i) => a + i.qty, 0)

  // Customer VIP auto-discount
  const vipDisc = customer?.tier === 'VIP' ? 0.15 : 0

  // Manual code
  const codeDisc = discResult?.type === 'percentage' ? discResult.value / 100
    : discResult?.type === 'fixed' ? discResult.value / subtotal
    : 0

  // BOGO check
  const bogoDisc = discResult?.type === 'bogo'
    ? Math.floor(totalQty / (discResult.buyQty + discResult.getQty)) * discResult.getQty * (subtotal / totalQty) / subtotal
    : 0

  const totalDiscRate = Math.min(1, vipDisc + (staffDisc || 0) + codeDisc + bogoDisc)
  const discountAmt   = discResult?.type === 'fixed' ? Math.min(subtotal, discResult.value) : subtotal * totalDiscRate
  const afterDisc     = subtotal - discountAmt
  const taxAmt        = tax ? afterDisc * TAX_RATE : 0
  const total         = afterDisc + taxAmt

  // Apply discount code
  const applyCode = () => {
    const disc = POS_DISCOUNTS.find(d => d.code === discCode.toUpperCase())
    if (!disc) { alert('Invalid discount code'); return }
    if (disc.minOrder && subtotal < disc.minOrder) { alert(`Min order ${fmt(disc.minOrder)}`); return }
    setDiscResult(disc)
  }

  // ── Process payment ──
  const handlePayment = (payInfo) => {
    const order = {
      id: `POS-${Date.now().toString().slice(-6)}`,
      date: nowFull(),
      cashier,
      customer,
      items: cart,
      subtotal,
      discountAmt: Math.round(discountAmt),
      tax: taxAmt,
      total: Math.round(total),
      payment: payInfo,
      note,
      location,
    }
    setRecentOrders(o => [order, ...o].slice(0, 10))
    setReceipt(order)
    setShowPM(false)
    clearCart()
  }

  const locName = LOCATIONS.find(l => l.id === location)?.name || ''

  return (
    <div className={styles.pos}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700;900&display=swap');`}</style>

      {/* ── Top bar ── */}
      <div className={styles.posTopbar}>
        <div className={styles.posTopLeft}>
          <h1 className={styles.posLogo}>OBANA <span>POS</span></h1>
          <select className={styles.locSelect} value={location} onChange={e => setLocation(e.target.value)}>
            {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} — {l.city}</option>)}
          </select>
        </div>
        <div className={styles.posTopRight}>
          <div className={styles.posTime}>{now()}</div>
          <span className={styles.posCashier}>
            <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={14} />
            {cashier}
          </span>
          <div className={`${styles.posStatus} ${styles.posOnline}`}>
            <div className={styles.posStatusDot} />
            Online
          </div>
        </div>
      </div>

      <div className={styles.posLayout}>
        {/* ══════════════════════════════════
            LEFT PANEL — Product catalog
        ══════════════════════════════════ */}
        <div className={styles.catalogPanel}>

          {/* Search bar */}
          <div className={styles.catalogSearch}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={16} stroke="#9CA3AF" />
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products, SKU or barcode…" autoFocus />
            {search && <button onClick={() => setSearch('')}><Ic d="M18 6L6 18M6 6l12 12" size={13} /></button>}
          </div>

          {/* Collection tabs */}
          <div className={styles.collectionTabs}>
            {COLLECTIONS.map(c => (
              <button key={c}
                className={`${styles.collTab} ${collection === c ? styles.collTabOn : ''}`}
                onClick={() => setCollection(c)}>
                {c}
              </button>
            ))}
          </div>

          {/* Product grid */}
          <div className={styles.productGrid}>
            {visible.length === 0 && (
              <div className={styles.noProducts}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={32} stroke="#9CA3AF" />
                <p>No products found</p>
              </div>
            )}
            {visible.map(p => {
              const totalStock = p.variants.reduce((a, v) => a + (inventory[v.sku]?.[location] ?? 0), 0)
              const hasDiscount = p.compareAt && p.compareAt > p.basePrice
              return (
                <button key={p.id} className={`${styles.productTile} ${totalStock === 0 ? styles.productTileOut : ''}`}
                  onClick={() => setShowVP(p)} disabled={totalStock === 0}>
                  <div className={styles.tileImg}>
                    <img src={p.img} alt={p.name} loading="lazy" />
                    {p.badge && <span className={`${styles.tileBadge} ${styles[`badge${p.badge}`]}`}>{p.badge}</span>}
                    {hasDiscount && <span className={styles.tileDisc}>SALE</span>}
                    {totalStock === 0 && <div className={styles.tileOut}>Out of Stock</div>}
                    {totalStock > 0 && totalStock <= 5 && <span className={styles.tileLow}>Low</span>}
                  </div>
                  <div className={styles.tileInfo}>
                    <p className={styles.tileName}>{p.name}</p>
                    <p className={styles.tileCat}>{p.category}</p>
                    <div className={styles.tilePriceRow}>
                      <span className={styles.tilePrice}>{fmt(p.basePrice)}</span>
                      <span className={styles.tileVariantCount}>{p.variants.length} variants</span>
                    </div>
                    <div className={styles.tileStock}>
                      <div className={styles.tileStockBar}>
                        <div className={styles.tileStockFill}
                          style={{ width: `${Math.min(100, (totalStock / 30) * 100)}%`, background: totalStock <= 3 ? '#EF4444' : totalStock <= 10 ? '#F59E0B' : '#2DBD97' }} />
                      </div>
                      <span>{totalStock}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Recent orders */}
          {recentOrders.length > 0 && (
            <div className={styles.recentOrdersWrap}>
              <p className={styles.recentOrdersTitle}>Recent Sales</p>
              <div className={styles.recentOrdersList}>
                {recentOrders.slice(0,3).map(o => (
                  <div key={o.id} className={styles.recentOrderItem}>
                    <span className={styles.recentOrderId}>{o.id}</span>
                    <span className={styles.recentOrderAmt}>{fmt(o.total)}</span>
                    <span className={styles.recentOrderTime}>{o.date.split(',')[1]?.trim() || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════
            RIGHT PANEL — Cart & Checkout
        ══════════════════════════════════ */}
        <div className={styles.cartPanel}>

          {/* Customer bar */}
          <button className={styles.customerBar} onClick={() => setShowCP(true)}>
            <div className={styles.customerBarLeft}>
              {customer ? (
                <>
                  <div className={styles.custAvatar}>{customer.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div>
                    <div className={styles.custName}>{customer.name}</div>
                    <div className={styles.custMeta}>{customer.tier} · {customer.points} pts · {fmt(customer.totalSpend)}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.custAvatarEmpty}>
                    <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={18} stroke="#9CA3AF" />
                  </div>
                  <span className={styles.custPlaceholder}>Add customer (optional)</span>
                </>
              )}
            </div>
            {customer ? (
              <button className={styles.custRemove} onClick={e => { e.stopPropagation(); setCustomer(null) }}>
                <Ic d="M18 6L6 18M6 6l12 12" size={13} />
              </button>
            ) : (
              <Ic d="M12 5v14M5 12h14" size={16} stroke="#9CA3AF" />
            )}
          </button>

          {/* Cart items */}
          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <div className={styles.cartEmpty}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="#2DBD97" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M22 26h20l-2.5 12h-15L22 26zM19 22h4.5l2.5 4" stroke="#2DBD97" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p>Cart is empty</p>
                <span>Search or tap a product to add</span>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.key} className={styles.cartItem}>
                  <img src={item.product.img} alt={item.product.name} className={styles.cartItemImg} />
                  <div className={styles.cartItemInfo}>
                    <p className={styles.cartItemName}>{item.product.name}</p>
                    <p className={styles.cartItemVariant}>
                      {item.variant.color} / {item.variant.size}
                      {item.variant.style !== 'Regular' && ` / ${item.variant.style}`}
                    </p>
                    <p className={styles.cartItemSku}>{item.variant.sku}</p>
                  </div>
                  <div className={styles.cartItemRight}>
                    <div className={styles.cartQty}>
                      <button onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                    </div>
                    <p className={styles.cartItemPrice}>{fmt(item.price * item.qty)}</p>
                    <button className={styles.cartItemDel} onClick={() => removeFromCart(item.key)}>
                      <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Note */}
          {cart.length > 0 && (
            <div className={styles.noteWrap}>
              <input className={styles.noteInput} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add order note…" />
            </div>
          )}

          {/* Discount section */}
          {cart.length > 0 && (
            <div className={styles.discSection}>
              <div className={styles.discCodeRow}>
                <input className={styles.discInput} value={discCode}
                  onChange={e => setDiscCode(e.target.value.toUpperCase())}
                  placeholder="Discount code" />
                <button className={styles.discApplyBtn} onClick={applyCode}>Apply</button>
              </div>

              {discResult && (
                <div className={styles.discApplied}>
                  <Ic d="M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" size={12} stroke="#047857" />
                  <span>{discResult.label}</span>
                  <button className={styles.discRemoveBtn} onClick={() => { setDiscResult(null); setDiscCode('') }}>×</button>
                </div>
              )}

              {/* Staff discount */}
              <div className={styles.staffDiscRow}>
                <span className={styles.staffDiscLabel}>Staff discount:</span>
                {[0, 0.05, 0.10, 0.15, 0.20].map(v => (
                  <button key={v}
                    className={`${styles.staffDiscBtn} ${staffDisc === v ? styles.staffDiscBtnOn : ''}`}
                    onClick={() => setStaffDisc(staffDisc === v ? null : v)}>
                    {v === 0 ? 'None' : `${v * 100}%`}
                  </button>
                ))}
              </div>

              {/* VIP auto discount */}
              {customer?.tier === 'VIP' && (
                <div className={styles.vipDisc}>
                  <Ic d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={12} fill="#E8C547" stroke="#E8C547" />
                  VIP customer — 15% auto-applied
                </div>
              )}
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && (
            <div className={styles.totalsSection}>
              <div className={styles.totalRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {discountAmt > 0 && <div className={`${styles.totalRow} ${styles.discountRow}`}><span>Discount</span><span>−{fmt(Math.round(discountAmt))}</span></div>}
              <div className={styles.totalRow}>
                <label className={styles.taxToggle}>
                  <span>VAT (7.5%)</span>
                  <div className={`${styles.toggle} ${styles.toggleSm} ${tax ? styles.toggleOn : ''}`} onClick={() => setTax(t => !t)}>
                    <div className={styles.toggleThumb} />
                  </div>
                </label>
                <span>{tax ? fmt(Math.round(taxAmt)) : '—'}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}><span>TOTAL</span><strong>{fmt(Math.round(total))}</strong></div>
            </div>
          )}

          {/* Action buttons */}
          <div className={styles.cartActions}>
            {cart.length > 0 && (
              <button className={styles.clearBtn} onClick={clearCart}>
                <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={14} />
                Clear
              </button>
            )}
            <button
              className={styles.chargeBtn}
              disabled={cart.length === 0}
              onClick={() => setShowPM(true)}>
              <Ic d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={16} stroke="#fff" />
              Charge {cart.length > 0 ? fmt(Math.round(total)) : ''}
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showVP && (
        <VariantPicker
          product={showVP}
          location={location}
          onAdd={addToCart}
          onClose={() => setShowVP(null)}
        />
      )}

      {showCP && (
        <CustomerPanel
          onSelect={setCustomer}
          onClose={() => setShowCP(false)}
        />
      )}

      {showPM && (
        <PaymentModal
          total={Math.round(total)}
          change={0}
          onComplete={handlePayment}
          onClose={() => setShowPM(false)}
        />
      )}

      {receipt && (
        <Receipt
          order={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  )
}
