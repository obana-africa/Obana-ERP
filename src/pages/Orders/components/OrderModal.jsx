
import { useState } from 'react'
import styles from '../Orders.module.css'
import { fmt, fmtD } from '../../../utils/formatters'
import { STATUS_CONFIG, PAYMENT_CONFIG, SHIP_CONFIG } from '../../../data/orders'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const Pill = ({ cfg, value }) => {
  const c = cfg[value] || { label: value, bg: '#F3F4F6', color: '#6B7280' }
  return (
    <span style={{ background:c.bg, color:c.color, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, whiteSpace:'nowrap' }}>
      {c.label}
    </span>
  )
}

const initials = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()

/**
 * Props:
 *  order          — full order object
 *  onClose        — () => void
 *  onUpdateStatus — (id, status, shipping) => void
 */
const OrderModal = ({ order, onClose, onUpdateStatus }) => {
  const [status,   setStatus]   = useState(order.status)
  const [shipping, setShipping] = useState(order.shipping)
  const [note,     setNote]     = useState('')

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h2 className={styles.mTitle}>{order.id}</h2>
              <Pill cfg={STATUS_CONFIG} value={order.status} />
            </div>
            <p className={styles.mSub}>
              {new Date(order.date).toLocaleDateString('en-NG', { dateStyle:'full' })} · {order.channel}
            </p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          <div className={styles.orderGrid}>

            {/* Customer */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Customer</h4>
              <div className={styles.customerCard}>
                <div className={styles.custAvatar}>{initials(order.customer)}</div>
                <div>
                  <div className={styles.custName}>{order.customer}</div>
                  <div className={styles.custDetail}>
                    <Ic d={['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6']} size={12} />
                    {order.email}
                  </div>
                  <div className={styles.custDetail}>
                    <Ic d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13" size={12} />
                    {order.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping address */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Shipping Address</h4>
              <div className={styles.infoBox}>{order.address}</div>
            </div>

            {/* Order items */}
            <div className={styles.orderSection} style={{ gridColumn:'1/-1' }}>
              <h4 className={styles.secLbl}>Order Items</h4>
              <div className={styles.itemsTable}>
                <div className={styles.itemsHead}>
                  <span>Item</span><span>Qty</span><span>Price</span><span>Subtotal</span>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.itemRow}>
                    <span className={styles.itemName}><div className={styles.itemDot} />{item.name}</span>
                    <span>{item.qty}</span>
                    <span>{fmt(item.price)}</span>
                    <span className={styles.itemSub}>{fmt(item.price * item.qty)}</span>
                  </div>
                ))}
                <div className={styles.itemTotal}>
                  <span style={{ gridColumn:'1/3' }} />
                  <span style={{ fontWeight:600, color:'var(--ink2)' }}>Total</span>
                  <span style={{ fontWeight:700, fontSize:15, color:'var(--navy)' }}>{fmt(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Status update */}
            <div className={styles.orderSection}>
              <h4 className={styles.secLbl}>Update Order Status</h4>
              <div className={styles.fg}>
                <label>Order Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {Object.entries(STATUS_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className={styles.fg}>
                <label>Shipping Status</label>
                <select value={shipping} onChange={e => setShipping(e.target.value)}>
                  {Object.entries(SHIP_CONFIG).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
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
            <div className={styles.orderSection} style={{ gridColumn:'1/-1' }}>
              <h4 className={styles.secLbl}>Add Internal Note</h4>
              <textarea className={styles.noteArea} rows={3} value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add an internal note about this order…" />
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <div className={styles.mFootL}>
            <button className={styles.btnGhost} onClick={onClose}>Close</button>
          </div>
          <div className={styles.mFootR}>
            <button className={styles.btnOutline}>
              <Ic d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3']} size={13} />
              Download Invoice
            </button>
            <button className={styles.btnPrimary}
              onClick={() => { onUpdateStatus(order.id, status, shipping); onClose() }}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderModal
