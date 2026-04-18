import { useState, useRef } from 'react'
import s from './Inventory.module.css'

// ── Icon helper ──────────────────────────────────────────
const Ic = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

// ── Sample Data ──────────────────────────────────────────
const SUPPLIERS = [
  { id: 1, name: 'Lagos Textile Hub', contact: 'Emeka Obi', phone: '+234 803 111 2222', email: 'emeka@lagostextile.com', category: 'Fashion' },
  { id: 2, name: 'Kano Craft Suppliers', contact: 'Fatima Musa', phone: '+234 706 333 4444', email: 'fatima@kanocrafts.com', category: 'Accessories' },
  { id: 3, name: 'Abuja Beauty Wholesale', contact: 'Ngozi Eze', phone: '+234 812 555 6666', email: 'ngozi@abujabeauty.com', category: 'Beauty' },
]

const SAMPLE_INVENTORY = [
  { id: 1, sku: 'AKR-001', name: 'Classic Ankara Dress', category: 'Fashion', tags: ['dress', 'ankara'], barcode: '8901234567890', price: 15000, costPrice: 9000, stock: 12, reorderPoint: 5, safetyStock: 3, variants: ['Red/S', 'Red/M', 'Blue/M'], supplier: 'Lagos Textile Hub', lastRestocked: '2026-03-15', shrinkage: 0, status: 'in_stock' },
  { id: 2, sku: 'LCB-002', name: 'Leather Crossbody Bag', category: 'Accessories', tags: ['bag', 'leather'], barcode: '8901234567891', price: 22000, costPrice: 12000, stock: 7, reorderPoint: 4, safetyStock: 2, variants: ['Black', 'Brown'], supplier: 'Kano Craft Suppliers', lastRestocked: '2026-03-20', shrinkage: 1, status: 'in_stock' },
  { id: 3, sku: 'SHB-003', name: 'Premium Shea Butter', category: 'Beauty', tags: ['skincare', 'organic'], barcode: '8901234567892', price: 4500, costPrice: 2000, stock: 0, reorderPoint: 10, safetyStock: 5, variants: [], supplier: 'Abuja Beauty Wholesale', lastRestocked: '2026-02-28', shrinkage: 2, status: 'out_of_stock' },
  { id: 4, sku: 'KFT-004', name: "Men's Kaftan Set", category: 'Fashion', tags: ['kaftan', 'men'], barcode: '8901234567893', price: 28000, costPrice: 16000, stock: 4, reorderPoint: 5, safetyStock: 2, variants: ['White/L', 'White/XL', 'Navy/L'], supplier: 'Lagos Textile Hub', lastRestocked: '2026-03-10', shrinkage: 0, status: 'low_stock' },
  { id: 5, sku: 'GFT-005', name: 'Ankara Gift Set Bundle', category: 'Fashion', tags: ['bundle', 'gift'], barcode: '8901234567894', price: 35000, costPrice: 20000, stock: 8, reorderPoint: 3, safetyStock: 2, variants: [], supplier: 'Lagos Textile Hub', lastRestocked: '2026-04-01', shrinkage: 0, status: 'in_stock', isKit: true, kitItems: ['Classic Ankara Dress x1', 'Leather Crossbody Bag x1'] },
]

const PURCHASE_ORDERS = [
  { id: 'PO-001', supplier: 'Lagos Textile Hub', items: 3, total: 85000, status: 'received', date: '2026-03-15', expectedDate: '2026-03-15' },
  { id: 'PO-002', supplier: 'Abuja Beauty Wholesale', items: 2, total: 40000, status: 'pending', date: '2026-04-05', expectedDate: '2026-04-12' },
  { id: 'PO-003', supplier: 'Kano Craft Suppliers', items: 1, total: 24000, status: 'in_transit', date: '2026-04-03', expectedDate: '2026-04-10' },
]

const STOCK_AUDIT = [
  { id: 1, sku: 'AKR-001', name: 'Classic Ankara Dress', systemQty: 12, physicalQty: 12, variance: 0, auditDate: '2026-04-01', auditedBy: 'Store Manager' },
  { id: 2, sku: 'LCB-002', name: 'Leather Crossbody Bag', systemQty: 8, physicalQty: 7, variance: -1, auditDate: '2026-04-01', auditedBy: 'Store Manager' },
  { id: 3, sku: 'SHB-003', name: 'Premium Shea Butter', systemQty: 2, physicalQty: 0, variance: -2, auditDate: '2026-04-01', auditedBy: 'Store Manager' },
]

