/**
 * StorefrontPreview.jsx
 * Live iframe-style preview of the storefront using real API data.
 * Renders inside the builder canvas.
 */

import { useState, useEffect } from 'react'
import styles from '../OnlineStore.module.css'

const fmt = n => `₦${Number(n || 0).toLocaleString()}`
const pct = (o, s) => Math.round(((o - s) / o) * 100)

/* ─── Tiny star renderer ─────────────────────────────────────── */
function Stars({ rating = 0 }) {
  return (
    <span style={{ display:'flex', gap:1 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width={10} height={10} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#F59E0B' : 'none'}
          stroke={s <= Math.round(rating) ? '#F59E0B' : '#D1D5DB'}
          strokeWidth={1.5}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </span>
  )
}

/* ─── Skeleton card ─────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius:8, overflow:'hidden', background:'#F9FAFB', border:'1px solid #F3F4F6' }}>
      <div style={{ aspectRatio:'4/5', background:'linear-gradient(90deg,#F3F4F6 25%,#E5E7EB 50%,#F3F4F6 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.4s infinite' }} />
      <div style={{ padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ height:10, width:'40%', background:'#F3F4F6', borderRadius:4 }} />
        <div style={{ height:13, width:'80%', background:'#E5E7EB', borderRadius:4 }} />
        <div style={{ height:11, width:'60%', background:'#F3F4F6', borderRadius:4 }} />
        <div style={{ height:15, width:'35%', background:'#E5E7EB', borderRadius:4, marginTop:4 }} />
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────── */
export default function StorefrontPreview({ theme, viewport, page, integration }) {
  const [products,  setProducts]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  /* Fetch real products from your ERP API */
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const fetchProducts = async () => {
      try {
        // If an external integration is connected, use its endpoint
        const endpoint = integration?.apiUrl
          ? `${integration.apiUrl}/products?limit=${theme.productCols * 2}`
          : `/api/products?limit=${theme.productCols * 2}&status=active&featured=true`

        const headers = { 'Content-Type': 'application/json' }
        if (integration?.apiKey) headers['Authorization'] = `Bearer ${integration.apiKey}`

        const res = await fetch(endpoint, { headers })
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
        const data = await res.json()

        if (!cancelled) {
          // Normalize shape — handles Obana ERP, Shopify, WooCommerce responses
          const normalized = normalizeProducts(data, integration?.platform)
          setProducts(normalized)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()
    return () => { cancelled = true }
  }, [theme.productCols, integration])

  /* ── Derived style values ─────────────────────────────────── */
  const r        = theme.radius
  const cols     = theme.productCols || 3
  const isPhone  = viewport === 'phone'
  const isTablet = viewport === 'tablet'
  const pad      = isPhone ? '16px' : '24px'
  const heroFS   = isPhone ? '26px' : isTablet ? '36px' : '48px'

  const btnBase = {
    padding: '10px 22px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: `${theme.bodyFont}, sans-serif`,
    fontSize: '13px',
    fontWeight: 700,
    borderRadius: theme.btn === 'pill' ? '99px' : `${Math.min(r + 2, 16)}px`,
    transition: 'all .15s',
    letterSpacing: '0.02em',
  }
  const btnPrimary = theme.btn === 'outline'
    ? { ...btnBase, background: 'transparent', border: `2px solid ${theme.accent}`, color: theme.accent }
    : { ...btnBase, background: theme.accent, color: '#fff' }
  const btnGhost = {
    ...btnBase,
    background: 'transparent',
    border: `1.5px solid rgba(255,255,255,0.4)`,
    color: theme.heroTextColor,
  }

  const CATS = ['All', 'Fashion', 'Beauty', 'Accessories', 'Gift Sets', 'Home']
  const TRUST = [
    { icon: '🚚', title: 'Free Delivery',   desc: 'On orders above ₦20,000' },
    { icon: '🔄', title: '7-Day Returns',   desc: 'Hassle-free returns'      },
    { icon: '✅', title: '100% Authentic',  desc: 'Genuine African fabrics'  },
    { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted payments'   },
  ]

  return (
    <div style={{
      background: theme.bg,
      color: theme.text,
      fontFamily: `${theme.bodyFont}, sans-serif`,
      overflow: 'hidden',
      minHeight: '100%',
    }}>

      {/* ── Custom CSS injection ── */}
      {theme.customCss && (
        <style dangerouslySetInnerHTML={{ __html: theme.customCss }} />
      )}

      {/* ── Announcement bar ─────────────────────────────────── */}
      {theme.showAnnounce && (
        <div style={{
          background: theme.announceBg || theme.primary,
          color: theme.announceColor || '#fff',
          textAlign: 'center',
          padding: '9px 40px',
          fontSize: '12.5px',
          fontWeight: 500,
        }}>
          {theme.announceText}
        </div>
      )}

      {/* ── Header / Nav ─────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: `13px ${pad}`,
        borderBottom: '1px solid #E5E7EB',
        background: theme.navBg || theme.bg,
        gap: '20px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        {theme.navLayout === 'split' && (
          <nav style={{ display:'flex', gap:18 }}>
            {['Shop','Collections','About'].map(l => (
              <span key={l} style={{ fontSize:13, fontWeight:500, color: theme.navText || theme.text, cursor:'pointer' }}>{l}</span>
            ))}
          </nav>
        )}

        {/* Logo */}
        <div style={{
          fontFamily: `${theme.headingFont}, serif`,
          fontSize: isPhone ? '16px' : '20px',
          fontWeight: 900,
          color: theme.primary,
          letterSpacing: '-.04em',
          flexShrink: 0,
        }}>
          {theme.logoUrl
            ? <img src={theme.logoUrl} alt={theme.logoText} style={{ height: 32, objectFit: 'contain' }} />
            : theme.logoText
          }
        </div>

        {/* Center nav */}
        {theme.navLayout !== 'split' && (
          <nav style={{
            display: 'flex',
            gap: 18,
            flex: 1,
            justifyContent: theme.navLayout === 'centered' ? 'center' : 'flex-start',
          }}>
            {['Shop', 'Collections', 'About'].map(l => (
              <span key={l} style={{ fontSize:13, fontWeight:500, color: theme.navText || '#374151', cursor:'pointer' }}>{l}</span>
            ))}
          </nav>
        )}

        {/* Right icons */}
        <div style={{ display:'flex', alignItems:'center', gap:14, marginLeft:'auto', flexShrink:0, color:'#6B7280' }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <circle cx={11} cy={11} r={8}/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <div style={{ position:'relative' }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span style={{
              position:'absolute', top:-5, right:-5,
              width:14, height:14, borderRadius:'50%',
              background: theme.primary, color:'#fff',
              fontSize:8, fontWeight:700,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>0</span>
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────── */}
      {theme.showHero && (
        <section style={{
          background: theme.heroBg,
          padding: `${isPhone ? '48px' : isTablet ? '64px' : '88px'} ${pad}`,
          minHeight: isPhone ? '260px' : '340px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background image */}
          {theme.heroImageUrl && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${theme.heroImageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: (100 - (theme.heroOverlayOpacity || 40)) / 100,
            }} />
          )}
          <div style={{ position:'relative', maxWidth:560, zIndex:1 }}>
            <p style={{
              fontSize: '11px', fontWeight: 700,
              letterSpacing: '.12em', textTransform: 'uppercase',
              color: theme.accent, marginBottom: 14,
            }}>{theme.tagline}</p>
            <h1 style={{
              fontFamily: `${theme.headingFont}, serif`,
              fontSize: heroFS,
              fontWeight: theme.headingWeight || 900,
              lineHeight: 1.1,
              letterSpacing: '-.03em',
              color: theme.heroTextColor,
              margin: '0 0 14px',
            }}>
              {theme.heroTitle.split('\n').map((l, i) => (
                <span key={i}>{l}<br /></span>
              ))}
            </h1>
            <p style={{
              fontSize: 14, opacity: .75, lineHeight: 1.7,
              color: theme.heroTextColor, maxWidth: 420,
              margin: '0 0 26px',
            }}>{theme.heroSub}</p>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <button style={btnPrimary}>{theme.heroCta1 || 'Shop Now'}</button>
              <button style={btnGhost}>{theme.heroCta2 || 'View Collections'}</button>
            </div>
          </div>
        </section>
      )}

      {/* ── Category pills ───────────────────────────────────── */}
      {theme.showCats && (
        <div style={{ display:'flex', gap:8, padding:`16px ${pad} 0`, flexWrap:'wrap', overflowX:'auto' }}>
          {CATS.map((c, i) => (
            <button key={c} style={{
              padding: '6px 16px',
              borderRadius: theme.btn === 'pill' ? '99px' : `${r}px`,
              border: `1.5px solid ${i === 0 ? theme.primary : '#E5E7EB'}`,
              background: i === 0 ? theme.primary : '#F9FAFB',
              color: i === 0 ? '#fff' : '#374151',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit', flexShrink: 0,
              transition: 'all .15s',
            }}>{c}</button>
          ))}
        </div>
      )}

      {/* ── Featured products ─────────────────────────────────── */}
      {theme.showFeatured && (
        <section style={{ padding: `28px ${pad}` }}>
          <h2 style={{
            fontFamily: `${theme.headingFont}, serif`,
            fontSize: isPhone ? '18px' : '22px',
            fontWeight: 700, color: theme.text,
            margin: '0 0 20px',
            letterSpacing: '-.02em',
          }}>{theme.featuredTitle}</h2>

          {error && (
            <div style={{
              padding: '20px', textAlign:'center',
              background:'#FEF2F2', borderRadius:`${r}px`,
              border:'1px solid #FECACA', color:'#B91C1C', fontSize:13,
            }}>
              ⚠️ Could not load products: {error}
              <br />
              <span style={{ fontSize:11, color:'#6B7280' }}>
                Check your API connection in the Integrations tab
              </span>
            </div>
          )}

          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${isPhone ? 2 : cols}, 1fr)`,
            gap: isPhone ? '10px' : '16px',
          }}>
            {loading
              ? Array.from({ length: cols * 2 }).map((_, i) => <SkeletonCard key={i} />)
              : products.slice(0, cols * 2).map(p => (
                <ProductCard key={p.id} p={p} theme={theme} r={r} />
              ))
            }
          </div>
        </section>
      )}

      {/* ── Promo banner ─────────────────────────────────────── */}
      {theme.showPromo && (
        <div style={{
          margin: `0 ${pad} 28px`,
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
          borderRadius: `${r}px`,
          padding: isPhone ? '22px 16px' : '30px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <h3 style={{
              fontFamily: `${theme.headingFont}, serif`,
              fontSize: isPhone ? '16px' : '20px',
              fontWeight: 700, color:'#fff',
              margin: '0 0 6px',
            }}>{theme.promoTitle}</h3>
            <p style={{ fontSize:13, color:'rgba(255,255,255,.65)', margin:0 }}>
              {theme.promoSub}
            </p>
          </div>
          <button style={{
            background:'#fff', color: theme.primary,
            border:'none', borderRadius:`${r}px`,
            padding:'10px 22px', fontWeight:700, fontSize:13,
            cursor:'pointer', flexShrink:0, fontFamily:'inherit',
          }}>{theme.promoCta || 'Shop Now'}</button>
        </div>
      )}

      {/* ── Trust badges ─────────────────────────────────────── */}
      {theme.showTrust && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${isPhone ? 2 : 4}, 1fr)`,
          borderTop: '1px solid #E5E7EB',
        }}>
          {TRUST.map((t, i) => (
            <div key={t.title} style={{
              display:'flex', flexDirection:'column',
              alignItems:'center', textAlign:'center',
              padding: '22px 12px',
              borderRight: i < 3 ? '1px solid #E5E7EB' : 'none',
            }}>
              <span style={{ fontSize:22, marginBottom:6 }}>{t.icon}</span>
              <strong style={{ fontSize:12, fontWeight:700, color:theme.text, marginBottom:3, display:'block' }}>
                {t.title}
              </strong>
              <p style={{ fontSize:11, color:'#6B7280', lineHeight:1.4, margin:0 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Newsletter ───────────────────────────────────────── */}
      {theme.showNewsletter && (
        <div style={{
          background: theme.primary,
          padding: `36px ${pad}`,
          textAlign: 'center',
        }}>
          <h3 style={{
            fontFamily: `${theme.headingFont}, serif`,
            fontSize: '22px', fontWeight:700,
            color:'#fff', margin:'0 0 8px',
          }}>Stay in the loop</h3>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:13, margin:'0 0 20px' }}>
            New arrivals, exclusive deals and style tips in your inbox.
          </p>
          <div style={{ display:'flex', gap:8, maxWidth:380, margin:'0 auto', flexWrap:'wrap' }}>
            <input type="email" placeholder="your@email.com" style={{
              flex:1, padding:'10px 14px',
              borderRadius: theme.btn === 'pill' ? '99px' : `${r}px`,
              border:'none', fontSize:13, minWidth:160,
              fontFamily:'inherit',
            }}/>
            <button style={{ ...btnPrimary, padding:'10px 18px', fontSize:13, flexShrink:0 }}>
              Subscribe
            </button>
          </div>
        </div>
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      {theme.showFooter && (
        <footer style={{
          background: theme.footerBg || theme.primary,
          padding: `28px ${pad}`,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap', marginBottom:16 }}>
            <span style={{
              fontFamily:`${theme.headingFont}, serif`,
              fontSize:18, fontWeight:900,
              color:'rgba(255,255,255,.9)', letterSpacing:'-.04em',
            }}>{theme.logoText}</span>
            <p style={{ fontSize:12, color:'rgba(255,255,255,.45)', margin:0 }}>
              {theme.footerTagline}
            </p>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:11, color:'rgba(255,255,255,.3)' }}>{theme.footerCopyright}</span>
            <div style={{ display:'flex', gap:16 }}>
              {['Privacy', 'Terms', 'Support'].map(l => (
                <span key={l} style={{ fontSize:11, color:'rgba(255,255,255,.4)', cursor:'pointer' }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

/* ─── Product card in preview ───────────────────────────────── */
function ProductCard({ p, theme, r }) {
  const hasDiscount = p.compareAt && p.compareAt > p.price

  const cardStyle = {
    border: theme.cardStyle === 'flat'
      ? 'none'
      : theme.cardStyle === 'border'
      ? `1.5px solid ${theme.cardBorder || '#E5E7EB'}`
      : '1px solid #F3F4F6',
    borderRadius: `${r}px`,
    overflow: 'hidden',
    cursor: 'pointer',
    background: theme.cardBg || '#fff',
    transition: 'all .2s',
    boxShadow: theme.cardStyle === 'shadow' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
  }

  return (
    <div style={cardStyle}>
      <div style={{ position:'relative', aspectRatio:'4/5', overflow:'hidden', background:'#F3F4F6' }}>
        {p.image
          ? <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} loading="lazy"/>
          : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#F3F4F6,#E5E7EB)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth={1}>
                <rect x={3} y={3} width={18} height={18} rx={2}/>
                <circle cx={8.5} cy={8.5} r={1.5}/><path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
        }
        {theme.showBadges && p.badge && (
          <span style={{
            position:'absolute', top:8, left:8,
            background: theme.primary, color:'#fff',
            padding:'3px 9px', borderRadius:'99px',
            fontSize:9, fontWeight:800, textTransform:'uppercase', letterSpacing:'.04em',
          }}>{p.badge}</span>
        )}
        {hasDiscount && (
          <span style={{
            position:'absolute', top:8, right:8,
            background:'#EF4444', color:'#fff',
            padding:'3px 8px', borderRadius:'99px',
            fontSize:10, fontWeight:800,
          }}>−{pct(p.compareAt, p.price)}%</span>
        )}
        {theme.showQuickAdd && (
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            padding:'10px', background: theme.primary,
            color:'#fff', fontSize:11, fontWeight:700,
            textAlign:'center', letterSpacing:'.05em',
            transform:'translateY(100%)',
            transition:'transform .22s',
          }} className={styles.quickAddBtn}>
            + QUICK ADD
          </div>
        )}
      </div>
      <div style={{ padding:'10px 12px 13px' }}>
        <p style={{ fontSize:10, color: theme.accent, fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', margin:'0 0 3px' }}>
          {p.category}
        </p>
        <h3 style={{ fontSize:13, fontWeight:600, color: theme.text, margin:'0 0 5px', lineHeight:1.3, display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:2, overflow:'hidden' }}>
          {p.name}
        </h3>
        {theme.showRatings && p.rating > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4 }}>
            <Stars rating={p.rating}/>
            <span style={{ fontSize:10, color:'#9CA3AF' }}>({p.reviewCount || 0})</span>
          </div>
        )}
        <div style={{ display:'flex', alignItems:'baseline', gap:6, fontWeight:700 }}>
          <span style={{ fontSize:14, color: theme.text }}>{fmt(p.price)}</span>
          {hasDiscount && (
            <span style={{ fontSize:11, textDecoration:'line-through', color:'#9CA3AF', fontWeight:400 }}>
              {fmt(p.compareAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Response normalizer ───────────────────────────────────── */
function normalizeProducts(data, platform) {
  // Obana ERP format
  if (data?.products) return data.products.map(p => ({
    id:          p.id || p._id,
    name:        p.name || p.title,
    image:       p.images?.[0]?.url || p.image || p.img || '',
    category:    p.category || '',
    price:       parseFloat(p.price) || 0,
    compareAt:   parseFloat(p.compareAt || p.compare_at_price) || null,
    rating:      parseFloat(p.rating) || 0,
    reviewCount: parseInt(p.reviewCount || p.reviews_count) || 0,
    badge:       p.badge || p.tags?.[0] || null,
    stock:       parseInt(p.stock || p.inventory_quantity) || 0,
  }))

  // Shopify format
  if (platform === 'shopify' && data?.products) return data.products.map(p => ({
    id:          p.id,
    name:        p.title,
    image:       p.images?.[0]?.src || '',
    category:    p.product_type || '',
    price:       parseFloat(p.variants?.[0]?.price) || 0,
    compareAt:   parseFloat(p.variants?.[0]?.compare_at_price) || null,
    rating:      0,
    reviewCount: 0,
    badge:       p.tags?.split(',')[0]?.trim() || null,
    stock:       p.variants?.[0]?.inventory_quantity || 0,
  }))

  // WooCommerce format
  if (platform === 'woocommerce' && Array.isArray(data)) return data.map(p => ({
    id:          p.id,
    name:        p.name,
    image:       p.images?.[0]?.src || '',
    category:    p.categories?.[0]?.name || '',
    price:       parseFloat(p.price) || 0,
    compareAt:   parseFloat(p.regular_price) || null,
    rating:      parseFloat(p.average_rating) || 0,
    reviewCount: parseInt(p.rating_count) || 0,
    badge:       p.featured ? 'Featured' : null,
    stock:       p.stock_quantity || 0,
  }))

  // Generic array
  if (Array.isArray(data)) return data.map(p => ({
    id:          p.id || p._id,
    name:        p.name || p.title || 'Product',
    image:       p.image || p.img || p.thumbnail || p.images?.[0]?.url || p.images?.[0] || '',
    category:    p.category || p.type || '',
    price:       parseFloat(p.price) || 0,
    compareAt:   parseFloat(p.compareAt || p.compare_at_price || p.originalPrice) || null,
    rating:      parseFloat(p.rating || p.averageRating) || 0,
    reviewCount: parseInt(p.reviewCount || p.reviews || p.numReviews) || 0,
    badge:       p.badge || p.label || null,
    stock:       parseInt(p.stock || p.quantity || p.inventory) || 0,
  }))

  return []
}
