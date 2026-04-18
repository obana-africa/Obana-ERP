
import { useState } from 'react'
import styles from '../OnlineStore.module.css'
import { NIGERIAN_STATES, PAY_METHODS } from '../../../data/onlineStore'

const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

/**
 * Props:
 *  cart         — cart item array
 *  summary      — { subtotal, totalSavings, shippingCost, tax, total, shipping, discCode }
 *  onClose      — () => void
 *  onOrderPlaced— (orderNum) => void
 */
const CheckoutModal = ({ cart, summary, onClose, onOrderPlaced }) => {
  const [step,    setStep]    = useState(1)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    address:'', city:'', state:'Lagos', zip:'',
    payMethod:'card',
    cardNumber:'', cardExpiry:'', cardCvv:'', cardName:'',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const step1Valid = form.firstName && form.lastName && form.email && form.phone && form.address && form.state

  const placeOrder = () => {
    setPlacing(true)
    setTimeout(() => {
      const orderNum = `OBN-${Date.now().toString().slice(-6)}`
      onOrderPlaced(orderNum)
    }, 1800)
  }

  return (
    <div className={styles.checkoutOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.checkoutModal}>
        <button className={styles.checkoutClose} onClick={onClose}>
          <Ic d="M18 6L6 18M6 6l12 12" size={20} />
        </button>

        {/* Progress steps */}
        <div className={styles.checkoutSteps}>
          {['Contact & Shipping','Payment','Confirm Order'].map((s, i) => (
            <div key={s} className={`${styles.checkoutStep} ${step > i+1 ? styles.stepDone : step === i+1 ? styles.stepActive : ''}`}>
              <div className={styles.stepDot}>
                {step > i+1 ? <Ic d="M20 6L9 17l-5-5" size={12} stroke="#fff" /> : i+1}
              </div>
              <span className={styles.stepLabel}>{s}</span>
              {i < 2 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        <div className={styles.checkoutBody}>
          <div className={styles.checkoutLeft}>

            {/* Step 1 — Contact & Shipping */}
            {step === 1 && (
              <div className={styles.checkoutSection}>
                <h3 className={styles.checkoutSectionTitle}>Contact Information</h3>
                <div className={styles.coRow}>
                  <div className={styles.coFg}><label>First Name *</label><input value={form.firstName} onChange={e => set('firstName',e.target.value)} placeholder="Tomiwa" /></div>
                  <div className={styles.coFg}><label>Last Name *</label><input value={form.lastName} onChange={e => set('lastName',e.target.value)} placeholder="Aleminu" /></div>
                </div>
                <div className={styles.coRow}>
                  <div className={styles.coFg}><label>Email *</label><input type="email" value={form.email} onChange={e => set('email',e.target.value)} placeholder="tomiwa@obana.africa" /></div>
                  <div className={styles.coFg}><label>Phone *</label><input type="tel" value={form.phone} onChange={e => set('phone',e.target.value)} placeholder="08012345678" /></div>
                </div>
                <h3 className={styles.checkoutSectionTitle} style={{ marginTop:'1.5rem' }}>Shipping Address</h3>
                <div className={styles.coFg}><label>Street Address *</label><input value={form.address} onChange={e => set('address',e.target.value)} placeholder="12 Allen Avenue" /></div>
                <div className={styles.coRow}>
                  <div className={styles.coFg}><label>City *</label><input value={form.city} onChange={e => set('city',e.target.value)} placeholder="Ikeja" /></div>
                  <div className={styles.coFg}>
                    <label>State *</label>
                    <select value={form.state} onChange={e => set('state',e.target.value)}>
                      {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button className={styles.coNextBtn} disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continue to Payment <Ic d="M5 12h14M12 5l7 7-7 7" size={15} stroke="#fff" />
                </button>
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div className={styles.checkoutSection}>
                <h3 className={styles.checkoutSectionTitle}>Payment Method</h3>
                <div className={styles.payMethods}>
                  {PAY_METHODS.map(m => (
                    <label key={m.id} className={`${styles.payMethod} ${form.payMethod === m.id ? styles.payMethodOn : ''}`}>
                      <input type="radio" name="pay" value={m.id} checked={form.payMethod === m.id} onChange={() => set('payMethod', m.id)} />
                      <span className={styles.payMethodIcon}>{m.icon}</span>
                      <span className={styles.payMethodLabel}>{m.label}</span>
                    </label>
                  ))}
                </div>

                {form.payMethod === 'card' && (
                  <div className={styles.cardForm}>
                    <div className={styles.coFg}><label>Cardholder Name</label><input value={form.cardName} onChange={e => set('cardName',e.target.value)} placeholder="TOMIWA ALEMINU" /></div>
                    <div className={styles.coFg}><label>Card Number</label><input value={form.cardNumber} onChange={e => set('cardNumber',e.target.value.replace(/\D/g,'').slice(0,16))} placeholder="0000 0000 0000 0000" /></div>
                    <div className={styles.coRow}>
                      <div className={styles.coFg}><label>Expiry</label><input value={form.cardExpiry} onChange={e => set('cardExpiry',e.target.value)} placeholder="MM/YY" /></div>
                      <div className={styles.coFg}><label>CVV</label><input value={form.cardCvv} onChange={e => set('cardCvv',e.target.value.slice(0,4))} placeholder="•••" /></div>
                    </div>
                  </div>
                )}

                {form.payMethod === 'transfer' && (
                  <div className={styles.transferDetails}>
                    <p className={styles.transferTitle}>Bank Transfer Details</p>
                    <div className={styles.transferRow}><span>Bank</span><strong>Access Bank</strong></div>
                    <div className={styles.transferRow}><span>Account Name</span><strong>Obana Africa Ltd</strong></div>
                    <div className={styles.transferRow}><span>Account Number</span><strong>0123456789</strong></div>
                    <div className={styles.transferRow}><span>Amount</span><strong style={{ color:'#2DBD97' }}>{fmt(summary.total)}</strong></div>
                    <p className={styles.transferNote}>Use your order number as reference. Orders are confirmed within 30 minutes of payment.</p>
                  </div>
                )}

                {['paystack','flutterwave'].includes(form.payMethod) && (
                  <div className={styles.gatewayBox}>
                    <p>You will be redirected to {form.payMethod === 'paystack' ? 'Paystack' : 'Flutterwave'} to complete your payment securely.</p>
                  </div>
                )}

                <div className={styles.coNavRow}>
                  <button className={styles.coBackBtn} onClick={() => setStep(1)}>← Back</button>
                  <button className={styles.coNextBtn} onClick={() => setStep(3)}>
                    Review Order <Ic d="M5 12h14M12 5l7 7-7 7" size={15} stroke="#fff" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 — Confirm */}
            {step === 3 && (
              <div className={styles.checkoutSection}>
                <h3 className={styles.checkoutSectionTitle}>Order Summary</h3>
                <div className={styles.confirmItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.confirmItem}>
                      <img src={item.img} alt={item.name} className={styles.confirmItemImg} />
                      <div className={styles.confirmItemInfo}>
                        <p className={styles.confirmItemName}>{item.name}</p>
                        {item.selSize && item.selSize !== 'One Size' && (
                          <p className={styles.confirmItemMeta}>Size: {item.selSize} · Qty: {item.qty}</p>
                        )}
                      </div>
                      <span className={styles.confirmItemPrice}>{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.confirmAddress}>
                  <p className={styles.confirmAddressTitle}>Delivering to</p>
                  <p className={styles.confirmAddressText}>
                    {form.firstName} {form.lastName}<br />
                    {form.address}, {form.city}, {form.state}<br />
                    {form.phone}
                  </p>
                </div>
                <div className={styles.coNavRow}>
                  <button className={styles.coBackBtn} onClick={() => setStep(2)}>← Back</button>
                  <button className={`${styles.coNextBtn} ${styles.coPlaceBtn}`}
                    onClick={placeOrder} disabled={placing}>
                    {placing
                      ? <span className={styles.placingSpinner}>Processing…</span>
                      : <><Ic d="M5 12h14M12 5l7 7-7 7" size={15} stroke="#fff" /> Place Order · {fmt(summary.total)}</>
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className={styles.checkoutRight}>
            <div className={styles.checkoutSummaryCard}>
              <p className={styles.checkoutSummaryTitle}>Order Summary</p>
              {cart.slice(0,3).map(item => (
                <div key={item.id} className={styles.checkoutSumItem}>
                  <span className={styles.checkoutSumName}>{item.name}</span>
                  <span>×{item.qty}</span>
                  <span>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              {cart.length > 3 && <p className={styles.moreItems}>+{cart.length - 3} more items</p>}
              <div className={styles.checkoutSumDivider} />
              <div className={styles.checkoutSumRow}><span>Subtotal</span><span>{fmt(summary.subtotal)}</span></div>
              {summary.totalSavings > 0 && (
                <div className={`${styles.checkoutSumRow} ${styles.sumDiscount}`}><span>Savings</span><span>−{fmt(summary.totalSavings)}</span></div>
              )}
              <div className={styles.checkoutSumRow}><span>Shipping</span><span>{summary.shippingCost === 0 ? 'Free' : fmt(summary.shippingCost)}</span></div>
              <div className={styles.checkoutSumRow}><span>VAT</span><span>{fmt(Math.round(summary.tax))}</span></div>
              <div className={`${styles.checkoutSumRow} ${styles.checkoutSumTotal}`}><span>Total</span><strong>{fmt(summary.total)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutModal


/* ─────────────────────────────────────────────────────────
   OrderConfirmation — kept in same file, used together
───────────────────────────────────────────────────────── */
export const OrderConfirmation = ({ orderNum, onClose }) => (
  <div className={styles.confirmOverlay}>
    <div className={styles.confirmModal}>
      <div className={styles.confirmIcon}>
        <svg width="64" height="64" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill="#ECFDF5" stroke="#2DBD97" strokeWidth="2"/>
          <path d="M20 33l8 8 16-16" stroke="#2DBD97" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className={styles.confirmTitle}>Order Placed!</h2>
      <p className={styles.confirmOrderNum}>Order #{orderNum}</p>
      <p className={styles.confirmMsg}>
        Thank you for shopping with Obana. Your order has been received and is being processed.
        You'll receive a confirmation SMS and email shortly.
      </p>
      <div className={styles.confirmSteps}>
        {['Order Received','Processing','Shipped','Delivered'].map((s, i) => (
          <div key={s} className={`${styles.confirmStepItem} ${i === 0 ? styles.confirmStepDone : ''}`}>
            <div className={styles.confirmStepDot} style={{ background: i === 0 ? '#2DBD97' : '#E5E7EB' }} />
            <span>{s}</span>
          </div>
        ))}
      </div>
      <button className={styles.confirmCloseBtn} onClick={onClose}>Continue Shopping</button>
    </div>
  </div>
)
