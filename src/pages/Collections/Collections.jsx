import { useState } from 'react'
import styles from './Collections.module.css'
import { LOCATIONS, LOCATION_TYPE_CFG, ALL_PRODUCTS, SEED_COLLECTIONS } from '../../data/collections'
import CollectionModal from './components/CollectionModal'
import InventoryModal  from './components/InventoryModal'
import LocationsModal  from './components/LocationsModal'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

const Pill = ({ label, bg, color, size = 'sm' }) => (
  <span className={`${styles.pill} ${size === 'xs' ? styles.pillXs : ''}`} style={{ background: bg, color }}>
    {label}
  </span>
)

const LocAvatar = ({ name, active }) => (
  <div className={styles.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
)

// ── Collection Card ───────────────────────────────────────
function CollectionCard({ collection, onEdit, onDelete, onManageInventory }) {
  const totalStock = Object.values(collection.locationInventory)
    .reduce((a, locInv) => a + Object.values(locInv).reduce((b, qty) => b + qty, 0), 0)

  return (
    <div className={styles.collCard}>
      <div className={styles.collImgWrap}>
        {collection.img
          ? <img src={collection.img} alt={collection.name} className={styles.collImg} />
          : <div className={styles.collImgPh}><Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={28} stroke="#9CA3AF" /></div>
        }
        <span className={styles.collStatusBadge} style={{
          background: collection.status === 'active' ? '#ECFDF5' : '#F3F4F6',
          color:      collection.status === 'active' ? '#059669' : '#6B7280',
        }}>
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
        <div className={styles.locStockRow}>
          {LOCATIONS.filter(l => l.active).slice(0,4).map(loc => {
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

// ── Locations Overview tab ────────────────────────────────
function LocationsOverview({ collections }) {
  return (
    <div className={styles.locOverview}>
      {LOCATIONS.map(loc => {
        const locType = LOCATION_TYPE_CFG[loc.type]
        const locStockByCollection = collections.map(c => {
          const products = ALL_PRODUCTS.filter(p => c.productIds.includes(p.id))
          const stock    = products.reduce((a, p) => a + (c.locationInventory[loc.id]?.[p.id] || 0), 0)
          return { collectionName: c.name, stock }
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
                <div className={styles.locOverviewStatVal} style={{ color:'#EF4444' }}>
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
                    <div className={styles.locCollBarFill}
                      style={{ width: totalLocStock ? `${(c.stock / totalLocStock) * 100}%` : '0%' }} />
                  </div>
                  <span className={styles.locCollQty}>{c.stock}</span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Collections() {
  const [collections,  setCollections]  = useState(SEED_COLLECTIONS)
  const [modal,        setModal]        = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [invTarget,    setInvTarget]    = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab,    setActiveTab]    = useState('collections')

  const filtered = collections.filter(c => {
    const q   = search.toLowerCase()
    const ms  = c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    const mst = filterStatus === 'all' || c.status === filterStatus
    return ms && mst
  })

  const saveCollection = data => {
    if (editTarget) {
      setCollections(cs => cs.map(c => c.id === editTarget.id ? { ...c, ...data } : c))
    } else {
      setCollections(cs => [...cs, {
        id: `col-${Date.now()}`,
        ...data,
        locationInventory: Object.fromEntries(
          LOCATIONS.map(l => [l.id, Object.fromEntries(data.productIds.map(pid => [pid, 0]))])
        ),
      }])
    }
    setModal(null); setEditTarget(null)
  }

  const saveInventory = newInventory => {
    setCollections(cs => cs.map(c =>
      c.id === invTarget.id ? { ...c, locationInventory: newInventory } : c
    ))
    setInvTarget(null)
  }

  const deleteCollection = id => setCollections(cs => cs.filter(c => c.id !== id))

  const totalProducts  = [...new Set(collections.flatMap(c => c.productIds))].length
  const totalLocations = LOCATIONS.filter(l => l.active).length
  const totalStock     = collections.reduce((a, c) =>
    a + Object.values(c.locationInventory).reduce((b, locInv) =>
      b + Object.values(locInv).reduce((d, q) => d + q, 0), 0), 0
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

  const STATS = [
    { label:'Total Collections', value:collections.length, accent:'#1a1a2e', icon:'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
    { label:'Products in Use',   value:totalProducts,      accent:'#2DBD97', icon:'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18' },
    { label:'Active Locations',  value:totalLocations,     accent:'#3B82F6', icon:'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z' },
    { label:'Total Stock Units', value:totalStock,         accent:'#8B5CF6', icon:'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
    { label:'Low Stock Alerts',  value:lowStockAlerts,     accent:lowStockAlerts > 0 ? '#EF4444' : '#9CA3AF', icon:'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01' },
  ]

  return (
    <div className={styles.page}>
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

        <div className={styles.statsRow}>
          {STATS.map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>{s.label}</span>
                <Ic d={s.icon} size={15} stroke={s.accent} />
              </div>
              <div className={styles.statValue} style={{ color: s.accent }}>{s.value}</div>
            </div>
          ))}
        </div>

        {lowStockAlerts > 0 && (
          <div className={styles.alertBanner}>
            <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={15} stroke="#B45309" />
            <span><strong>{lowStockAlerts} product–location combination{lowStockAlerts > 1 ? 's' : ''}</strong> running low on stock.</span>
          </div>
        )}

        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {[['collections','Collections'],['locations','Locations Overview']].map(([key, label]) => (
              <button key={key}
                className={`${styles.tab} ${activeTab === key ? styles.tabOn : ''}`}
                onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>
          <div className={styles.tabActions}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /></span>
              <input className={styles.searchInput} placeholder="Search collections…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {activeTab === 'collections' && (
          filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="14" y="22" width="52" height="42" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
                <rect x="22" y="14" width="36" height="42" rx="4" fill="#fff" stroke="#2DBD97" strokeWidth="1.5" />
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
                  key={c.id} collection={c}
                  onEdit={col => { setEditTarget(col); setModal('collection') }}
                  onDelete={deleteCollection}
                  onManageInventory={col => { setInvTarget(col); setModal('inventory') }}
                />
              ))}
              <button className={styles.addCollCard}
                onClick={() => { setEditTarget(null); setModal('collection') }}>
                <Ic d="M12 5v14M5 12h14" size={22} />
                <span>New Collection</span>
              </button>
            </div>
          )
        )}

        {activeTab === 'locations' && <LocationsOverview collections={collections} />}
      </div>

      {modal === 'collection' && (
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
      {modal === 'locations' && <LocationsModal onClose={() => setModal(null)} />}
    </div>
  )
}
