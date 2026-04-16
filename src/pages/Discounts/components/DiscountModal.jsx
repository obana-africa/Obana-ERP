import { useState } from 'react'
import styles from '../Discounts.module.css'
import {
  DISC_TYPES, STATUS_CFG,
  APPLIES_TO, CUSTOMER_SEGS, DISC_CHANNELS,
} from '../../../data/discounts'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const today = () => new Date().toISOString().split('T')[0]

/**
 * Props:
 *  discount — existing discount object (null = create)
 *  onClose  — () => void
 *  onSave   — (data) => void
 */
const DiscountModal = ({ discount, onClose, onSave }) => {
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
      { minQty:1,  maxQty:4,  discount:0,  label:'Standard'  },
      { minQty:5,  maxQty:9,  discount:5,  label:'Bulk'      },
      { minQty:10, maxQty:24, discount:10, label:'Wholesale' },
      { minQty:25, maxQty:99, discount:15, label:'Trade'     },
    ],
  })

  const set     = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setTier = (i, k, v) => setForm(f => {
    const tiers = [...f.tiers]; tiers[i] = { ...tiers[i], [k]: v }; return { ...f, tiers }
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

          {/* Type selector */}
          <div className={styles.fg}>
            <label>Discount Type <span className={styles.req}>*</span></label>
            <div className={styles.typeGrid}>
              {Object.entries(DISC_TYPES).map(([key, cfg]) => (
                <button key={key}
                  className={`${styles.typeCard} ${form.type === key ? styles.typeCardOn : ''}`}
                  onClick={() => set('type', key)}
                  style={{ borderColor: form.type === key ? cfg.color : undefined }}>
                  <div className={styles.typeCardIco} style={{ background:cfg.bg, color:cfg.color }}>
                    <Ic d={cfg.icon} size={16} stroke={cfg.color} />
                  </div>
                  <span className={styles.typeCardLabel}>{cfg.label}</span>
                  {form.type === key && (
                    <div className={styles.typeCardCheck} style={{ background:cfg.color }}>
                      <Ic d="M20 6L9 17l-5-5" size={10} stroke="#fff" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Code */}
          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Discount Name <span className={styles.req}>*</span></label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Summer Sale 25%" />
            </div>
            <div className={styles.fg}>
              <label>Discount Code</label>
              <div className={styles.codeWrap}>
                <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
                  placeholder="SUMMER25" className={styles.codeInput} />
                <button className={styles.codeGenBtn} onClick={generateCode} title="Auto-generate code">
                  <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Value by type */}
          {['percentage','fixed','flash'].includes(form.type) && (
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
                  <input type="number" min={1} value={form.buyQty}
                    onChange={e => set('buyQty', Number(e.target.value))} />
                </div>
                <div className={styles.bogoArrow}>→ Gets</div>
                <div className={styles.fg}>
                  <label>Free Items (qty)</label>
                  <input type="number" min={1} value={form.getQty}
                    onChange={e => set('getQty', Number(e.target.value))} />
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
                <input type="number" min={2} value={form.multipleOf}
                  onChange={e => set('multipleOf', Number(e.target.value))} />
                <span className={styles.fieldHint}>e.g. 3 = discount applies when qty is 3, 6, 9…</span>
              </div>
              <div className={styles.fg}>
                <label>Discount per Batch (%)</label>
                <div className={styles.inputPre}>
                  <span>%</span>
                  <input type="number" min={0} max={100} value={form.value}
                    onChange={e => set('value', e.target.value)} placeholder="10" />
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
                  <input type="number" min={0} value={form.rrpPrice}
                    onChange={e => set('rrpPrice', e.target.value)} placeholder="15000" />
                </div>
                <span className={styles.fieldHint}>Products cannot be sold below this price.</span>
              </div>
              <div className={styles.rrpNotice}>
                <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={14} stroke="#B45309" />
                <span>RRP rules override all other discount types.</span>
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
                    <input value={tier.label} onChange={e => setTier(i,'label',e.target.value)} className={styles.tierInput} />
                    <input type="number" min={0} value={tier.minQty} onChange={e => setTier(i,'minQty',Number(e.target.value))} className={styles.tierInput} />
                    <input type="number" min={0} value={tier.maxQty} onChange={e => setTier(i,'maxQty',Number(e.target.value))} className={styles.tierInput} />
                    <input type="number" min={0} max={100} value={tier.discount} onChange={e => setTier(i,'discount',Number(e.target.value))} className={styles.tierInput} />
                  </div>
                ))}
              </div>
              <button className={styles.addTierBtn}
                onClick={() => setForm(f => ({ ...f, tiers:[...f.tiers,{ minQty:0, maxQty:999, discount:0, label:'New Tier' }] }))}>
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
                {DISC_CHANNELS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={styles.fg}>
              <label>Minimum Order Value (₦)</label>
              <div className={styles.inputPre}>
                <span>₦</span>
                <input type="number" min={0} value={form.minOrder}
                  onChange={e => set('minOrder', e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Max Total Uses <span className={styles.opt}>(0 = unlimited)</span></label>
              <input type="number" min={0} value={form.maxUses}
                onChange={e => set('maxUses', e.target.value)} placeholder="0" />
            </div>
            <div className={styles.fg}>
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {Object.entries(STATUS_CFG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

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
            {[
              { key:'stackable',      label:'Stackable',         desc:'Can combine with other discounts' },
              { key:'onePerCustomer', label:'One per customer',  desc:'Limit each customer to one use'   },
            ].map(t => (
              <label key={t.key} className={styles.toggleItem}>
                <div className={`${styles.toggle} ${form[t.key] ? styles.toggleOn : ''}`}
                  onClick={() => set(t.key, !form[t.key])}>
                  <div className={styles.toggleThumb} />
                </div>
                <div>
                  <span className={styles.toggleLbl}>{t.label}</span>
                  <span className={styles.toggleDesc}>{t.desc}</span>
                </div>
              </label>
            ))}
          </div>

          <div className={styles.fg}>
            <label>Internal Description <span className={styles.opt}>(optional)</span></label>
            <textarea rows={2} value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Notes for your team about this discount…" />
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={!form.name.trim()}
            onClick={() => onSave(form)}>
            {isEdit ? 'Save Changes' : 'Create Discount'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DiscountModal
