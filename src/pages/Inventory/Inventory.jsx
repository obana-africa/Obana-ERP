import { useState } from 'react'
import s from './Inventory.module.css'
import { fmt } from '../../utils/formatters'
import {
  SAMPLE_INVENTORY, SUPPLIERS, PURCHASE_ORDERS, STOCK_AUDIT,
  ROLES, STATUS_CFG, PO_CFG, INVENTORY_TABS,
} from '../../data/inventory'
import ItemModal from './components/ItemModal'
import POModal   from './components/POModal'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const StatusPill = ({ cfg }) => (
  <span style={{
    background:cfg?.bg, color:cfg?.color,
    padding:'3px 10px', borderRadius:20,
    fontSize:11.5, fontWeight:600, whiteSpace:'nowrap',
  }}>{cfg?.label}</span>
)

const fmtDate = d => new Date(d).toLocaleDateString('en-NG', { dateStyle:'medium' })

const ICONS = {
  box:   'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  naira: 'M2 8h20M2 16h20M6 4v16M18 4v16',
  alert: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4M12 17h.01'],
  info:  ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 8h.01M12 12v4'],
  edit:  ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash: ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  plus:  'M12 5v14M5 12h14',
  search:['M11 11a8 8 0 1 0 0-16 8 8 0 0 0 0 16z','M21 21l-4.35-4.35'],
  po:    ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2','M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2'],
  user:  ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8'],
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.36 13',
  mail:  ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
}

