import { useState } from 'react'
import styles from '../Collections.module.css'
import { fmt } from '../../../utils/formatters'
import { LOCATIONS, LOCATION_TYPE_CFG, ALL_PRODUCTS } from '../../../data/collections'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

const Pill = ({ label, bg, color, size = 'sm' }) => (
  <span className={`${styles.pill} ${size === 'xs' ? styles.pillXs : ''}`} style={{ background: bg, color }}>
    {label}
  </span>
)

const LocAvatar = ({ name, active }) => (
  <div className={styles.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
)

/**
 * Props:
 *  collection — full collection object (with locationInventory)
 *  onClose    — () => void
 *  onSave     — (newInventory) => void
 */
const InventoryModal = ({ collection, onClose, onSave }) => {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0].id)
  const [inventory, setInventory] = useState(
    JSON.parse(JSON.stringify(collection.locationInventory))
  )

  const products      = ALL_PRODUCTS.filter(p => collection.productIds.includes(p.id))
  const loc           = LOCATIONS.find(l => l.id === activeLocation)
  const locTypeCfg    = LOCATION_TYPE_CFG[loc.type]

  const updateQty = (productId, qty) => {
    setInventory(prev => ({
      ...prev,
      [activeLocation]: {
        ...(prev[activeLocation] || {}),
        [productId]: Math.max(0, Number(qty) || 0),
      },
    }))
  }

  const getQty = productId => inventory[activeLocation]?.[productId] ?? 0

  const totalForLocation = products.reduce((a, p) => a + getQty(p.id), 0)
  const totalAcrossAll   = LOCATIONS.reduce((a, loc) =>
    a + products.reduce((b, p) => b + (inventory[loc.id]?.[p.id] || 0), 0), 0
  )

  // Copy stock from another location
  const copyFrom = fromLocId => {
    setInventory(prev => ({
      ...prev,
      [activeLocation]: { ...(prev[fromLocId] || {}) },
    }))
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalLg}>

        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Inventory by Location</h2>
            <p className={styles.mSub}>
              {collection.name} · {products.length} products across{' '}
              {LOCATIONS.filter(l => l.active).length} active locations
            </p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.invLayout}>

          {/* ── Left: location list ── */}
          <div className={styles.locList}>
            <div className={styles.locListHead}>Locations</div>
            {LOCATIONS.map(loc => {
              const locTotal = products.reduce(
                (a, p) => a + (inventory[loc.id]?.[p.id] || 0), 0
              )
              const isActive = activeLocation === loc.id
              return (
                <button
                  key={loc.id}
                  className={`${styles.locItem} ${isActive ? styles.locItemOn : ''} ${!loc.active ? styles.locItemInactive : ''}`}
                  onClick={() => setActiveLocation(loc.id)}
                >
                  <LocAvatar name={loc.name} active={loc.active} />
                  <div className={styles.locItemInfo}>
                    <div className={styles.locItemName}>{loc.name}</div>
                    <div className={styles.locItemCity}>{loc.city}</div>
                  </div>
                  <div className={styles.locItemRight}>
                    <span className={styles.locItemQty}>{locTotal}</span>
                    {!loc.active && <span className={styles.locInactiveTag}>Inactive</span>}
                  </div>
                </button>
              )
            })}

            <div className={styles.locTotalRow}>
              <span>All locations</span>
              <span className={styles.locTotalVal}>{totalAcrossAll}</span>
            </div>
          </div>

          {/* ── Right: inventory table ── */}
          <div className={styles.invTable}>
            <div className={styles.invTableHead}>
              <div className={styles.invLocBadge}>
                <LocAvatar name={loc.name} active={loc.active} />
                <div>
                  <div className={styles.invLocName}>{loc.name} — {loc.city}</div>
                  <Pill {...locTypeCfg} size="xs" />
                </div>
                {!loc.active && <span className={styles.invInactiveNote}>This location is inactive</span>}
              </div>

              {/* Copy from another location */}
              <div className={styles.copyFromWrap}>
                <span className={styles.copyFromLabel}>Copy from:</span>
                {LOCATIONS
                  .filter(l => l.id !== activeLocation && l.active)
                  .map(l => (
                    <button key={l.id} className={styles.copyFromBtn} onClick={() => copyFrom(l.id)}>
                      {l.name.split(' ')[0]}
                    </button>
                  ))
                }
              </div>
            </div>

            {/* Column headers */}
            <div className={styles.invColHead}>
              <span>Product</span>
              <span>SKU</span>
              <span>Price</span>
              <span>On Hand</span>
              <span>Status</span>
            </div>

            {/* Product rows */}
            {products.map(p => {
              const qty = getQty(p.id)
              return (
                <div key={p.id} className={styles.invRow}>
                  <span className={styles.invProdCell}>
                    <div className={styles.invProdThumb}>{p.name[0]}</div>
                    <div>
                      <div className={styles.invProdName}>{p.name}</div>
                      <div className={styles.invProdCat}>{p.category}</div>
                    </div>
                  </span>
                  <span className={styles.invSku}>{p.sku}</span>
                  <span className={styles.invPrice}>{fmt(p.price)}</span>
                  <span className={styles.invQtyCell}>
                    <button className={styles.qtyBtn} onClick={() => updateQty(p.id, qty - 1)}>−</button>
                    <input
                      type="number" min={0} value={qty}
                      onChange={e => updateQty(p.id, e.target.value)}
                      className={styles.qtyInput}
                    />
                    <button className={styles.qtyBtn} onClick={() => updateQty(p.id, qty + 1)}>+</button>
                  </span>
                  <span>
                    <span className={styles.invStatus} style={{
                      background: qty === 0 ? '#FEF2F2' : qty <= 5 ? '#FFFBEB' : '#ECFDF5',
                      color:      qty === 0 ? '#DC2626' : qty <= 5 ? '#D97706' : '#059669',
                    }}>
                      {qty === 0 ? 'Out of stock' : qty <= 5 ? 'Low stock' : 'In stock'}
                    </span>
                  </span>
                </div>
              )
            })}

            {products.length === 0 && (
              <div className={styles.invEmpty}>
                <p>No products in this collection yet.</p>
                <span>Edit the collection to add products first.</span>
              </div>
            )}

            <div className={styles.invFootTotal}>
              <span>Total at {loc.name}</span>
              <strong>{totalForLocation} units</strong>
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} onClick={() => { onSave(inventory); onClose() }}>
            Save Inventory
          </button>
        </div>
      </div>
    </div>
  )
}

export default InventoryModal
