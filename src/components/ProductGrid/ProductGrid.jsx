import styles from './ProductGrid.module.css'
import { fmt } from '../../utils/formatters'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 14, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Badge colour map ───────────────────────────────────────
const BADGE_CLASS = {
  Bestseller: styles.badgeBestseller,
  New:        styles.badgeNew,
  Sale:       styles.badgeSale,
  Limited:    styles.badgeLimited,
}

// ── Stock bar ─────────────────────────────────────────────
function StockBar({ stock, max = 30 }) {
  const pct   = Math.min(100, Math.round((stock / max) * 100))
  const color = stock === 0 ? '#EF4444' : stock <= 5 ? '#F59E0B' : '#2DBD97'
  return (
    <div className={styles.stockBarWrap}>
      <div className={styles.stockBar}>
        <div className={styles.stockBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={styles.stockNum} style={{ color }}>{stock}</span>
    </div>
  )
}

// ── Product tile ──────────────────────────────────────────
function ProductTile({ product, totalStock, onSelect }) {
  const outOfStock  = totalStock === 0
  const lowStock    = totalStock > 0 && totalStock <= 5
  const hasDiscount = product.compareAt && product.compareAt > product.basePrice

  return (
    <button
      className={`${styles.tile} ${outOfStock ? styles.tileOut : ''}`}
      onClick={() => !outOfStock && onSelect(product)}
      disabled={outOfStock}
      title={outOfStock ? 'Out of stock' : product.name}
    >
      {/* Image */}
      <div className={styles.imgWrap}>
        <img
          src={product.img}
          alt={product.name}
          className={styles.img}
          loading="lazy"
          onError={e => { e.target.src = '' ; e.target.style.display = 'none' }}
        />

        {/* Badges */}
        {product.badge && (
          <span className={`${styles.badge} ${BADGE_CLASS[product.badge] || ''}`}>
            {product.badge}
          </span>
        )}
        {hasDiscount && (
          <span className={styles.discBadge}>SALE</span>
        )}
        {outOfStock && (
          <div className={styles.outOverlay}>Out of Stock</div>
        )}
        {lowStock && !outOfStock && (
          <span className={styles.lowBadge}>Low</span>
        )}

        {/* Variant count pill */}
        <span className={styles.variantPill}>
          {product.variants.length} var.
        </span>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.cat}>{product.category}</p>

        <div className={styles.priceRow}>
          <span className={styles.price}>{fmt(product.basePrice)}</span>
          {hasDiscount && (
            <span className={styles.compare}>{fmt(product.compareAt)}</span>
          )}
        </div>

        <StockBar stock={totalStock} />
      </div>
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────
function EmptyState({ search }) {
  return (
    <div className={styles.empty}>
      <Ic
        d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0"
        size={36} stroke="#555568"
      />
      {search
        ? <><p>No results for <strong>"{search}"</strong></p><span>Try a different name or SKU</span></>
        : <><p>No products in this collection</p><span>Switch category or check inventory</span></>
      }
    </div>
  )
}

// ── ProductGrid ───────────────────────────────────────────
/**
 * Props:
 *  products   — full catalog array (from data/products.js)
 *  inventory  — { [sku]: { [locationId]: number } } live stock map
 *  location   — active location id (e.g. 'loc-1')
 *  search     — search string (name or SKU)
 *  collection — active collection/category filter string
 *  onSelect   — (product) => void — opens VariantPicker
 */
const ProductGrid = ({
  products   = [],
  inventory  = {},
  location   = 'loc-1',
  search     = '',
  collection = 'All',
  onSelect,
}) => {

  // ── Filter ──────────────────────────────────────────────
  const filtered = products.filter(p => {
    const q   = search.toLowerCase()
    const ms  = !q
      || p.name.toLowerCase().includes(q)
      || p.variants.some(v => v.sku.toLowerCase().includes(q))
    const mc  = collection === 'All'
      || p.category   === collection
      || p.collection === collection

    return ms && mc
  })

  // ── Render ──────────────────────────────────────────────
  return (
    <div className={styles.grid}>
      {filtered.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        filtered.map(product => {
          // Sum all variant stock at the active location
          const totalStock = product.variants.reduce(
            (a, v) => a + (inventory[v.sku]?.[location] ?? 0),
            0
          )
          return (
            <ProductTile
              key={product.id}
              product={product}
              totalStock={totalStock}
              onSelect={onSelect}
            />
          )
        })
      )}
    </div>
  )
}

export default ProductGrid
