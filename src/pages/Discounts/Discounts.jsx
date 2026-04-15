import { useState, useEffect } from 'react'
import styles from './Discounts.module.css'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Helpers ───────────────────────────────────────────────
const fmt  = (n) => `₦${Number(n || 0).toLocaleString()}`
const fmtD = (s) => new Date(s).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
const uid  = () => `disc-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
const today = () => new Date().toISOString().split('T')[0]

// ── Discount type configs ─────────────────────────────────
const DISC_TYPES = {
  percentage:   { label: 'Percentage',        color: '#2DBD97', bg: '#ECFDF5', icon: 'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0' },
  fixed:        { label: 'Fixed Amount',      color: '#3B82F6', bg: '#EFF6FF', icon: 'M2 8h20M2 16h20M6 4v16M18 4v16' },
  bogo:         { label: 'Buy X Get Y',       color: '#8B5CF6', bg: '#F5F3FF', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0' },
  multibuy:     { label: 'Multi-Buy (×3)',    color: '#F59E0B', bg: '#FFFBEB', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  rrp:          { label: 'RRP / Price Lock',  color: '#EF4444', bg: '#FEF2F2', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  tiered:       { label: 'Tiered Pricing',   color: '#1a1a2e', bg: '#EEF2FF', icon: 'M18 20V10M12 20V4M6 20v-6' },
  bundle:       { label: 'Bundle Deal',      color: '#059669', bg: '#ECFDF5', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  flash:        { label: 'Flash Sale',       color: '#DC2626', bg: '#FEF2F2', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  loyalty:      { label: 'Loyalty / VIP',    color: '#D97706', bg: '#FFFBEB', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  freeShipping: { label: 'Free Shipping',    color: '#0891B2', bg: '#ECFEFF', icon: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3M9 17h6a2 2 0 0 0 2-2V9M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 17a2 2 0 1 1 4 0 2 2 0 0 1-4 0z' },
}

const STATUS_CFG = {
  active:    { label: 'Active',    bg: '#ECFDF5', color: '#047857' },
  scheduled: { label: 'Scheduled', bg: '#EFF6FF', color: '#1D4ED8' },
  expired:   { label: 'Expired',   bg: '#FEF2F2', color: '#B91C1C' },
  draft:     { label: 'Draft',     bg: '#F3F4F6', color: '#6B7280' },
  paused:    { label: 'Paused',    bg: '#FFFBEB', color: '#B45309' },
}

const APPLIES_TO = ['All products', 'Specific products', 'Specific collections', 'Specific categories']
const CUSTOMER_SEGS = ['All customers', 'VIP customers', 'New customers', 'Returning customers', 'Wholesale buyers']
const CHANNELS = ['All channels', 'Online Store', 'Point of Sale', 'WhatsApp', 'Instagram']

// ── Seed data ─────────────────────────────────────────────
const SEED = [
  {
    id: 'disc-001', code: 'SUMMER25', name: 'Summer 25% Off',
    type: 'percentage', value: 25, appliesTo: 'All products',
    minOrder: 10000, maxUses: 500, usedCount: 142,
    customerSegment: 'All customers', channel: 'All channels',
    startDate: '2026-04-01', endDate: '2026-04-30',
    status: 'active', stackable: false, onePerCustomer: true,
    description: 'Summer seasonal discount for all products',
    conditions: [], tiers: [],
  },
  {
    id: 'disc-002', code: 'VIPFLAT5K', name: 'VIP ₦5,000 Off',
    type: 'fixed', value: 5000, appliesTo: 'All products',
    minOrder: 30000, maxUses: 100, usedCount: 38,
    customerSegment: 'VIP customers', channel: 'All channels',
    startDate: '2026-04-01', endDate: '2026-06-30',
    status: 'active', stackable: false, onePerCustomer: false,
    description: 'Flat ₦5,000 off for VIP customers on orders above ₦30,000',
    conditions: [], tiers: [],
  },
  {
    id: 'disc-003', code: 'BUY2GET1', name: 'Buy 2 Get 1 Free',
    type: 'bogo', value: 100, buyQty: 2, getQty: 1,
    appliesTo: 'Specific collections', minOrder: 0, maxUses: 200, usedCount: 67,
    customerSegment: 'All customers', channel: 'All channels',
    startDate: '2026-04-10', endDate: '2026-04-20',
    status: 'active', stackable: false, onePerCustomer: false,
    description: 'Buy any 2 items, get the 3rd free from same collection',
    conditions: [], tiers: [],
  },
  {
    id: 'disc-004', code: 'TRIPLE10', name: 'Buy 3 Save 10%',
    type: 'multibuy', value: 10, multipleOf: 3,
    appliesTo: 'All products', minOrder: 0, maxUses: 0, usedCount: 23,
    customerSegment: 'All customers', channel: 'Point of Sale',
    startDate: '2026-04-01', endDate: '2026-12-31',
    status: 'active', stackable: true, onePerCustomer: false,
    description: 'Buy in multiples of 3, get 10% off the entire batch',
    conditions: [], tiers: [],
  },
  {
    id: 'disc-005', code: 'RRP-LOCK', name: 'RRP Price Control',
    type: 'rrp', rrpPrice: 15000, appliesTo: 'Specific products',
    minOrder: 0, maxUses: 0, usedCount: 0,
    customerSegment: 'Wholesale buyers', channel: 'Point of Sale',
    startDate: '2026-01-01', endDate: '2026-12-31',
    status: 'active', stackable: false, onePerCustomer: false,
    description: 'Recommended Retail Price lock — prevents selling below ₦15,000',
    conditions: [], tiers: [],
  },
  {
    id: 'disc-006', code: 'TIER-VOL', name: 'Volume Tiered Pricing',
    type: 'tiered', appliesTo: 'All products',
    minOrder: 0, maxUses: 0, usedCount: 89,
    customerSegment: 'All customers', channel: 'All channels',
    startDate: '2026-01-01', endDate: '2026-12-31',
    status: 'active', stackable: false, onePerCustomer: false,
    description: 'Automatic tiered discounts based on order value',
    conditions: [],
    tiers: [
      { minQty: 1,  maxQty: 4,  discount: 0,  label: 'Standard' },
      { minQty: 5,  maxQty: 9,  discount: 5,  label: 'Bulk (5–9)' },
      { minQty: 10, maxQty: 24, discount: 10, label: 'Wholesale (10–24)' },
      { minQty: 25, maxQty: 99, discount: 15, label: 'Trade (25+)' },
    ],
  },
  {
    id: 'disc-007', code: 'FLASH48', name: '48-Hour Flash Sale',
    type: 'flash', value: 30, appliesTo: 'Specific collections',
    minOrder: 0, maxUses: 1000, usedCount: 412,
    customerSegment: 'All customers', channel: 'Online Store',
    startDate: '2026-04-15', endDate: '2026-04-17',
    status: 'scheduled', stackable: false, onePerCustomer: true,
    description: '30% flash sale — Bridal collection only, 48 hours',
    conditions: [], tiers: [],
  },
  {
    id: 'disc-008', code: 'FREESHIP', name: 'Free Shipping Over ₦20k',
    type: 'freeShipping', value: 0, appliesTo: 'All products',
    minOrder: 20000, maxUses: 0, usedCount: 203,
    customerSegment: 'All customers', channel: 'Online Store',
    startDate: '2026-01-01', endDate: '2026-12-31',
    status: 'active', stackable: true, onePerCustomer: false,
    description: 'Automatic free shipping on all online orders above ₦20,000',
    conditions: [], tiers: [],
  },
]

// ── Discount Calculator ───────────────────────────────────
function DiscountCalculator() {
  const [price,   setPrice]   = useState(15000)
  const [qty,     setQty]     = useState(3)
  const [code,    setCode]    = useState('')
  const [applied, setApplied] = useState(null)
  const [result,  setResult]  = useState(null)

  const DISCOUNTS = SEED

  const calculate = () => {
    const subtotal = price * qty
    let savings = 0
    let breakdown = []
    let disc = null

    if (code) {
      disc = DISCOUNTS.find(d => d.code === code.toUpperCase() && d.status === 'active')
      if (!disc) { setResult({ error: 'Invalid or inactive discount code' }); return }
      if (disc.minOrder && subtotal < disc.minOrder) {
        setResult({ error: `Minimum order of ${fmt(disc.minOrder)} required` }); return
      }
    }

    // RRP check
    const rrpDisc = DISCOUNTS.find(d => d.type === 'rrp' && d.status === 'active')
    if (rrpDisc && price < rrpDisc.rrpPrice) {
      setResult({ error: `Price below RRP of ${fmt(rrpDisc.rrpPrice)}. Cannot apply discount.` }); return
    }

    // Tiered pricing (auto)
    const tieredDisc = DISCOUNTS.find(d => d.type === 'tiered' && d.status === 'active')
    if (tieredDisc && !disc) {
      const tier = tieredDisc.tiers.find(t => qty >= t.minQty && qty <= t.maxQty)
      if (tier && tier.discount > 0) {
        savings += subtotal * (tier.discount / 100)
        breakdown.push(`Tiered discount (${tier.label}): −${tier.discount}%`)
      }
    }

    // Multi-buy rule
    const multiDisc = DISCOUNTS.find(d => d.type === 'multibuy' && d.status === 'active')
    if (multiDisc && !disc && qty >= multiDisc.multipleOf && qty % multiDisc.multipleOf === 0) {
      const save = subtotal * (multiDisc.value / 100)
      savings += save
      breakdown.push(`Multi-buy ×${multiDisc.multipleOf} (${multiDisc.value}% off): −${fmt(save)}`)
    }

    // BOGO
    const bogoDisc = DISCOUNTS.find(d => d.type === 'bogo' && d.status === 'active')
    if (bogoDisc && !disc) {
      const freePacks = Math.floor(qty / (bogoDisc.buyQty + bogoDisc.getQty))
      if (freePacks > 0) {
        const save = freePacks * bogoDisc.getQty * price
        savings += save
        breakdown.push(`Buy ${bogoDisc.buyQty} Get ${bogoDisc.getQty} Free: −${fmt(save)}`)
      }
    }

    // Free shipping auto
    const shipDisc = DISCOUNTS.find(d => d.type === 'freeShipping' && d.status === 'active')
    if (shipDisc && subtotal >= shipDisc.minOrder) {
      breakdown.push(`Free shipping applied`)
    }

    // Manual code
    if (disc) {
      if (disc.type === 'percentage') {
        const save = subtotal * (disc.value / 100)
        savings += save
        breakdown.push(`Code "${disc.code}" (${disc.value}% off): −${fmt(save)}`)
      } else if (disc.type === 'fixed') {
        savings += disc.value
        breakdown.push(`Code "${disc.code}" (fixed): −${fmt(disc.value)}`)
      } else if (disc.type === 'flash') {
        const save = subtotal * (disc.value / 100)
        savings += save
        breakdown.push(`Flash sale "${disc.code}" (${disc.value}% off): −${fmt(save)}`)
      }
    }

    setResult({
      subtotal, savings,
      total: Math.max(0, subtotal - savings),
      breakdown,
    })
    setApplied(disc)
  }

  return (
    <div className={styles.calcCard}>
      <div className={styles.calcHead}>
        <Ic d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 7h6" size={18} stroke="#1a1a2e" />
        Discount Calculator
      </div>
      <div className={styles.calcBody}>
        <div className={styles.calcRow}>
          <div className={styles.calcField}>
            <label>Unit Price (₦)</label>
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </div>
          <div className={styles.calcField}>
            <label>Quantity</label>
            <input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} />
          </div>
          <div className={styles.calcField}>
            <label>Discount Code</label>
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SUMMER25" />
          </div>
          <button className={styles.calcBtn} onClick={calculate}>Calculate</button>
        </div>

        {result && (
          <div className={`${styles.calcResult} ${result.error ? styles.calcError : ''}`}>
            {result.error ? (
              <div className={styles.calcErrorMsg}>
                <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={15} stroke="#DC2626" />
                {result.error}
              </div>
            ) : (
              <>
                <div className={styles.calcBreakdown}>
                  <div className={styles.calcLine}>
                    <span>Subtotal ({qty} × {fmt(price)})</span>
                    <span>{fmt(result.subtotal)}</span>
                  </div>
                  {result.breakdown.map((b, i) => (
                    <div key={i} className={`${styles.calcLine} ${styles.calcDiscount}`}>
                      <span>{b}</span>
                    </div>
                  ))}
                  {result.breakdown.length === 0 && (
                    <div className={styles.calcLine} style={{ color: '#9CA3AF' }}>
                      <span>No discounts applied</span>
                    </div>
                  )}
                  <div className={`${styles.calcLine} ${styles.calcTotal}`}>
                    <span>Total</span>
                    <span>{fmt(result.total)}</span>
                  </div>
                  {result.savings > 0 && (
                    <div className={styles.calcSavings}>
                      🎉 You saved {fmt(result.savings)} ({Math.round((result.savings / result.subtotal) * 100)}%)
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Discount Modal ────────────────────────────────────────
function DiscountModal({ discount, onClose, onSave }) {
  const isEdit = !!discount
  const [form, setForm] = useState({
    code:            discount?.code            || '',
    name:            discount?.name            || '',
    type:            discount?.type            || 'percentage',
    value:           discount?.value           || '',
    buyQty:          discount?.buyQty          || 2,
    getQty:          discount?.getQty          || 1,
    multipleOf:      discount?.multipleOf      || 3,
    rrpPrice:        discount?.rrpPrice        || '',
    appliesTo:       discount?.appliesTo       || 'All products',
    minOrder:        discount?.minOrder        || '',
    maxUses:         discount?.maxUses         || '',
    customerSegment: discount?.customerSegment || 'All customers',
    channel:         discount?.channel         || 'All channels',
    startDate:       discount?.startDate       || today(),
    endDate:         discount?.endDate         || '',
    status:          discount?.status          || 'active',
    stackable:       discount?.stackable       ?? false,
    onePerCustomer:  discount?.onePerCustomer  ?? false,
    description:     discount?.description     || '',
    tiers:           discount?.tiers           || [
      { minQty: 1,  maxQty: 4,  discount: 0,  label: 'Standard'  },
      { minQty: 5,  maxQty: 9,  discount: 5,  label: 'Bulk'      },
      { minQty: 10, maxQty: 24, discount: 10, label: 'Wholesale' },
      { minQty: 25, maxQty: 99, discount: 15, label: 'Trade'     },
    ],
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const setTier = (i, k, v) => setForm(f => {
    const tiers = [...f.tiers]
    tiers[i] = { ...tiers[i], [k]: v }
    return { ...f, tiers }
  })

  const typeInfo = DISC_TYPES[form.type]

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    set('code', Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''))
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{isEdit ? 'Edit Discount' : 'Create Discount'}</h2>
            <p className={styles.mSub}>Configure your discount rules and conditions</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>

          {/* Discount type selector */}
          <div className={styles.fg}>
            <label>Discount Type <span className={styles.req}>*</span></label>
            <div className={styles.typeGrid}>
              {Object.entries(DISC_TYPES).map(([key, cfg]) => (
                <button
                  key={key}
                  className={`${styles.typeCard} ${form.type === key ? styles.typeCardOn : ''}`}
                  onClick={() => set('type', key)}
                  style={{ borderColor: form.type === key ? cfg.color : undefined }}
                >
                  <div className={styles.typeCardIco} style={{ background: cfg.bg, color: cfg.color }}>
                    <Ic d={cfg.icon} size={16} stroke={cfg.color} />
                  </div>
                  <span className={styles.typeCardLabel}>{cfg.label}</span>
                  {form.type === key && (
                    <div className={styles.typeCardCheck} style={{ background: cfg.color }}>
                      <Ic d="M20 6L9 17l-5-5" size={10} stroke="#fff" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Basic info */}
          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Discount Name <span className={styles.req}>*</span></label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Summer Sale 25%" />
            </div>
            <div className={styles.fg}>
              <label>Discount Code</label>
              <div className={styles.codeWrap}>
                <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="SUMMER25" className={styles.codeInput} />
                <button className={styles.codeGenBtn} onClick={generateCode} title="Auto-generate code">
                  <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Value config based on type */}
          {['percentage', 'fixed', 'flash'].includes(form.type) && (
            <div className={styles.fg}>
              <label>{form.type === 'fixed' ? 'Discount Amount (₦)' : 'Discount Percentage (%)'}</label>
              <div className={styles.inputPre}>
                <span>{form.type === 'fixed' ? '₦' : '%'}</span>
                <input type="number" min={0} max={form.type !== 'fixed' ? 100 : undefined}
                  value={form.value} onChange={e => set('value', e.target.value)} placeholder="0" />
              </div>
            </div>
          )}

          {form.type === 'bogo' && (
            <div className={styles.bogoConfig}>
              <div className={styles.bogoRow}>
                <div className={styles.fg}>
                  <label>Customer Buys (qty)</label>
                  <input type="number" min={1} value={form.buyQty} onChange={e => set('buyQty', Number(e.target.value))} />
                </div>
                <div className={styles.bogoArrow}>→ Gets</div>
                <div className={styles.fg}>
                  <label>Free Items (qty)</label>
                  <input type="number" min={1} value={form.getQty} onChange={e => set('getQty', Number(e.target.value))} />
                </div>
              </div>
              <div className={styles.bogoPreview}>
                Buy {form.buyQty} → get {form.getQty} free (effective: {Math.round((form.getQty / (form.buyQty + form.getQty)) * 100)}% saving)
              </div>
            </div>
          )}

          {form.type === 'multibuy' && (
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>Multiple Of (qty)</label>
                <input type="number" min={2} value={form.multipleOf} onChange={e => set('multipleOf', Number(e.target.value))} />
                <span className={styles.fieldHint}>e.g. 3 = discount applies when qty is 3, 6, 9…</span>
              </div>
              <div className={styles.fg}>
                <label>Discount per Batch (%)</label>
                <div className={styles.inputPre}>
                  <span>%</span>
                  <input type="number" min={0} max={100} value={form.value} onChange={e => set('value', e.target.value)} placeholder="10" />
                </div>
              </div>
            </div>
          )}

          {form.type === 'rrp' && (
            <div className={styles.rrpConfig}>
              <div className={styles.fg}>
                <label>Recommended Retail Price (RRP)</label>
                <div className={styles.inputPre}>
                  <span>₦</span>
                  <input type="number" min={0} value={form.rrpPrice} onChange={e => set('rrpPrice', e.target.value)} placeholder="15000" />
                </div>
                <span className={styles.fieldHint}>Products cannot be sold below this price. Applies as a floor price control.</span>
              </div>
              <div className={styles.rrpNotice}>
                <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={14} stroke="#B45309" />
                <span>RRP rules override all other discount types. Ensure suppliers are aligned before activating.</span>
              </div>
            </div>
          )}

          {form.type === 'tiered' && (
            <div className={styles.tieredConfig}>
              <label className={styles.tieredLabel}>Pricing Tiers</label>
              <div className={styles.tiersTable}>
                <div className={styles.tiersHead}>
                  <span>Label</span><span>Min Qty</span><span>Max Qty</span><span>Discount %</span>
                </div>
                {form.tiers.map((tier, i) => (
                  <div key={i} className={styles.tierRow}>
                    <input value={tier.label} onChange={e => setTier(i, 'label', e.target.value)} className={styles.tierInput} />
                    <input type="number" min={0} value={tier.minQty} onChange={e => setTier(i, 'minQty', Number(e.target.value))} className={styles.tierInput} />
                    <input type="number" min={0} value={tier.maxQty} onChange={e => setTier(i, 'maxQty', Number(e.target.value))} className={styles.tierInput} />
                    <input type="number" min={0} max={100} value={tier.discount} onChange={e => setTier(i, 'discount', Number(e.target.value))} className={styles.tierInput} />
                  </div>
                ))}
              </div>
              <button className={styles.addTierBtn} onClick={() => setForm(f => ({ ...f, tiers: [...f.tiers, { minQty: 0, maxQty: 999, discount: 0, label: 'New Tier' }] }))}>
                <Ic d="M12 5v14M5 12h14" size={12} /> Add Tier
              </button>
            </div>
          )}

          {/* Conditions */}
          <div className={styles.sectionDivider}>Conditions & Limits</div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Applies To</label>
              <select value={form.appliesTo} onChange={e => set('appliesTo', e.target.value)}>
                {APPLIES_TO.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className={styles.fg}>
              <label>Customer Segment</label>
              <select value={form.customerSegment} onChange={e => set('customerSegment', e.target.value)}>
                {CUSTOMER_SEGS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Sales Channel</label>
              <select value={form.channel} onChange={e => set('channel', e.target.value)}>
                {CHANNELS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.fg}>
              <label>Minimum Order Value (₦)</label>
              <div className={styles.inputPre}>
                <span>₦</span>
                <input type="number" min={0} value={form.minOrder} onChange={e => set('minOrder', e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Max Total Uses <span className={styles.opt}>(0 = unlimited)</span></label>
              <input type="number" min={0} value={form.maxUses} onChange={e => set('maxUses', e.target.value)} placeholder="0" />
            </div>
            <div className={styles.fg}>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          {/* Date range */}
          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Start Date</label>
              <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div className={styles.fg}>
              <label>End Date <span className={styles.opt}>(leave blank = no expiry)</span></label>
              <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          {/* Toggles */}
          <div className={styles.togglesRow}>
            <label className={styles.toggleItem}>
              <div className={`${styles.toggle} ${form.stackable ? styles.toggleOn : ''}`} onClick={() => set('stackable', !form.stackable)}>
                <div className={styles.toggleThumb} />
              </div>
              <div>
                <span className={styles.toggleLbl}>Stackable</span>
                <span className={styles.toggleDesc}>Can combine with other discounts</span>
              </div>
            </label>
            <label className={styles.toggleItem}>
              <div className={`${styles.toggle} ${form.onePerCustomer ? styles.toggleOn : ''}`} onClick={() => set('onePerCustomer', !form.onePerCustomer)}>
                <div className={styles.toggleThumb} />
              </div>
              <div>
                <span className={styles.toggleLbl}>One per customer</span>
                <span className={styles.toggleDesc}>Limit each customer to one use</span>
              </div>
            </label>
          </div>

          <div className={styles.fg}>
            <label>Internal Description <span className={styles.opt}>(optional)</span></label>
            <textarea rows={2} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Notes for your team about this discount…" />
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={!form.name.trim()} onClick={() => onSave(form)}>
            {isEdit ? 'Save Changes' : 'Create Discount'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Discounts() {
  const [discounts,    setDiscounts]    = useState(SEED)
  const [modal,        setModal]        = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [activeTab,    setActiveTab]    = useState('all')
  const [search,       setSearch]       = useState('')
  const [filterType,   setFilterType]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selected,     setSelected]     = useState([])

  const stats = {
    total:    discounts.length,
    active:   discounts.filter(d => d.status === 'active').length,
    totalUses:discounts.reduce((a, d) => a + (d.usedCount || 0), 0),
    scheduled:discounts.filter(d => d.status === 'scheduled').length,
  }

  const filtered = discounts.filter(d => {
    const q   = search.toLowerCase()
    const ms  = d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)
    const mt  = filterType   === 'all' || d.type   === filterType
    const mst = filterStatus === 'all' || d.status === filterStatus
    return ms && mt && mst
  })

  const save = (data) => {
    if (editTarget) {
      setDiscounts(ds => ds.map(d => d.id === editTarget.id ? { ...d, ...data } : d))
    } else {
      setDiscounts(ds => [...ds, { ...data, id: uid(), usedCount: 0, conditions: [] }])
    }
    setModal(null); setEditTarget(null)
  }

  const del = (id)    => setDiscounts(ds => ds.filter(d => d.id !== id))
  const pause = (id)  => setDiscounts(ds => ds.map(d => d.id === id ? { ...d, status: d.status === 'paused' ? 'active' : 'paused' } : d))
  const toggleSel = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(d => d.id))

  const usagePct = (d) => d.maxUses ? Math.min(100, Math.round((d.usedCount / d.maxUses) * 100)) : null

  return (
    <div className={styles.page}>

      {/* Topbar */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Discounts</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline} onClick={() => setModal('calc')}>
            <Ic d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" size={14} />
            Calculator
          </button>
          <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('discount') }}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
            Create Discount
          </button>
        </div>
      </header>

      <div className={styles.content}>

        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Discounts',  value: stats.total,     accent: '#1a1a2e', icon: 'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0' },
            { label: 'Active',           value: stats.active,    accent: '#2DBD97', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3' },
            { label: 'Scheduled',        value: stats.scheduled, accent: '#3B82F6', icon: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2' },
            { label: 'Total Redemptions',value: stats.totalUses, accent: '#8B5CF6', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLbl}>{s.label}</span>
                <Ic d={s.icon} size={15} stroke={s.accent} />
              </div>
              <div className={styles.statVal} style={{ color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Type filter pills */}
        <div className={styles.typeFilterRow}>
          <button className={`${styles.typePill} ${filterType === 'all' ? styles.typePillOn : ''}`} onClick={() => setFilterType('all')}>
            All Types
          </button>
          {Object.entries(DISC_TYPES).map(([key, cfg]) => (
            <button
              key={key}
              className={`${styles.typePill} ${filterType === key ? styles.typePillOn : ''}`}
              onClick={() => setFilterType(key)}
              style={filterType === key ? { background: cfg.color, color: '#fff', borderColor: cfg.color } : {}}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsL}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /></span>
              <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by code or name…" />
            </div>
          </div>
          <div className={styles.controlsR}>
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>{selected.length} selected</span>
            <button className={styles.bulkBtn} onClick={() => { selected.forEach(id => del(id)); setSelected([]) }}>
              <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} stroke="#FCA5A5" /> Delete
            </button>
            <button className={styles.bulkBtn} onClick={() => { selected.forEach(id => pause(id)); setSelected([]) }}>
              Pause Selected
            </button>
          </div>
        )}

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tHead}>
            <span><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></span>
            <span>Discount</span>
            <span>Type</span>
            <span>Value</span>
            <span>Usage</span>
            <span>Conditions</span>
            <span>Dates</span>
            <span>Status</span>
            <span></span>
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <rect x="10" y="20" width="52" height="38" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5"/>
                <path d="M22 39l14-14M28 33a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM44 47a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="#2DBD97" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="54" cy="54" r="12" fill="#2DBD97"/>
                <path d="M49 54h10M54 49v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3>No discounts found</h3>
              <p>Create your first discount to start driving sales</p>
              <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('discount') }}>
                <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Create Discount
              </button>
            </div>
          ) : filtered.map(d => {
            const typeInfo = DISC_TYPES[d.type]
            const usage    = usagePct(d)
            const isExpired = d.endDate && new Date(d.endDate) < new Date()
            return (
              <div key={d.id} className={styles.tRow}>
                <span><input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggleSel(d.id)} /></span>

                <span className={styles.discCell}>
                  <div className={styles.discName}>{d.name}</div>
                  {d.code && <code className={styles.discCode}>{d.code}</code>}
                  {d.description && <div className={styles.discDesc}>{d.description}</div>}
                </span>

                <span>
                  <span className={styles.typeBadge} style={{ background: typeInfo.bg, color: typeInfo.color }}>
                    <Ic d={typeInfo.icon} size={11} stroke={typeInfo.color} />
                    {typeInfo.label}
                  </span>
                </span>

                <span className={styles.valueCell}>
                  {d.type === 'percentage' || d.type === 'flash' ? `${d.value}% off`
                    : d.type === 'fixed'       ? `${fmt(d.value)} off`
                    : d.type === 'bogo'        ? `B${d.buyQty}G${d.getQty}`
                    : d.type === 'multibuy'    ? `×${d.multipleOf} → ${d.value}% off`
                    : d.type === 'rrp'         ? `RRP ${fmt(d.rrpPrice)}`
                    : d.type === 'tiered'      ? `${d.tiers.length} tiers`
                    : d.type === 'freeShipping'? 'Free shipping'
                    : d.type === 'loyalty'     ? `${d.value}% off`
                    : d.type === 'bundle'      ? `Bundle`
                    : '—'
                  }
                </span>

                <span className={styles.usageCell}>
                  <div className={styles.usageNums}>
                    <span>{d.usedCount}</span>
                    {d.maxUses > 0 && <span className={styles.usageMax}>/ {d.maxUses}</span>}
                  </div>
                  {usage !== null && (
                    <div className={styles.usageBar}>
                      <div className={styles.usageBarFill} style={{ width: `${usage}%`, background: usage >= 90 ? '#EF4444' : usage >= 70 ? '#F59E0B' : '#2DBD97' }} />
                    </div>
                  )}
                </span>

                <span className={styles.condCell}>
                  <div className={styles.condItem}>{d.appliesTo}</div>
                  {d.minOrder > 0 && <div className={styles.condItem}>Min {fmt(d.minOrder)}</div>}
                  {d.customerSegment !== 'All customers' && <div className={styles.condItem}>{d.customerSegment}</div>}
                  {d.stackable && <span className={styles.stackBadge}>Stackable</span>}
                </span>

                <span className={styles.dateCell}>
                  <div>{fmtD(d.startDate)}</div>
                  {d.endDate && <div className={styles.dateSep}>→ {fmtD(d.endDate)}</div>}
                  {!d.endDate && <div className={styles.dateSep}>No expiry</div>}
                </span>

                <span>
                  <span className={styles.statusPill} style={{ background: STATUS_CFG[d.status]?.bg, color: STATUS_CFG[d.status]?.color }}>
                    {STATUS_CFG[d.status]?.label}
                  </span>
                  {isExpired && d.status === 'active' && (
                    <div style={{ fontSize: 10.5, color: '#DC2626', marginTop: 2 }}>Expired</div>
                  )}
                </span>

                <span className={styles.actCell}>
                  <button className={styles.iconBtn} title="Edit" onClick={() => { setEditTarget(d); setModal('discount') }}>
                    <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
                  </button>
                  <button className={styles.iconBtn} title={d.status === 'paused' ? 'Resume' : 'Pause'} onClick={() => pause(d.id)}>
                    <Ic d={d.status === 'paused' ? 'M5 3l14 9-14 9V3z' : 'M10 9v6m4-6v6M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z'} size={13} />
                  </button>
                  <button className={styles.iconBtnRed} title="Delete" onClick={() => del(d.id)}>
                    <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} />
                  </button>
                </span>
              </div>
            )
          })}
        </div>

        <p className={styles.countLine}>Showing {filtered.length} of {discounts.length} discounts</p>
      </div>

      {/* Modals */}
      {modal === 'discount' && (
        <DiscountModal
          discount={editTarget}
          onClose={() => { setModal(null); setEditTarget(null) }}
          onSave={save}
        />
      )}
      {modal === 'calc' && (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className={styles.modalCalc}>
            <div className={styles.mHead}>
              <div><h2 className={styles.mTitle}>Discount Calculator</h2><p className={styles.mSub}>Test how your discounts apply to a real order</p></div>
              <button className={styles.mClose} onClick={() => setModal(null)}><Ic d="M18 6L6 18M6 6l12 12" size={18} /></button>
            </div>
            <div className={styles.mBody}><DiscountCalculator /></div>
          </div>
        </div>
      )}
    </div>
  )
}
