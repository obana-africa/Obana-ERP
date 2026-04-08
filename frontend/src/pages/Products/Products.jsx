import { useState, useRef } from 'react'
import s from './Products.module.css'

// ── Tiny SVG icon helper ─────────────────────────────────
const Ic = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

// ── Sample data ──────────────────────────────────────────
const SAMPLE_PRODUCTS = [
  { id: 1, name: 'Classic Ankara Dress', price: 15000, stock: 12, sold: 3, img: null, category: 'Fashion', variants: true },
  { id: 2, name: 'Leather Crossbody Bag', price: 22000, stock: 5, sold: 8, img: null, category: 'Accessories', variants: false },
  { id: 3, name: 'Shea Butter Body Cream', price: 4500, stock: 0, sold: 24, img: null, category: 'Beauty', variants: false },
]

const SAMPLE_COLLECTIONS = [
  { id: 1, name: 'Summer Collection', products: 6, img: null },
  { id: 2, name: 'Bestsellers', products: 12, img: null },
]

const IMPORT_PLATFORMS = [
  { name: 'Shopify', icon: '' },
  { name: 'WooCommerce', icon: '' },
  { name: 'Jumia', icon: '' },
  { name: 'Konga', icon: '' },
  { name: 'Instagram', icon: '' },
  { name: 'CSV File', icon: '' },
]

// ── Reusable Modal ───────────────────────────────────────
function Modal({ title, onClose, children, wide }) {
  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${s.modal} ${wide ? s.modalWide : ''}`}>
        <div className={s.modalHead}>
          <span className={s.modalTitle}>{title}</span>
          <button className={s.modalClose} onClick={onClose}>
            <Ic size={18}><path d="M18 6 6 18M6 6l12 12" /></Ic>
          </button>
        </div>
        <div className={s.modalBody}>{children}</div>
      </div>
    </div>
  )
}

// ── Add Product Wizard ───────────────────────────────────
function AddProductModal({ onClose, onAdd }) {
  const [step, setStep] = useState(1)
  const [productType, setProductType] = useState('regular')
  const [images, setImages] = useState([])
  const [variants, setVariants] = useState([{ option: 'Size', values: '' }, { option: 'Color', values: '' }])
  const [form, setForm] = useState({
    name: '', shortDesc: '', longDesc: '', collection: '', price: '',
    costPrice: '', discountPrice: '', stock: '', unit: 'pc', barcode: ''
  })
  const fileRef = useRef()

  const handleImage = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      setImages(prev => [...prev, { url, name: f.name }])
    })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    files.forEach(f => {
      const url = URL.createObjectURL(f)
      setImages(prev => [...prev, { url, name: f.name }])
    })
  }

  const STEPS = ['Product Type', 'Details & Images', 'Pricing', 'Inventory']

  return (
    <Modal title="Add New Product" onClose={onClose} wide>
      <div className={s.stepBar}>
        {STEPS.map((label, i) => (
          <div key={i} className={`${s.stepItem} ${step === i + 1 ? s.stepActive : ''} ${step > i + 1 ? s.stepDone : ''}`}>
            <div className={s.stepCircle}>{step > i + 1 ? '✓' : i + 1}</div>
            <span className={s.stepLabel}>{label}</span>
            {i < STEPS.length - 1 && <div className={s.stepLine} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className={s.stepContent}>
          <p className={s.stepHint}>Is this a regular product or does it have variations like colours, sizes, etc?</p>
          <div className={s.typeGrid}>
            <button className={`${s.typeCard} ${productType === 'regular' ? s.typeCardActive : ''}`}
              onClick={() => setProductType('regular')}>
              <div className={s.typeIcon}>
                <Ic size={28}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></Ic>
              </div>
              <strong>Regular Product</strong>
              <span>This is a product without variations</span>
            </button>
            <button className={`${s.typeCard} ${productType === 'variants' ? s.typeCardActive : ''}`}
              onClick={() => setProductType('variants')}>
              <div className={s.typeIcon}>
                <Ic size={28}><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></Ic>
              </div>
              <strong>Product with Variations</strong>
              <span>The product has different colours, sizes, etc.</span>
            </button>
          </div>
          {productType === 'variants' && (
            <div className={s.variantsSection}>
              <h4 className={s.sectionLabel}>Configure Variants</h4>
              {variants.map((v, i) => (
                <div key={i} className={s.variantRow}>
                  <input className={s.input} placeholder="Option name (e.g. Size)"
                    value={v.option} onChange={e => {
                      const nv = [...variants]; nv[i].option = e.target.value; setVariants(nv)
                    }} />
                  <input className={s.input} placeholder="Values comma-separated (e.g. S, M, L, XL)"
                    value={v.values} onChange={e => {
                      const nv = [...variants]; nv[i].values = e.target.value; setVariants(nv)
                    }} />
                  <button className={s.btnIconDanger} onClick={() => setVariants(variants.filter((_, j) => j !== i))}>
                    <Ic size={14}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></Ic>
                  </button>
                </div>
              ))}
              <button className={s.btnOutlineSmall} onClick={() => setVariants([...variants, { option: '', values: '' }])}>
                + Add Variant Option
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className={s.stepContent}>
          <div className={s.field}>
            <label className={s.label}>Product Name *</label>
            <input className={s.input} placeholder="Enter product name"
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className={s.field}>
            <label className={s.label}>
              Product Images (optional)
              <span className={s.labelHint}>Recommended: 930×1163px · Max 5mb</span>
            </label>
            <div className={s.dropzone} onDrop={handleDrop}
              onDragOver={e => e.preventDefault()} onClick={() => fileRef.current.click()}>
              {images.length === 0 ? (
                <>
                  <Ic size={32}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Ic>
                  <p>Drag or drop image</p>
                  <span>Recommended dimension: 930px × 1163px · Max file size: 5mb</span>
                </>
              ) : (
                <div className={s.imageGrid}>
                  {images.map((img, i) => (
                    <div key={i} className={s.imageThumb}>
                      <img src={img.url} alt={img.name} />
                      <button className={s.removeImg} onClick={e => {
                        e.stopPropagation(); setImages(images.filter((_, j) => j !== i))
                      }}>×</button>
                    </div>
                  ))}
                  <div className={s.addMoreImg}>
                    <Ic size={20}><path d="M12 5v14M5 12h14" /></Ic>
                  </div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" hidden onChange={handleImage} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Short Description (Optional)</label>
            <input className={s.input} placeholder="Brief product summary"
              value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Long Description (Optional)</label>
            <div className={s.richBar}>
              {['B', 'I', 'U', 'S', '❝', '≡', '⋮≡', '⋮⋮'].map(b => (
                <button key={b} className={s.richBtn}>{b}</button>
              ))}
            </div>
            <textarea className={s.textarea} placeholder="Detailed product description..."
              value={form.longDesc} onChange={e => setForm({ ...form, longDesc: e.target.value })} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Select Collection</label>
            <select className={s.input} value={form.collection}
              onChange={e => setForm({ ...form, collection: e.target.value })}>
              <option value="">Select collections</option>
              {SAMPLE_COLLECTIONS.map(c => <option key={c.id}>{c.name}</option>)}
              <option value="__new">+ Create New Collection</option>
            </select>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={s.stepContent}>
          <div className={s.field}>
            <label className={s.label}>Pricing *</label>
            <div className={s.inputPrefix}>
              <span>₦</span>
              <input type="number" className={s.input} placeholder="0.00"
                value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
          </div>
          <div className={s.fieldRow2}>
            <div className={s.field}>
              <label className={s.label}>Cost Price</label>
              <div className={s.inputPrefix}>
                <span>₦</span>
                <input type="number" className={s.input} placeholder="0.00"
                  value={form.costPrice} onChange={e => setForm({ ...form, costPrice: e.target.value })} />
              </div>
            </div>
            <div className={s.field}>
              <label className={s.label}>Discounted Price (Optional)</label>
              <div className={s.inputPrefix}>
                <span>₦</span>
                <input type="number" className={s.input} placeholder="0.00"
                  value={form.discountPrice} onChange={e => setForm({ ...form, discountPrice: e.target.value })} />
              </div>
            </div>
          </div>
          {form.costPrice && form.price && (
            <div className={s.profitBadge}>
              Estimated profit: ₦{(parseFloat(form.price || 0) - parseFloat(form.costPrice || 0)).toLocaleString()}
            </div>
          )}
          <div className={s.field} style={{ marginTop: '1.25rem' }}>
            <label className={s.label}>Size Chart (Optional)</label>
            <button className={s.btnOutlineSmall}>+ Add Size Chart</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={s.stepContent}>
          <h4 className={s.sectionLabel}>Product Inventory</h4>
          <div className={s.field}>
            <label className={s.label}>Stock Quantity *</label>
            <input type="number" className={s.input} placeholder="Enter quantity"
              value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Unit (Optional)</label>
            <input className={s.input} placeholder="pc"
              value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Barcode (Optional)</label>
            <input className={s.input} placeholder="Focus here to scan barcode"
              value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} />
            <span className={s.fieldHint}>Focus here to scan barcode</span>
          </div>
          <div className={s.field}>
            <div className={s.toggleRow}>
              <div>
                <span className={s.label} style={{ display: 'block' }}>Track order quantity</span>
                <span className={s.fieldHint}>Enable quantity tracking for this product</span>
              </div>
              <label className={s.toggle}>
                <input type="checkbox" defaultChecked />
                <span className={s.toggleSlider} />
              </label>
            </div>
          </div>
        </div>
      )}

      <div className={s.modalFooter}>
        <div className={s.footerLeft}>
          {step > 1 && <button className={s.btnGhost} onClick={() => setStep(step - 1)}>← Back</button>}
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
        </div>
        <div className={s.footerRight}>
          <button className={s.btnOutline}>Preview</button>
          {step < 4
            ? <button className={s.btnPrimary} onClick={() => setStep(step + 1)}>Next →</button>
            : <button className={s.btnPrimary} onClick={() => { onAdd(form); onClose() }}>Add Product</button>
          }
        </div>
      </div>
    </Modal>
  )
}

// ── Import Products Modal ────────────────────────────────
function ImportModal({ onClose }) {
  const [selected, setSelected] = useState(null)
  const [file, setFile] = useState(null)
  const fileRef = useRef()

  return (
    <Modal title="Import Products" onClose={onClose}>
      <p className={s.importHint}>Choose a platform to import your products from</p>
      <div className={s.platformGrid}>
        {IMPORT_PLATFORMS.map(p => (
          <button key={p.name}
            className={`${s.platformCard} ${selected === p.name ? s.platformActive : ''}`}
            onClick={() => setSelected(p.name)}>
            <span className={s.platformEmoji}>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      {selected === 'CSV File' && (
        <div className={s.csvZone} onClick={() => fileRef.current.click()}>
          <Ic size={24}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></Ic>
          <p>{file ? file.name : 'Click to upload CSV file'}</p>
          <input ref={fileRef} type="file" accept=".csv" hidden onChange={e => setFile(e.target.files[0])} />
        </div>
      )}
      {selected && selected !== 'CSV File' && (
        <div className={s.importInfo}>
          <Ic size={15}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ic>
          You'll be redirected to connect your {selected} account and select products to import.
        </div>
      )}
      <div className={s.modalFooter}>
        <button className={s.btnGhost} onClick={onClose}>Cancel</button>
        <button className={s.btnPrimary} disabled={!selected}>
          {selected === 'CSV File' ? 'Upload & Import' : `Connect ${selected || '...'}`}
        </button>
      </div>
    </Modal>
  )
}

// ── Collection Modal ─────────────────────────────────────
function CollectionModal({ collection, onClose, onSave }) {
  const [name, setName] = useState(collection?.name || '')
  const [desc, setDesc] = useState(collection?.desc || '')
  const [img, setImg] = useState(collection?.img || null)
  const fileRef = useRef()

  return (
    <Modal title={collection ? 'Edit Collection' : 'Create Collection'} onClose={onClose}>
      <div className={s.field}>
        <label className={s.label}>Collection Image</label>
        <div className={s.collImgZone} onClick={() => fileRef.current.click()}>
          {img
            ? <img src={img} alt="collection" className={s.collImgPreview} />
            : <>
                <Ic size={28}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Ic>
                <p>Click to upload collection image</p>
                <span>Recommended: 1200×800px</span>
              </>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden
          onChange={e => { const f = e.target.files[0]; if (f) setImg(URL.createObjectURL(f)) }} />
      </div>
      <div className={s.field}>
        <label className={s.label}>Collection Name *</label>
        <input className={s.input} placeholder="e.g. Summer Collection"
          value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className={s.field}>
        <label className={s.label}>Description (Optional)</label>
        <textarea className={s.textarea} placeholder="Describe this collection..."
          value={desc} onChange={e => setDesc(e.target.value)} style={{ height: 80 }} />
      </div>
      <div className={s.modalFooter}>
        <button className={s.btnGhost} onClick={onClose}>Cancel</button>
        <button className={s.btnPrimary} disabled={!name}
          onClick={() => { onSave({ name, desc, img }); onClose() }}>
          {collection ? 'Save Changes' : 'Create Collection'}
        </button>
      </div>
    </Modal>
  )
}

// ── Empty State ──────────────────────────────────────────
function EmptyState({ tab, onAdd, onImport }) {
  return (
    <div className={s.emptyState}>
      <div className={s.emptyIllo}>
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <rect x="10" y="22" width="70" height="52" rx="7" fill="#edfaf5" stroke="#19a97b" strokeWidth="1.5" />
          <rect x="19" y="33" width="24" height="24" rx="4" fill="#c4ead8" />
          <path d="M27 45h8M31 41v8" stroke="#19a97b" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="50" y="33" width="22" height="5" rx="2.5" fill="#c4ead8" />
          <rect x="50" y="42" width="16" height="4" rx="2" fill="#ddf2ea" />
          <rect x="50" y="50" width="20" height="4" rx="2" fill="#ddf2ea" />
          <circle cx="45" cy="14" r="8" fill="#19a97b" fillOpacity="0.12" stroke="#19a97b" strokeWidth="1.5" />
          <path d="M42 14h6M45 11v6" stroke="#19a97b" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      {tab === 'products' ? (
        <>
          <h3>Add new products to your store</h3>
          <p>Choose how you want to add products</p>
          <div className={s.emptyActions}>
            <button className={s.btnOutline} onClick={onImport}>
              <Ic size={14}><path d="M8 17l4 4 4-4M12 12v9" /><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" /></Ic>
              Import Products
            </button>
            <button className={s.btnPrimary} onClick={onAdd}>
              <Ic size={14}><path d="M12 5v14M5 12h14" /></Ic>
              Add New Product
            </button>
          </div>
        </>
      ) : (
        <>
          <h3>Collections</h3>
          <p>Every collection created will appear here</p>
          <button className={s.btnPrimary} onClick={onAdd}>
            <Ic size={14}><path d="M12 5v14M5 12h14" /></Ic>
            Create Collection
          </button>
        </>
      )}
    </div>
  )
}

// ── Main Dashboard ───────────────────────────────────────
export default function ProductsDashboard() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState(SAMPLE_PRODUCTS)
  const [collections, setCollections] = useState(SAMPLE_COLLECTIONS)
  const [modal, setModal] = useState(null)
  const [editColl, setEditColl] = useState(null)
  const [search, setSearch] = useState('')
  // const [sidebarOpen, setSidebarOpen] = useState(true)

  const totalRetail = products.reduce((a, p) => a + p.price * p.stock, 0)
  const totalInventory = products.reduce((a, p) => a + p.stock, 0)
  const totalSold = products.reduce((a, p) => a + p.sold, 0)
  const outOfStock = products.filter(p => p.stock === 0).length

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={s.page}>
      {/* ── Main ── */}
      <main className={s.main}>

        {/* Topbar */}
        <header className={s.topbar}>
          <div className={s.topbarLeft}>
            {/* <button className={s.hamburger} onClick={() => setSidebarOpen(v => !v)}>
              <Ic size={18}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></Ic>
            </button> */}    
            <h1 className={s.pageTitle}>Products</h1>
          </div>
          <div className={s.topbarRight}>
            <button className={s.btnViewStore}>
              <Ic size={13}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></Ic>
              View Store
            </button>
            <button className={s.btnIcon} title="Notifications">
              <Ic size={17}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ic>
            </button>
            <div className={s.avatar}></div>
          </div>
        </header>

        {/* Stats */}
        <div className={s.statsRow}>
          {[
            { label: 'Total Retail Value', value: `₦${totalRetail.toLocaleString()}`, icon: '', color: '#edfaf5', iconColor: '#19a97b' },
            { label: 'Total Inventory Value', value: `₦${totalInventory.toLocaleString()}`, icon: '', color: '#fef9ec', iconColor: '#d4a017' },
            { label: 'Products Sold', value: totalSold, icon: '', color: '#eef4ff', iconColor: '#3b5fe2' },
            { label: 'Out of Stock', value: outOfStock, icon: '', color: '#fff3f3', iconColor: '#e24b4a' },
          ].map(stat => (
            <div key={stat.label} className={s.statCard}>
              <div className={s.statRow}>
                <span className={s.statValue}>{stat.value}</span>
                <div className={s.statBadge} style={{ background: stat.color, color: stat.iconColor }}>
                  {stat.icon}
                </div>
              </div>
              <span className={s.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className={s.tabBar}>
          <div className={s.tabs}>
            <button className={`${s.tab} ${tab === 'products' ? s.tabActive : ''}`}
              onClick={() => setTab('products')}>Products</button>
            <button className={`${s.tab} ${tab === 'collections' ? s.tabActive : ''}`}
              onClick={() => setTab('collections')}>Collections</button>
          </div>
          <div className={s.tabActions}>
            {tab === 'products' && (
              <>
                <div className={s.searchWrap}>
                  <Ic size={13}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ic>
                  <input className={s.searchInput} placeholder="Search products..."
                    value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <button className={s.btnOutline} onClick={() => setModal('import')}>
                  <Ic size={13}><path d="M8 17l4 4 4-4M12 12v9" /><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" /></Ic>
                  Import
                </button>
                <button className={s.btnPrimary} onClick={() => setModal('add')}>
                  <Ic size={13}><path d="M12 5v14M5 12h14" /></Ic>
                  Add Product
                </button>
              </>
            )}
            {tab === 'collections' && (
              <button className={s.btnPrimary} onClick={() => { setEditColl(null); setModal('collection') }}>
                <Ic size={13}><path d="M12 5v14M5 12h14" /></Ic>
                Create Collection
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={s.content}>

          {tab === 'products' && (
            filtered.length === 0 && !search ? (
              <EmptyState tab="products" onAdd={() => setModal('add')} onImport={() => setModal('import')} />
            ) : filtered.length === 0 ? (
              <div className={s.emptyState}>
                <p style={{ color: '#888' }}>No products match "<strong>{search}</strong>"</p>
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
                        <td className={s.priceCell}>₦{p.price.toLocaleString()}</td>
                        <td>{p.stock}</td>
                        <td>{p.sold}</td>
                        <td>
                          <span className={`${s.statusBadge} ${p.stock === 0 ? s.statusOut : s.statusIn}`}>
                            {p.stock === 0 ? 'Out of stock' : 'In stock'}
                          </span>
                        </td>
                        <td>
                          <div className={s.rowActions}>
                            <button className={s.btnIconSm} title="Edit">
                              <Ic size={13}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Ic>
                            </button>
                            <button className={s.btnIconSm} title="Delete"
                              onClick={() => setProducts(products.filter(x => x.id !== p.id))}>
                              <Ic size={13}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Ic>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {tab === 'collections' && (
            collections.length === 0 ? (
              <EmptyState tab="collections" onAdd={() => { setEditColl(null); setModal('collection') }} />
            ) : (
              <div className={s.collGrid}>
                {collections.map(c => (
                  <div key={c.id} className={s.collCard}>
                    <div className={s.collCover}>
                      {c.img
                        ? <img src={c.img} alt={c.name} />
                        : <div className={s.collPlaceholder}>
                            <Ic size={32}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Ic>
                          </div>
                      }
                      <div className={s.collOverlay}>
                        <button className={s.collAction}
                          onClick={() => { setEditColl(c); setModal('editCollection') }}>
                          <Ic size={13}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Ic>
                          Edit
                        </button>
                        <button className={`${s.collAction} ${s.collActionDanger}`}
                          onClick={() => setCollections(collections.filter(x => x.id !== c.id))}>
                          <Ic size={13}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></Ic>
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className={s.collInfo}>
                      <span className={s.collName}>{c.name}</span>
                      <span className={s.collCount}>{c.products} products</span>
                    </div>
                  </div>
                ))}
                <button className={s.collAddCard}
                  onClick={() => { setEditColl(null); setModal('collection') }}>
                  <Ic size={26}><path d="M12 5v14M5 12h14" /></Ic>
                  <span>New Collection</span>
                </button>
              </div>
            )
          )}
        </div>
      </main>

      {/* Modals */}
      {modal === 'add' && (
        <AddProductModal onClose={() => setModal(null)}
          onAdd={(form) => setProducts([...products, {
            id: Date.now(), name: form.name || 'Untitled Product',
            price: parseFloat(form.price) || 0, stock: parseInt(form.stock) || 0,
            sold: 0, img: null, category: form.collection || 'General', variants: false
          }])} />
      )}
      {modal === 'import' && <ImportModal onClose={() => setModal(null)} />}
      {(modal === 'collection' || modal === 'editCollection') && (
        <CollectionModal
          collection={modal === 'editCollection' ? editColl : null}
          onClose={() => setModal(null)}
          onSave={(data) => {
            if (modal === 'editCollection') {
              setCollections(collections.map(c => c.id === editColl.id ? { ...c, ...data } : c))
            } else {
              setCollections([...collections, { id: Date.now(), products: 0, ...data }])
            }
          }} />
      )}
    </div>
  )
}
