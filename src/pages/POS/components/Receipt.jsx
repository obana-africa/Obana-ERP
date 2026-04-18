/* ─────────────────────────────────────────────────────────
   Path: src/pages/POS/components/Receipt.jsx
───────────────────────────────────────────────────────── */
import { useRef } from 'react'
import styles from '../POS.module.css'
import { fmt } from '../../../utils/formatters'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  order   — full order object from handlePayment
 *  onClose — () => void
 */
const Receipt = ({ order, onClose }) => {
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
            {order.customer && (
              <div className={styles.rcMetaRow}><span>Customer</span><span>{order.customer.name}</span></div>
            )}
          </div>
          <div className={styles.rcDivider} />

          <div className={styles.rcItems}>
            {order.items.map((item, i) => (
              <div key={i} className={styles.rcItem}>
                <div className={styles.rcItemLeft}>
                  <span className={styles.rcItemName}>{item.product?.name || item.name}</span>
                  <span className={styles.rcItemSku}>
                    {item.variant?.sku} · {item.variant?.color} / {item.variant?.size}
                  </span>
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
            {order.discountAmt > 0 && (
              <div className={`${styles.rcSumRow} ${styles.rcDiscount}`}>
                <span>Discount</span><span>−{fmt(order.discountAmt)}</span>
              </div>
            )}
            <div className={styles.rcSumRow}><span>VAT (7.5%)</span><span>{fmt(Math.round(order.tax))}</span></div>
            <div className={`${styles.rcSumRow} ${styles.rcTotal}`}><span>TOTAL</span><strong>{fmt(order.total)}</strong></div>
          </div>
          <div className={styles.rcDivider} />

          <div className={styles.rcPayment}>
            <div className={styles.rcPayRow}><span>Payment</span><strong>{order.payment.method}</strong></div>
            {order.payment.change > 0 && (
              <div className={styles.rcPayRow}><span>Change Given</span><span>{fmt(order.payment.change)}</span></div>
            )}
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
          <button className={styles.rcDoneBtn} onClick={onClose}>New Sale</button>
        </div>
      </div>
    </div>
  )
}

export default Receipt
