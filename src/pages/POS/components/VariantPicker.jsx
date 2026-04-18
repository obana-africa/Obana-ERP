
import { useState, useEffect } from 'react'
import styles from '../POS.module.css'
import { fmt } from '../../../utils/formatters'
import { LOCATIONS, COLOR_MAP } from '../../../data/pos'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  product  — full catalog product object
 *  location — active location id (e.g. 'loc-1')
 *  onAdd    — (product, variant, qty, price) => void
 *  onClose  — () => void
 */
const VariantPicker = ({ product, location, onAdd, onClose }) => {
  const [selColor,    setSelColor]    = useState(product.colors[0])
  const [selSize,     setSelSize]     = useState(null)
  const [selStyle,    setSelStyle]    = useState(product.styles[0])
  const [qty,         setQty]         = useState(1)
  const [customPrice, setCustomPrice] = useState(null)

  const variant   = product.variants.find(v =>
    v.color === selColor && (selSize === null || v.size === selSize) && v.style === selStyle
  )
  const stockHere = variant?.stock?.[location] ?? 0
  const canAdd    = variant && stockHere >= qty

  const availSizes = product.variants
    .filter(v => v.color === selColor && v.style === selStyle)
    .map(v => v.size)

  useEffect(() => {
    if (availSizes.length > 0 && !availSizes.includes(selSize)) setSelSize(availSizes[0])
  }, [selColor, selStyle])

  return (
    <div className={styles.vpOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.vpModal}>
        <button className={styles.vpClose} onClick={onClose}>
          <Ic d="M18 6L6 18M6 6l12 12" size={18} />
        </button>
        <div className={styles.vpGrid}>
          <div className={styles.vpImg}>
            <img src={product.img} alt={product.name} />
            {product.badge && <span className={styles.vpBadge}>{product.badge}</span>}
          </div>
          <div className={styles.vpInfo}>
            <p className={styles.vpCat}>{product.category} · {product.collection}</p>
            <h3 className={styles.vpName}>{product.name}</h3>
            <div className={styles.vpPriceRow}>
              <span className={styles.vpPrice}>{fmt(customPrice ?? product.basePrice)}</span>
              {product.compareAt && !customPrice && <span className={styles.vpCompare}>{fmt(product.compareAt)}</span>}
            </div>
            {variant && (
              <div className={styles.vpSku}>
                <Ic d="M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3" size={12} />
                {variant.sku}
                <span className={styles.vpStock} style={{ color: stockHere===0?'#DC2626':stockHere<=3?'#D97706':'#059669' }}>
                  · {stockHere===0?'Out of stock':`${stockHere} in stock here`}
                </span>
              </div>
            )}

            {/* Colour */}
            <div className={styles.vpSection}>
              <p className={styles.vpSectionLabel}>Colour: <strong>{selColor}</strong></p>
              <div className={styles.vpColors}>
                {product.colors.map(c => (
                  <button key={c}
                    className={`${styles.colorSwatch} ${selColor===c?styles.colorSwatchOn:''}`}
                    style={{ background: COLOR_MAP[c] || '#ccc' }}
                    onClick={() => setSelColor(c)} title={c} />
                ))}
              </div>
            </div>

            {/* Size */}
            {!(product.sizes.length === 1 && product.sizes[0] === 'One Size') && (
              <div className={styles.vpSection}>
                <p className={styles.vpSectionLabel}>Size</p>
                <div className={styles.vpSizes}>
                  {product.sizes.map(s => {
                    const inStock = product.variants.some(v => v.size===s && v.color===selColor && (v.stock[location]??0)>0)
                    return (
                      <button key={s}
                        className={`${styles.sizeBtn} ${selSize===s?styles.sizeBtnOn:''} ${!inStock?styles.sizeBtnOut:''}`}
                        onClick={() => setSelSize(s)} disabled={!inStock}>{s}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Style */}
            {product.styles.length > 1 && (
              <div className={styles.vpSection}>
                <p className={styles.vpSectionLabel}>Style</p>
                <div className={styles.vpStyles}>
                  {product.styles.map(st => (
                    <button key={st}
                      className={`${styles.styleBtn} ${selStyle===st?styles.styleBtnOn:''}`}
                      onClick={() => setSelStyle(st)}>{st}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + custom price */}
            <div className={styles.vpActions}>
              <div className={styles.vpQty}>
                <button onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(stockHere,q+1))}>+</button>
              </div>
              <div className={styles.vpCustomPrice}>
                <Ic d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={12} />
                <input type="number" placeholder="Custom price" value={customPrice||''}
                  onChange={e => setCustomPrice(e.target.value?Number(e.target.value):null)} />
              </div>
            </div>

            {/* All-location stock */}
            <div className={styles.vpAllStock}>
              {variant && LOCATIONS.map(loc => (
                <div key={loc.id} className={styles.vpStockRow}>
                  <span>{loc.name}</span>
                  <span style={{ color:(variant.stock[loc.id]??0)>0?'#059669':'#DC2626', fontWeight:600 }}>
                    {variant.stock[loc.id]??0} units
                  </span>
                </div>
              ))}
            </div>

            <button className={styles.vpAddBtn} disabled={!canAdd}
              onClick={() => { onAdd(product,variant,qty,customPrice??product.basePrice); onClose() }}>
              <Ic d="M12 5v14M5 12h14" size={15} stroke="#fff" />
              Add to Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VariantPicker