const ROLES = [
  { role: 'Super Admin', access: 'Full access — inventory settings, supplier data, system config', color: '#1a1a2e', bg: '#EEF2FF' },
  { role: 'Store Manager', access: 'Daily counts, receive shipments, run reports', color: '#065F46', bg: '#ECFDF5' },
  { role: 'Cashier / Staff', access: 'Scan products, process sales — limited stock adjustments', color: '#92400E', bg: '#FFFBEB' },
]

const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

const STATUS_CFG = {
  in_stock:    { label: 'In Stock',    bg: '#ECFDF5', color: '#059669' },
  low_stock:   { label: 'Low Stock',   bg: '#FFFBEB', color: '#D97706' },
  out_of_stock:{ label: 'Out of Stock',bg: '#FEF2F2', color: '#DC2626' },
}

const PO_CFG = {
  received:   { label: 'Received',   bg: '#ECFDF5', color: '#059669' },
  pending:    { label: 'Pending',    bg: '#FFFBEB', color: '#D97706' },
  in_transit: { label: 'In Transit', bg: '#EFF6FF', color: '#2563EB' },
}

// ── Add / Edit Item Modal ────────────────────────────────
function ItemModal({ item, suppliers, onClose, onSave }) {
  const [form, setForm] = useState({
    name: item?.name || '', sku: item?.sku || '', category: item?.category || '',
    tags: item?.tags?.join(', ') || '', barcode: item?.barcode || '',
    price: item?.price || '', costPrice: item?.costPrice || '',
    stock: item?.stock || '', reorderPoint: item?.reorderPoint || '',
    safetyStock: item?.safetyStock || '', supplier: item?.supplier || '',
    variants: item?.variants?.join(', ') || '',
    isKit: item?.isKit || false, kitItems: item?.kitItems?.join('\n') || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>{item ? 'Edit Item' : 'Add Inventory Item'}</h2>
            <p className={s.mSub}>Fill in item master data</p>
          </div>
          <button className={s.mClose} onClick={onClose}>
            <Ic size={18}><path d="M18 6L6 18M6 6l12 12" /></Ic>
          </button>
        </div>
        <div className={s.mBody}>

          <p className={s.secHead}>Item Identity</p>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Product Name <span className={s.req}>*</span></label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic Ankara Dress" />
            </div>
            <div className={s.fg}>
              <label>SKU <span className={s.req}>*</span></label>
              <input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. AKR-001" />
            </div>
          </div>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {['Fashion','Accessories','Beauty','Electronics','Food','Home','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={s.fg}>
              <label>Tags <span className={s.opt}>(comma separated)</span></label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. dress, ankara, women" />
            </div>
          </div>
          <div className={s.fg}>
            <label>Barcode / UPC</label>
            <input value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="Scan or enter barcode" />
            <span className={s.hint}>Focus here and scan with barcode scanner</span>
          </div>
          <div className={s.fg}>
            <label>Variants <span className={s.opt}>(comma separated)</span></label>
            <input value={form.variants} onChange={e => set('variants', e.target.value)} placeholder="e.g. Red/S, Red/M, Blue/M" />
          </div>

          <p className={s.secHead} style={{ marginTop: '1rem' }}>Pricing</p>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Retail Price <span className={s.req}>*</span></label>
              <div className={s.inputPre}><span>₦</span>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
              </div>
            </div>
            <div className={s.fg}>
              <label>Cost Price</label>
              <div className={s.inputPre}><span>₦</span>
                <input type="number" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" />
              </div>
            </div>
          </div>
          {form.price && form.costPrice && (
            <div className={s.profitBadge}>
              Margin: <strong>{Math.round(((form.price - form.costPrice) / form.price) * 100)}%</strong>
              &nbsp;— Profit per unit: {fmt(form.price - form.costPrice)}
            </div>
          )}

          <p className={s.secHead} style={{ marginTop: '1rem' }}>Stock Levels</p>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Quantity on Hand <span className={s.req}>*</span></label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
            </div>
            <div className={s.fg}>
              <label>Reorder Point</label>
              <input type="number" value={form.reorderPoint} onChange={e => set('reorderPoint', e.target.value)} placeholder="e.g. 5" />
              <span className={s.hint}>Alert triggers when stock falls to this level</span>
            </div>
          </div>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Safety Stock</label>
              <input type="number" value={form.safetyStock} onChange={e => set('safetyStock', e.target.value)} placeholder="e.g. 2" />
              <span className={s.hint}>Buffer for sync latency between channels</span>
            </div>
            <div className={s.fg}>
              <label>Supplier</label>
              <select value={form.supplier} onChange={e => set('supplier', e.target.value)}>
                <option value="">Select supplier</option>
                {suppliers.map(sup => <option key={sup.id}>{sup.name}</option>)}
              </select>
            </div>
          </div>

          <div className={s.kitToggle}>
            <label className={s.toggleRow}>
              <div>
                <span className={s.toggleLbl}>Bundle / Kit Item</span>
                <span className={s.hint}>This item is made up of multiple individual products</span>
              </div>
              <div className={`${s.toggle} ${form.isKit ? s.toggleOn : ''}`} onClick={() => set('isKit', !form.isKit)}>
                <div className={s.toggleThumb} />
              </div>
            </label>
          </div>

          {form.isKit && (
            <div className={s.fg}>
              <label>Kit Components <span className={s.opt}>(one per line)</span></label>
              <textarea rows={3} value={form.kitItems} onChange={e => set('kitItems', e.target.value)}
                placeholder={'Classic Ankara Dress x1\nLeather Crossbody Bag x1'} />
              <span className={s.hint}>Each component will be deducted from individual stock when this kit is sold</span>
            </div>
          )}
        </div>
        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!form.name || !form.sku}
            onClick={() => onSave({
              ...form,
              tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
              variants: form.variants.split(',').map(v => v.trim()).filter(Boolean),
              kitItems: form.kitItems.split('\n').map(k => k.trim()).filter(Boolean),
            })}>
            {item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Purchase Order Modal ─────────────────────────────────
function POModal({ onClose, onSave, suppliers }) {
  const [form, setForm] = useState({ supplier: '', expectedDate: '', notes: '' })
  const [items, setItems] = useState([{ name: '', qty: 1, cost: '' }])
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i, k, v) => setItems(its => its.map((it, j) => j === i ? { ...it, [k]: v } : it))
  const total = items.reduce((a, it) => a + (Number(it.qty) * Number(it.cost) || 0), 0)
  const [openDropdown, setOpenDropdown] = useState(null)

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div><h2 className={s.mTitle}>Create Purchase Order</h2><p className={s.mSub}>Order stock from a supplier</p></div>
          <button className={s.mClose} onClick={onClose}><Ic size={18}><path d="M18 6L6 18M6 6l12 12" /></Ic></button>
        </div>
        <div className={s.mBody}>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Supplier <span className={s.req}>*</span></label>
              <select value={form.supplier} onChange={e => set('supplier', e.target.value)}>
                <option value="">Select supplier</option>
                {suppliers.map(sup => <option key={sup.id}>{sup.name}</option>)}
              </select>
            </div>
            <div className={s.fg}>
              <label>Expected Delivery Date</label>
              <input type="date" value={form.expectedDate} onChange={e => set('expectedDate', e.target.value)} />
            </div>
          </div>

          <div className={s.poItemsEditor}>
            <div className={s.poItemsHeader}>
              <p className={s.secHead} style={{ margin: 0 }}>Order Items</p>
              <button className={s.btnOutlineSm} onClick={() => setItems(its => [...its, { name: '', qty: 1, cost: '' }])}>
                <Ic size={12}><path d="M12 5v14M5 12h14" /></Ic> Add Item
              </button>
            </div>
            {items.map((item, i) => (
              <div key={i} className={s.poItemRow}>
               <div className={s.fg} style={{ flex: 2, position: 'relative' }}>
  <label>Product / SKU</label>
  <input
    value={item.name}
    onChange={e => setItem(i, 'name', e.target.value)}
    placeholder="Search product name or SKU…"
    autoComplete="off"
    onFocus={() => setOpenDropdown(i)}
    onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
  />
  {openDropdown === i && (
    <div style={{
      position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
      background: '#fff', border: '1.5px solid #E5E7EB', borderRadius: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 999,
      maxHeight: 200, overflowY: 'auto',
    }}>
      {SAMPLE_INVENTORY
        .filter(p =>
          !item.name ||
          p.name.toLowerCase().includes(item.name.toLowerCase()) ||
          p.sku.toLowerCase().includes(item.name.toLowerCase())
        )
        .map(p => (
          <div
            key={p.sku}
            onMouseDown={() => {
              setItem(i, 'name', p.name)
              setItem(i, 'cost', p.costPrice)
              setOpenDropdown(null)
            }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.6rem 0.85rem', cursor: 'pointer',
              borderBottom: '1px solid #F3F4F6', fontSize: 13,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F0FDF9'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
              <div style={{ fontSize: 11.5, color: '#9CA3AF' }}>{p.sku}</div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#1a1a2e' }}>
              ₦{p.costPrice.toLocaleString()}
            </div>
          </div>
        ))
      }
      {SAMPLE_INVENTORY.filter(p =>
        !item.name ||
        p.name.toLowerCase().includes(item.name.toLowerCase()) ||
        p.sku.toLowerCase().includes(item.name.toLowerCase())
      ).length === 0 && (
        <div style={{ padding: '1rem', textAlign: 'center', fontSize: 13, color: '#9CA3AF' }}>
          No products found
        </div>
      )}
    </div>
  )}
</div>
                <div className={s.fg} style={{ flex: 0.6 }}>
                  <label>Qty</label>
                  <input type="number" min="1" value={item.qty} onChange={e => setItem(i, 'qty', e.target.value)} />
                </div>
                <div className={s.fg} style={{ flex: 1 }}>
                  <label>Unit Cost (₦)</label>
                  <input type="number" value={item.cost} onChange={e => setItem(i, 'cost', e.target.value)} placeholder="0" />
                </div>
                {items.length > 1 && (
                  <button className={s.removeBtn} onClick={() => setItems(its => its.filter((_, j) => j !== i))}>
                    <Ic size={13}><path d="M18 6L6 18M6 6l12 12" /></Ic>
                  </button>
                )}
              </div>
            ))}
            <div className={s.poTotal}><span>Order Total</span><strong>{fmt(total)}</strong></div>
          </div>

          <div className={s.fg}>
            <label>Notes <span className={s.opt}>(optional)</span></label>
            <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special instructions..." />
          </div>
        </div>
        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!form.supplier}
            onClick={() => onSave({ ...form, items, total, id: `PO-${Date.now()}`, status: 'pending', date: new Date().toISOString().split('T')[0] })}>
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  )
}

const LOCATIONS = [
  { id: 'loc-1', name: 'Main Store',   city: 'Lagos'         },
  { id: 'loc-2', name: 'POS Outlet',   city: 'Abuja'         },
  { id: 'loc-3', name: 'Warehouse',    city: 'Lagos'         },
  { id: 'loc-4', name: 'POS Kiosk',    city: 'Kano'          },
  { id: 'loc-5', name: 'Pop-up Store', city: 'Port Harcourt' },
]

// ── MAIN ─────────────────────────────────────────────────
export default function Inventory() {
  const [tab, setTab] = useState('items')
  const [location, setLocation] = useState('loc-1')
  const [inventory, setInventory] = useState(SAMPLE_INVENTORY)
  const [suppliers, setSuppliers] = useState(SUPPLIERS)
  const [purchaseOrders, setPurchaseOrders] = useState(PURCHASE_ORDERS)
  const [auditData, setAuditData] = useState(STOCK_AUDIT)
  const [modal, setModal] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showSearchDrop, setShowSearchDrop] = useState(false)
  const [reportType, setReportType] = useState('stock_status')

  const activeLoc = LOCATIONS.find(l => l.id === location)

  const totalItems = inventory.length
  const totalValue = inventory.reduce((a, i) => a + i.costPrice * i.stock, 0)
  const lowStock = inventory.filter(i => i.stock > 0 && i.stock <= i.reorderPoint).length
  const outOfStock = inventory.filter(i => i.stock === 0).length
  const totalShrinkage = inventory.reduce((a, i) => a + (i.shrinkage || 0), 0)

  const filtered = inventory.filter(i => {
    const q = search.toLowerCase()
    const matchSearch = i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.barcode?.includes(q)
    const matchStatus = filterStatus === 'all' || i.status === filterStatus
    const matchCat = filterCategory === 'all' || i.category === filterCategory
    return matchSearch && matchStatus && matchCat
  })

  const saveItem = (data) => {
    if (editItem) setInventory(inv => inv.map(i => i.id === editItem.id ? { ...i, ...data } : i))
    else setInventory(inv => [...inv, { id: Date.now(), shrinkage: 0, lastRestocked: new Date().toISOString().split('T')[0], status: Number(data.stock) === 0 ? 'out_of_stock' : Number(data.stock) <= Number(data.reorderPoint) ? 'low_stock' : 'in_stock', ...data }])
    setModal(null); setEditItem(null)
  }

  const savePO = (data) => { setPurchaseOrders(pos => [...pos, data]); setModal(null) }

  const categories = [...new Set(inventory.map(i => i.category))]

  const REPORTS = {
    stock_status: inventory.map(i => ({ name: i.name, sku: i.sku, stock: i.stock, value: fmt(i.costPrice * i.stock), status: i.status })),
    best_sellers: [...inventory].sort((a, b) => b.sold - a.sold).slice(0, 5),
    slow_moving: [...inventory].sort((a, b) => a.sold - b.sold).slice(0, 5),
    shrinkage: inventory.filter(i => i.shrinkage > 0),
    turnover: inventory.map(i => ({ name: i.name, sku: i.sku, turnover: i.stock > 0 ? ((i.sold || 0) / i.stock).toFixed(2) : '—' })),
  }

  return (
    <div className={s.page}>
      {/* Topbar */}
      <header className={s.topbar}>
        <div className={s.topbarL}>
          <h1 className={s.pgTitle}>Inventory</h1>
          <div className={s.locSelector}>
            <Ic size={13}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Ic>
            <select
              className={s.locSelect}
              value={location}
              onChange={e => setLocation(e.target.value)}
              aria-label="Select inventory location"
            >
              {LOCATIONS.map(l => (
                <option key={l.id} value={l.id}>{l.name} — {l.city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={s.topbarR}>
          <button className={s.btnOutline} onClick={() => setModal('po')}>
            <Ic size={13}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><path d="M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" /></Ic>
            Purchase Order
          </button>
          <button className={s.btnPrimary} onClick={() => { setEditItem(null); setModal('item') }}>
            <Ic size={13}><path d="M12 5v14M5 12h14" /></Ic>
            Add Item
          </button>
        </div>
      </header>

      <div className={s.content}>
        {/* Stats */}
        <div className={s.statsRow}>
          {[
            { label: 'Total SKUs', value: totalItems, icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8" /><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></>, accent: '#2DBD97' },
            { label: 'Inventory Value', value: fmt(totalValue), icon: <><path d="M2 8h20M2 16h20M6 4v16M18 4v16" /></>, accent: '#E8C547' },
            { label: 'Low Stock Alerts', value: lowStock, icon: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></>, accent: '#F59E0B' },
            { label: 'Out of Stock', value: outOfStock, icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></>, accent: '#EF4444' },
            { label: 'Total Shrinkage', value: totalShrinkage, icon: <><path d="M3 3h18v18H3zM3 9h18M9 21V9" /></>, accent: '#8B5CF6' },
          ].map(stat => (
            <div key={stat.label} className={s.statCard}>
              <div className={s.statTop}>
                <span className={s.statLbl}>{stat.label}</span>
                <span style={{ color: stat.accent }}><Ic size={15}>{stat.icon}</Ic></span>
              </div>
              <div className={s.statVal}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Low stock alerts banner */}
        {(lowStock > 0 || outOfStock > 0) && (
          <div className={s.alertBanner}>
            <Ic size={15}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><path d="M12 9v4M12 17h.01" /></Ic>
            <span>
              {outOfStock > 0 && <><strong>{outOfStock} item{outOfStock > 1 ? 's' : ''}</strong> out of stock. </>}
              {lowStock > 0 && <><strong>{lowStock} item{lowStock > 1 ? 's' : ''}</strong> below reorder point. </>}
              Restock soon to avoid overselling.
            </span>
            <button className={s.alertBtn} onClick={() => setModal('po')}>Create Purchase Order →</button>
          </div>
        )}

        {/* Tabs */}
        <div className={s.tabBar}>
          <div className={s.tabs}>
            {[
              { key: 'items', label: 'Item Master' },
              { key: 'po', label: 'Purchase Orders' },
              { key: 'audit', label: 'Stock Audit' },
              { key: 'reports', label: 'Reports & Analytics' },
              { key: 'suppliers', label: 'Suppliers' },
              { key: 'roles', label: 'User Roles' },
            ].map(t => (
              <button key={t.key} className={`${s.tab} ${tab === t.key ? s.tabOn : ''}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── ITEM MASTER TAB ── */}
        {tab === 'items' && (
          <div className={s.tableSection}>
            <div className={s.controls}>
              <div className={s.controlsL}>
                <div className={s.searchBox} style={{ position: 'relative' }}>
                  <span className={s.searchIco}><Ic size={14}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></Ic></span>
                  <input placeholder="Search by name, SKU, barcode…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setShowSearchDrop(true)}
                    onBlur={() => setTimeout(() => setShowSearchDrop(false), 150)} />
                  {showSearchDrop && (
                    <div className={s.searchDrop}>
                      {(search ? inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())) : inventory).map(i => (
                        <div key={i.id} className={s.searchDropItem} onMouseDown={() => { setSearch(i.name); setShowSearchDrop(false) }}>
                          <div className={s.searchDropThumb}>{i.name[0]}</div>
                          <div className={s.searchDropInfo}>
                            <div className={s.searchDropName}>{i.name}</div>
                            <div className={s.searchDropMeta}>{i.sku} · {i.category} · {fmt(i.price)}</div>
                          </div>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: STATUS_CFG[i.status]?.color }}>{STATUS_CFG[i.status]?.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={s.controlsR}>
                <select className={s.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="low_stock">Low Stock</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
                <select className={s.filterSel} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                  <option value="all">All Categories</option>
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className={s.table}>
              <div className={s.tHead}>
                <span>Item</span><span>SKU</span><span>Barcode</span>
                <span>Price</span><span>Cost</span><span>Stock</span>
                <span>Reorder Pt</span><span>Supplier</span><span>Status</span><span></span>
              </div>
              {filtered.length === 0 ? (
                <div className={s.noRecord}>
                  <Ic size={36}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8" /></Ic>
                  <p>No items found</p>
                </div>
              ) : filtered.map(item => (
                <div key={item.id} className={`${s.tRow} ${item.stock === 0 ? s.tRowDanger : item.stock <= item.reorderPoint ? s.tRowWarn : ''}`}>
                  <span className={s.itemCell}>
                    <div className={s.itemThumb}>{item.name[0]}</div>
                    <div>
                      <div className={s.itemName}>
                        {item.name}
                        {item.isKit && <span className={s.kitBadge}>Kit</span>}
                      </div>
                      <div className={s.itemTags}>
                        {item.tags?.slice(0, 2).map(t => <span key={t} className={s.tag}>{t}</span>)}
                      </div>
                    </div>
                  </span>
                  <span className={s.mono}>{item.sku}</span>
                  <span className={s.mono} style={{ fontSize: 11 }}>{item.barcode || '—'}</span>
                  <span>{fmt(item.price)}</span>
                  <span style={{ color: 'var(--ink3)' }}>{fmt(item.costPrice)}</span>
                  <span>
                    <div className={s.stockCell}>
                      <span className={s.stockNum} style={{ color: item.stock === 0 ? '#DC2626' : item.stock <= item.reorderPoint ? '#D97706' : '#059669' }}>{item.stock}</span>
                      <div className={s.stockBar}>
                        <div className={s.stockBarFill} style={{ width: `${Math.min(100, (item.stock / (item.reorderPoint * 3)) * 100)}%`, background: item.stock === 0 ? '#EF4444' : item.stock <= item.reorderPoint ? '#F59E0B' : '#2DBD97' }} />
                      </div>
                    </div>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{item.reorderPoint} / {item.safetyStock}</span>
                  <span style={{ fontSize: 12 }}>{item.supplier || '—'}</span>
                  <span>
                    <span style={{ background: STATUS_CFG[item.status]?.bg, color: STATUS_CFG[item.status]?.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {STATUS_CFG[item.status]?.label}
                    </span>
                  </span>
                  <span className={s.actCell}>
                    <button className={s.iconBtn} onClick={() => { setEditItem(item); setModal('item') }}>
                      <Ic size={13}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Ic>
                    </button>
                    <button className={s.iconBtnRed} onClick={() => setInventory(inv => inv.filter(i => i.id !== item.id))}>
                      <Ic size={13}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Ic>
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PURCHASE ORDERS TAB ── */}
        {tab === 'po' && (
          <div className={s.tableSection}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className={s.btnPrimary} onClick={() => setModal('po')}>
                <Ic size={13}><path d="M12 5v14M5 12h14" /></Ic> New Purchase Order
              </button>
            </div>
            <div className={s.table}>
              <div className={s.tHead} style={{ gridTemplateColumns: '1fr 1.5fr 0.7fr 1fr 1fr 1fr 0.6fr' }}>
                <span>PO Number</span><span>Supplier</span><span>Items</span>
                <span>Total</span><span>Order Date</span><span>Expected</span><span>Status</span>
              </div>
              {purchaseOrders.map(po => (
                <div key={po.id} className={s.tRow} style={{ gridTemplateColumns: '1fr 1.5fr 0.7fr 1fr 1fr 1fr 0.6fr' }}>
                  <span className={s.mono} style={{ fontWeight: 600, color: 'var(--navy)' }}>{po.id}</span>
                  <span>{po.supplier}</span>
                  <span>{po.items}</span>
                  <span style={{ fontWeight: 700 }}>{fmt(po.total)}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{new Date(po.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{new Date(po.expectedDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
                  <span>
                    <span style={{ background: PO_CFG[po.status]?.bg, color: PO_CFG[po.status]?.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
                      {PO_CFG[po.status]?.label}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STOCK AUDIT TAB ── */}
        {tab === 'audit' && (
          <div className={s.tableSection}>
            <div className={s.auditInfo}>
              <Ic size={15}><circle cx="12" cy="12" r="10" /><path d="M12 8h.01M12 12v4" /></Ic>
              <span>Reconcile physical stock counts with system data. Variances are flagged automatically.</span>
            </div>
            <div className={s.table}>
              <div className={s.tHead} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.8fr' }}>
                <span>Item</span><span>SKU</span><span>System Qty</span>
                <span>Physical Qty</span><span>Variance</span><span>Audited By</span><span>Date</span>
              </div>
              {auditData.map(a => (
                <div key={a.id} className={s.tRow} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.8fr' }}>
                  <span style={{ fontWeight: 500 }}>{a.name}</span>
                  <span className={s.mono}>{a.sku}</span>
                  <span>{a.systemQty}</span>
                  <span>
                    <input type="number" className={s.auditInput} defaultValue={a.physicalQty}
                      onChange={e => setAuditData(ad => ad.map(x => x.id === a.id ? { ...x, physicalQty: Number(e.target.value), variance: Number(e.target.value) - x.systemQty } : x))} />
                  </span>
                  <span style={{ fontWeight: 700, color: a.variance < 0 ? '#DC2626' : a.variance > 0 ? '#059669' : 'var(--ink3)' }}>
                    {a.variance > 0 ? '+' : ''}{a.variance}
                  </span>
                  <span style={{ fontSize: 12 }}>{a.auditedBy}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{new Date(a.auditDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button className={s.btnPrimary}>Save Audit Results</button>
            </div>
          </div>
        )}

        {/* ── REPORTS TAB ── */}
        {tab === 'reports' && (
          <div className={s.tableSection}>
            <div className={s.reportTabs}>
              {[
                { key: 'stock_status', label: 'Stock Status' },
                { key: 'turnover', label: 'Turnover Rate' },
                { key: 'shrinkage', label: 'Shrinkage' },
              ].map(r => (
                <button key={r.key} className={`${s.reportTab} ${reportType === r.key ? s.reportTabOn : ''}`} onClick={() => setReportType(r.key)}>
                  {r.label}
                </button>
              ))}
            </div>

            {reportType === 'stock_status' && (
              <div className={s.table}>
                <div className={s.tHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
                  <span>Product</span><span>SKU</span><span>On Hand</span><span>Value</span><span>Status</span>
                </div>
                {inventory.map(i => (
                  <div key={i.id} className={s.tRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight: 500 }}>{i.name}</span>
                    <span className={s.mono}>{i.sku}</span>
                    <span>{i.stock}</span>
                    <span>{fmt(i.costPrice * i.stock)}</span>
                    <span><span style={{ background: STATUS_CFG[i.status]?.bg, color: STATUS_CFG[i.status]?.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>{STATUS_CFG[i.status]?.label}</span></span>
                  </div>
                ))}
              </div>
            )}

            {reportType === 'turnover' && (
              <div className={s.table}>
                <div className={s.tHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                  <span>Product</span><span>SKU</span><span>Stock</span><span>Turnover Rate</span>
                </div>
                {[...inventory].sort((a, b) => (b.sold || 0) - (a.sold || 0)).map(i => (
                  <div key={i.id} className={s.tRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight: 500 }}>{i.name}</span>
                    <span className={s.mono}>{i.sku}</span>
                    <span>{i.stock}</span>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>
                      {i.stock > 0 ? `${((i.sold || 0) / i.stock).toFixed(2)}x` : '—'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {reportType === 'shrinkage' && (
              <div className={s.table}>
                <div className={s.tHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                  <span>Product</span><span>SKU</span><span>Units Lost</span><span>Est. Loss Value</span>
                </div>
                {inventory.filter(i => i.shrinkage > 0).map(i => (
                  <div key={i.id} className={s.tRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight: 500 }}>{i.name}</span>
                    <span className={s.mono}>{i.sku}</span>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>{i.shrinkage}</span>
                    <span style={{ color: '#DC2626', fontWeight: 700 }}>{fmt(i.shrinkage * i.costPrice)}</span>
                  </div>
                ))}
                {inventory.filter(i => i.shrinkage > 0).length === 0 && (
                  <div className={s.noRecord}><p>No shrinkage recorded</p></div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SUPPLIERS TAB ── */}
        {tab === 'suppliers' && (
          <div className={s.tableSection}>
            <div className={s.supplierGrid}>
              {suppliers.map(sup => (
                <div key={sup.id} className={s.supplierCard}>
                  <div className={s.supAvatar}>{sup.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                  <div className={s.supInfo}>
                    <div className={s.supName}>{sup.name}</div>
                    <div className={s.supDetail}><Ic size={12}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></Ic>{sup.contact}</div>
                    <div className={s.supDetail}><Ic size={12}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6" /></Ic>{sup.phone}</div>
                    <div className={s.supDetail}><Ic size={12}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M22 6l-10 7L2 6" /></Ic>{sup.email}</div>
                    <span className={s.supCat}>{sup.category}</span>
                  </div>
                </div>
              ))}
              <button className={s.supAddCard}>
                <Ic size={22}><path d="M12 5v14M5 12h14" /></Ic>
                <span>Add Supplier</span>
              </button>
            </div>
          </div>
        )}

        {/* ── ROLES TAB ── */}
        {tab === 'roles' && (
          <div className={s.rolesSection}>
            <p className={s.roleDesc}>Control who can view and modify inventory data across your store.</p>
            <div className={s.rolesGrid}>
              {ROLES.map(r => (
                <div key={r.role} className={s.roleCard} style={{ borderLeft: `4px solid ${r.color}` }}>
                  <div className={s.roleAvatar} style={{ background: r.bg, color: r.color }}>{r.role[0]}</div>
                  <div>
                    <div className={s.roleName}>{r.role}</div>
                    <div className={s.roleAccess}>{r.access}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.roleNote}>
              <Ic size={14}><circle cx="12" cy="12" r="10" /><path d="M12 8h.01M12 12v4" /></Ic>
              <span>Manage detailed role permissions in <strong>Settings → User Management</strong></span>
            </div>
          </div>
        )}
      </div>

      {modal === 'item' && <ItemModal item={editItem} suppliers={suppliers} onClose={() => { setModal(null); setEditItem(null) }} onSave={saveItem} />}
      {modal === 'po' && <POModal suppliers={suppliers} onClose={() => setModal(null)} onSave={savePO} />}
    </div>
  )
}
