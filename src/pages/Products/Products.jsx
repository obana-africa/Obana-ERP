import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import s from './Products.module.css'
import { fmt } from '../../utils/formatters'
import { SAMPLE_PRODUCTS } from '../../data/products'
import AddProductModal from './components/AddProductModal'
import ImportModal     from './components/ImportModal'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Icon paths ────────────────────────────────────────────
const ICON = {
  plus:   'M12 5v14M5 12h14',
  edit:   ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  eye:    ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  trash:  ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  search: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  import: ['M8 17l4 4 4-4M12 12v9','M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29'],
  store:  ['M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6','M15 3h6v6','M10 14L21 3'],
  bell:   ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  box:    'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  img:    ['M3 3h18v18H3z','M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z','M21 15l-5-5L5 21'],
  close:  'M18 6L6 18M6 6l12 12',
}

// ── Empty state ───────────────────────────────────────────
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
        <circle cx="45" cy="14" r="8" fill="#2DBD97" fillOpacity="0.12" stroke="#2DBD97" strokeWidth="1.5" />
        <path d="M42 14h6M45 11v6" stroke="#2DBD97" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </div>
    <h3>Add new products to your store</h3>
    <p>Choose how you want to add products</p>
    <div className={s.emptyActions}>
      <button className={s.btnOutline} onClick={onImport}>
        <Ic d={ICON.import} size={14} /> Import Products
      </button>
      <button className={s.btnPrimary} onClick={onAdd}>
        <Ic d={ICON.plus} size={14} stroke="#f8f2f2" /> Add New Product
      </button>
    </div>
  </div>
)

// ── Product preview modal ─────────────────────────────────
const PreviewModal = ({ product, onClose, onEdit }) => (
  <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={s.modal}>
      <div className={s.modalHead}>
        <span className={s.modalTitle}>Product Preview</span>
        <button className={s.modalClose} onClick={onClose}>
          <Ic d={ICON.close} size={18} />
        </button>
      </div>
      <div className={s.modalBody}>
        <div className={s.previewImgBox}>
          {product.img
            ? <img src={product.img} alt={product.name} className={s.previewImg} />
            : <div className={s.previewImgPlaceholder}>
                <Ic d={ICON.img} size={36} stroke="#9CA3AF" />
                <span>No image uploaded</span>
              </div>
          }
        </div>
        <div className={s.previewName}>{product.name}</div>
        <div className={s.previewMeta}>
          <span className={s.categoryBadge}>{product.category}</span>
          {product.variants && <span className={s.variantBadge}>Has variants</span>}
        </div>
        <div className={s.previewStats}>
          {[
            { label:'Price',      value: fmt(product.price) },
            { label:'Stock',      value: product.stock      },
            { label:'Units Sold', value: product.sold       },
          ].map(stat => (
            <div key={stat.label} className={s.previewStat}>
              <div className={s.previewStatVal}>{stat.value}</div>
              <div className={s.previewStatLbl}>{stat.label}</div>
            </div>
          ))}
        </div>
        <div className={s.previewStatusRow}>
          <span className={`${s.statusBadge} ${product.stock===0?s.statusOut:s.statusIn}`}>
            {product.stock === 0 ? 'Out of stock' : 'In stock'}
          </span>
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

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Products() {
  const [products,       setProducts]       = useState(SAMPLE_PRODUCTS)
  const [modal,          setModal]          = useState(null)
  const [previewProduct, setPreviewProduct] = useState(null)
  const [search,         setSearch]         = useState('')
  const [showSearchDrop, setShowSearchDrop] = useState(false)

  const location = useLocation()

  // Auto-open modal when navigated here from Quick Actions
  useEffect(() => {
    if (location.state?.openModal) {
      setModal(location.state.openModal)
      // Clear the state so refreshing doesn't re-open it
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  // ── Derived stats ─────────────────────────────────────
  const totalRetail    = products.reduce((a,p) => a + p.price * p.stock, 0)
  const totalInventory = products.reduce((a,p) => a + p.stock, 0)
  const totalSold      = products.reduce((a,p) => a + p.sold,  0)
  const outOfStock     = products.filter(p => p.stock === 0).length

  const dropMatches = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // ── CRUD ─────────────────────────────────────────────
  const addProduct = form => setProducts(ps => [...ps, {
    id:       Date.now(),
    name:     form.name     || 'Untitled Product',
    price:    parseFloat(form.price)   || 0,
    stock:    parseInt(form.stock)     || 0,
    sold:     0,
    img:      null,
    category: form.collection || 'General',
    variants: false,
    sku:      `SKU-${Date.now()}`,
  }])

  const deleteProduct = id => setProducts(ps => ps.filter(p => p.id !== id))

  const STATS = [
    { label:'Total Retail Value',     value:fmt(totalRetail),    accent:'#2DBD97', icon:ICON.box   },
    { label:'Total Units in Stock',   value:totalInventory,      accent:'#E8C547', icon:ICON.box   },
    { label:'Products Sold',          value:totalSold,           accent:'#3B82F6', icon:ICON.store },
    { label:'Out of Stock',           value:outOfStock,          accent:'#EF4444', icon:ICON.bell  },
  ]

  return (
    <div className={s.page}>
      <main className={s.main}>

        {/* Topbar */}
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            <h1 className={s.pageTitle}>Products</h1>
          </div>
          <div className={s.topbarRight}>
            <button className={s.btnViewStore} onClick={() => window.open('/online-store','_blank')}>
              <Ic d={ICON.store} size={13} /> View Store
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className={s.statsRow}>
          {STATS.map(stat => (
            <div key={stat.label} className={s.statCard}>
              <div className={s.statRow}>
                <span className={s.statValue}>{stat.value}</span>
                <Ic d={stat.icon} size={18} stroke={stat.accent} />
              </div>
              <span className={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tab bar + actions */}
        <div className={s.tabBar}>
          <div className={s.tabs}>
            <button className={`${s.tab} ${s.tabActive}`}>Products</button>
          </div>
          <div className={s.tabActions}>
            <div className={s.searchWrap}>
              <Ic d={ICON.search} size={13} stroke="#9CA3AF" />
              <input className={s.searchInput} placeholder="Search products…"
                value={search} onChange={e => setSearch(e.target.value)}
                onFocus={() => setShowSearchDrop(true)}
                onBlur={() => setTimeout(() => setShowSearchDrop(false), 150)} />

              {showSearchDrop && (
                <div className={s.searchDrop}>
                  {dropMatches.length === 0 ? (
                    <div className={s.searchDropEmpty}>No products found</div>
                  ) : dropMatches.map(p => (
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
                        style={{ color: p.stock===0 ? '#EF4444' : '#059669' }}>
                        {p.stock===0 ? 'Out of stock' : `${p.stock} in stock`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className={s.btnOutline} onClick={() => setModal('import')}>
              <Ic d={ICON.import} size={13} /> Import
            </button>
            <button className={s.btnPrimary} onClick={() => setModal('add')}>
              <Ic d={ICON.plus} size={13}  /> Add Product
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={s.content}>
          {filtered.length === 0 && !search ? (
            <EmptyState
              onAdd={() => setModal('add')}
              onImport={() => setModal('import')}
            />
          ) : filtered.length === 0 ? (
            <div className={s.emptyState}>
              <p style={{ color:'#9CA3AF' }}>No products match "<strong>{search}</strong>"</p>
            </div>
          ) : (
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
                  {filtered.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className={s.productCell}>
                          <div className={s.productThumb}>
                            {p.img ? <img src={p.img} alt={p.name} /> : p.name[0]}
                          </div>
                          <div>
                            <div className={s.productName}>{p.name}</div>
                            {p.variants && <span className={s.variantBadge}>Has variants</span>}
                          </div>
                        </div>
                      </td>
                      <td><span className={s.categoryBadge}>{p.category}</span></td>
                      <td className={s.priceCell}>{fmt(p.price)}</td>
                      <td>{p.stock}</td>
                      <td>{p.sold}</td>
                      <td>
                        <span className={`${s.statusBadge} ${p.stock===0?s.statusOut:s.statusIn}`}>
                          {p.stock === 0 ? 'Out of stock' : 'In stock'}
                        </span>
                      </td>
                      <td>
                        <div className={s.rowActions}>
                          <button className={s.btnIconSm} title="Edit" onClick={() => setModal('add')}>
                            <Ic d={ICON.edit} size={13} />
                          </button>
                          <button className={s.btnIconSm} title="Preview" onClick={() => setPreviewProduct(p)}>
                            <Ic d={ICON.eye} size={13} />
                          </button>
                          <button className={s.btnIconSm} title="Delete" onClick={() => deleteProduct(p.id)}>
                            <Ic d={ICON.trash} size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {modal === 'add' && (
        <AddProductModal
          onClose={() => setModal(null)}
          onAdd={form => { addProduct(form); setModal(null) }}
        />
      )}
      {modal === 'import' && (
        <ImportModal onClose={() => setModal(null)} />
      )}
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
