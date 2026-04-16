import { useState, useEffect, useCallback, useRef } from 'react'
import styles from './OnlineStore.module.css'

/* ─── Google Fonts ─────────────────────────────────────── */
const FontLoader = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
)

/* ─── Icon helper ──────────────────────────────────────── */
const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ─── Helpers ──────────────────────────────────────────── */
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`
const pct = (orig, sale) => Math.round(((orig - sale) / orig) * 100)

/* ─────────────────────────────────────────────────────────
   STORE DATA  — mirrors your ERP modules
───────────────────────────────────────────────────────── */

// From Products module
const STORE_PRODUCTS = [
  {
    id: 'p1', sku: 'AKR-001', name: 'Classic Ankara Dress',
    price: 15000, compareAt: 18500, badge: 'Bestseller',
    category: 'Fashion', subCategory: 'Dresses',
    rating: 4.8, reviews: 124, stock: 24,
    colors: ['#E8532A','#2D5BE3','#1C1C1C'],
    sizes: ['XS','S','M','L','XL'],
    tags: ['ankara','dress','fashion','african'],
    img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    imgs: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      'https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80',
    ],
    description: 'A beautifully crafted Ankara dress celebrating rich West African textile traditions. Made from 100% premium cotton Ankara fabric.',
    weight: 0.4, location: 'Main Store — Lagos',
  },
  {
    id: 'p2', sku: 'LCB-002', name: 'Leather Crossbody Bag',
    price: 22000, compareAt: null, badge: 'New',
    category: 'Accessories', subCategory: 'Bags',
    rating: 4.9, reviews: 89, stock: 7,
    colors: ['#8B6F47','#1C1C1C','#C4A882'],
    sizes: ['One Size'],
    tags: ['leather','bag','accessories'],
    img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    imgs: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'],
    description: 'Premium full-grain leather crossbody bag. Handcrafted with attention to detail, featuring brass hardware and suede lining.',
    weight: 0.6, location: 'Main Store — Lagos',
  },
  {
    id: 'p3', sku: 'SHB-003', name: 'Premium Shea Butter Set',
    price: 4500, compareAt: 5800, badge: 'Sale',
    category: 'Beauty', subCategory: 'Skincare',
    rating: 4.7, reviews: 312, stock: 80,
    colors: ['#F5E6C8'],
    sizes: ['100ml','200ml','500ml'],
    tags: ['shea','beauty','skincare','natural'],
    img: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80',
    imgs: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80'],
    description: 'Pure unrefined shea butter sourced from Northern Nigeria. Rich in vitamins A, E & F for deep moisturisation.',
    weight: 0.3, location: 'Main Store — Lagos',
  },
  {
    id: 'p4', sku: 'KFT-004', name: "Men's Kaftan Set",
    price: 28000, compareAt: null, badge: null,
    category: 'Fashion', subCategory: 'Menswear',
    rating: 4.6, reviews: 67, stock: 15,
    colors: ['#F0EDE8','#1C3A5E','#2D5016'],
    sizes: ['S','M','L','XL','XXL'],
    tags: ['kaftan','menswear','fashion','traditional'],
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4b1d7a?w=600&q=80',
    imgs: ['https://images.unsplash.com/photo-1594938298603-c8148c4b1d7a?w=600&q=80'],
    description: 'Elegant traditional kaftan set made from handwoven fabric. Perfect for weddings, ceremonies and special occasions.',
    weight: 0.8, location: 'Main Store — Lagos',
  },
  {
    id: 'p5', sku: 'GFT-005', name: 'Ankara Gift Set Bundle',
    price: 35000, compareAt: 42000, badge: 'Limited',
    category: 'Fashion', subCategory: 'Gift Sets',
    rating: 5.0, reviews: 45, stock: 8,
    colors: ['#E8532A','#2D5BE3'],
    sizes: ['S/M','L/XL'],
    tags: ['gift','ankara','bundle','limited'],
    img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
    imgs: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'],
    description: 'Curated gift set featuring our best-selling Ankara pieces. Perfect for weddings, birthdays and celebrations.',
    weight: 1.2, location: 'Main Store — Lagos',
  },
  {
    id: 'p6', sku: 'NBC-006', name: 'Natural Body Cream',
    price: 3800, compareAt: null, badge: null,
    category: 'Beauty', subCategory: 'Body Care',
    rating: 4.5, reviews: 203, stock: 60,
    colors: ['#FFF8F0'],
    sizes: ['150ml','300ml'],
    tags: ['cream','beauty','natural','body'],
    img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    imgs: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80'],
    description: 'Luxurious body cream with shea butter, coconut oil and African botanicals. Absorbs quickly and leaves skin glowing.',
    weight: 0.3, location: 'Main Store — Lagos',
  },
]

// From Discounts engine
const ACTIVE_DISCOUNTS = [
  { code: 'SUMMER25', type: 'percentage', value: 25, minOrder: 10000, status: 'active' },
  { code: 'VIPFLAT5K', type: 'fixed', value: 5000, minOrder: 30000, status: 'active' },
  { code: 'FREESHIP', type: 'freeShipping', value: 0, minOrder: 20000, status: 'active', auto: true },
  { code: 'TRIPLE10', type: 'multibuy', value: 10, multipleOf: 3, status: 'active', auto: true },
]

// From Content module — blog posts
const BLOG_POSTS = [
  { id: 'b1', title: 'How to Style Ankara for Any Occasion', blog: 'Style Guide', date: '2026-04-01', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', excerpt: 'Discover the versatility of Ankara fabric and how to rock it from office to evening events.' },
  { id: 'b2', title: '5 Skincare Routines Using Nigerian Ingredients', blog: 'Wellness', date: '2026-03-22', img: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80', excerpt: 'From shea butter to black soap — build your routine with ingredients grown right here.' },
  { id: 'b3', title: 'Celebrating Nigerian Textile Heritage', blog: 'Style Guide', date: '2026-03-10', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', excerpt: 'A deep dive into the rich history and craft of Aso-oke, Ankara, and Adire fabrics.' },
]

// Shipping rates
const SHIPPING_RATES = [
  { id: 'standard', name: 'Standard Delivery', desc: '3–5 business days', price: 1500, days: '3-5' },
  { id: 'express',  name: 'Express Delivery',  desc: '1–2 business days', price: 3000, days: '1-2' },
  { id: 'pickup',   name: 'Store Pickup',       desc: 'Ready in 2 hours',  price: 0,    days: '0' },
]

const NIGERIAN_STATES = ['Lagos','Abuja','Rivers','Kano','Oyo','Delta','Enugu','Kaduna','Anambra','Kwara','Osun','Ondo','Ekiti','Ogun','Edo']

const CATEGORIES = ['All','Fashion','Beauty','Accessories']
const SORT_OPTS   = ['Featured','Price: Low to High','Price: High to Low','Best Rated','Most Reviewed','New Arrivals']

/* ─────────────────────────────────────────────────────────
   DISCOUNT ENGINE
───────────────────────────────────────────────────────── */
function applyDiscount(code, cartItems, subtotal) {
  const disc = ACTIVE_DISCOUNTS.find(d => d.code === code?.toUpperCase() && d.status === 'active')
  if (!disc) return { error: 'Invalid discount code' }
  if (disc.minOrder && subtotal < disc.minOrder) return { error: `Min order ${fmt(disc.minOrder)} required` }
  if (disc.type === 'percentage') return { savings: subtotal * (disc.value / 100), code: disc.code, label: `${disc.value}% off` }
  if (disc.type === 'fixed')      return { savings: disc.value, code: disc.code, label: `₦${disc.value.toLocaleString()} off` }
  return { error: 'Code not applicable' }
}

function getAutoDiscounts(cartItems, subtotal) {
  const result = []
  const totalQty = cartItems.reduce((a, i) => a + i.qty, 0)
  // Multi-buy
  const mb = ACTIVE_DISCOUNTS.find(d => d.type === 'multibuy' && d.auto && totalQty % d.multipleOf === 0 && totalQty >= d.multipleOf)
  if (mb) result.push({ savings: subtotal * (mb.value / 100), label: `Multi-buy ×${mb.multipleOf} (${mb.value}% off)` })
  // Free shipping
  const fs = ACTIVE_DISCOUNTS.find(d => d.type === 'freeShipping' && d.auto && subtotal >= d.minOrder)
  if (fs) result.push({ freeShipping: true, label: 'Free shipping applied' })
  return result
}

/* ─────────────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────────────── */

// Star rating
function Stars({ rating, size = 11 }) {
  return (
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
}

// Stock badge
function StockBadge({ stock }) {
  if (stock === 0)   return <span className={`${styles.stockBadge} ${styles.stockOut}`}>Out of Stock</span>
  if (stock <= 5)    return <span className={`${styles.stockBadge} ${styles.stockLow}`}>Only {stock} left</span>
  return null
}

/* ─── Product Card ─────────────────────────────────────── */
function ProductCard({ product, onAddToCart, onQuickView }) {
  const [activeColor, setActiveColor] = useState(0)
  const [wishlist, setWishlist]       = useState(false)
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

/* ─── Product Quick-View Modal ─────────────────────────── */
function QuickView({ product, onClose, onAddToCart }) {
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

            {/* Color */}
            <div className={styles.qvSection}>
              <span className={styles.qvSectionLabel}>Colour</span>
              <div className={styles.qvSwatches}>
                {product.colors.map((c, i) => (
                  <button key={i} className={`${styles.swatch} ${styles.swatchLg} ${i === selColor ? styles.swatchOn : ''}`}
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

            <button className={styles.qvAddBtn}
              disabled={product.stock === 0}
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

            {tab === 'desc' && (
              <p className={styles.qvDesc}>{product.description}</p>
            )}
            {tab === 'shipping' && (
              <div className={styles.qvShipping}>
                {SHIPPING_RATES.map(r => (
                  <div key={r.id} className={styles.qvShipRow}>
                    <Ic d={r.id === 'pickup' ? 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' : 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3'} size={14} />
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

/* ─── Cart Drawer ──────────────────────────────────────── */
function CartDrawer({ cart, onClose, onUpdateQty, onRemove, onCheckout }) {
  const [discCode,  setDiscCode]  = useState('')
  const [discResult,setDiscResult]= useState(null)
  const [selShipping,setSelShipping]= useState('standard')
  const shippingRate = SHIPPING_RATES.find(r => r.id === selShipping)

  const subtotal    = cart.reduce((a, i) => a + i.price * i.qty, 0)
  const autoDiscs   = getAutoDiscounts(cart, subtotal)
  const autoSavings = autoDiscs.reduce((a, d) => a + (d.savings || 0), 0)
  const hasFreeShip = autoDiscs.some(d => d.freeShipping)
  const manualSavings = discResult?.savings || 0
  const totalSavings  = autoSavings + manualSavings
  const shippingCost  = hasFreeShip ? 0 : shippingRate.price
  const taxRate       = 0.075  // 7.5% VAT Nigeria
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

              {/* Auto discounts applied */}
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

              {/* Shipping */}
              <div className={styles.shippingSelect}>
                <p className={styles.shippingLabel}>Shipping Method</p>
                {SHIPPING_RATES.map(r => (
                  <label key={r.id} className={`${styles.shippingOption} ${selShipping === r.id ? styles.shippingOptionOn : ''}`}>
                    <input type="radio" name="shipping" value={r.id} checked={selShipping === r.id}
                      onChange={() => setSelShipping(r.id)} />
                    <div className={styles.shippingOptionInfo}>
                      <span className={styles.shippingOptionName}>{r.name}</span>
                      <span className={styles.shippingOptionDesc}>{r.desc}</span>
                    </div>
                    <span className={styles.shippingOptionPrice}>
                      {hasFreeShip && r.id !== 'pickup' ? <s>{fmt(r.price)}</s> : r.price === 0 ? 'Free' : fmt(r.price)}
                      {hasFreeShip && r.id !== 'pickup' && <span className={styles.freeTag}> Free!</span>}
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
              {totalSavings > 0 && <div className={`${styles.sumRow} ${styles.sumDiscount}`}><span>Discounts</span><span>−{fmt(totalSavings)}</span></div>}
              <div className={styles.sumRow}><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : fmt(shippingCost)}</span></div>
              <div className={styles.sumRow}><span>VAT (7.5%)</span><span>{fmt(Math.round(tax))}</span></div>
              <div className={`${styles.sumRow} ${styles.sumTotal}`}>
                <span>Total</span>
                <span>{fmt(Math.round(total))}</span>
              </div>
            </div>
            <button className={styles.checkoutBtn} onClick={() => onCheckout({ subtotal, totalSavings, shippingCost, tax, total: Math.round(total), shipping: shippingRate, discCode: discResult?.code })}>
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

/* ─── Checkout Modal ───────────────────────────────────── */
function CheckoutModal({ cart, summary, onClose, onOrderPlaced }) {
  const [step,    setStep]    = useState(1) // 1=info, 2=payment, 3=confirm
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    address:'', city:'', state:'Lagos', zip:'',
    payMethod: 'card',
    cardNumber:'', cardExpiry:'', cardCvv:'', cardName:'',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const placeOrder = () => {
    setPlacing(true)
    setTimeout(() => {
      const orderNum = `OBN-${Date.now().toString().slice(-6)}`
      onOrderPlaced(orderNum)
    }, 1800)
  }

  const PAY_METHODS = [
    { id: 'card',     label: 'Debit / Credit Card',     icon: '💳' },
    { id: 'transfer', label: 'Bank Transfer',            icon: '🏦' },
    { id: 'paystack', label: 'Paystack',                 icon: '🟢' },
    { id: 'flutterwave', label: 'Flutterwave',           icon: '🦋' },
    { id: 'pos',      label: 'POS on Delivery',          icon: '📟' },
    { id: 'cash',     label: 'Cash on Delivery',         icon: '💵' },
  ]

  const step1Valid = form.firstName && form.lastName && form.email && form.phone && form.address && form.state

  return (
    <div className={styles.checkoutOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.checkoutModal}>
        <button className={styles.checkoutClose} onClick={onClose}>
          <Ic d="M18 6L6 18M6 6l12 12" size={20} />
        </button>

        {/* Progress steps */}
        <div className={styles.checkoutSteps}>
          {['Contact & Shipping','Payment','Confirm Order'].map((s, i) => (
            <div key={s} className={`${styles.checkoutStep} ${step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : ''}`}>
              <div className={styles.stepDot}>
                {step > i + 1 ? <Ic d="M20 6L9 17l-5-5" size={12} stroke="#fff" /> : i + 1}
              </div>
              <span className={styles.stepLabel}>{s}</span>
              {i < 2 && <div className={styles.stepLine} />}
            </div>
          ))}
        </div>

        <div className={styles.checkoutBody}>
          <div className={styles.checkoutLeft}>

            {/* STEP 1 — Contact & Shipping */}
            {step === 1 && (
              <div className={styles.checkoutSection}>
                <h3 className={styles.checkoutSectionTitle}>Contact Information</h3>
                <div className={styles.coRow}>
                  <div className={styles.coFg}><label>First Name *</label><input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="Tomiwa" /></div>
                  <div className={styles.coFg}><label>Last Name *</label><input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Aleminu" /></div>
                </div>
                <div className={styles.coRow}>
                  <div className={styles.coFg}><label>Email *</label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tomiwa@obana.africa" /></div>
                  <div className={styles.coFg}><label>Phone *</label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="08012345678" /></div>
                </div>
                <h3 className={styles.checkoutSectionTitle} style={{ marginTop: '1.5rem' }}>Shipping Address</h3>
                <div className={styles.coFg}><label>Street Address *</label><input value={form.address} onChange={e => set('address', e.target.value)} placeholder="12 Allen Avenue" /></div>
                <div className={styles.coRow}>
                  <div className={styles.coFg}><label>City *</label><input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Ikeja" /></div>
                  <div className={styles.coFg}><label>State *</label>
                    <select value={form.state} onChange={e => set('state', e.target.value)}>
                      {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button className={styles.coNextBtn} disabled={!step1Valid} onClick={() => setStep(2)}>
                  Continue to Payment <Ic d="M5 12h14M12 5l7 7-7 7" size={15} stroke="#fff" />
                </button>
              </div>
            )}

            {/* STEP 2 — Payment */}
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
                    <div className={styles.coFg}><label>Cardholder Name</label><input value={form.cardName} onChange={e => set('cardName', e.target.value)} placeholder="TOMIWA ALEMINU" /></div>
                    <div className={styles.coFg}><label>Card Number</label><input value={form.cardNumber} onChange={e => set('cardNumber', e.target.value.replace(/\D/g,'').slice(0,16))} placeholder="0000 0000 0000 0000" /></div>
                    <div className={styles.coRow}>
                      <div className={styles.coFg}><label>Expiry</label><input value={form.cardExpiry} onChange={e => set('cardExpiry', e.target.value)} placeholder="MM/YY" /></div>
                      <div className={styles.coFg}><label>CVV</label><input value={form.cardCvv} onChange={e => set('cardCvv', e.target.value.slice(0,4))} placeholder="•••" /></div>
                    </div>
                  </div>
                )}

                {form.payMethod === 'transfer' && (
                  <div className={styles.transferDetails}>
                    <p className={styles.transferTitle}>Bank Transfer Details</p>
                    <div className={styles.transferRow}><span>Bank</span><strong>Access Bank</strong></div>
                    <div className={styles.transferRow}><span>Account Name</span><strong>Obana Africa Ltd</strong></div>
                    <div className={styles.transferRow}><span>Account Number</span><strong>0123456789</strong></div>
                    <div className={styles.transferRow}><span>Amount</span><strong style={{ color: '#2DBD97' }}>{fmt(summary.total)}</strong></div>
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

            {/* STEP 3 — Confirm */}
            {step === 3 && (
              <div className={styles.checkoutSection}>
                <h3 className={styles.checkoutSectionTitle}>Order Summary</h3>
                <div className={styles.confirmItems}>
                  {cart.map(item => (
                    <div key={item.id} className={styles.confirmItem}>
                      <img src={item.img} alt={item.name} className={styles.confirmItemImg} />
                      <div className={styles.confirmItemInfo}>
                        <p className={styles.confirmItemName}>{item.name}</p>
                        {item.selSize && item.selSize !== 'One Size' && <p className={styles.confirmItemMeta}>Size: {item.selSize} · Qty: {item.qty}</p>}
                      </div>
                      <span className={styles.confirmItemPrice}>{fmt(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className={styles.confirmAddress}>
                  <p className={styles.confirmAddressTitle}>Delivering to</p>
                  <p className={styles.confirmAddressText}>{form.firstName} {form.lastName}<br/>{form.address}, {form.city}, {form.state}<br/>{form.phone}</p>
                </div>

                <div className={styles.coNavRow}>
                  <button className={styles.coBackBtn} onClick={() => setStep(2)}>← Back</button>
                  <button className={`${styles.coNextBtn} ${styles.coPlaceBtn}`} onClick={placeOrder} disabled={placing}>
                    {placing ? (
                      <span className={styles.placingSpinner}>Processing…</span>
                    ) : (
                      <><Ic d="M5 12h14M12 5l7 7-7 7" size={15} stroke="#fff" /> Place Order · {fmt(summary.total)}</>
                    )}
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
              {summary.totalSavings > 0 && <div className={`${styles.checkoutSumRow} ${styles.sumDiscount}`}><span>Savings</span><span>−{fmt(summary.totalSavings)}</span></div>}
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

/* ─── Order Confirmation ───────────────────────────────── */
function OrderConfirmation({ orderNum, onClose }) {
  return (
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
        <p className={styles.confirmMsg}>Thank you for shopping with Obana. Your order has been received and is being processed. You'll receive a confirmation SMS and email shortly.</p>
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
}

/* ─────────────────────────────────────────────────────────
   MAIN STOREFRONT
───────────────────────────────────────────────────────── */
export default function OnlineStore() {
  const [cart,          setCart]          = useState([])
  const [cartOpen,      setCartOpen]      = useState(false)
  const [quickView,     setQuickView]     = useState(null)
  const [checkoutData,  setCheckoutData]  = useState(null)
  const [orderNum,      setOrderNum]      = useState(null)
  const [category,      setCategory]      = useState('All')
  const [sort,          setSort]          = useState('Featured')
  const [search,        setSearch]        = useState('')
  const [banner,        setBanner]        = useState(true)
  const [page,          setPage]          = useState('shop') // 'shop' | 'blog'
  const [toast,         setToast]         = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800) }

  const addToCart = (product, qty = 1, selSize = product.sizes[0], selColor = 0) => {
    if (product.stock === 0) return
    setCart(c => {
      const key = `${product.id}-${selSize}-${selColor}`
      const exists = c.find(i => `${i.id}-${i.selSize}-${i.selColor}` === key)
      if (exists) return c.map(i => `${i.id}-${i.selSize}-${i.selColor}` === key ? { ...i, qty: Math.min(product.stock, i.qty + qty) } : i)
      return [...c, { ...product, qty, selSize, selColor }]
    })
    showToast(`${product.name} added to cart`)
    setCartOpen(true)
  }

  const updateQty = (item, qty) => {
    if (qty <= 0) return removeItem(item)
    setCart(c => c.map(i => i.id === item.id && i.selSize === item.selSize ? { ...i, qty } : i))
  }

  const removeItem = (item) => setCart(c => c.filter(i => !(i.id === item.id && i.selSize === item.selSize)))

  const startCheckout = (summary) => { setCartOpen(false); setCheckoutData(summary) }

  const onOrderPlaced = (num) => { setOrderNum(num); setCheckoutData(null); setCart([]) }

  const cartCount = cart.reduce((a, i) => a + i.qty, 0)

  // Filter + sort
  const visible = STORE_PRODUCTS
    .filter(p => category === 'All' || p.category === category)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.includes(search.toLowerCase())))
    .sort((a, b) => {
      if (sort === 'Price: Low to High')  return a.price - b.price
      if (sort === 'Price: High to Low')  return b.price - a.price
      if (sort === 'Best Rated')          return b.rating - a.rating
      if (sort === 'Most Reviewed')       return b.reviews - a.reviews
      return 0
    })

  return (
    <div className={styles.root}>
      <FontLoader />

      {/* ─── Announcement Banner ─── */}
      {banner && (
        <div className={styles.banner}>
          🎉 Free shipping on orders above ₦20,000 · Use code <strong>SUMMER25</strong> for 25% off
          <button className={styles.bannerClose} onClick={() => setBanner(false)}>✕</button>
        </div>
      )}

      {/* ─── Header ─── */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <h1 className={styles.logo}>OBANA<span>.</span></h1>
            <nav className={styles.nav}>
              <button className={`${styles.navLink} ${page === 'shop' ? styles.navLinkActive : ''}`} onClick={() => setPage('shop')}>Shop</button>
              <button className={`${styles.navLink} ${page === 'blog' ? styles.navLinkActive : ''}`} onClick={() => setPage('blog')}>Blog</button>
              <button className={styles.navLink}>Collections</button>
              <button className={styles.navLink}>About</button>
            </nav>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.searchWrap}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={15} stroke="#9CA3AF" />
              <input className={styles.searchInput} placeholder="Search products…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
              <Ic d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" size={20} />
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Toast notification ─── */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* ─── SHOP PAGE ─── */}
      {page === 'shop' && (
        <>
          {/* Hero */}
          <section className={styles.hero}>
            <div className={styles.heroInner}>
              <p className={styles.heroEyebrow}>New Season · 2026 Collection</p>
              <h2 className={styles.heroTitle}>African Fashion,<br/>Redefined</h2>
              <p className={styles.heroSub}>Premium Ankara, Kaftan & Beauty — shipped across Nigeria in 48 hours</p>
              <div className={styles.heroCtas}>
                <button className={styles.heroPrimary} onClick={() => setCategory('All')}>Shop Now</button>
                <button className={styles.heroSecondary} onClick={() => setPage('blog')}>Read Our Blog</button>
              </div>
            </div>
            <div className={styles.heroPattern} aria-hidden />
          </section>

          {/* Category pills */}
          <div className={styles.catRow}>
            {['Fashion','Beauty','Accessories','Gift Sets','New Arrivals','Sale'].map(c => (
              <button key={c} className={styles.catPill}
                onClick={() => { setCategory(c === 'Fashion' || c === 'Beauty' || c === 'Accessories' ? c : 'All') }}>
                {c}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className={styles.mainWrap}>
            <div className={styles.filters}>
              <div className={styles.filterLeft}>
                {CATEGORIES.map(c => (
                  <button key={c}
                    className={`${styles.filterBtn} ${category === c ? styles.filterBtnOn : ''}`}
                    onClick={() => setCategory(c)}>
                    {c}
                  </button>
                ))}
                <span className={styles.filterCount}>{visible.length} products</span>
              </div>
              <div className={styles.filterRight}>
                <select className={styles.sortSel} value={sort} onChange={e => setSort(e.target.value)}>
                  {SORT_OPTS.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {visible.length === 0 ? (
              <div className={styles.emptySearch}>
                <p>No products found for "<strong>{search}</strong>"</p>
                <button className={styles.filterBtn} onClick={() => setSearch('')}>Clear search</button>
              </div>
            ) : (
              <div className={styles.grid}>
                {visible.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={addToCart} onQuickView={setQuickView} />
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className={styles.trust}>
              {[
                { icon: '🚚', title: 'Fast Nationwide Shipping', desc: 'Lagos same-day · Other states 3–5 days' },
                { icon: '🔒', title: '100% Secure Payments',     desc: 'Paystack, Flutterwave, Bank Transfer' },
                { icon: '↩️', title: '7-Day Easy Returns',       desc: 'No questions asked return policy' },
                { icon: '🇳🇬', title: 'Made in Nigeria',          desc: 'Supporting local artisans & craftspeople' },
              ].map(t => (
                <div key={t.title} className={styles.trustItem}>
                  <span className={styles.trustIcon}>{t.icon}</span>
                  <strong className={styles.trustTitle}>{t.title}</strong>
                  <p className={styles.trustDesc}>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─── BLOG PAGE ─── */}
      {page === 'blog' && (
        <div className={styles.blogPage}>
          <div className={styles.blogHero}>
            <p className={styles.heroEyebrow}>Obana Journal</p>
            <h2 className={styles.heroTitle}>Stories, Style & Craft</h2>
          </div>
          <div className={styles.blogGrid}>
            {BLOG_POSTS.map(post => (
              <div key={post.id} className={styles.blogCard}>
                <div className={styles.blogCardImg}>
                  <img src={post.img} alt={post.title} />
                  <span className={styles.blogCardBlog}>{post.blog}</span>
                </div>
                <div className={styles.blogCardBody}>
                  <p className={styles.blogCardDate}>{new Date(post.date).toLocaleDateString('en-NG',{day:'numeric',month:'long',year:'numeric'})}</p>
                  <h3 className={styles.blogCardTitle}>{post.title}</h3>
                  <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
                  <button className={styles.blogCardRead}>Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Cart Drawer ─── */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
          onCheckout={startCheckout}
        />
      )}

      {/* ─── Quick View ─── */}
      {quickView && (
        <QuickView
          product={quickView}
          onClose={() => setQuickView(null)}
          onAddToCart={addToCart}
        />
      )}

      {/* ─── Checkout ─── */}
      {checkoutData && (
        <CheckoutModal
          cart={cart}
          summary={checkoutData}
          onClose={() => setCheckoutData(null)}
          onOrderPlaced={onOrderPlaced}
        />
      )}

      {/* ─── Order Confirmation ─── */}
      {orderNum && (
        <OrderConfirmation orderNum={orderNum} onClose={() => setOrderNum(null)} />
      )}
    </div>
  )
}
