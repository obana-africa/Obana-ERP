import { useState, useRef } from 'react'
import styles from './POS.module.css'
import { fmt, uid } from '../../utils/formatters'
import { CATALOG, COLLECTIONS, LOCATIONS, POS_DISCOUNTS, TAX_RATE } from '../../data/pos'
import VariantPicker  from './components/VariantPicker'
import CustomerPanel  from './components/CustomerPanel'
import PaymentModal   from './components/PaymentModal'
import Receipt        from './components/Receipt'

const Ic = ({ d, size=16, stroke='currentColor', sw=1.8, fill='none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{flexShrink:0}}>
    {[].concat(d).map((p,i) => <path key={i} d={p} />)}
  </svg>
)

// POS-specific time helpers (not shared — keep local)
const now     = () => new Date().toLocaleTimeString('en-NG', { hour:'2-digit', minute:'2-digit' })
const nowFull = () => new Date().toLocaleString('en-NG', { dateStyle:'medium', timeStyle:'short' })

export default function POS() {
  const [location,     setLocation]     = useState('loc-1')
  const [search,       setSearch]       = useState('')
  const [collection,   setCollection]   = useState('All')
  const [cart,         setCart]         = useState([])
  const [customer,     setCustomer]     = useState(null)
  const [discCode,     setDiscCode]     = useState('')
  const [discResult,   setDiscResult]   = useState(null)
  const [staffDisc,    setStaffDisc]    = useState(null)
  const [tax,          setTax]          = useState(true)
  const [showVP,       setShowVP]       = useState(null)
  const [showCP,       setShowCP]       = useState(false)
  const [showPM,       setShowPM]       = useState(false)
  const [receipt,      setReceipt]      = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [note,         setNote]         = useState('')
  const [cashier]      = useState('Tomiwa A.')
  const searchRef = useRef()

  // Live inventory — deducted on add, restored on remove
  const [inventory, setInventory] = useState(() => {
    const inv = {}
    CATALOG.forEach(p => p.variants.forEach(v => { inv[v.sku] = { ...v.stock } }))
    return inv
  })

  const getStock = (sku, loc) => inventory[sku]?.[loc] ?? 0

  // Filtered product grid
  const visible = CATALOG.filter(p => {
    const q  = search.toLowerCase()
    const ms = p.name.toLowerCase().includes(q) || p.variants.some(v => v.sku.toLowerCase().includes(q))
    const mc = collection === 'All' || p.category === collection || p.collection === collection
    return ms && mc
  })

  // ── Cart actions ─────────────────────────────────────
  const addToCart = (product, variant, qty, price) => {
    const key = variant.sku
    setCart(c => {
      const idx = c.findIndex(i => i.key === key)
      if (idx >= 0) {
        const updated = [...c]
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty }
        return updated
      }
      return [...c, { key, product, variant, qty, price, id: uid() }]
    })
    setInventory(inv => ({
      ...inv,
      [variant.sku]: { ...inv[variant.sku], [location]: Math.max(0, (inv[variant.sku]?.[location] ?? 0) - qty) },
    }))
  }

  const removeFromCart = key => {
    const item = cart.find(i => i.key === key)
    if (item) {
      setInventory(inv => ({
        ...inv,
        [item.variant.sku]: { ...inv[item.variant.sku], [location]: (inv[item.variant.sku]?.[location] ?? 0) + item.qty },
      }))
    }
    setCart(c => c.filter(i => i.key !== key))
  }

  const updateQty = (key, qty) => { if (qty <= 0) return removeFromCart(key); setCart(c => c.map(i => i.key===key ? {...i,qty} : i)) }

  const clearCart = () => {
    cart.forEach(item => setInventory(inv => ({
      ...inv,
      [item.variant.sku]: { ...inv[item.variant.sku], [location]: (inv[item.variant.sku]?.[location] ?? 0) + item.qty },
    })))
    setCart([]); setDiscResult(null); setStaffDisc(null); setCustomer(null); setNote(''); setDiscCode('')
  }

  // ── Pricing engine ────────────────────────────────────
  const subtotal  = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const totalQty  = cart.reduce((a, i) => a + i.qty, 0)
  const vipDisc   = customer?.tier === 'VIP' ? 0.15 : 0
  const codeDisc  = discResult?.type === 'percentage' ? discResult.value / 100
    : discResult?.type === 'fixed' ? discResult.value / subtotal : 0
  const bogoDisc  = discResult?.type === 'bogo'
    ? Math.floor(totalQty / (discResult.buyQty + discResult.getQty)) * discResult.getQty * (subtotal / totalQty) / subtotal
    : 0
  const totalDiscRate = Math.min(1, vipDisc + (staffDisc || 0) + codeDisc + bogoDisc)
  const discountAmt   = discResult?.type === 'fixed' ? Math.min(subtotal, discResult.value) : subtotal * totalDiscRate
  const afterDisc     = subtotal - discountAmt
  const taxAmt        = tax ? afterDisc * TAX_RATE : 0
  const total         = afterDisc + taxAmt

  const applyCode = () => {
    const disc = POS_DISCOUNTS.find(d => d.code === discCode.toUpperCase())
    if (!disc) { alert('Invalid discount code'); return }
    if (disc.minOrder && subtotal < disc.minOrder) { alert(`Min order ${fmt(disc.minOrder)}`); return }
    setDiscResult(disc)
  }

  const handlePayment = payInfo => {
    const order = {
      id: `POS-${Date.now().toString().slice(-6)}`,
      date: nowFull(), cashier, customer,
      items: cart, subtotal,
      discountAmt: Math.round(discountAmt),
      tax: taxAmt, total: Math.round(total),
      payment: payInfo, note, location,
    }
    setRecentOrders(o => [order, ...o].slice(0, 10))
    setReceipt(order)
    setShowPM(false)
    clearCart()
  }

  const locName = LOCATIONS.find(l => l.id === location)?.name || ''

  return (
    <div className={styles.pos}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@700;900&display=swap');`}</style>

      {/* Topbar */}
      <div className={styles.posTopbar}>
        <div className={styles.posTopLeft}>
          <div className={styles.posLogo}>
            <img src="/logos/taja_logo_white.png" alt="taja" className={styles.posLogoImg} />
            <span className={styles.posLogoTag}>POS</span>
          </div>
          <select className={styles.locSelect} value={location} onChange={e => setLocation(e.target.value)}>
            {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name} — {l.city}</option>)}
          </select>
        </div>
        <div className={styles.posTopRight}>
          <div className={styles.posTime}>{now()}</div>
          <span className={styles.posCashier}>
            <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={14} />
            {cashier}
          </span>
          <div className={`${styles.posStatus} ${styles.posOnline}`}>
            <div className={styles.posStatusDot} />
            Online
          </div>
        </div>
      </div>

      <div className={styles.posLayout}>
        {/* ── LEFT: Catalog ── */}
        <div className={styles.catalogPanel}>
          <div className={styles.catalogSearch}>
            <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={16} stroke="#9CA3AF" />
            <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products, SKU or barcode…" autoFocus />
            {search && <button onClick={() => setSearch('')}><Ic d="M18 6L6 18M6 6l12 12" size={13} /></button>}
          </div>

          <div className={styles.collectionTabs}>
            {COLLECTIONS.map(c => (
              <button key={c}
                className={`${styles.collTab} ${collection===c?styles.collTabOn:''}`}
                onClick={() => setCollection(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className={styles.productGrid}>
            {visible.length === 0 && (
              <div className={styles.noProducts}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={32} stroke="#9CA3AF" />
                <p>No products found</p>
              </div>
            )}
            {visible.map(p => {
              const totalStock = p.variants.reduce((a, v) => a + (inventory[v.sku]?.[location] ?? 0), 0)
              const hasDiscount = p.compareAt && p.compareAt > p.basePrice
              return (
                <button key={p.id}
                  className={`${styles.productTile} ${totalStock===0?styles.productTileOut:''}`}
                  onClick={() => setShowVP(p)} disabled={totalStock===0}>
                  <div className={styles.tileImg}>
                    <img src={p.img} alt={p.name} loading="lazy" />
                    {p.badge && <span className={`${styles.tileBadge} ${styles[`badge${p.badge}`]}`}>{p.badge}</span>}
                    {hasDiscount && <span className={styles.tileDisc}>SALE</span>}
                    {totalStock===0 && <div className={styles.tileOut}>Out of Stock</div>}
                    {totalStock>0 && totalStock<=5 && <span className={styles.tileLow}>Low</span>}
                  </div>
                  <div className={styles.tileInfo}>
                    <p className={styles.tileName}>{p.name}</p>
                    <p className={styles.tileCat}>{p.category}</p>
                    <div className={styles.tilePriceRow}>
                      <span className={styles.tilePrice}>{fmt(p.basePrice)}</span>
                      <span className={styles.tileVariantCount}>{p.variants.length} variants</span>
                    </div>
                    <div className={styles.tileStock}>
                      <div className={styles.tileStockBar}>
                        <div className={styles.tileStockFill} style={{
                          width: `${Math.min(100,(totalStock/30)*100)}%`,
                          background: totalStock<=3?'#EF4444':totalStock<=10?'#F59E0B':'#2DBD97',
                        }} />
                      </div>
                      <span>{totalStock}</span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {recentOrders.length > 0 && (
            <div className={styles.recentOrdersWrap}>
              <p className={styles.recentOrdersTitle}>Recent Sales</p>
              <div className={styles.recentOrdersList}>
                {recentOrders.slice(0,3).map(o => (
                  <div key={o.id} className={styles.recentOrderItem}>
                    <span className={styles.recentOrderId}>{o.id}</span>
                    <span className={styles.recentOrderAmt}>{fmt(o.total)}</span>
                    <span className={styles.recentOrderTime}>{o.date.split(',')[1]?.trim()||''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Cart ── */}
        <div className={styles.cartPanel}>

          {/* Customer bar */}
          <button className={styles.customerBar} onClick={() => setShowCP(true)}>
            <div className={styles.customerBarLeft}>
              {customer ? (
                <>
                  <div className={styles.custAvatar}>{customer.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div>
                    <div className={styles.custName}>{customer.name}</div>
                    <div className={styles.custMeta}>{customer.tier} · {customer.points} pts · {fmt(customer.totalSpend)}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.custAvatarEmpty}>
                    <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" size={18} stroke="#9CA3AF" />
                  </div>
                  <span className={styles.custPlaceholder}>Add customer (optional)</span>
                </>
              )}
            </div>
            {customer ? (
              <button className={styles.custRemove} onClick={e => { e.stopPropagation(); setCustomer(null) }}>
                <Ic d="M18 6L6 18M6 6l12 12" size={13} />
              </button>
            ) : (
              <Ic d="M12 5v14M5 12h14" size={16} stroke="#9CA3AF" />
            )}
          </button>

          {/* Cart items */}
          <div className={styles.cartItems}>
            {cart.length === 0 ? (
              <div className={styles.cartEmpty}>
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="#2DBD97" strokeWidth="1.5" strokeDasharray="4 4" />
                  <path d="M22 26h20l-2.5 12h-15L22 26zM19 22h4.5l2.5 4" stroke="#2DBD97" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p>Cart is empty</p>
                <span>Search or tap a product to add</span>
              </div>
            ) : cart.map(item => (
              <div key={item.key} className={styles.cartItem}>
                <img src={item.product.img} alt={item.product.name} className={styles.cartItemImg} />
                <div className={styles.cartItemInfo}>
                  <p className={styles.cartItemName}>{item.product.name}</p>
                  <p className={styles.cartItemVariant}>
                    {item.variant.color} / {item.variant.size}
                    {item.variant.style !== 'Regular' && ` / ${item.variant.style}`}
                  </p>
                  <p className={styles.cartItemSku}>{item.variant.sku}</p>
                </div>
                <div className={styles.cartItemRight}>
                  <div className={styles.cartQty}>
                    <button onClick={() => updateQty(item.key, item.qty-1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty+1)}>+</button>
                  </div>
                  <p className={styles.cartItemPrice}>{fmt(item.price * item.qty)}</p>
                  <button className={styles.cartItemDel} onClick={() => removeFromCart(item.key)}>
                    <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          {cart.length > 0 && (
            <div className={styles.noteWrap}>
              <input className={styles.noteInput} value={note} onChange={e => setNote(e.target.value)}
                placeholder="Add order note…" />
            </div>
          )}

          {/* Discount section */}
          {cart.length > 0 && (
            <div className={styles.discSection}>
              <div className={styles.discCodeRow}>
                <input className={styles.discInput} value={discCode}
                  onChange={e => setDiscCode(e.target.value.toUpperCase())} placeholder="Discount code" />
                <button className={styles.discApplyBtn} onClick={applyCode}>Apply</button>
              </div>
              {discResult && (
                <div className={styles.discApplied}>
                  <Ic d="M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0" size={12} stroke="#047857" />
                  <span>{discResult.label}</span>
                  <button className={styles.discRemoveBtn} onClick={() => { setDiscResult(null); setDiscCode('') }}>×</button>
                </div>
              )}
              <div className={styles.staffDiscRow}>
                <span className={styles.staffDiscLabel}>Staff discount:</span>
                {[0, 0.05, 0.10, 0.15, 0.20].map(v => (
                  <button key={v}
                    className={`${styles.staffDiscBtn} ${staffDisc===v?styles.staffDiscBtnOn:''}`}
                    onClick={() => setStaffDisc(staffDisc===v ? null : v)}>
                    {v===0 ? 'None' : `${v*100}%`}
                  </button>
                ))}
              </div>
              {customer?.tier === 'VIP' && (
                <div className={styles.vipDisc}>
                  <Ic d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={12} fill="#E8C547" stroke="#E8C547" />
                  VIP customer — 15% auto-applied
                </div>
              )}
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && (
            <div className={styles.totalsSection}>
              <div className={styles.totalRow}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              {discountAmt > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}><span>Discount</span><span>−{fmt(Math.round(discountAmt))}</span></div>
              )}
              <div className={styles.totalRow}>
                <label className={styles.taxToggle}>
                  <span>VAT (7.5%)</span>
                  <div className={`${styles.toggle} ${styles.toggleSm} ${tax?styles.toggleOn:''}`} onClick={() => setTax(t => !t)}>
                    <div className={styles.toggleThumb} />
                  </div>
                </label>
                <span>{tax ? fmt(Math.round(taxAmt)) : '—'}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}><span>TOTAL</span><strong>{fmt(Math.round(total))}</strong></div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.cartActions}>
            {cart.length > 0 && (
              <button className={styles.clearBtn} onClick={clearCart}>
                <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={14} />
                Clear
              </button>
            )}
            <button className={styles.chargeBtn} disabled={cart.length===0} onClick={() => setShowPM(true)}>
              <Ic d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={16} stroke="#fff" />
              Charge {cart.length > 0 ? fmt(Math.round(total)) : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showVP && <VariantPicker product={showVP} location={location} onAdd={addToCart} onClose={() => setShowVP(null)} />}
      {showCP && <CustomerPanel onSelect={setCustomer} onClose={() => setShowCP(false)} />}
      {showPM && <PaymentModal total={Math.round(total)} onComplete={handlePayment} onClose={() => setShowPM(false)} />}
      {receipt && <Receipt order={receipt} onClose={() => setReceipt(null)} />}
    </div>
  )
}
