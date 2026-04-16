import { useState } from 'react'
import styles from './CartPanel.module.css'
import { useCart } from '../../context/CartContext'
import { fmt } from '../../utils/formatters'
import { applyDiscount, getAutoDiscounts } from '../../utils/discountEngine'
import Toggle from '../ui/Toggle/Toggle'

// ── Constants ─────────────────────────────────────────────
const VAT_RATE      = 0.075
const PAYMENT_METHODS = [
  { id: 'cash',     label: 'Cash'         },
  { id: 'card',     label: 'Card (POS)'   },
  { id: 'transfer', label: 'Transfer'     },
  { id: 'mobile',   label: 'Mobile'       },
]
const STAFF_DISCOUNTS = [
  { value: 0,    label: 'None' },
  { value: 0.05, label: '5%'   },
  { value: 0.10, label: '10%'  },
  { value: 0.15, label: '15%'  },
  { value: 0.20, label: '20%'  },
]

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 14, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── CartItem sub-component ────────────────────────────────
function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className={styles.item}>
      <img
        src={item.img}
        alt={item.name}
        className={styles.itemImg}
        onError={e => { e.target.style.display = 'none' }}
      />
      <div className={styles.itemInfo}>
        <p className={styles.itemName}>{item.name}</p>
        {item.variant && (
          <p className={styles.itemVariant}>
            {[item.variant.color, item.variant.size, item.variant.style !== 'Regular' && item.variant.style]
              .filter(Boolean).join(' / ')}
          </p>
        )}
        {item.sku && <p className={styles.itemSku}>{item.sku}</p>}
      </div>
      <div className={styles.itemRight}>
        <div className={styles.qtyCtrl}>
          <button onClick={onDecrease}>−</button>
          <span>{item.qty}</span>
          <button onClick={onIncrease}>+</button>
        </div>
        <p className={styles.itemTotal}>{fmt(item.price * item.qty)}</p>
        <button className={styles.removeBtn} onClick={onRemove} title="Remove item">
          <Ic d="M18 6L6 18M6 6l12 12" size={12} />
        </button>
      </div>
    </div>
  )
}

