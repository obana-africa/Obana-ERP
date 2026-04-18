
import { useState } from 'react'
import styles from '../OnlineStore.module.css'

const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`
const pct = (orig, sale) => Math.round(((orig - sale) / orig) * 100)

// ── Stars ─────────────────────────────────────────────────
export const Stars = ({ rating, size = 11 }) => (
  <span className={styles.stars}>
    {[1,2,3,4,5].map(s => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? '#E8C547' : 'none'}
        stroke={s <= Math.round(rating) ? '#E8C547' : '#D1D5DB'}
        strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </span>
)

// ── StockBadge ────────────────────────────────────────────
export const StockBadge = ({ stock }) => {
  if (stock === 0)  return <span className={`${styles.stockBadge} ${styles.stockOut}`}>Out of Stock</span>
  if (stock <= 5)   return <span className={`${styles.stockBadge} ${styles.stockLow}`}>Only {stock} left</span>
  return null
}

/**
 * Props:
 *  product     — product object
 *  onAddToCart — (product) => void
 *  onQuickView — (product) => void
 */
const ProductCard = ({ product, onAddToCart, onQuickView }) => {
  const [activeColor, setActiveColor] = useState(0)
  const [wishlist,    setWishlist]    = useState(false)
  const hasDiscount = product.compareAt && product.compareAt > product.price

  return (
    <div className={styles.card} onClick={() => onQuickView(product)}>
      <div className={styles.cardImgWrap}>
        <img src={product.img} alt={product.name} className={styles.cardImg} loading="lazy" />

        {product.badge && (
          <span className={`${styles.cardBadge} ${styles[`badge${product.badge.replace(/\s/g,'')}`]}`}>
            {product.badge}
          </span>
        )}
        {hasDiscount && (
          <span className={styles.cardDiscount}>−{pct(product.compareAt, product.price)}%</span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className={styles.cardLowStock}>Only {product.stock} left</span>
        )}

        <button className={`${styles.cardWishlist} ${wishlist ? styles.cardWishlistOn : ''}`}
          onClick={e => { e.stopPropagation(); setWishlist(w => !w) }}>
          <Ic d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            size={16} fill={wishlist ? '#EF4444' : 'none'} stroke={wishlist ? '#EF4444' : 'white'} />
        </button>

        <button className={styles.cardQuickAdd}
          onClick={e => { e.stopPropagation(); onAddToCart(product) }}
          disabled={product.stock === 0}>
          {product.stock === 0 ? 'Out of Stock' : '+ Quick Add'}
        </button>
      </div>

      <div className={styles.cardBody}>
        <p className={styles.cardCat}>{product.category}</p>
        <h3 className={styles.cardName}>{product.name}</h3>
        <div className={styles.cardStars}>
          <Stars rating={product.rating} />
          <span className={styles.cardReviewCount}>({product.reviews})</span>
        </div>

        {product.colors.length > 1 && (
          <div className={styles.cardSwatches}>
            {product.colors.map((c, i) => (
              <button key={i}
                className={`${styles.swatch} ${i === activeColor ? styles.swatchOn : ''}`}
                style={{ background: c }}
                onClick={e => { e.stopPropagation(); setActiveColor(i) }}
                title={c}
              />
            ))}
          </div>
        )}

        <div className={styles.cardPriceRow}>
          <span className={styles.cardPrice}>{fmt(product.price)}</span>
          {hasDiscount && <span className={styles.cardCompare}>{fmt(product.compareAt)}</span>}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
