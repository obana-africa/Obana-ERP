import { useState, useRef } from 'react'
import styles from './Collections.module.css'

// ── Icon helper ──────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Helpers ──────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`
const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

// ── Static data ──────────────────────────────────────────
const LOCATIONS = [
  { id: 'loc-1', name: 'Main Store',   city: 'Lagos',       type: 'retail',    active: true  },
  { id: 'loc-2', name: 'POS Outlet',   city: 'Abuja',       type: 'pos',       active: true  },
  { id: 'loc-3', name: 'Warehouse',    city: 'Lagos',       type: 'warehouse', active: true  },
  { id: 'loc-4', name: 'POS Kiosk',    city: 'Kano',        type: 'pos',       active: true  },
  { id: 'loc-5', name: 'Pop-up Store', city: 'Port Harcourt', type: 'retail',  active: false },
]

const LOCATION_TYPE_CFG = {
  retail:    { label: 'Retail Store', bg: '#EFF6FF', color: '#1D4ED8' },
  pos:       { label: 'POS Terminal', bg: '#F0FDF4', color: '#15803D' },
  warehouse: { label: 'Warehouse',    bg: '#FEF3C7', color: '#B45309' },
}

const ALL_PRODUCTS = [
  { id: 'p1', sku: 'AKR-001', name: 'Classic Ankara Dress',   price: 15000, category: 'Fashion',    img: null },
  { id: 'p2', sku: 'LCB-002', name: 'Leather Crossbody Bag',  price: 22000, category: 'Accessories',img: null },
  { id: 'p3', sku: 'SHB-003', name: 'Premium Shea Butter',    price: 4500,  category: 'Beauty',     img: null },
  { id: 'p4', sku: 'KFT-004', name: "Men's Kaftan Set",        price: 28000, category: 'Fashion',    img: null },
  { id: 'p5', sku: 'GFT-005', name: 'Ankara Gift Set Bundle', price: 35000, category: 'Fashion',    img: null },
  { id: 'p6', sku: 'NBC-006', name: 'Natural Body Cream',     price: 3800,  category: 'Beauty',     img: null },
]

// Seed: each collection has locationInventory keyed by locationId
const SEED_COLLECTIONS = [
  {
    id: 'col-1',
    name: 'Summer Collection',
    desc: 'Bright and breezy looks for the season',
    status: 'active',
    img: null,
    productIds: ['p1', 'p2', 'p5'],
    locationInventory: {
      'loc-1': { 'p1': 24, 'p2': 12, 'p5': 8  },
      'loc-2': { 'p1': 10, 'p2': 5,  'p5': 3  },
      'loc-3': { 'p1': 60, 'p2': 30, 'p5': 20 },
      'loc-4': { 'p1': 6,  'p2': 4,  'p5': 2  },
      'loc-5': { 'p1': 0,  'p2': 0,  'p5': 0  },
    },
  },
  {
    id: 'col-2',
    name: 'Bridal & Aso-Ebi',
    desc: 'Elegant pieces for weddings and celebrations',
    status: 'active',
    img: null,
    productIds: ['p1', 'p4'],
    locationInventory: {
      'loc-1': { 'p1': 18, 'p4': 10 },
      'loc-2': { 'p1': 6,  'p4': 4  },
      'loc-3': { 'p1': 40, 'p4': 25 },
      'loc-4': { 'p1': 4,  'p4': 2  },
      'loc-5': { 'p1': 0,  'p4': 0  },
    },
  },
  {
    id: 'col-3',
    name: "Men's Essentials",
    desc: 'Core wardrobe pieces for the modern man',
    status: 'draft',
    img: null,
    productIds: ['p4'],
    locationInventory: {
      'loc-1': { 'p4': 15 },
      'loc-2': { 'p4': 8  },
      'loc-3': { 'p4': 35 },
      'loc-4': { 'p4': 5  },
      'loc-5': { 'p4': 0  },
    },
  },
  {
    id: 'col-4',
    name: 'Beauty & Wellness',
    desc: 'Premium skincare and body care products',
    status: 'active',
    img: null,
    productIds: ['p3', 'p6'],
    locationInventory: {
      'loc-1': { 'p3': 30, 'p6': 25 },
      'loc-2': { 'p3': 12, 'p6': 10 },
      'loc-3': { 'p3': 80, 'p6': 60 },
      'loc-4': { 'p3': 8,  'p6': 6  },
      'loc-5': { 'p3': 0,  'p6': 0  },
    },
  },
]

// ── Pill ─────────────────────────────────────────────────
const Pill = ({ label, bg, color, size = 'sm' }) => (
  <span className={`${styles.pill} ${size === 'xs' ? styles.pillXs : ''}`} style={{ background: bg, color }}>
    {label}
  </span>
)

// ── Location avatar ───────────────────────────────────────
const LocAvatar = ({ name, active }) => (
  <div className={styles.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
)

// ── Collection Card ───────────────────────────────────────
function CollectionCard({ collection, onEdit, onDelete, onManageInventory }) {
  const totalStock = Object.values(collection.locationInventory)
    .reduce((a, locInv) => a + Object.values(locInv).reduce((b, qty) => b + qty, 0), 0)

  const products = ALL_PRODUCTS.filter(p => collection.productIds.includes(p.id))

  return (
    <div className={styles.collCard}>
      <div className={styles.collImgWrap}>
        {collection.img
          ? <img src={collection.img} alt={collection.name} className={styles.collImg} />
          : (
            <div className={styles.collImgPh}>
              <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={28} stroke="#9CA3AF" />
            </div>
          )
        }
        <span
          className={styles.collStatusBadge}
          style={{
            background: collection.status === 'active' ? '#ECFDF5' : '#F3F4F6',
            color:      collection.status === 'active' ? '#059669' : '#6B7280',
          }}
        >
          {collection.status}
        </span>
      </div>

      <div className={styles.collInfo}>
        <div className={styles.collName}>{collection.name}</div>
        <div className={styles.collDesc}>{collection.desc}</div>

        <div className={styles.collMeta}>
          <span className={styles.collMetaItem}>
            <Ic d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" size={12} />
            {collection.productIds.length} products
          </span>
          <span className={styles.collMetaItem}>
            <Ic d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={12} />
            {totalStock} units total
          </span>
        </div>

        {/* Location stock mini-bar */}
        <div className={styles.locStockRow}>
          {LOCATIONS.filter(l => l.active).slice(0, 4).map(loc => {
            const locStock = Object.values(collection.locationInventory[loc.id] || {}).reduce((a, b) => a + b, 0)
            return (
              <div key={loc.id} className={styles.locStockItem} title={`${loc.name}: ${locStock} units`}>
                <div className={styles.locStockDot} style={{ background: locStock > 0 ? '#2DBD97' : '#E5E7EB' }} />
                <span className={styles.locStockName}>{loc.name.split(' ')[0]}</span>
                <span className={styles.locStockQty}>{locStock}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.collActions}>
        <button className={styles.actBtnPrimary} onClick={() => onManageInventory(collection)}>
          <Ic d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={12} />
          Manage Inventory
        </button>
        <button className={styles.actBtn} onClick={() => onEdit(collection)}>
          <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={12} />
          Edit
        </button>
        <button className={styles.actBtnRed} onClick={() => onDelete(collection.id)}>
          <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={12} />
        </button>
      </div>
    </div>
  )
}

// ── Collection Modal (Create / Edit) ─────────────────────
function CollectionModal({ collection, onClose, onSave }) {
  const [name,   setName]   = useState(collection?.name   || '')
  const [desc,   setDesc]   = useState(collection?.desc   || '')
  const [status, setStatus] = useState(collection?.status || 'active')
  const [img,    setImg]    = useState(collection?.img    || null)
  const [drag,   setDrag]   = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(collection?.productIds || [])
  const fileRef = useRef()

  const toggleProduct = (id) =>
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id])

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{collection ? 'Edit Collection' : 'Create Collection'}</h2>
            <p className={styles.mSub}>Organise your products into themed collections</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          <div className={styles.fg}>
            <label>Collection Name <span className={styles.req}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Collection" />
          </div>

          <div className={styles.fg}>
            <label>Description <span className={styles.opt}>(optional)</span></label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="What is this collection about?" />
          </div>

          {/* Image upload */}
          <div className={styles.fg}>
            <label>Cover Image <span className={styles.opt}>(optional)</span></label>
            <div
              className={`${styles.drop} ${drag ? styles.dropOn : ''}`}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false)
                const f = e.dataTransfer.files[0]
                if (f?.type.startsWith('image/')) setImg(URL.createObjectURL(f))
              }}
              onClick={() => fileRef.current.click()}
            >
              {img ? (
                <div className={styles.dropImgPreview}>
                  <img src={img} alt="cover" />
                  <button className={styles.dropImgRemove} onClick={e => { e.stopPropagation(); setImg(null) }}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={10} />
                  </button>
                </div>
              ) : (
                <div className={styles.dropInner}>
                  <Ic d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" size={24} stroke="#9CA3AF" />
                  <p>Upload cover image</p>
                  <span>PNG, JPG up to 5MB</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden
                onChange={e => { const f = e.target.files[0]; if (f) setImg(URL.createObjectURL(f)) }} />
            </div>
          </div>

          {/* Product selection */}
          <div className={styles.fg}>
            <label>Products in this collection</label>
            <div className={styles.productPicker}>
              {ALL_PRODUCTS.map(p => (
                <label key={p.id} className={`${styles.productPickItem} ${selectedProducts.includes(p.id) ? styles.productPickItemOn : ''}`}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className={styles.productPickChk}
                  />
                  <div className={styles.productPickThumb}>{p.name[0]}</div>
                  <div className={styles.productPickInfo}>
                    <div className={styles.productPickName}>{p.name}</div>
                    <div className={styles.productPickMeta}>{p.sku} · {fmt(p.price)}</div>
                  </div>
                  {selectedProducts.includes(p.id) && (
                    <Ic d="M20 6L9 17l-5-5" size={14} stroke="#2DBD97" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className={styles.fg}>
            <label>Status</label>
            <div className={styles.radioRow}>
              {[{ v: 'active', l: 'Active' }, { v: 'draft', l: 'Draft' }].map(s => (
                <label key={s.v} className={styles.radioLbl}>
                  <input type="radio" name="colStatus" value={s.v} checked={status === s.v} onChange={() => setStatus(s.v)} />
                  <span>{s.l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button
            className={styles.btnPrimary}
            disabled={!name.trim()}
            onClick={() => onSave({ name, desc, status, img, productIds: selectedProducts })}
          >
            {collection ? 'Save Changes' : 'Create Collection'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Inventory Manager Modal ───────────────────────────────
function InventoryModal({ collection, onClose, onSave }) {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0].id)
  const [inventory, setInventory] = useState(
    JSON.parse(JSON.stringify(collection.locationInventory))
  )

  const products = ALL_PRODUCTS.filter(p => collection.productIds.includes(p.id))
  const loc = LOCATIONS.find(l => l.id === activeLocation)

  const updateQty = (productId, qty) => {
    setInventory(prev => ({
      ...prev,
      [activeLocation]: {
        ...(prev[activeLocation] || {}),
        [productId]: Math.max(0, Number(qty) || 0),
      },
    }))
  }

  const getQty = (productId) => inventory[activeLocation]?.[productId] ?? 0

  const totalForLocation = products.reduce((a, p) => a + getQty(p.id), 0)
  const totalAcrossAll   = LOCATIONS.reduce((a, loc) =>
    a + products.reduce((b, p) => b + (inventory[loc.id]?.[p.id] || 0), 0), 0
  )

  // Copy stock from one location to another
  const copyFrom = (fromLocId) => {
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
            <p className={styles.mSub}>{collection.name} · {products.length} products across {LOCATIONS.filter(l => l.active).length} active locations</p>
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
              const locTotal = products.reduce((a, p) => a + (inventory[loc.id]?.[p.id] || 0), 0)
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

            {/* Total across all */}
            <div className={styles.locTotalRow}>
              <span>All locations</span>
              <span className={styles.locTotalVal}>{totalAcrossAll}</span>
            </div>
          </div>

          {/* ── Right: inventory table for selected location ── */}
          <div className={styles.invTable}>
            <div className={styles.invTableHead}>
              <div className={styles.invLocBadge}>
                <LocAvatar name={loc.name} active={loc.active} />
                <div>
                  <div className={styles.invLocName}>{loc.name} — {loc.city}</div>
                  <Pill {...LOCATION_TYPE_CFG[loc.type]} size="xs" />
                </div>
                {!loc.active && <span className={styles.invInactiveNote}>This location is inactive</span>}
              </div>

              {/* Copy from another location */}
              <div className={styles.copyFromWrap}>
                <span className={styles.copyFromLabel}>Copy from:</span>
                {LOCATIONS.filter(l => l.id !== activeLocation && l.active).map(l => (
                  <button key={l.id} className={styles.copyFromBtn} onClick={() => copyFrom(l.id)}>
                    {l.name.split(' ')[0]}
                  </button>
                ))}
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
                      type="number"
                      min={0}
                      value={qty}
                      onChange={e => updateQty(p.id, e.target.value)}
                      className={styles.qtyInput}
                    />
                    <button className={styles.qtyBtn} onClick={() => updateQty(p.id, qty + 1)}>+</button>
                  </span>
                  <span>
                    <span
                      className={styles.invStatus}
                      style={{
                        background: qty === 0 ? '#FEF2F2' : qty <= 5 ? '#FFFBEB' : '#ECFDF5',
                        color:      qty === 0 ? '#DC2626' : qty <= 5 ? '#D97706' : '#059669',
                      }}
                    >
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

            {/* Location total */}
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

// ── Locations Manager Modal ───────────────────────────────
function LocationsModal({ onClose }) {
  const [locations, setLocations] = useState(LOCATIONS)
  const [adding, setAdding]       = useState(false)
  const [newName, setNewName]     = useState('')
  const [newCity, setNewCity]     = useState('')
  const [newType, setNewType]     = useState('retail')

  const toggle = (id) =>
    setLocations(ls => ls.map(l => l.id === id ? { ...l, active: !l.active } : l))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: 520 }}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Manage Locations</h2>
            <p className={styles.mSub}>Control which locations carry inventory</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          {locations.map(loc => (
            <div key={loc.id} className={styles.locManageRow}>
              <LocAvatar name={loc.name} active={loc.active} />
              <div className={styles.locManageInfo}>
                <div className={styles.locManageName}>{loc.name}</div>
                <div className={styles.locManageCity}>
                  {loc.city} ·
                  <span style={{ marginLeft: 4, ...LOCATION_TYPE_CFG[loc.type] && { color: LOCATION_TYPE_CFG[loc.type].color } }}>
                    {LOCATION_TYPE_CFG[loc.type]?.label}
                  </span>
                </div>
              </div>
              <div className={`${styles.toggle} ${loc.active ? styles.toggleOn : ''}`} onClick={() => toggle(loc.id)}>
                <div className={styles.toggleThumb} />
              </div>
            </div>
          ))}

          {adding && (
            <div className={styles.addLocForm}>
              <div className={styles.fRow}>
                <div className={styles.fg}>
                  <label>Location Name</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. New Branch" />
                </div>
                <div className={styles.fg}>
                  <label>City</label>
                  <input value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="e.g. Ibadan" />
                </div>
              </div>
              <div className={styles.fg}>
                <label>Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)}>
                  <option value="retail">Retail Store</option>
                  <option value="pos">POS Terminal</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className={styles.btnPrimary} disabled={!newName || !newCity} onClick={() => {
                  setAdding(false); setNewName(''); setNewCity('')
                }}>
                  Add Location
                </button>
                <button className={styles.btnGhost} onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          )}

          {!adding && (
            <button className={styles.addLocBtn} onClick={() => setAdding(true)}>
              <Ic d="M12 5v14M5 12h14" size={14} /> Add New Location
            </button>
          )}
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Close</button>
          <button className={styles.btnPrimary} onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ────────────────────────────────────────────
export default function Collections() {
  const [collections,   setCollections]   = useState(SEED_COLLECTIONS)
  const [modal,         setModal]         = useState(null)
  const [editTarget,    setEditTarget]    = useState(null)
  const [invTarget,     setInvTarget]     = useState(null)
  const [search,        setSearch]        = useState('')
  const [filterStatus,  setFilterStatus]  = useState('all')
  const [filterLoc,     setFilterLoc]     = useState('all')
  const [activeTab,     setActiveTab]     = useState('collections')

  const filtered = collections.filter(c => {
    const q  = search.toLowerCase()
    const ms = c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    const mst= filterStatus === 'all' || c.status === filterStatus
    return ms && mst
  })

  const saveCollection = (data) => {
    if (editTarget) {
      setCollections(cs => cs.map(c => c.id === editTarget.id
        ? { ...c, ...data }
        : c
      ))
    } else {
      const newCol = {
        id: `col-${Date.now()}`,
        ...data,
        locationInventory: Object.fromEntries(
          LOCATIONS.map(l => [l.id, Object.fromEntries(data.productIds.map(pid => [pid, 0]))])
        ),
      }
      setCollections(cs => [...cs, newCol])
    }
    setModal(null)
    setEditTarget(null)
  }

  const saveInventory = (newInventory) => {
    setCollections(cs => cs.map(c =>
      c.id === invTarget.id ? { ...c, locationInventory: newInventory } : c
    ))
    setInvTarget(null)
  }

  const deleteCollection = (id) => setCollections(cs => cs.filter(c => c.id !== id))

  // Summary stats
  const totalProducts = [...new Set(collections.flatMap(c => c.productIds))].length
  const totalLocations = LOCATIONS.filter(l => l.active).length
  const totalStock = collections.reduce((a, c) =>
    a + Object.values(c.locationInventory).reduce((b, locInv) =>
      b + Object.values(locInv).reduce((d, q) => d + q, 0), 0
    ), 0
  )
  const lowStockAlerts = collections.reduce((a, c) => {
    let count = 0
    ALL_PRODUCTS.filter(p => c.productIds.includes(p.id)).forEach(p => {
      LOCATIONS.filter(l => l.active).forEach(l => {
        const qty = c.locationInventory[l.id]?.[p.id] ?? 0
        if (qty > 0 && qty <= 5) count++
      })
    })
    return a + count
  }, 0)

  return (
    <div className={styles.page}>

      {/* ── Topbar ── */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Collections</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline} onClick={() => setModal('locations')}>
            <Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
            Manage Locations
          </button>
          <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('collection') }}>
            <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
            Create Collection
          </button>
        </div>
      </header>

      <div className={styles.content}>

        {/* ── Stats ── */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Collections', value: collections.length,         accent: '#1a1a2e', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
            { label: 'Products in Use',   value: totalProducts,              accent: '#2DBD97', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18' },
            { label: 'Active Locations',  value: totalLocations,             accent: '#3B82F6', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z' },
            { label: 'Total Stock Units', value: totalStock,                 accent: '#8B5CF6', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
            { label: 'Low Stock Alerts',  value: lowStockAlerts,             accent: lowStockAlerts > 0 ? '#EF4444' : '#9CA3AF', icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>{s.label}</span>
                <Ic d={s.icon} size={15} stroke={s.accent} />
              </div>
              <div className={styles.statValue} style={{ color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Low stock banner */}
        {lowStockAlerts > 0 && (
          <div className={styles.alertBanner}>
            <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={15} stroke="#B45309" />
            <span><strong>{lowStockAlerts} product–location combination{lowStockAlerts > 1 ? 's' : ''}</strong> are running low on stock.</span>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'collections' ? styles.tabOn : ''}`} onClick={() => setActiveTab('collections')}>
              Collections
            </button>
            <button className={`${styles.tab} ${activeTab === 'locations' ? styles.tabOn : ''}`} onClick={() => setActiveTab('locations')}>
              Locations Overview
            </button>
          </div>
          <div className={styles.tabActions}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />
              </span>
              <input
                className={styles.searchInput}
                placeholder="Search collections…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* ── Collections tab ── */}
        {activeTab === 'collections' && (
          <>
            {filtered.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="14" y="22" width="52" height="42" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
                  <rect x="22" y="14" width="36" height="42" rx="4" fill="#fff" stroke="#2DBD97" strokeWidth="1.5" />
                  <line x1="30" y1="26" x2="50" y2="26" stroke="#2DBD97" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="30" y1="33" x2="50" y2="33" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="58" cy="58" r="14" fill="#2DBD97" />
                  <line x1="58" y1="51" x2="58" y2="65" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="51" y1="58" x2="65" y2="58" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                <h3>No collections found</h3>
                <p>Create your first collection to organise products by theme or season</p>
                <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('collection') }}>
                  <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" /> Create Collection
                </button>
              </div>
            ) : (
              <div className={styles.collGrid}>
                {filtered.map(c => (
                  <CollectionCard
                    key={c.id}
                    collection={c}
                    onEdit={(col) => { setEditTarget(col); setModal('collection') }}
                    onDelete={deleteCollection}
                    onManageInventory={(col) => { setInvTarget(col); setModal('inventory') }}
                  />
                ))}
                <button className={styles.addCollCard} onClick={() => { setEditTarget(null); setModal('collection') }}>
                  <Ic d="M12 5v14M5 12h14" size={22} />
                  <span>New Collection</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ── Locations overview tab ── */}
        {activeTab === 'locations' && (
          <div className={styles.locOverview}>
            {LOCATIONS.map(loc => {
              const locType = LOCATION_TYPE_CFG[loc.type]
              const locStockByCollection = collections.map(c => {
                const products = ALL_PRODUCTS.filter(p => c.productIds.includes(p.id))
                const stock    = products.reduce((a, p) => a + (c.locationInventory[loc.id]?.[p.id] || 0), 0)
                return { collectionName: c.name, stock, products: products.length }
              })
              const totalLocStock = locStockByCollection.reduce((a, b) => a + b.stock, 0)

              return (
                <div key={loc.id} className={`${styles.locOverviewCard} ${!loc.active ? styles.locOverviewCardInactive : ''}`}>
                  <div className={styles.locOverviewHead}>
                    <div className={styles.locOverviewLeft}>
                      <LocAvatar name={loc.name} active={loc.active} />
                      <div>
                        <div className={styles.locOverviewName}>{loc.name}</div>
                        <div className={styles.locOverviewCity}>{loc.city}</div>
                      </div>
                    </div>
                    <div className={styles.locOverviewRight}>
                      <Pill {...locType} size="xs" />
                      {!loc.active && <span className={styles.inactiveBadge}>Inactive</span>}
                    </div>
                  </div>

                  <div className={styles.locOverviewStats}>
                    <div className={styles.locOverviewStat}>
                      <div className={styles.locOverviewStatVal}>{totalLocStock}</div>
                      <div className={styles.locOverviewStatLbl}>Total Units</div>
                    </div>
                    <div className={styles.locOverviewStat}>
                      <div className={styles.locOverviewStatVal}>{collections.length}</div>
                      <div className={styles.locOverviewStatLbl}>Collections</div>
                    </div>
                    <div className={styles.locOverviewStat}>
                      <div className={styles.locOverviewStatVal} style={{ color: '#EF4444' }}>
                        {locStockByCollection.filter(c => c.stock === 0).length}
                      </div>
                      <div className={styles.locOverviewStatLbl}>Out of Stock</div>
                    </div>
                  </div>

                  <div className={styles.locCollBreakdown}>
                    {locStockByCollection.map(c => (
                      <div key={c.collectionName} className={styles.locCollRow}>
                        <span className={styles.locCollName}>{c.collectionName}</span>
                        <div className={styles.locCollBar}>
                          <div
                            className={styles.locCollBarFill}
                            style={{ width: totalLocStock ? `${(c.stock / totalLocStock) * 100}%` : '0%' }}
                          />
                        </div>
                        <span className={styles.locCollQty}>{c.stock}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {(modal === 'collection') && (
        <CollectionModal
          collection={editTarget}
          onClose={() => { setModal(null); setEditTarget(null) }}
          onSave={saveCollection}
        />
      )}
      {modal === 'inventory' && invTarget && (
        <InventoryModal
          collection={invTarget}
          onClose={() => { setModal(null); setInvTarget(null) }}
          onSave={saveInventory}
        />
      )}
      {modal === 'locations' && (
        <LocationsModal onClose={() => setModal(null)} />
      )}
    </div>
  )
}