// ── CartPanel ─────────────────────────────────────────────
const CartPanel = ({ customer, onCharge, onClear }) => {
  const { cart, dispatch } = useCart()

  const [payMethod,  setPayMethod]  = useState('cash')
  const [discCode,   setDiscCode]   = useState('')
  const [discResult, setDiscResult] = useState(null)
  const [staffDisc,  setStaffDisc]  = useState(0)
  const [taxEnabled, setTaxEnabled] = useState(true)
  const [note,       setNote]       = useState('')

  // ── Pricing calculations ──────────────────────────────
  const subtotal  = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const totalQty  = cart.reduce((a, i) => a + i.qty, 0)

  // VIP auto-discount
  const vipRate   = customer?.tier === 'VIP' ? 0.15 : 0

  // Manual code discount
  const codeRate  = discResult?.type === 'percentage' ? discResult.value / 100
    : discResult?.type === 'fixed' ? discResult.value / Math.max(subtotal, 1)
    : 0

  // Auto discounts (multi-buy etc.)
  const autoDiscs   = getAutoDiscounts(cart, subtotal)
  const autoSavings = autoDiscs.reduce((a, d) => a + (d.savings || 0), 0)
  const hasFreeShip = autoDiscs.some(d => d.freeShipping)

  const totalDiscRate = Math.min(1, vipRate + staffDisc + codeRate)
  const manualDisc    = discResult?.type === 'fixed'
    ? Math.min(subtotal, discResult.value)
    : subtotal * totalDiscRate
  const totalDisc     = manualDisc + autoSavings

  const afterDisc  = Math.max(0, subtotal - totalDisc)
  const taxAmt     = taxEnabled ? afterDisc * VAT_RATE : 0
  const total      = afterDisc + taxAmt

  // ── Dispatch helpers ──────────────────────────────────
  const increase = item => dispatch({ type: 'ADD_ITEM',      payload: item })
  const decrease = item => dispatch({ type: 'DECREASE_QTY', payload: item.id })
  const remove   = item => dispatch({ type: 'REMOVE_ITEM',  payload: item.id })
  const clear    = ()   => {
    dispatch({ type: 'CLEAR_CART' })
    setDiscResult(null)
    setDiscCode('')
    setStaffDisc(0)
    setNote('')
    if (onClear) onClear()
  }

  // ── Apply discount code ───────────────────────────────
  const handleApplyCode = () => {
    const res = applyDiscount(discCode, cart, subtotal)
    if (res.error) {
      alert(res.error)
      return
    }
    setDiscResult(res)
  }

  // ── Charge handler ────────────────────────────────────
  const handleCharge = () => {
    if (!onCharge || cart.length === 0) return
    onCharge({
      cart,
      customer,
      payMethod,
      subtotal,
      discountAmt: Math.round(totalDisc),
      taxAmt:      Math.round(taxAmt),
      total:       Math.round(total),
      note,
      discCode:    discResult?.code || null,
    })
  }

  const totalItems = cart.reduce((a, i) => a + i.qty, 0)

  return (
    <aside className={styles.panel}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={styles.title}>Current Order</span>
        {cart.length > 0 && (
          <span className={styles.badge}>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* ── Cart items ── */}
      <div className={styles.items}>
        {cart.length === 0 ? (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="#2DBD97" strokeWidth="1.2" strokeDasharray="3 3"/>
              <path d="M16 20h16l-2 10H18L16 20zM13 16h4l2 4" stroke="#2DBD97" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <p>Cart is empty</p>
            <span>Tap a product to add it</span>
          </div>
        ) : (
          cart.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={() => increase(item)}
              onDecrease={() => decrease(item)}
              onRemove={() => remove(item)}
            />
          ))
        )}
      </div>

      {/* ── Note ── */}
      {cart.length > 0 && (
        <div className={styles.noteWrap}>
          <input
            className={styles.noteInput}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add order note…"
          />
        </div>
      )}

      {/* ── Discounts ── */}
      {cart.length > 0 && (
        <div className={styles.discSection}>
          {/* Code input */}
          <div className={styles.discRow}>
            <input
              className={styles.discInput}
              value={discCode}
              onChange={e => setDiscCode(e.target.value.toUpperCase())}
              placeholder="Discount code"
            />
            <button className={styles.discApplyBtn} onClick={handleApplyCode}>
              Apply
            </button>
          </div>

          {/* Applied code */}
          {discResult && (
            <div className={styles.discApplied}>
              <Ic d="M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" size={12} stroke="#4ADE80" />
              <span>{discResult.label}</span>
              <button className={styles.discRemove} onClick={() => { setDiscResult(null); setDiscCode('') }}>×</button>
            </div>
          )}

          {/* Auto discounts */}
          {autoDiscs.length > 0 && (
            <div className={styles.autoDiscBanner}>
              {autoDiscs.map((d, i) => (
                <div key={i} className={styles.autoDiscItem}>
                  <Ic d="M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" size={11} stroke="#4ADE80" />
                  {d.label}
                </div>
              ))}
            </div>
          )}

          {/* Staff discount */}
          <div className={styles.staffRow}>
            <span className={styles.staffLabel}>Staff:</span>
            {STAFF_DISCOUNTS.map(s => (
              <button
                key={s.value}
                className={`${styles.staffBtn} ${staffDisc === s.value ? styles.staffBtnOn : ''}`}
                onClick={() => setStaffDisc(staffDisc === s.value && s.value !== 0 ? 0 : s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* VIP badge */}
          {customer?.tier === 'VIP' && (
            <div className={styles.vipBadge}>
              <Ic d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={11} stroke="#E8C547" fill="#E8C547" />
              VIP — 15% auto-applied
            </div>
          )}
        </div>
      )}

      {/* ── Summary ── */}
      {cart.length > 0 && (
        <div className={styles.summary}>
          <div className={styles.sumRow}>
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </div>
          {totalDisc > 0 && (
            <div className={`${styles.sumRow} ${styles.sumDiscount}`}>
              <span>Discount</span>
              <span>−{fmt(Math.round(totalDisc))}</span>
            </div>
          )}
          <div className={styles.sumRow}>
            <label className={styles.taxLabel}>
              VAT (7.5%)
              <Toggle on={taxEnabled} onChange={() => setTaxEnabled(t => !t)} />
            </label>
            <span>{taxEnabled ? fmt(Math.round(taxAmt)) : '—'}</span>
          </div>
          <div className={`${styles.sumRow} ${styles.sumTotal}`}>
            <span>TOTAL</span>
            <strong>{fmt(Math.round(total))}</strong>
          </div>
        </div>
      )}

      {/* ── Payment methods ── */}
      {cart.length > 0 && (
        <div className={styles.payMethods}>
          {PAYMENT_METHODS.map(m => (
            <button
              key={m.id}
              className={`${styles.payBtn} ${payMethod === m.id ? styles.payBtnOn : ''}`}
              onClick={() => setPayMethod(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Actions ── */}
      <div className={styles.actions}>
        {cart.length > 0 && (
          <button className={styles.clearBtn} onClick={clear}>
            <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} />
            Clear
          </button>
        )}
        <button
          className={styles.chargeBtn}
          disabled={cart.length === 0}
          onClick={handleCharge}
        >
          <Ic d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={15} stroke="#fff" />
          {cart.length > 0 ? `Charge ${fmt(Math.round(total))}` : 'Charge'}
        </button>
      </div>
    </aside>
  )
}

export default CartPanel
