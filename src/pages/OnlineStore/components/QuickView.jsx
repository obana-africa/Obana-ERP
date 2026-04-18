
import { useState } from 'react'
import styles from '../OnlineStore.module.css'
import { Stars, StockBadge } from './ProductCard'
import { SHIPPING_RATES } from '../../../data/onlineStore'

const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`
const pct = (orig, sale) => Math.round(((orig - sale) / orig) * 100)

/**
 * Props:
 *  product     — full product object
 *  onClose     — () => void
 *  onAddToCart — (product, qty, selSize, selColor) => void
 */
const QuickView = ({ product, onClose, onAddToCart }) => {
  const [selSize,  setSelSize]  = useState(product.sizes[0])
  const [selColor, setSelColor] = useState(0)
  const [qty,      setQty]      = useState(1)
  const [tab,      setTab]      = useState('desc')
  const hasDiscount = product.compareAt && product.compareAt > product.price

  return (
    <div className={styles.qvOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.qvModal}>
        <button className={styles.qvClose} onClick={onClose}>
          <Ic d="M18 6L6 18M6 6l12 12" size={20} />
        </button>

        <div className={styles.qvGrid}>
          {/* Image */}
          <div className={styles.qvImgWrap}>
            <img src={product.img} alt={product.name} className={styles.qvImg} />
            {hasDiscount && (
              <div className={styles.qvDiscBadge}>−{pct(product.compareAt, product.price)}% OFF</div>
            )}
          </div>

          {/* Info */}
          <div className={styles.qvInfo}>
            <p className={styles.qvCat}>{product.category} · {product.subCategory}</p>
            <h2 className={styles.qvTitle}>{product.name}</h2>

            <div className={styles.qvRating}>
              <Stars rating={product.rating} size={13} />
              <span className={styles.qvRatingText}>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className={styles.qvPriceRow}>
              <span className={styles.qvPrice}>{fmt(product.price)}</span>
              {hasDiscount && <span className={styles.qvCompare}>{fmt(product.compareAt)}</span>}
            </div>

            <StockBadge stock={product.stock} />

            {/* Colour */}
            <div className={styles.qvSection}>
              <span className={styles.qvSectionLabel}>Colour</span>
              <div className={styles.qvSwatches}>
                {product.colors.map((c, i) => (
                  <button key={i}
                    className={`${styles.swatch} ${styles.swatchLg} ${i === selColor ? styles.swatchOn : ''}`}
                    style={{ background: c }} onClick={() => setSelColor(i)} />
                ))}
              </div>
            </div>

            {/* Size */}
            {product.sizes[0] !== 'One Size' && (
              <div className={styles.qvSection}>
                <span className={styles.qvSectionLabel}>Size</span>
                <div className={styles.qvSizes}>
                  {product.sizes.map(s => (
                    <button key={s}
                      className={`${styles.sizeBtn} ${s === selSize ? styles.sizeBtnOn : ''}`}
                      onClick={() => setSelSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className={styles.qvSection}>
              <span className={styles.qvSectionLabel}>Quantity</span>
              <div className={styles.qvQty}>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className={styles.qtyVal}>{qty}</span>
                <button className={styles.qtyBtn} onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <button className={styles.qvAddBtn} disabled={product.stock === 0}
              onClick={() => { onAddToCart(product, qty, selSize, selColor); onClose() }}>
              <Ic d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" size={16} stroke="#fff" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Tabs */}
            <div className={styles.qvTabs}>
              {['desc','shipping','reviews'].map(t => (
                <button key={t} className={`${styles.qvTab} ${tab === t ? styles.qvTabOn : ''}`}
                  onClick={() => setTab(t)}>
                  {t === 'desc' ? 'Description' : t === 'shipping' ? 'Shipping' : 'Reviews'}
                </button>
              ))}
            </div>

            {tab === 'desc' && <p className={styles.qvDesc}>{product.description}</p>}

            {tab === 'shipping' && (
              <div className={styles.qvShipping}>
                {SHIPPING_RATES.map(r => (
                  <div key={r.id} className={styles.qvShipRow}>
                    <Ic d={r.id === 'pickup'
                      ? 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'
                      : 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3'
                    } size={14} />
                    <div>
                      <div className={styles.qvShipName}>{r.name}</div>
                      <div className={styles.qvShipDesc}>{r.desc}</div>
                    </div>
                    <span className={styles.qvShipPrice}>{r.price === 0 ? 'Free' : fmt(r.price)}</span>
                  </div>
                ))}
                <p className={styles.qvShipNote}>Free shipping on orders above ₦20,000</p>
              </div>
            )}

            {tab === 'reviews' && (
              <div className={styles.qvReviewsTeaser}>
                <div className={styles.qvReviewScore}>{product.rating}</div>
                <Stars rating={product.rating} size={16} />
                <p>{product.reviews} verified reviews</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickView
