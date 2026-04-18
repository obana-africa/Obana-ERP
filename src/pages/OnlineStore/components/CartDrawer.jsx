
import { useState } from 'react'
import styles from '../OnlineStore.module.css'
import { applyDiscount, getAutoDiscounts } from '../../../utils/discountEngine'
import { SHIPPING_RATES } from '../../../data/onlineStore'

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
 *  cart        — cart item array
 *  onClose     — () => void
 *  onUpdateQty — (item, newQty) => void
 *  onRemove    — (item) => void
 *  onCheckout  — (summary) => void
 */
const CartDrawer = ({ cart, onClose, onUpdateQty, onRemove, onCheckout }) => {
  const [discCode,    setDiscCode]    = useState('')
  const [discResult,  setDiscResult]  = useState(null)
  const [selShipping, setSelShipping] = useState('standard')

  const shippingRate  = SHIPPING_RATES.find(r => r.id === selShipping)
  const subtotal      = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const autoDiscs     = getAutoDiscounts(cart, subtotal)
  const autoSavings   = autoDiscs.reduce((a, d) => a + (d.savings || 0), 0)
  const hasFreeShip   = autoDiscs.some(d => d.freeShipping)
  const manualSavings = discResult?.savings || 0
  const totalSavings  = autoSavings + manualSavings
  const shippingCost  = hasFreeShip ? 0 : shippingRate.price
  const taxRate       = 0.075   // 7.5% VAT Nigeria
  const taxable       = subtotal - totalSavings
  const tax           = taxable * taxRate
  const total         = taxable + tax + shippingCost
  const totalItems    = cart.reduce((a, i) => a + i.qty, 0)

  const applyCode = () => {
    const res = applyDiscount(discCode, cart, subtotal)
    setDiscResult(res.error ? null : res)
    if (res.error) alert(res.error)
  }

  return (
    <div className={styles.drawerOverlay}>
      <div className={styles.drawerBackdrop} onClick={onClose} />
      <div className={styles.drawer}>
        <div className={styles.drawerHead}>
          <div>
            <h2 className={styles.drawerTitle}>Your Cart</h2>
            <p className={styles.drawerCount}>{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
          <button className={styles.drawerClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={20} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {cart.length === 0 ? (
            <div className={styles.cartEmpty}>
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="30" stroke="#E5E7EB" strokeWidth="2"/>
                <path d="M20 24h24l-3 14H23L20 24zM17 20h4l3 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="27" cy="42" r="2" fill="#9CA3AF"/>
                <circle cx="37" cy="42" r="2" fill="#9CA3AF"/>
              </svg>
              <p className={styles.cartEmptyTitle}>Your cart is empty</p>
              <p className={styles.cartEmptySub}>Add some products to get started</p>
              <button className={styles.cartShopBtn} onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={`${item.id}-${item.selSize}-${item.selColor}`} className={styles.cartItem}>
                  <img src={item.img} alt={item.name} className={styles.cartItemImg} />
                  <div className={styles.cartItemInfo}>
                    <p className={styles.cartItemName}>{item.name}</p>
                    {item.selSize && item.selSize !== 'One Size' && (
                      <p className={styles.cartItemMeta}>Size: {item.selSize}</p>
                    )}
                    <div className={styles.cartItemBottom}>
                      <div className={styles.cartItemQty}>
                        <button onClick={() => onUpdateQty(item, item.qty - 1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => onUpdateQty(item, item.qty + 1)}>+</button>
                      </div>
                      <span className={styles.cartItemTotal}>{fmt(item.price * item.qty)}</span>
                    </div>
                  </div>
                  <button className={styles.cartItemRemove} onClick={() => onRemove(item)}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={14} />
                  </button>
                </div>
              ))}

              {/* Auto discounts */}
              {autoDiscs.length > 0 && (
                <div className={styles.autoDiscBanner}>
                  {autoDiscs.map((d, i) => (
                    <div key={i} className={styles.autoDiscItem}>
                      <Ic d="M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" size={13} stroke="#047857" />
                      {d.label}
                    </div>
                  ))}
                </div>
              )}

              {/* Discount code */}
              <div className={styles.discCodeWrap}>
                <input className={styles.discCodeInput} value={discCode}
                  onChange={e => setDiscCode(e.target.value.toUpperCase())}
                  placeholder="Discount code" />
                <button className={styles.discCodeBtn} onClick={applyCode}>Apply</button>
              </div>
              {discResult && (
                <div className={styles.discApplied}>
                  <Ic d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" size={13} stroke="#047857" />
                  Code "{discResult.code}" applied — {discResult.label}
                </div>
              )}

              {/* Shipping method */}
              <div className={styles.shippingSelect}>
                <p className={styles.shippingLabel}>Shipping Method</p>
                {SHIPPING_RATES.map(r => (
                  <label key={r.id}
                    className={`${styles.shippingOption} ${selShipping === r.id ? styles.shippingOptionOn : ''}`}>
                    <input type="radio" name="shipping" value={r.id}
                      checked={selShipping === r.id} onChange={() => setSelShipping(r.id)} />
                    <div className={styles.shippingOptionInfo}>
                      <span className={styles.shippingOptionName}>{r.name}</span>
                      <span className={styles.shippingOptionDesc}>{r.desc}</span>
                    </div>
                    <span className={styles.shippingOptionPrice}>
                      {hasFreeShip && r.id !== 'pickup'
                        ? <><s>{fmt(r.price)}</s><span className={styles.freeTag}> Free!</span></>
                        : r.price === 0 ? 'Free' : fmt(r.price)
                      }
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.drawerFoot}>
            <div className={styles.drawerSummary}>
              <div className={styles.sumRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {totalSavings > 0 && (
                <div className={`${styles.sumRow} ${styles.sumDiscount}`}>
                  <span>Discounts</span><span>−{fmt(totalSavings)}</span>
                </div>
              )}
              <div className={styles.sumRow}>
                <span>Shipping</span><span>{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span>
              </div>
              <div className={styles.sumRow}><span>VAT (7.5%)</span><span>{fmt(Math.round(tax))}</span></div>
              <div className={`${styles.sumRow} ${styles.sumTotal}`}>
                <span>Total</span><span>{fmt(Math.round(total))}</span>
              </div>
            </div>
            <button className={styles.checkoutBtn}
              onClick={() => onCheckout({
                subtotal, totalSavings, shippingCost, tax,
                total: Math.round(total),
                shipping: shippingRate,
                discCode: discResult?.code,
              })}>
              Proceed to Checkout
              <Ic d="M5 12h14M12 5l7 7-7 7" size={16} stroke="#fff" />
            </button>
            <button className={styles.continueBtn} onClick={onClose}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
