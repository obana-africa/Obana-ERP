
import { useState, useRef, useEffect } from 'react'
import styles from '../Orders.module.css'
import { fmt } from '../../../utils/formatters'
import { SAMPLE_CUSTOMERS, SAMPLE_PRODUCTS, PAYMENT_CONFIG, SALES_CHANNELS } from '../../../data/orders'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Searchable dropdown ───────────────────────────────────
function SearchDropdown({ label, placeholder, value, onChange, options, renderOption, renderSelected }) {
  const [open,  setOpen]  = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(o =>
    renderOption(o).toLowerCase().includes(query.toLowerCase())
  )
  const selected = options.find(o => o.id === value || o.name === value)

  return (
    <div className={styles.sdWrap} ref={ref}>
      <div className={`${styles.sdTrigger} ${open ? styles.sdTriggerOpen : ''}`}
        onClick={() => { setOpen(v => !v); setQuery('') }}>
        <span className={selected ? styles.sdValueText : styles.sdPlaceholder}>
          {selected ? renderSelected(selected) : placeholder}
        </span>
        <Ic d="M6 9l6 6 6-6" size={14} stroke="var(--ink3)" />
      </div>

      <div className={`${styles.sdDropdown} ${open ? styles.sdDropdownOpen : ''}`}>
        <div className={styles.sdSearch}>
          <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={13} stroke="var(--ink4)" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${label.toLowerCase()}…`}
            className={styles.sdSearchInput}
            onClick={e => e.stopPropagation()}
          />
        </div>
        <div className={styles.sdList}>
          {filtered.length === 0 ? (
            <div className={styles.sdEmpty}>No results found</div>
          ) : filtered.map((o, i) => {
            const isActive = o.id === value || o.name === value
            return (
              <div key={i}
                className={`${styles.sdItem} ${isActive ? styles.sdItemActive : ''} ${o.disabled ? styles.sdItemDisabled : ''}`}
                onClick={() => { if (!o.disabled) { onChange(o); setOpen(false); setQuery('') } }}>
                {renderOption(o)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/**
 * Props:
 *  onClose — () => void
 *  onSave  — (data) => void
 */
const CreateOrderModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    customer:'', email:'', phone:'', address:'',
    channel:'Website',
    items:[{ name:'', qty:1, price:'' }],
    payment:'unpaid', notes:'',
  })
  const set     = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i, k, v) => setForm(f => {
    const items = [...f.items]; items[i] = { ...items[i], [k]: v }; return { ...f, items }
  })
  const addItem    = ()  => setForm(f => ({ ...f, items:[...f.items,{ name:'', qty:1, price:'' }] }))
  const removeItem = i   => setForm(f => ({ ...f, items:f.items.filter((_,j) => j !== i) }))

  const total = form.items.reduce((a, item) => a + (Number(item.qty) * Number(item.price) || 0), 0)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Create New Order</h2>
            <p className={styles.mSub}>Manually record a new order</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          <p className={styles.secHead}>Customer Details</p>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Customer Name <span className={styles.req}>*</span></label>
              <SearchDropdown
                label="Customer" placeholder="Select a customer"
                value={form.customer}
                onChange={c => { set('customer', c.name); set('email', c.email); set('phone', c.phone); set('address', c.address) }}
                options={SAMPLE_CUSTOMERS}
                renderOption={c => `${c.name} — ${c.phone}`}
                renderSelected={c => c.name}
              />
            </div>
            <div className={styles.fg}>
              <label>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" />
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="customer@email.com" />
            </div>
            <div className={styles.fg}>
              <label>Sales Channel</label>
              <select value={form.channel} onChange={e => set('channel', e.target.value)}>
                {SALES_CHANNELS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.fg}>
            <label>Delivery Address</label>
            <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full shipping address" />
          </div>

          {/* Order items */}
          <div className={styles.itemsEditor}>
            <div className={styles.itemsEditorHead}>
              <p className={styles.secHead} style={{ margin:0 }}>Order Items</p>
              <button className={styles.btnOutlineSm} onClick={addItem}>
                <Ic d="M12 5v14M5 12h14" size={12} /> Add Item
              </button>
            </div>

            {form.items.map((item, i) => (
              <div key={i} className={styles.itemEditRow}>
                <div className={styles.fg} style={{ flex:2 }}>
                  <label>Product</label>
                  <SearchDropdown
                    label="Product" placeholder="Select a product"
                    value={item.name}
                    onChange={p => { setItem(i,'name',p.name); setItem(i,'price',p.price) }}
                    options={SAMPLE_PRODUCTS.map(p => ({ ...p, disabled: p.stock === 0 }))}
                    renderOption={p => `${p.name}${p.stock===0?' — Out of stock':` — ₦${p.price.toLocaleString()}`}`}
                    renderSelected={p => p.name}
                  />
                </div>
                <div className={styles.fg} style={{ flex:0.6 }}>
                  <label>Qty</label>
                  <input type="number" min="1" value={item.qty} onChange={e => setItem(i,'qty',e.target.value)} />
                </div>
                <div className={styles.fg} style={{ flex:1 }}>
                  <label>Unit Price (₦)</label>
                  <input type="number" value={item.price} onChange={e => setItem(i,'price',e.target.value)} placeholder="0" />
                </div>
                {form.items.length > 1 && (
                  <button className={styles.removeItemBtn} onClick={() => removeItem(i)}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={13} />
                  </button>
                )}
              </div>
            ))}

            <div className={styles.orderTotalRow}>
              <span>Order Total</span>
              <strong>{fmt(total)}</strong>
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Payment Status</label>
              <select value={form.payment} onChange={e => set('payment', e.target.value)}>
                {Object.entries(PAYMENT_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.fg}>
            <label>Notes <span className={styles.opt}>(optional)</span></label>
            <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)}
              placeholder="Any notes about this order…" />
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnPrimary}
              onClick={() => {
                onSave({ ...form, total, id:`ORD-${Date.now()}`, status:'pending', shipping:'pending', date:new Date().toISOString().split('T')[0] })
                onClose()
              }}>
              Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateOrderModal
