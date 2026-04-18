import { useState } from 'react'
import styles from './OnlineStore.module.css'
import { STORE_PRODUCTS, STORE_BLOG_POSTS, STORE_CATEGORIES, SORT_OPTS, TRUST_BADGES } from '../../data/onlineStore'
import ProductCard          from './components/ProductCard'
import QuickView            from './components/QuickView'
import CartDrawer           from './components/CartDrawer'
import CheckoutModal, { OrderConfirmation } from './components/CheckoutModal'

const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

export default function OnlineStore() {
  const [cart,         setCart]         = useState([])
  const [cartOpen,     setCartOpen]     = useState(false)
  const [quickView,    setQuickView]    = useState(null)
  const [checkoutData, setCheckoutData] = useState(null)
  const [orderNum,     setOrderNum]     = useState(null)
  const [category,     setCategory]     = useState('All')
  const [sort,         setSort]         = useState('Featured')
  const [search,       setSearch]       = useState('')
  const [banner,       setBanner]       = useState(true)
  const [page,         setPage]         = useState('shop')
  const [toast,        setToast]        = useState(null)

  const showToast = msg => { setToast(msg); setTimeout(() => setToast(null), 2800) }

  const addToCart = (product, qty = 1, selSize = product.sizes[0], selColor = 0) => {
    if (product.stock === 0) return
    setCart(c => {
      const key    = `${product.id}-${selSize}-${selColor}`
      const exists = c.find(i => `${i.id}-${i.selSize}-${i.selColor}` === key)
      if (exists) return c.map(i =>
        `${i.id}-${i.selSize}-${i.selColor}` === key
          ? { ...i, qty: Math.min(product.stock, i.qty + qty) }
          : i
      )
      return [...c, { ...product, qty, selSize, selColor }]
    })
    showToast(`${product.name} added to cart`)
    setCartOpen(true)
  }

  const updateQty     = (item, qty) => { if (qty <= 0) return removeItem(item); setCart(c => c.map(i => i.id === item.id && i.selSize === item.selSize ? { ...i, qty } : i)) }
  const removeItem    = item => setCart(c => c.filter(i => !(i.id === item.id && i.selSize === item.selSize)))
  const startCheckout = summary => { setCartOpen(false); setCheckoutData(summary) }
  const onOrderPlaced = num => { setOrderNum(num); setCheckoutData(null); setCart([]) }
  const cartCount     = cart.reduce((a, i) => a + i.qty, 0)

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
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {banner && (
        <div className={styles.banner}>
          🎉 Free shipping on orders above ₦20,000 · Use code <strong>SUMMER25</strong> for 25% off
          <button className={styles.bannerClose} onClick={() => setBanner(false)}>✕</button>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <img
              src="/logos/taja_logo_blue.png"
              alt="taja by Obana.Africa"
              className={styles.logo}
            />
            <nav className={styles.nav}>
              <button className={`${styles.navLink} ${page==='shop'?styles.navLinkActive:''}`} onClick={() => setPage('shop')}>Shop</button>
              <button className={`${styles.navLink} ${page==='blog'?styles.navLinkActive:''}`} onClick={() => setPage('blog')}>Blog</button>
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

      {toast && <div className={styles.toast}>{toast}</div>}

      {page === 'shop' && (
        <>
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

          <div className={styles.catRow}>
            {['Fashion','Beauty','Accessories','Gift Sets','New Arrivals','Sale'].map(c => (
              <button key={c} className={styles.catPill}
                onClick={() => setCategory(['Fashion','Beauty','Accessories'].includes(c) ? c : 'All')}>
                {c}
              </button>
            ))}
          </div>

          <div className={styles.mainWrap}>
            <div className={styles.filters}>
              <div className={styles.filterLeft}>
                {STORE_CATEGORIES.map(c => (
                  <button key={c}
                    className={`${styles.filterBtn} ${category===c?styles.filterBtnOn:''}`}
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

            <div className={styles.trust}>
              {TRUST_BADGES.map(t => (
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

      {page === 'blog' && (
        <div className={styles.blogPage}>
          <div className={styles.blogHero}>
            <p className={styles.heroEyebrow}>Obana Journal</p>
            <h2 className={styles.heroTitle}>Stories, Style & Craft</h2>
          </div>
          <div className={styles.blogGrid}>
            {STORE_BLOG_POSTS.map(post => (
              <div key={post.id} className={styles.blogCard}>
                <div className={styles.blogCardImg}>
                  <img src={post.img} alt={post.title} />
                  <span className={styles.blogCardBlog}>{post.blog}</span>
                </div>
                <div className={styles.blogCardBody}>
                  <p className={styles.blogCardDate}>
                    {new Date(post.date).toLocaleDateString('en-NG',{ day:'numeric', month:'long', year:'numeric' })}
                  </p>
                  <h3 className={styles.blogCardTitle}>{post.title}</h3>
                  <p className={styles.blogCardExcerpt}>{post.excerpt}</p>
                  <button className={styles.blogCardRead}>Read More →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeItem} onCheckout={startCheckout} />}
      {quickView && <QuickView product={quickView} onClose={() => setQuickView(null)} onAddToCart={addToCart} />}
      {checkoutData && <CheckoutModal cart={cart} summary={checkoutData} onClose={() => setCheckoutData(null)} onOrderPlaced={onOrderPlaced} />}
      {orderNum && <OrderConfirmation orderNum={orderNum} onClose={() => setOrderNum(null)} />}
    </div>
  )
}
