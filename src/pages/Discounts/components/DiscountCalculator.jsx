import { useState } from 'react'
import styles from '../Discounts.module.css'
import { fmt } from '../../../utils/formatters'
import { SEED_DISCOUNTS } from '../../../data/discounts'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Standalone discount calculator — tests how discounts apply to an order.
 * Reads directly from SEED_DISCOUNTS (active rules only).
 */
const DiscountCalculator = () => {
  const [price,  setPrice]  = useState(15000)
  const [qty,    setQty]    = useState(3)
  const [code,   setCode]   = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const subtotal  = price * qty
    let   savings   = 0
    let   breakdown = []
    let   disc      = null

    // Manual code lookup
    if (code) {
      disc = SEED_DISCOUNTS.find(d => d.code === code.toUpperCase() && d.status === 'active')
      if (!disc) { setResult({ error: 'Invalid or inactive discount code' }); return }
      if (disc.minOrder && subtotal < disc.minOrder) {
        setResult({ error: `Minimum order of ${fmt(disc.minOrder)} required` }); return
      }
    }

    // RRP floor check
    const rrpDisc = SEED_DISCOUNTS.find(d => d.type === 'rrp' && d.status === 'active')
    if (rrpDisc && price < rrpDisc.rrpPrice) {
      setResult({ error: `Price below RRP of ${fmt(rrpDisc.rrpPrice)}. Cannot apply discount.` }); return
    }

    // Auto: Tiered pricing
    const tieredDisc = SEED_DISCOUNTS.find(d => d.type === 'tiered' && d.status === 'active')
    if (tieredDisc && !disc) {
      const tier = tieredDisc.tiers.find(t => qty >= t.minQty && qty <= t.maxQty)
      if (tier && tier.discount > 0) {
        savings += subtotal * (tier.discount / 100)
        breakdown.push(`Tiered (${tier.label}): −${tier.discount}%`)
      }
    }

    // Auto: Multi-buy ×N
    const multiDisc = SEED_DISCOUNTS.find(d => d.type === 'multibuy' && d.status === 'active')
    if (multiDisc && !disc && qty >= multiDisc.multipleOf && qty % multiDisc.multipleOf === 0) {
      const save = subtotal * (multiDisc.value / 100)
      savings += save
      breakdown.push(`Multi-buy ×${multiDisc.multipleOf} (${multiDisc.value}% off): −${fmt(save)}`)
    }

    // Auto: BOGO
    const bogoDisc = SEED_DISCOUNTS.find(d => d.type === 'bogo' && d.status === 'active')
    if (bogoDisc && !disc) {
      const freePacks = Math.floor(qty / (bogoDisc.buyQty + bogoDisc.getQty))
      if (freePacks > 0) {
        const save = freePacks * bogoDisc.getQty * price
        savings += save
        breakdown.push(`Buy ${bogoDisc.buyQty} Get ${bogoDisc.getQty} Free: −${fmt(save)}`)
      }
    }

    // Auto: Free shipping threshold
    const shipDisc = SEED_DISCOUNTS.find(d => d.type === 'freeShipping' && d.status === 'active')
    if (shipDisc && subtotal >= shipDisc.minOrder) {
      breakdown.push('Free shipping applied')
    }

    // Manual code application
    if (disc) {
      if (disc.type === 'percentage' || disc.type === 'flash') {
        const save = subtotal * (disc.value / 100)
        savings += save
        breakdown.push(`Code "${disc.code}" (${disc.value}% off): −${fmt(save)}`)
      } else if (disc.type === 'fixed') {
        savings += disc.value
        breakdown.push(`Code "${disc.code}" (fixed): −${fmt(disc.value)}`)
      }
    }

    setResult({ subtotal, savings, total: Math.max(0, subtotal - savings), breakdown })
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
              <div className={styles.calcBreakdown}>
                <div className={styles.calcLine}>
                  <span>Subtotal ({qty} × {fmt(price)})</span>
                  <span>{fmt(result.subtotal)}</span>
                </div>
                {result.breakdown.length === 0 ? (
                  <div className={styles.calcLine} style={{ color:'#9CA3AF' }}>
                    <span>No discounts applied</span>
                  </div>
                ) : result.breakdown.map((b, i) => (
                  <div key={i} className={`${styles.calcLine} ${styles.calcDiscount}`}>
                    <span>{b}</span>
                  </div>
                ))}
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCalculator
