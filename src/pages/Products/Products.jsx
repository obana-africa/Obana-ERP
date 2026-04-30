import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import s from './Products.module.css'
import { fmt } from '../../utils/formatters'
import { SAMPLE_PRODUCTS } from '../../data/products'
import AddProductModal from './components/AddProductModal'
import ImportModal     from './components/ImportModal'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const ICON = {
  plus:     'M12 5v14M5 12h14',
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  trash:    ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  search:   'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  import:   ['M8 17l4 4 4-4M12 12v9','M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29'],
  store:    ['M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6','M15 3h6v6','M10 14L21 3'],
  bell:     ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  box:      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  img:      ['M3 3h18v18H3z','M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z','M21 15l-5-5L5 21'],
  close:    'M18 6L6 18M6 6l12 12',
  filter:   ['M22 3H2l8 9.46V19l4 2v-8.54L22 3'],
  grid:     ['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z'],
  list:     ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  chevronD: 'M6 9l6 6 6-6',
  tag:      ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  trending: 'M23 6l-9.5 9.5-5-5L1 18',
  chart:    ['M18 20V10','M12 20V4','M6 20v-6'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
}

/* ── Animated counter ──────────────────────────────────────────── */
function Counter({ target, prefix = '', suffix = '', duration = 900 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const start = performance.now()
    const num = typeof target === 'number' ? target : parseFloat(String(target).replace(/[^0-9.]/g, ''))
    const tick = now => {
      const p = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(e * num))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target])
  return <>{prefix}{val.toLocaleString()}{suffix}</>
}

/* ── Zigzag sparkline ──────────────────────────────────────────── */
function SparkLine({ data, color }) {
  const w = 80, h = 28
  const min = Math.min(...data), max = Math.max(...data)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={s.spark}>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.1" stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </svg>
  )
}

/* ── Stat card ─────────────────────────────────────────────────── */
function StatCard({ label, value, prefix, suffix, change, up, color, spark, onClick, delay }) {
  return (
    <div className={s.statCard} style={{ animationDelay: delay }} onClick={onClick}
      role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className={s.statTop}>
        <div className={s.statIconWrap} style={{ background: `${color}18` }}>
          <Ic d={ICON.chart} size={14} stroke={color} />
        </div>
        {up !== null && up !== undefined ? (
          <span className={`${s.statBadge} ${up ? s.statUp : s.statDown}`}>
            <Ic d={up ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} size={10} stroke="currentColor" />
            {Math.abs(change)}%
          </span>
        ) : (
          <span className={s.statFlat}>—</span>
        )}
      </div>
      <div className={s.statBody}>
        <p className={s.statLabel}>{label}</p>
        <p className={s.statValue} style={{ color }}>
          <Counter target={typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''))}
            prefix={prefix || ''} suffix={suffix || ''} />
        </p>
      </div>
      <SparkLine data={spark} color={color} />
      {onClick && (
        <div className={s.statFooter}>
          <span>View details</span>
          <Ic d="M9 18l6-6-6-6" size={11} stroke="#9CA3AF" />
        </div>
      )}
    </div>
  )
}

/* ── Preview modal ─────────────────────────────────────────────── */
const PreviewModal = ({ product, onClose, onEdit }) => (
  <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={s.modal}>
      <div className={s.modalHead}>
        <span className={s.modalTitle}>Product Preview</span>
        <button className={s.modalClose} onClick={onClose}><Ic d={ICON.close} size={18} /></button>
      </div>
      <div className={s.modalBody}>
        <div className={s.previewImgBox}>
          {product.img
            ? <img src={product.img} alt={product.name} className={s.previewImg} />
            : <div className={s.previewImgPlaceholder}>
                <Ic d={ICON.img} size={36} stroke="#9CA3AF" />
                <span>No image uploaded</span>
              </div>}
        </div>
        <div className={s.previewName}>{product.name}</div>
        <div className={s.previewMeta}>
          <span className={s.categoryBadge}>{product.category}</span>
          {product.variants && <span className={s.variantBadge}>Has variants</span>}
        </div>
        <div className={s.previewStats}>
          {[
            { label: 'Price',     value: fmt(product.price) },
            { label: 'Stock',     value: product.stock },
            { label: 'Units Sold',value: product.sold },
          ].map(stat => (
            <div key={stat.label} className={s.previewStat}>
              <div className={s.previewStatVal}>{stat.value}</div>
              <div className={s.previewStatLbl}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className={s.previewStatusRow}>
          <span className={`${s.statusBadge} ${product.stock === 0 ? s.statusOut : s.statusIn}`}>
            {product.stock === 0 ? 'Out of stock' : 'In stock'}
          </span>
          {product.stock > 0 && product.stock <= 10 && (
            <span className={s.lowStockWarn}>⚠ Low stock</span>
          )}
        </div>
      </div>
      <div className={s.modalFooter}>
        <button className={s.btnGhost} onClick={onClose}>Close</button>
        <button className={s.btnPrimary} onClick={onEdit}>
          <Ic d={ICON.edit} size={13} stroke="#fff" /> Edit Product
        </button>
      </div>
    </div>
  </div>
)

/* ── Empty state ───────────────────────────────────────────────── */
const EmptyState = ({ onAdd, onImport }) => (
  <div className={s.emptyState}>
    <div className={s.emptyIllo}>
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        <rect x="10" y="22" width="70" height="52" rx="7" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
        <rect x="19" y="33" width="24" height="24" rx="4" fill="#A7F3D0" />
        <path d="M27 45h8M31 41v8" stroke="#2DBD97" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="50" y="33" width="22" height="5" rx="2.5" fill="#A7F3D0" />
        <rect x="50" y="42" width="16" height="4" rx="2" fill="#D1FAE5" />
        <rect x="50" y="50" width="20" height="4" rx="2" fill="#D1FAE5" />
      </svg>
    </div>
    <h3>Add your first product</h3>
    <p>Choose how you want to add products to your store</p>
    <div className={s.emptyActions}>
      <button className={s.btnOutline} onClick={onImport}>
        <Ic d={ICON.import} size={14} /> Import Products
      </button>
      <button className={s.btnPrimary} onClick={onAdd}>
        <Ic d={ICON.plus} size={14} stroke="#fff" /> Add New Product
      </button>
    </div>
  </div>
)

/* ── Spark data per stat ───────────────────────────────────────── */
const SPARK_RETAIL  = [310,380,290,450,410,520,470,600,540,680,620,740]
const SPARK_STOCK   = [820,790,850,810,780,760,800,770,790,750,780,760]
const SPARK_SOLD    = [18,24,19,31,27,38,33,44,39,51,46,58]
const SPARK_OUT     = [2,1,3,2,4,3,5,4,3,5,4,6]

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Products() {
  const [products,       setProducts]       = useState(SAMPLE_PRODUCTS)
  const [modal,          setModal]          = useState(null)
  const [previewProduct, setPreviewProduct] = useState(null)
  const [search,         setSearch]         = useState('')
  const [showSearchDrop, setShowSearchDrop] = useState(false)
  const [viewMode,       setViewMode]       = useState('table') // table | grid
  const [statusFilter,   setStatusFilter]   = useState('all')  // all | in | out | low
  const [sortBy,         setSortBy]         = useState('name')
  const [visible,        setVisible]        = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  useEffect(() => {
    if (location.state?.openModal) {
      setModal(location.state.openModal)
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  /* ── Derived stats ─────────────────────────────────────────── */
  const totalRetail    = products.reduce((a, p) => a + p.price * p.stock, 0)
  const totalInventory = products.reduce((a, p) => a + p.stock, 0)
  const totalSold      = products.reduce((a, p) => a + p.sold, 0)
  const outOfStock     = products.filter(p => p.stock === 0).length
  const lowStock       = products.filter(p => p.stock > 0 && p.stock <= 10).length

  /* ── Filter + sort ─────────────────────────────────────────── */
  const dropMatches = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  const filtered = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => {
      if (statusFilter === 'in')  return p.stock > 10
      if (statusFilter === 'out') return p.stock === 0
      if (statusFilter === 'low') return p.stock > 0 && p.stock <= 10
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price')  return b.price - a.price
      if (sortBy === 'stock')  return b.stock - a.stock
      if (sortBy === 'sold')   return b.sold  - a.sold
      return a.name.localeCompare(b.name)
    })

  /* ── CRUD ──────────────────────────────────────────────────── */
  const addProduct = form => setProducts(ps => [...ps, {
    id:       Date.now(),
    name:     form.name     || 'Untitled Product',
    price:    parseFloat(form.price)  || 0,
    stock:    parseInt(form.stock)    || 0,
    sold:     0,
    img:      null,
    category: form.collection || 'General',
    variants: false,
    sku:      `SKU-${Date.now()}`,
  }])

  const deleteProduct = id => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      setProducts(ps => ps.filter(p => p.id !== id))
    }
  }

  /* ── Stat cards config ─────────────────────────────────────── */
  const STATS = [
    {
      label: 'Total Retail Value', value: totalRetail, prefix: '₦', suffix: '',
      change: 12, up: true, color: '#2DBD97', spark: SPARK_RETAIL,
      onClick: () => navigate('/analytics'),
    },
    {
      label: 'Units in Stock', value: totalInventory, prefix: '', suffix: '',
      change: -4, up: false, color: '#1b3b5f', spark: SPARK_STOCK,
      onClick: () => navigate('/inventory'),
    },
    {
      label: 'Total Units Sold', value: totalSold, prefix: '', suffix: '',
      change: 18, up: true, color: '#E8C547', spark: SPARK_SOLD,
      onClick: () => navigate('/analytics'),
    },
    {
      label: 'Out of Stock', value: outOfStock, prefix: '', suffix: '',
      change: null, up: null, color: '#EF4444', spark: SPARK_OUT,
      onClick: () => setStatusFilter('out'),
    },
  ]

  return (
    <div className={`${s.page} ${visible ? s.pageVisible : ''}`}>
      <main className={s.main}>

        {/* ── Topbar ─────────────────────────────────────────── */}
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <h1 className={s.pageTitle}>Products</h1>
            <span className={s.productCount}>{products.length} products</span>
          </div>
          <div className={s.topbarRight}>
            {lowStock > 0 && (
              <button className={s.lowStockAlert} onClick={() => setStatusFilter('low')}>
                ⚠ {lowStock} low stock
              </button>
            )}
            <button className={s.btnExport}>
              <Ic d={ICON.download} size={13} /> Export
            </button>
            <button className={s.btnViewStore}
              onClick={() => window.open('/online-store', '_blank')}>
              <Ic d={ICON.store} size={13} /> View Store
            </button>
          </div>
        </header>

        {/* ── Stat cards ─────────────────────────────────────── */}
        <div className={s.statsRow}>
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={`${i * 60}ms`} />
          ))}
        </div>

        {/* ── Tab bar + actions ──────────────────────────────── */}
        <div className={s.tabBar}>
          <div className={s.tabsLeft}>
            <div className={s.tabs}>
              {['all','in','out','low'].map(f => (
                <button key={f}
                  className={`${s.tab} ${statusFilter === f ? s.tabActive : ''}`}
                  onClick={() => setStatusFilter(f)}>
                  {f === 'all' ? `All (${products.length})` :
                   f === 'in'  ? `In Stock (${products.filter(p=>p.stock>10).length})` :
                   f === 'out' ? `Out of Stock (${outOfStock})` :
                   `Low Stock (${lowStock})`}
                </button>
              ))}
            </div>
          </div>

          <div className={s.tabActions}>
            {/* Search */}
            <div className={s.searchWrap}>
              <Ic d={ICON.search} size={13} stroke="#9CA3AF" />
              <input className={s.searchInput} placeholder="Search products…"
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowSearchDrop(true)}
                onBlur={() => setTimeout(() => setShowSearchDrop(false), 150)} />
              {search && (
                <button className={s.searchClear} onClick={() => setSearch('')}>
                  <Ic d={ICON.close} size={12} stroke="#9CA3AF" />
                </button>
              )}
              {showSearchDrop && (
                <div className={s.searchDrop}>
                  {dropMatches.length === 0 ? (
                    <div className={s.searchDropEmpty}>No products found</div>
                  ) : dropMatches.slice(0, 6).map(p => (
                    <div key={p.id} className={s.searchDropItem}
                      onMouseDown={() => { setSearch(p.name); setShowSearchDrop(false) }}>
                      <div className={s.searchDropThumb}>
                        {p.img ? <img src={p.img} alt={p.name} /> : p.name[0]}
                      </div>
                      <div className={s.searchDropInfo}>
                        <div className={s.searchDropName}>{p.name}</div>
                        <div className={s.searchDropMeta}>{p.category} · {fmt(p.price)}</div>
                      </div>
                      <span className={s.searchDropStock}
                        style={{ color: p.stock === 0 ? '#EF4444' : '#059669' }}>
                        {p.stock === 0 ? 'Out' : `${p.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sort */}
            <select className={s.sortSel} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Name A–Z</option>
              <option value="price">Price ↓</option>
              <option value="stock">Stock ↓</option>
              <option value="sold">Best Sellers</option>
            </select>

            {/* View toggle */}
            <div className={s.viewToggle}>
              <button className={`${s.viewBtn} ${viewMode==='table'?s.viewBtnOn:''}`}
                onClick={() => setViewMode('table')} title="Table view">
                <Ic d={ICON.list} size={13} />
              </button>
              <button className={`${s.viewBtn} ${viewMode==='grid'?s.viewBtnOn:''}`}
                onClick={() => setViewMode('grid')} title="Grid view">
                <Ic d={ICON.grid} size={13} />
              </button>
            </div>

            <button className={s.btnOutline} onClick={() => setModal('import')}>
              <Ic d={ICON.import} size={13} /> Import
            </button>
            <button className={s.btnPrimary} onClick={() => setModal('add')}>
              <Ic d={ICON.plus} size={13} stroke="#fff" /> Add Product
            </button>
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────── */}
        <div className={s.content}>
          {filtered.length === 0 && !search && statusFilter === 'all' ? (
            <EmptyState onAdd={() => setModal('add')} onImport={() => setModal('import')} />
          ) : filtered.length === 0 ? (
            <div className={s.emptyState}>
              <span style={{ fontSize: 40 }}>🔍</span>
              <p style={{ color: '#6B7280', marginTop: 8 }}>
                No products match{search ? ` "${search}"` : ' this filter'}
              </p>
              <button className={s.btnOutline} style={{ marginTop: 12 }}
                onClick={() => { setSearch(''); setStatusFilter('all') }}>
                Reset filters
              </button>
            </div>
          ) : viewMode === 'table' ? (

            /* ── Table view ────────────────────────────────── */
            <div className={s.tableWrap}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Sold</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id} className={s.tableRow}
                      style={{ animationDelay: `${i * 30}ms` }}>
                      <td>
                        <div className={s.productCell}>
                          <div className={s.productThumb}>
                            {p.img ? <img src={p.img} alt={p.name} /> : p.name[0]}
                          </div>
                          <div>
                            <div className={s.productName}>{p.name}</div>
                            <div className={s.productSku}>SKU: {p.sku || '—'}</div>
                            {p.variants && <span className={s.variantBadge}>Has variants</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className={s.categoryBadge}>{p.category}</span></td>
                      <td className={s.priceCell}>{fmt(p.price)}</td>
                      <td>
                        <div className={s.stockCell}>
                          <span className={p.stock === 0 ? s.stockZero : p.stock <= 10 ? s.stockLow : s.stockOk}>
                            {p.stock}
                          </span>
                          {p.stock > 0 && (
                            <div className={s.stockBar}>
                              <div className={s.stockBarFill}
                                style={{
                                  width: `${Math.min((p.stock / 100) * 100, 100)}%`,
                                  background: p.stock <= 10 ? '#EF4444' : '#2DBD97'
                                }} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className={s.soldCell}>{p.sold}</td>
                      <td>
                        <span className={`${s.statusBadge} ${p.stock === 0 ? s.statusOut : p.stock <= 10 ? s.statusLow : s.statusIn}`}>
                          {p.stock === 0 ? 'Out of stock' : p.stock <= 10 ? 'Low stock' : 'In stock'}
                        </span>
                      </td>
                      <td>
                        <div className={s.rowActions}>
                          <button className={s.btnIconSm} title="Edit"
                            onClick={() => setModal('add')}>
                            <Ic d={ICON.edit} size={13} />
                          </button>
                          <button className={s.btnIconSm} title="Preview"
                            onClick={() => setPreviewProduct(p)}>
                            <Ic d={ICON.eye} size={13} />
                          </button>
                          <button className={`${s.btnIconSm} ${s.btnIconDanger}`} title="Delete"
                            onClick={() => deleteProduct(p.id)}>
                            <Ic d={ICON.trash} size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          ) : (

            /* ── Grid view ─────────────────────────────────── */
            <div className={s.productGrid}>
              {filtered.map((p, i) => (
                <div key={p.id} className={s.productCard}
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={s.productCardImg} onClick={() => setPreviewProduct(p)}>
                    {p.img
                      ? <img src={p.img} alt={p.name} />
                      : <div className={s.productCardImgPlaceholder}>{p.name[0]}</div>}
                    <span className={`${s.productCardStatus} ${p.stock === 0 ? s.statusOut : p.stock <= 10 ? s.statusLow : s.statusIn}`}>
                      {p.stock === 0 ? 'Out' : p.stock <= 10 ? 'Low' : 'In stock'}
                    </span>
                  </div>
                  <div className={s.productCardBody}>
                    <p className={s.productCardCat}>{p.category}</p>
                    <p className={s.productCardName}>{p.name}</p>
                    <div className={s.productCardRow}>
                      <span className={s.productCardPrice}>{fmt(p.price)}</span>
                      <span className={s.productCardStock}>{p.stock} left</span>
                    </div>
                    <div className={s.productCardActions}>
                      <button className={s.btnIconSm} onClick={() => setPreviewProduct(p)} title="Preview">
                        <Ic d={ICON.eye} size={13} />
                      </button>
                      <button className={s.btnIconSm} onClick={() => setModal('add')} title="Edit">
                        <Ic d={ICON.edit} size={13} />
                      </button>
                      <button className={`${s.btnIconSm} ${s.btnIconDanger}`} onClick={() => deleteProduct(p.id)} title="Delete">
                        <Ic d={ICON.trash} size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Modals ─────────────────────────────────────────────── */}
      {modal === 'add' && (
        <AddProductModal
          onClose={() => setModal(null)}
          onAdd={form => { addProduct(form); setModal(null) }}
        />
      )}
      {modal === 'import' && <ImportModal onClose={() => setModal(null)} />}
      {previewProduct && (
        <PreviewModal
          product={previewProduct}
          onClose={() => setPreviewProduct(null)}
          onEdit={() => { setPreviewProduct(null); setModal('add') }}
        />
      )}
    </div>
  )
}
