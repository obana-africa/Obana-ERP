import { useState, useRef, useEffect } from 'react'
import styles from './Orders.module.css'

// ── Icons ────────────────────────────────────────────────
const Ico = ({ path, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {[].concat(path).map((d, i) => <path key={i} d={d} />)}
  </svg>
)

const icons = {
  orders:      ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2','M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2'],
  naira:       ['M2 8h20','M2 16h20','M6 4v16','M18 4v16'],
  check:       'M20 6L9 17l-5-5',
  unpaid:      ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  plus:        'M12 5v14M5 12h14',
  search:      'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  filter:      ['M22 3H2l8 9.46V19l4 2v-8.54z'],
  delivery:    ['M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3','M9 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0','M17 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0','M13 9h8l2 8H13V9z'],
  calendar:    ['M3 9h18','M3 5h18','M8 3v4','M16 3v4','M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'],
  chevDown:    'M6 9l6 6 6-6',
  chevRight:   'M9 18l6-6-6-6',
  close:       ['M18 6L6 18','M6 6l12 12'],
  eye:         ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  edit:        ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:       ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  download:    ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  star:        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  alert:       ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  refresh:     ['M1 4v6h6','M23 20v-6h-6','M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'],
  mail:        ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:       'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  package:     ['M12 2L2 7l10 5 10-5-10-5z','M2 17l10 5 10-5','M2 12l10 5 10-5'],
  info:        ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 8h.01','M12 12v4'],
  send:        ['M22 2L11 13','M22 2L15 22l-4-9-9-4 20-7z'],
  abandon:     ['M3 3h18v18H3z','M3 9h18','M9 21V9'],
  copy:        ['M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8z','M4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2'],
}

// ── Searchable Dropdown ──────────────────────────────────
function SearchDropdown({ label, placeholder, value, onChange, options, renderOption, renderSelected }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(o =>
    renderOption(o).toLowerCase().includes(query.toLowerCase())
  )

  const selected = options.find(o => o.id === value || o.name === value)

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <div
        onClick={() => { setOpen(v => !v); setQuery('') }}
        style={{
          width: '100%', padding: '0.55rem 0.75rem',
          fontFamily: 'DM Sans, sans-serif', fontSize: 13.5,
          color: selected ? 'var(--ink)' : '#C4C9D4',
          background: 'var(--white)',
          border: `1.5px solid ${open ? 'var(--green)' : 'var(--border)'}`,
          borderRadius: 8, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: open ? '0 0 0 3px rgba(45,189,151,0.1)' : 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          userSelect: 'none',
        }}
      >
        <span>{selected ? renderSelected(selected) : placeholder}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s', flexShrink: 0, color: 'var(--ink3)' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <div style={{
        position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
        background: 'var(--white)', border: '1.5px solid var(--border)',
        borderRadius: 10, boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        maxHeight: open ? 260 : 0,
        opacity: open ? 1 : 0,
        transition: 'max-height 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease',
        pointerEvents: open ? 'auto' : 'none',
      }}>
        <div style={{ padding: '8px 8px 4px' }}>
          <div style={{ position: 'relative' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink4)' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              style={{
                width: '100%', padding: '0.45rem 0.75rem 0.45rem 30px',
                fontFamily: 'DM Sans, sans-serif', fontSize: 13,
                border: '1.5px solid var(--border)', borderRadius: 7,
                outline: 'none', color: 'var(--ink)', background: 'var(--surface)',
              }}
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>

        <div style={{ overflowY: 'auto', maxHeight: 195 }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '1rem', textAlign: 'center', fontSize: 13, color: 'var(--ink3)' }}>
              No results found
            </div>
          ) : filtered.map((o, i) => (
            <div key={i}
              onClick={() => { onChange(o); setOpen(false); setQuery('') }}
              style={{
                padding: '0.6rem 0.85rem', cursor: 'pointer', fontSize: 13,
                color: (o.id === value || o.name === value) ? 'var(--green-dk)' : 'var(--ink2)',
                background: (o.id === value || o.name === value) ? 'var(--green-lt)' : 'transparent',
                transition: 'background 0.12s',
                opacity: o.disabled ? 0.4 : 1,
                pointerEvents: o.disabled ? 'none' : 'auto',
              }}
              onMouseEnter={e => { if (!o.disabled) e.currentTarget.style.background = '#F0FDF9' }}
              onMouseLeave={e => { e.currentTarget.style.background = (o.id === value || o.name === value) ? 'var(--green-lt)' : 'transparent' }}
            >
              {renderOption(o)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Sample Data ──────────────────────────────────────────
const SAMPLE_ORDERS = [
  { id: 'ORD-1001', customer: 'Adaeze Okonkwo', email: 'adaeze@gmail.com', phone: '+234 803 123 4567', items: [{ name: 'Classic Ankara Dress', qty: 2, price: 15000 }, { name: 'Leather Bag', qty: 1, price: 22000 }], total: 52000, status: 'completed', payment: 'paid', shipping: 'delivered', date: '2026-04-01', channel: 'Website', address: '14 Adeola Odeku, VI, Lagos' },
  { id: 'ORD-1002', customer: 'Emmanuel Bassey', email: 'emma.b@yahoo.com', phone: '+234 812 987 6543', items: [{ name: 'Premium Shea Butter', qty: 4, price: 4500 }], total: 18000, status: 'pending', payment: 'unpaid', shipping: 'processing', date: '2026-04-02', channel: 'Instagram', address: '7 Wuse Zone 4, Abuja' },
  { id: 'ORD-1003', customer: 'Fatima Kabir', email: 'fatimak@hotmail.com', phone: '+234 706 234 5678', items: [{ name: "Men's Kaftan Set", qty: 1, price: 28000 }], total: 28000, status: 'processing', payment: 'paid', shipping: 'shipped', date: '2026-04-03', channel: 'WhatsApp', address: '22 Ahmadu Bello Way, Kano' },
  { id: 'ORD-1004', customer: 'Chukwuemeka Ibe', email: 'emeka.ibe@gmail.com', phone: '+234 909 876 5432', items: [{ name: 'Classic Ankara Dress', qty: 1, price: 15000 }, { name: 'Premium Shea Butter', qty: 2, price: 4500 }], total: 24000, status: 'completed', payment: 'paid', shipping: 'delivered', date: '2026-03-30', channel: 'Website', address: '5 Rumuola Road, Port Harcourt' },
  { id: 'ORD-1005', customer: 'Ngozi Eze', email: 'ngozi.e@gmail.com', phone: '+234 803 456 7890', items: [{ name: 'Leather Crossbody Bag', qty: 1, price: 22000 }], total: 22000, status: 'cancelled', payment: 'refunded', shipping: 'cancelled', date: '2026-03-28', channel: 'Website', address: '19 Ogui Road, Enugu' },
  { id: 'ORD-1006', customer: 'Bola Adesanya', email: 'bola.a@outlook.com', phone: '+234 817 654 3210', items: [{ name: 'Classic Ankara Dress', qty: 3, price: 15000 }], total: 45000, status: 'pending', payment: 'partial', shipping: 'pending', date: '2026-04-04', channel: 'Facebook', address: '8 Bodija Market, Ibadan' },
]

const SAMPLE_CUSTOMERS = [
  { id: 'CUST-001', name: 'Adaeze Okonkwo', email: 'adaeze@gmail.com', phone: '+234 803 123 4567', address: '14 Adeola Odeku, VI, Lagos' },
  { id: 'CUST-002', name: 'Emmanuel Bassey', email: 'emma.b@yahoo.com', phone: '+234 812 987 6543', address: '7 Wuse Zone 4, Abuja' },
  { id: 'CUST-003', name: 'Fatima Kabir', email: 'fatimak@hotmail.com', phone: '+234 706 234 5678', address: '22 Ahmadu Bello Way, Kano' },
  { id: 'CUST-004', name: 'Chukwuemeka Ibe', email: 'emeka.ibe@gmail.com', phone: '+234 909 876 5432', address: '5 Rumuola Road, Port Harcourt' },
]

const SAMPLE_PRODUCTS = [
  { id: 'PROD-001', name: 'Classic Ankara Dress', price: 15000, stock: 5 },
  { id: 'PROD-002', name: 'Leather Bag', price: 22000, stock: 3 },
  { id: 'PROD-003', name: 'Premium Shea Butter', price: 4500, stock: 12 },
  { id: 'PROD-004', name: "Men's Kaftan Set", price: 28000, stock: 2 },
]

const ABANDONED = [
  { id: 'ABN-001', customer: 'Tunde Adeyemi', email: 'tunde.a@gmail.com', phone: '+234 802 111 2222', items: [{ name: 'Classic Ankara Dress', qty: 2, price: 15000 }], cartValue: 30000, abandonedAt: '2026-04-03 14:22', stage: 'Checkout', reminder: 0 },
  { id: 'ABN-002', customer: 'Kemi Oladele', email: 'kemi.ol@yahoo.com', phone: '+234 706 333 4444', items: [{ name: "Men's Kaftan Set", qty: 1, price: 28000 }, { name: 'Leather Bag', qty: 1, price: 22000 }], cartValue: 50000, abandonedAt: '2026-04-02 09:15', stage: 'Payment', reminder: 1 },
  { id: 'ABN-003', customer: 'Uche Nwosu', email: 'uche.n@gmail.com', phone: '+234 813 555 6666', items: [{ name: 'Premium Shea Butter', qty: 6, price: 4500 }], cartValue: 27000, abandonedAt: '2026-04-01 18:45', stage: 'Cart', reminder: 2 },
]

const REVIEWS = [
  { id: 1, customer: 'Adaeze Okonkwo', orderId: 'ORD-1001', product: 'Classic Ankara Dress', rating: 5, comment: 'Absolutely love this dress! The fabric quality is exceptional and the fit is perfect. Will definitely order again.', date: '2026-04-02', status: 'published' },
  { id: 2, customer: 'Chukwuemeka Ibe', orderId: 'ORD-1004', product: 'Premium Shea Butter', rating: 4, comment: 'Great product, very moisturising. Packaging could be better but the quality is top notch.', date: '2026-03-31', status: 'published' },
  { id: 3, customer: 'Fatima Kabir', orderId: 'ORD-1003', product: "Men's Kaftan Set", rating: 5, comment: "Bought this for my husband and he absolutely loves it. The embroidery work is stunning.", date: '2026-04-04', status: 'pending' },
  { id: 4, customer: 'Anonymous', orderId: 'ORD-1002', product: 'Leather Crossbody Bag', rating: 2, comment: 'The colour was slightly different from the photos online. Disappointed with the delivery time as well.', date: '2026-03-29', status: 'flagged' },
]

const STATUS_CONFIG = {
  completed:  { label: 'Completed',  bg: '#ECFDF5', color: '#059669' },
  pending:    { label: 'Pending',    bg: '#FFFBEB', color: '#D97706' },
  processing: { label: 'Processing', bg: '#EFF6FF', color: '#2563EB' },
  cancelled:  { label: 'Cancelled',  bg: '#FEF2F2', color: '#DC2626' },
}

const PAYMENT_CONFIG = {
  paid:     { label: 'Paid',     bg: '#ECFDF5', color: '#059669' },
  unpaid:   { label: 'Unpaid',   bg: '#FEF2F2', color: '#DC2626' },
  partial:  { label: 'Partial',  bg: '#FFFBEB', color: '#D97706' },
  refunded: { label: 'Refunded', bg: '#F5F3FF', color: '#7C3AED' },
}

const SHIP_CONFIG = {
  delivered:  { label: 'Delivered',  bg: '#ECFDF5', color: '#059669' },
  shipped:    { label: 'Shipped',    bg: '#EFF6FF', color: '#2563EB' },
  processing: { label: 'Processing', bg: '#FFFBEB', color: '#D97706' },
  pending:    { label: 'Pending',    bg: '#F3F4F6', color: '#6B7280' },
  cancelled:  { label: 'Cancelled',  bg: '#FEF2F2', color: '#DC2626' },
}

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`
const Pill = ({ cfg, value }) => {
  const c = cfg[value] || { label: value, bg: '#F3F4F6', color: '#6B7280' }
  return <span style={{ background: c.bg, color: c.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{c.label}</span>
}

// ── Order Detail Modal ────────────────────────────────────
function OrderModal({ order, onClose, onUpdateStatus }) {
  const [status, setStatus] = useState(order.status)
  const [shipping, setShipping] = useState(order.shipping)
  const [note, setNote] = useState('')

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 className={styles.mTitle}>{order.id}</h2>
              <Pill cfg={STATUS_CONFIG} value={order.status} />
            </div>
            <p className={styles.mSub}>{new Date(order.date).toLocaleDateString('en-NG', { dateStyle: 'full' })} · {order.channel}</p>
          </div>
          <button className={styles.mClose} onClick={onClose}><Ico path={icons.close} size={18} /></button>
        </div>
        <div className={styles.mBody}>
          <div className={styles.orderGrid}>

            {/* Customer */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Customer</h4>
              <div className={styles.customerCard}>
                <div className={styles.custAvatar}>{order.customer.split(' ').map(n => n[0]).join('').slice(0,2)}</div>
                <div>
                  <div className={styles.custName}>{order.customer}</div>
                  <div className={styles.custDetail}><Ico path={icons.mail} size={12} /> {order.email}</div>
                  <div className={styles.custDetail}><Ico path={icons.phone} size={12} /> {order.phone}</div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Shipping Address</h4>
              <div className={styles.infoBox}>{order.address}</div>
            </div>

            {/* Order items */}
            <div className={styles.orderSection} style={{ gridColumn: '1 / -1' }}>
              <h4 className={styles.secLbl}>Order Items</h4>
              <div className={styles.itemsTable}>
                <div className={styles.itemsHead}><span>Item</span><span>Qty</span><span>Price</span><span>Subtotal</span></div>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.itemRow}>
                    <span className={styles.itemName}><div className={styles.itemDot} />{item.name}</span>
                    <span>{item.qty}</span>
                    <span>{fmt(item.price)}</span>
                    <span className={styles.itemSub}>{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className={styles.itemTotal}>
                  <span style={{ gridColumn: '1/3' }} />
                  <span style={{ fontWeight: 600, color: 'var(--ink2)' }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--navy)' }}>{fmt(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status update */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Update Order Status</h4>
              <div className={styles.fg}>
                <label>Order Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className={styles.fg}>
                <label>Shipping Status</label>
                <select value={shipping} onChange={e => setShipping(e.target.value)}>
                  {Object.entries(SHIP_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            </div>

            {/* Payment */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Payment</h4>
              <div className={styles.paymentCard}>
                <div className={styles.payRow}><span>Amount</span><strong>{fmt(order.total)}</strong></div>
                <div className={styles.payRow}><span>Status</span><Pill cfg={PAYMENT_CONFIG} value={order.payment} /></div>
                <div className={styles.payRow}><span>Channel</span><span>{order.channel}</span></div>
              </div>
            </div>

            {/* Note */}
            <div className={styles.orderSection} style={{ gridColumn: '1 / -1' }}>
              <h4 className={styles.secLbl}>Add Note</h4>
              <textarea className={styles.noteArea} rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Add an internal note about this order..." />
            </div>
          </div>
        </div>
        <div className={styles.mFoot}>
          <div className={styles.mFootL}>
            <button className={styles.btnGhost} onClick={onClose}>Close</button>
          </div>
          <div className={styles.mFootR}>
            <button className={styles.btnOutline}><Ico path={icons.download} size={13} /> Download Invoice</button>
            <button className={styles.btnPrimary} onClick={() => { onUpdateStatus(order.id, status, shipping); onClose() }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Create Order Modal ────────────────────────────────────
function CreateOrderModal({ onClose, onSave }) {
  const [form, setForm] = useState({ customer: '', email: '', phone: '', address: '', channel: 'Website', items: [{ name: '', qty: 1, price: '' }], payment: 'unpaid', notes: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i, k, v) => setForm(f => { const items = [...f.items]; items[i] = { ...items[i], [k]: v }; return { ...f, items } })
  const addItem = () => setForm(f => ({ ...f, items: [...f.items, { name: '', qty: 1, price: '' }] }))
  const removeItem = (i) => setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))
  const total = form.items.reduce((a, item) => a + (Number(item.qty) * Number(item.price) || 0), 0)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div><h2 className={styles.mTitle}>Create New Order</h2><p className={styles.mSub}>Manually record a new order</p></div>
          <button className={styles.mClose} onClick={onClose}><Ico path={icons.close} size={18} /></button>
        </div>
        <div className={styles.mBody}>
          <p className={styles.secHead}>Customer Details</p>
          <div className={styles.fRow}>
            <div className={styles.fg}>
        <label>Customer Name <span className={styles.req}>*</span></label>
         <SearchDropdown
           label="Customer"
           placeholder="Select a customer"
           value={form.customer}
           onChange={c => { set('customer', c.name); set('email', c.email); set('phone', c.phone); set('address', c.address) }}
           options={SAMPLE_CUSTOMERS}
           renderOption={c => `${c.name} — ${c.phone}`}
           renderSelected={c => c.name}
                 />
        </div>
            <div className={styles.fg}><label>Phone</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" /></div>
          </div>
          <div className={styles.fRow}>
            <div className={styles.fg}><label>Email</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="customer@email.com" /></div>
            <div className={styles.fg}>
              <label>Sales Channel</label>
              <select value={form.channel} onChange={e => set('channel', e.target.value)}>
                {['Website','Instagram','WhatsApp','Facebook','In-store','Phone'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.fg}><label>Delivery Address</label><input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full shipping address" /></div>

          <div className={styles.itemsEditor}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <p className={styles.secHead} style={{ margin: 0 }}>Order Items</p>
              <button className={styles.btnOutline} style={{ padding: '0.3rem 0.75rem', fontSize: 12 }} onClick={addItem}><Ico path={icons.plus} size={12} /> Add Item</button>
            </div>
            {form.items.map((item, i) => (
              <div key={i} className={styles.itemEditRow}>
                <div className={styles.fg} style={{ flex: 2 }}>
           <label>Product</label>
              <SearchDropdown
                label="Product"
                placeholder="Select a product"
                value={item.name}
                onChange={p => { setItem(i, 'name', p.name); setItem(i, 'price', p.price) }}
                options={SAMPLE_PRODUCTS.map(p => ({ ...p, disabled: p.stock === 0 }))}
                renderOption={p => `${p.name}${p.stock === 0 ? ' — Out of stock' : ` — ₦${p.price.toLocaleString()}`}`}
                renderSelected={p => p.name}
              />
              </div>
                <div className={styles.fg} style={{ flex: 0.6 }}><label>Qty</label><input type="number" min="1" value={item.qty} onChange={e => setItem(i, 'qty', e.target.value)} /></div>
                <div className={styles.fg} style={{ flex: 1 }}><label>Unit Price (₦)</label><input type="number" value={item.price} onChange={e => setItem(i, 'price', e.target.value)} placeholder="0" /></div>
                {form.items.length > 1 && <button className={styles.removeItemBtn} onClick={() => removeItem(i)}><Ico path={icons.close} size={13} /></button>}
              </div>
            ))}
            <div className={styles.orderTotalRow}><span>Order Total</span><strong>{fmt(total)}</strong></div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Payment Status</label>
              <select value={form.payment} onChange={e => set('payment', e.target.value)}>
                {Object.entries(PAYMENT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.fg}><label>Notes <span className={styles.opt}>(optional)</span></label><textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes about this order..." /></div>
        </div>
        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnPrimary} onClick={() => { onSave({ ...form, total, id: `ORD-${Date.now()}`, status: 'pending', shipping: 'pending', date: new Date().toISOString().split('T')[0] }); onClose() }}>Create Order</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────
export default function OrdersDashboard() {
  const [tab, setTab] = useState('orders')
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [abandoned, _setAbandoned] = useState(ABANDONED)
  const [reviews, setReviews] = useState(REVIEWS)
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPayment, setFilterPayment] = useState('all')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState([])
  const [perPage, setPerPage] = useState(25)
  const [reminderSent, setReminderSent] = useState({})

  const totalOrders = orders.length
  const amountOwed = orders.filter(o => o.payment !== 'paid').reduce((a, o) => a + o.total, 0)
  const completedOrders = orders.filter(o => o.status === 'completed').length
  const unpaidOrders = orders.filter(o => o.payment === 'unpaid').length

  const filtered = orders.filter(o => {
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || o.status === filterStatus
    const matchPayment = filterPayment === 'all' || o.payment === filterPayment
    const matchDate = (!dateFrom || o.date >= dateFrom) && (!dateTo || o.date <= dateTo)
    return matchSearch && matchStatus && matchPayment && matchDate
  })

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(o => o.id))

  const updateStatus = (id, status, shipping) => setOrders(os => os.map(o => o.id === id ? { ...o, status, shipping } : o))
  const createOrder = (data) => setOrders(os => [...os, data])
  const sendReminder = (id) => setReminderSent(r => ({ ...r, [id]: (r[id] || 0) + 1 }))

  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '—'

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Orders</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline}><Ico path={icons.chevDown} size={13} /> Actions</button>
          <button className={styles.btnPrimary} onClick={() => setShowCreate(true)}><Ico path={icons.plus} size={14} /> Create Order</button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Orders', value: totalOrders, icon: icons.orders, accent: '#2DBD97' },
            { label: 'Amount Owed', value: fmt(amountOwed), icon: icons.naira, accent: '#E8C547' },
            { label: 'Completed Orders', value: completedOrders, icon: icons.check, accent: '#2DBD97' },
            { label: 'Unpaid Orders', value: unpaidOrders, icon: icons.unpaid, accent: '#EF4444' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}><span className={styles.statLbl}>{s.label}</span><span style={{ color: s.accent }}><Ico path={s.icon} size={15} /></span></div>
              <div className={styles.statVal}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'orders' ? styles.tabOn : ''}`} onClick={() => setTab('orders')}>Recent Orders</button>
            <button className={`${styles.tab} ${tab === 'abandoned' ? styles.tabOn : ''}`} onClick={() => setTab('abandoned')}>
              Abandoned Orders <span className={styles.tabBadge}>{abandoned.length}</span>
            </button>
            <button className={`${styles.tab} ${tab === 'reviews' ? styles.tabOn : ''}`} onClick={() => setTab('reviews')}>
              Reviews <span className={styles.tabBadge}>{reviews.filter(r => r.status === 'pending').length}</span>
            </button>
          </div>
        </div>

        {/* ── ORDERS TAB ── */}
        {tab === 'orders' && (
          <div className={styles.tableSection}>
            {/* Controls */}
            <div className={styles.controls}>
              <div className={styles.controlsL}>
                <div className={styles.countTxt}>
                  <Ico path={icons.refresh} size={13} />
                  Showing {filtered.length} of {orders.length} Orders
                </div>
              </div>
              <div className={styles.controlsR}>
                {/* Filter */}
                <div className={styles.filterGroup}>
                  <select className={styles.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <select className={styles.filterSelect} value={filterPayment} onChange={e => setFilterPayment(e.target.value)}>
                    <option value="all">All Payment</option>
                    {Object.entries(PAYMENT_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <button className={styles.ctrlBtn} onClick={() => setShowDatePicker(p => !p)}>
                  <Ico path={icons.calendar} size={14} /> Select Date Range
                </button>
                <div className={styles.searchBox}>
                  <span className={styles.searchIco}><Ico path={icons.search} size={14} /></span>
                  <input placeholder="Search orders…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
            </div>

            {/* Date picker */}
            {showDatePicker && (
              <div className={styles.datePicker}>
                <div className={styles.fg} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 0 }}>
                  <label>From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 'auto' }} />
                  <label>To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 'auto' }} />
                  <button className={styles.btnOutline} style={{ padding: '0.3rem 0.75rem', fontSize: 12 }} onClick={() => { setDateFrom(''); setDateTo(''); setShowDatePicker(false) }}>Clear</button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></span>
                <span>Order Number & Name</span>
                <span>Total</span>
                <span>Status</span>
                <span>Payment</span>
                <span>Shipping</span>
                <span>Date</span>
                <span>Downloads</span>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.noRecord}>
                  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ opacity: 0.25 }}>
                    <path d="M10 20 L10 50 L50 50 L50 20 L30 8 Z" stroke="#2DBD97" strokeWidth="2" fill="none"/>
                    <line x1="20" y1="30" x2="40" y2="30" stroke="#2DBD97" strokeWidth="2"/>
                    <line x1="20" y1="38" x2="35" y2="38" stroke="#2DBD97" strokeWidth="2"/>
                  </svg>
                  <p>No record found</p>
                </div>
              ) : filtered.map(o => (
                <div key={o.id} className={`${styles.tableRow} ${selected.includes(o.id) ? styles.tableRowSel : ''}`}>
                  <span><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} /></span>
                  <span className={styles.orderCell}>
                    <div className={styles.orderNum} onClick={() => setSelectedOrder(o)}>{o.id}</div>
                    <div className={styles.orderCust}>{o.customer}</div>
                    <div className={styles.orderChan}>{o.channel}</div>
                  </span>
                  <span className={styles.orderTotal}>{fmt(o.total)}</span>
                  <span><Pill cfg={STATUS_CONFIG} value={o.status} /></span>
                  <span><Pill cfg={PAYMENT_CONFIG} value={o.payment} /></span>
                  <span><Pill cfg={SHIP_CONFIG} value={o.shipping} /></span>
                  <span className={styles.dateCell}>{new Date(o.date).toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' })}</span>
                  <span className={styles.actCell}>
                    <button className={styles.iconActBtn} title="View" onClick={() => setSelectedOrder(o)}><Ico path={icons.eye} size={13} /></button>
                    <button className={styles.iconActBtn} title="Edit" onClick={() => setSelectedOrder(o)}><Ico path={icons.edit} size={13} /></button>
                    <button className={styles.iconActBtn} title="Download"><Ico path={icons.download} size={13} /></button>
                  </span>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className={styles.pagination}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink3)' }}>
                Show
                <select value={perPage} onChange={e => setPerPage(Number(e.target.value))} className={styles.perPageSelect}>
                  {[10,25,50,100].map(n => <option key={n}>{n}</option>)}
                </select>
                Entries
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {['←', '1', '→'].map(p => (
                  <button key={p} className={`${styles.pgBtn} ${p === '1' ? styles.pgBtnActive : ''}`}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ABANDONED TAB ── */}
        {tab === 'abandoned' && (
          <div className={styles.tableSection}>
            <div className={styles.abandonedHeader}>
              <div className={styles.infoAlert}>
                <Ico path={icons.alert} size={14} />
                <span><strong>{abandoned.length} abandoned carts</strong> with a combined value of <strong>{fmt(abandoned.reduce((a, c) => a + c.cartValue, 0))}</strong>. Send reminders to recover these sales.</span>
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tableHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
                <span>Customer</span>
                <span>Cart Value</span>
                <span>Stage</span>
                <span>Abandoned At</span>
                <span>Items</span>
                <span>Actions</span>
              </div>
              {abandoned.map(a => (
                <div key={a.id} className={styles.tableRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr' }}>
                  <span className={styles.orderCell}>
                    <div className={styles.custAvatar} style={{ width: 32, height: 32, fontSize: 11 }}>{a.customer.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                    <div>
                      <div className={styles.orderCust} style={{ fontWeight: 600 }}>{a.customer}</div>
                      <div className={styles.orderChan}>{a.email}</div>
                    </div>
                  </span>
                  <span className={styles.orderTotal}>{fmt(a.cartValue)}</span>
                  <span>
                    <span style={{ background: '#FFF7ED', color: '#C2410C', padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>{a.stage}</span>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{a.abandonedAt}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink2)' }}>
                    {a.items.slice(0,2).map((item, i) => (
                      <div key={i}>{item.qty}× {item.name}</div>
                    ))}
                    {a.items.length > 2 && <div style={{ color: 'var(--ink4)' }}>+{a.items.length - 2} more</div>}
                  </span>
                  <span className={styles.actCell}>
                    <button
                      className={`${styles.remindBtn} ${reminderSent[a.id] ? styles.remindBtnSent : ''}`}
                      onClick={() => sendReminder(a.id)}
                      title="Send reminder"
                    >
                      {reminderSent[a.id]
                        ? <><Ico path={icons.check} size={12} /> Sent ({reminderSent[a.id]})</>
                        : <><Ico path={icons.mail} size={12} /> Remind</>
                      }
                    </button>
                    <button className={styles.iconActBtn} title="Call"><Ico path={icons.phone} size={13} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEWS TAB ── */}
        {tab === 'reviews' && (
          <div className={styles.tableSection}>
            <div className={styles.reviewsSummary}>
              <div className={styles.ratingBig}>
                <div className={styles.ratingNum}>{avgRating}</div>
                <div className={styles.ratingStars}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: Number(avgRating) >= s ? '#F59E0B' : '#E5E7EB', fontSize: 20 }}>★</span>
                  ))}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink3)' }}>{reviews.length} reviews</div>
              </div>
              <div className={styles.ratingBars}>
                {[5,4,3,2,1].map(r => {
                  const count = reviews.filter(x => x.rating === r).length
                  const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
                  return (
                    <div key={r} className={styles.ratingBarRow}>
                      <span style={{ fontSize: 12, color: 'var(--ink3)', width: 8 }}>{r}</span>
                      <span style={{ fontSize: 11, color: '#F59E0B' }}>★</span>
                      <div className={styles.ratingBarBg}><div className={styles.ratingBarFill} style={{ width: `${pct}%` }} /></div>
                      <span style={{ fontSize: 12, color: 'var(--ink3)', width: 24 }}>{count}</span>
                    </div>
                  )
                })}
              </div>
              <div className={styles.reviewStatusBreakdown}>
                {[
                  { label: 'Published', count: reviews.filter(r=>r.status==='published').length, color: '#059669', bg: '#ECFDF5' },
                  { label: 'Pending', count: reviews.filter(r=>r.status==='pending').length, color: '#D97706', bg: '#FFFBEB' },
                  { label: 'Flagged', count: reviews.filter(r=>r.status==='flagged').length, color: '#DC2626', bg: '#FEF2F2' },
                ].map(s => (
                  <div key={s.label} className={styles.reviewStatusCard} style={{ background: s.bg }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.count}</div>
                    <div style={{ fontSize: 11.5, color: s.color, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.reviewsList}>
              {reviews.map(r => (
                <div key={r.id} className={styles.reviewCard}>
                  <div className={styles.reviewTop}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className={styles.custAvatar} style={{ background: '#1a1a2e', color: '#E8C547' }}>{r.customer.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>{r.customer}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink3)' }}>{r.orderId} · {r.product}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div>
                        {[1,2,3,4,5].map(s => (
                          <span key={s} style={{ color: r.rating >= s ? '#F59E0B' : '#E5E7EB', fontSize: 16 }}>★</span>
                        ))}
                      </div>
                      <span style={{ background: r.status==='published'?'#ECFDF5':r.status==='pending'?'#FFFBEB':'#FEF2F2', color: r.status==='published'?'#059669':r.status==='pending'?'#D97706':'#DC2626', padding:'3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, textTransform:'capitalize' }}>{r.status}</span>
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{r.comment}</p>
                  <div className={styles.reviewFoot}>
                    <span style={{ fontSize: 12, color: 'var(--ink4)' }}>{new Date(r.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {r.status !== 'published' && (
                        <button className={styles.actBtn} onClick={() => setReviews(rs => rs.map(x => x.id === r.id ? { ...x, status: 'published' } : x))}>
                          <Ico path={icons.check} size={12} /> Publish
                        </button>
                      )}
                      {r.status !== 'flagged' && (
                        <button className={styles.actBtnWarn} onClick={() => setReviews(rs => rs.map(x => x.id === r.id ? { ...x, status: 'flagged' } : x))}>
                          <Ico path={icons.alert} size={12} /> Flag
                        </button>
                      )}
                      <button className={styles.actBtnRed} onClick={() => setReviews(rs => rs.filter(x => x.id !== r.id))}>
                        <Ico path={icons.trash} size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdateStatus={updateStatus} />}
      {showCreate && <CreateOrderModal onClose={() => setShowCreate(false)} onSave={createOrder} />}
    </div>
  )
}