export default function Inventory() {
  const [tab,            setTab]            = useState('items')
  const [inventory,      setInventory]      = useState(SAMPLE_INVENTORY)
  const [suppliers]                         = useState(SUPPLIERS)
  const [purchaseOrders, setPurchaseOrders] = useState(PURCHASE_ORDERS)
  const [auditData,      setAuditData]      = useState(STOCK_AUDIT)
  const [modal,          setModal]          = useState(null)
  const [editItem,       setEditItem]       = useState(null)
  const [search,         setSearch]         = useState('')
  const [showDrop,       setShowDrop]       = useState(false)
  const [filterStatus,   setFilterStatus]   = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [reportType,     setReportType]     = useState('stock_status')

  const totalItems     = inventory.length
  const totalValue     = inventory.reduce((a,i) => a + i.costPrice * i.stock, 0)
  const lowStock       = inventory.filter(i => i.stock > 0 && i.stock <= i.reorderPoint).length
  const outOfStock     = inventory.filter(i => i.stock === 0).length
  const totalShrinkage = inventory.reduce((a,i) => a + (i.shrinkage||0), 0)

  const categories = [...new Set(inventory.map(i => i.category))]
  const filtered   = inventory.filter(i => {
    const q  = search.toLowerCase()
    const ms = i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q) || i.barcode?.includes(q)
    const mt = filterStatus   === 'all' || i.status   === filterStatus
    const mc = filterCategory === 'all' || i.category === filterCategory
    return ms && mt && mc
  })

  const saveItem = data => {
    const stock  = Number(data.stock)
    const rp     = Number(data.reorderPoint)
    const status = stock===0 ? 'out_of_stock' : stock<=rp ? 'low_stock' : 'in_stock'
    if (editItem) setInventory(inv => inv.map(i => i.id===editItem.id ? { ...i,...data,status } : i))
    else          setInventory(inv => [...inv, { ...data,status,id:Date.now(),shrinkage:0,lastRestocked:new Date().toISOString().split('T')[0] }])
    setModal(null); setEditItem(null)
  }

  const deleteItem = id => setInventory(inv => inv.filter(i => i.id!==id))
  const savePO     = data => { setPurchaseOrders(pos => [...pos,data]); setModal(null) }

  const STATS = [
    { label:'Total SKUs',       value:totalItems,      accent:'#2DBD97', icon:ICONS.box   },
    { label:'Inventory Value',  value:fmt(totalValue), accent:'#E8C547', icon:ICONS.naira },
    { label:'Low Stock Alerts', value:lowStock,        accent:'#F59E0B', icon:ICONS.alert },
    { label:'Out of Stock',     value:outOfStock,      accent:'#EF4444', icon:ICONS.box   },
    { label:'Total Shrinkage',  value:totalShrinkage,  accent:'#8B5CF6', icon:'M3 3h18v18H3zM3 9h18M9 21V9' },
  ]

  return (
    <div className={s.page}>
      <header className={s.topbar}>
        <h1 className={s.pgTitle}>Inventory</h1>
        <div className={s.topbarR}>
          <button className={s.btnOutline} onClick={() => setModal('po')}>
            <Ic d={ICONS.po} size={13} /> Purchase Order
          </button>
          <button className={s.btnPrimary} onClick={() => { setEditItem(null); setModal('item') }}>
            <Ic d={ICONS.plus} size={13} /> Add Item
          </button>
        </div>
      </header>

      <div className={s.content}>
        <div className={s.statsRow}>
          {STATS.map(stat => (
            <div key={stat.label} className={s.statCard}>
              <div className={s.statTop}>
                <span className={s.statLbl}>{stat.label}</span>
                <Ic d={stat.icon} size={15} stroke={stat.accent} />
              </div>
              <div className={s.statVal} style={{ color:stat.accent }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {(lowStock > 0 || outOfStock > 0) && (
          <div className={s.alertBanner}>
            <Ic d={ICONS.alert} size={15} />
            <span>
              {outOfStock > 0 && <><strong>{outOfStock} item{outOfStock>1?'s':''}</strong> out of stock. </>}
              {lowStock > 0 && <><strong>{lowStock} item{lowStock>1?'s':''}</strong> below reorder point. </>}
              Restock soon to avoid overselling.
            </span>
            <button className={s.alertBtn} onClick={() => setModal('po')}>Create Purchase Order →</button>
          </div>
        )}

        <div className={s.tabBar}>
          <div className={s.tabs}>
            {INVENTORY_TABS.map(t => (
              <button key={t.key} className={`${s.tab} ${tab===t.key?s.tabOn:''}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ITEMS */}
        {tab === 'items' && (
          <div className={s.tableSection}>
            <div className={s.controls}>
              <div className={s.controlsL}>
                <div className={s.searchBox} style={{ position:'relative' }}>
                  <span className={s.searchIco}><Ic d={ICONS.search} size={14} /></span>
                  <input placeholder="Search by name, SKU, barcode…" value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setShowDrop(true)}
                    onBlur={() => setTimeout(() => setShowDrop(false), 150)} />
                  {showDrop && (
                    <div className={s.searchDrop}>
                      {(search ? inventory.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())) : inventory).map(i => (
                        <div key={i.id} className={s.searchDropItem} onMouseDown={() => { setSearch(i.name); setShowDrop(false) }}>
                          <div className={s.searchDropThumb}>{i.name[0]}</div>
                          <div className={s.searchDropInfo}>
                            <div className={s.searchDropName}>{i.name}</div>
                            <div className={s.searchDropMeta}>{i.sku} · {i.category} · {fmt(i.price)}</div>
                          </div>
                          <span style={{ fontSize:11.5, fontWeight:600, color:STATUS_CFG[i.status]?.color }}>{STATUS_CFG[i.status]?.label}</span>
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
                <span>Item</span><span>SKU</span><span>Barcode</span><span>Price</span><span>Cost</span>
                <span>Stock</span><span>Reorder Pt</span><span>Supplier</span><span>Status</span><span />
              </div>
              {filtered.length === 0 ? (
                <div className={s.noRecord}><Ic d={ICONS.box} size={36} stroke="#9CA3AF" /><p>No items found</p></div>
              ) : filtered.map(item => (
                <div key={item.id} className={`${s.tRow} ${item.stock===0?s.tRowDanger:item.stock<=item.reorderPoint?s.tRowWarn:''}`}>
                  <span className={s.itemCell}>
                    <div className={s.itemThumb}>{item.name[0]}</div>
                    <div>
                      <div className={s.itemName}>{item.name}{item.isKit && <span className={s.kitBadge}>Kit</span>}</div>
                      <div className={s.itemTags}>{item.tags?.slice(0,2).map(t => <span key={t} className={s.tag}>{t}</span>)}</div>
                    </div>
                  </span>
                  <span className={s.mono}>{item.sku}</span>
                  <span className={s.mono} style={{ fontSize:11 }}>{item.barcode||'—'}</span>
                  <span>{fmt(item.price)}</span>
                  <span style={{ color:'var(--ink3)' }}>{fmt(item.costPrice)}</span>
                  <span>
                    <div className={s.stockCell}>
                      <span className={s.stockNum} style={{ color:item.stock===0?'#DC2626':item.stock<=item.reorderPoint?'#D97706':'#059669' }}>{item.stock}</span>
                      <div className={s.stockBar}>
                        <div className={s.stockBarFill} style={{ width:`${Math.min(100,(item.stock/(item.reorderPoint*3))*100)}%`, background:item.stock===0?'#EF4444':item.stock<=item.reorderPoint?'#F59E0B':'#2DBD97' }} />
                      </div>
                    </div>
                  </span>
                  <span style={{ fontSize:12, color:'var(--ink3)' }}>{item.reorderPoint} / {item.safetyStock}</span>
                  <span style={{ fontSize:12 }}>{item.supplier||'—'}</span>
                  <span><StatusPill cfg={STATUS_CFG[item.status]} /></span>
                  <span className={s.actCell}>
                    <button className={s.iconBtn} onClick={() => { setEditItem(item); setModal('item') }}><Ic d={ICONS.edit} size={13} /></button>
                    <button className={s.iconBtnRed} onClick={() => deleteItem(item.id)}><Ic d={ICONS.trash} size={13} /></button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PO */}
        {tab === 'po' && (
          <div className={s.tableSection}>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button className={s.btnPrimary} onClick={() => setModal('po')}><Ic d={ICONS.plus} size={13} /> New Purchase Order</button>
            </div>
            <div className={s.table}>
              <div className={s.tHead} style={{ gridTemplateColumns:'1fr 1.5fr 0.7fr 1fr 1fr 1fr 0.6fr' }}>
                <span>PO Number</span><span>Supplier</span><span>Items</span><span>Total</span><span>Order Date</span><span>Expected</span><span>Status</span>
              </div>
              {purchaseOrders.map(po => (
                <div key={po.id} className={s.tRow} style={{ gridTemplateColumns:'1fr 1.5fr 0.7fr 1fr 1fr 1fr 0.6fr' }}>
                  <span className={s.mono} style={{ fontWeight:600, color:'var(--navy)' }}>{po.id}</span>
                  <span>{po.supplier}</span><span>{po.items}</span>
                  <span style={{ fontWeight:700 }}>{fmt(po.total)}</span>
                  <span style={{ fontSize:12, color:'var(--ink3)' }}>{fmtDate(po.date)}</span>
                  <span style={{ fontSize:12, color:'var(--ink3)' }}>{fmtDate(po.expectedDate)}</span>
                  <span><StatusPill cfg={PO_CFG[po.status]} /></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT */}
        {tab === 'audit' && (
          <div className={s.tableSection}>
            <div className={s.auditInfo}><Ic d={ICONS.info} size={15} /><span>Reconcile physical stock counts with system data. Variances are flagged automatically.</span></div>
            <div className={s.table}>
              <div className={s.tHead} style={{ gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr 0.8fr' }}>
                <span>Item</span><span>SKU</span><span>System Qty</span><span>Physical Qty</span><span>Variance</span><span>Audited By</span><span>Date</span>
              </div>
              {auditData.map(a => (
                <div key={a.id} className={s.tRow} style={{ gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr 0.8fr' }}>
                  <span style={{ fontWeight:500 }}>{a.name}</span>
                  <span className={s.mono}>{a.sku}</span>
                  <span>{a.systemQty}</span>
                  <span>
                    <input type="number" className={s.auditInput} defaultValue={a.physicalQty}
                      onChange={e => setAuditData(ad => ad.map(x => x.id===a.id ? { ...x, physicalQty:Number(e.target.value), variance:Number(e.target.value)-x.systemQty } : x))} />
                  </span>
                  <span style={{ fontWeight:700, color:a.variance<0?'#DC2626':a.variance>0?'#059669':'var(--ink3)' }}>
                    {a.variance>0?'+':''}{a.variance}
                  </span>
                  <span style={{ fontSize:12 }}>{a.auditedBy}</span>
                  <span style={{ fontSize:12, color:'var(--ink3)' }}>{fmtDate(a.auditDate)}</span>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
              <button className={s.btnPrimary}>Save Audit Results</button>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {tab === 'reports' && (
          <div className={s.tableSection}>
            <div className={s.reportTabs}>
              {[{ key:'stock_status',label:'Stock Status' },{ key:'turnover',label:'Turnover Rate' },{ key:'shrinkage',label:'Shrinkage' }].map(r => (
                <button key={r.key} className={`${s.reportTab} ${reportType===r.key?s.reportTabOn:''}`} onClick={() => setReportType(r.key)}>{r.label}</button>
              ))}
            </div>
            {reportType === 'stock_status' && (
              <div className={s.table}>
                <div className={s.tHead} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr' }}><span>Product</span><span>SKU</span><span>On Hand</span><span>Value</span><span>Status</span></div>
                {inventory.map(i => (
                  <div key={i.id} className={s.tRow} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight:500 }}>{i.name}</span><span className={s.mono}>{i.sku}</span>
                    <span>{i.stock}</span><span>{fmt(i.costPrice*i.stock)}</span>
                    <span><StatusPill cfg={STATUS_CFG[i.status]} /></span>
                  </div>
                ))}
              </div>
            )}
            {reportType === 'turnover' && (
              <div className={s.table}>
                <div className={s.tHead} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr' }}><span>Product</span><span>SKU</span><span>Stock</span><span>Turnover Rate</span></div>
                {[...inventory].sort((a,b)=>(b.sold||0)-(a.sold||0)).map(i => (
                  <div key={i.id} className={s.tRow} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight:500 }}>{i.name}</span><span className={s.mono}>{i.sku}</span>
                    <span>{i.stock}</span>
                    <span style={{ fontWeight:700, color:'var(--navy)' }}>{i.stock>0?`${((i.sold||0)/i.stock).toFixed(2)}x`:'—'}</span>
                  </div>
                ))}
              </div>
            )}
            {reportType === 'shrinkage' && (
              <div className={s.table}>
                <div className={s.tHead} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr' }}><span>Product</span><span>SKU</span><span>Units Lost</span><span>Est. Loss Value</span></div>
                {inventory.filter(i=>i.shrinkage>0).map(i => (
                  <div key={i.id} className={s.tRow} style={{ gridTemplateColumns:'2fr 1fr 1fr 1fr' }}>
                    <span style={{ fontWeight:500 }}>{i.name}</span><span className={s.mono}>{i.sku}</span>
                    <span style={{ color:'#DC2626', fontWeight:700 }}>{i.shrinkage}</span>
                    <span style={{ color:'#DC2626', fontWeight:700 }}>{fmt(i.shrinkage*i.costPrice)}</span>
                  </div>
                ))}
                {inventory.filter(i=>i.shrinkage>0).length===0 && <div className={s.noRecord}><p>No shrinkage recorded</p></div>}
              </div>
            )}
          </div>
        )}

        {/* SUPPLIERS */}
        {tab === 'suppliers' && (
          <div className={s.tableSection}>
            <div className={s.supplierGrid}>
              {suppliers.map(sup => (
                <div key={sup.id} className={s.supplierCard}>
                  <div className={s.supAvatar}>{sup.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                  <div className={s.supInfo}>
                    <div className={s.supName}>{sup.name}</div>
                    <div className={s.supDetail}><Ic d={ICONS.user} size={12} />{sup.contact}</div>
                    <div className={s.supDetail}><Ic d={ICONS.phone} size={12} />{sup.phone}</div>
                    <div className={s.supDetail}><Ic d={ICONS.mail} size={12} />{sup.email}</div>
                    <span className={s.supCat}>{sup.category}</span>
                  </div>
                </div>
              ))}
              <button className={s.supAddCard}><Ic d={ICONS.plus} size={22} /><span>Add Supplier</span></button>
            </div>
          </div>
        )}

        {/* ROLES */}
        {tab === 'roles' && (
          <div className={s.rolesSection}>
            <p className={s.roleDesc}>Control who can view and modify inventory data across your store.</p>
            <div className={s.rolesGrid}>
              {ROLES.map(r => (
                <div key={r.role} className={s.roleCard} style={{ borderLeft:`4px solid ${r.color}` }}>
                  <div className={s.roleAvatar} style={{ background:r.bg, color:r.color }}>{r.role[0]}</div>
                  <div><div className={s.roleName}>{r.role}</div><div className={s.roleAccess}>{r.access}</div></div>
                </div>
              ))}
            </div>
            <div className={s.roleNote}>
              <Ic d={ICONS.info} size={14} />
              <span>Manage detailed role permissions in <strong>Settings → User Management</strong></span>
            </div>
          </div>
        )}
      </div>

      {modal==='item' && <ItemModal item={editItem} suppliers={suppliers} onClose={() => { setModal(null); setEditItem(null) }} onSave={saveItem} />}
      {modal==='po'   && <POModal suppliers={suppliers} onClose={() => setModal(null)} onSave={savePO} />}
    </div>
  )
}
