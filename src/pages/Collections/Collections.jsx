import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import styles from './Collections.module.css'
import { LOCATIONS, LOCATION_TYPE_CFG, ALL_PRODUCTS, SEED_COLLECTIONS } from '../../data/collections'
import CollectionModal from './components/CollectionModal'
import InventoryModal  from './components/InventoryModal'
import LocationsModal  from './components/LocationsModal'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

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

/* ── Animated counter ──────────────────────────────────────────── */
function Counter({ target, duration = 900 }) {
  const [val, setVal] = useState(0)
  const raf = useRef(null)
  useEffect(() => {
    const start = performance.now()
    const num = Number(target)
    const tick = now => {
      const p = Math.min((now - start) / duration, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(e * num))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])
  return <>{val.toLocaleString()}</>
}

/* ── Search suggestions (portal-based) ────────────────────────── */
function SearchWithSuggestions({ value, onChange, collections, onSelectCollection, onSelectProduct, placeholder }) {
  const [suggestions, setSuggestions]   = useState([])
  const [showSugg,    setShowSugg]       = useState(false)
  const [focusedIdx,  setFocusedIdx]     = useState(-1)
  const [menuPos,     setMenuPos]        = useState({ top: 0, left: 0, width: 0 })
  const wrapRef   = useRef(null)
  const inputRef  = useRef(null)
  const timerRef  = useRef(null)

  const getSuggestions = useCallback((q) => {
    if (!q.trim()) return []
    const lq = q.toLowerCase()
    const results = []

    collections.filter(c =>
      c.name.toLowerCase().includes(lq) || (c.desc || '').toLowerCase().includes(lq)
    ).slice(0, 3).forEach(c => {
      const total = Object.values(c.locationInventory)
        .reduce((a, loc) => a + Object.values(loc).reduce((b, v) => b + v, 0), 0)
      results.push({ type: 'collection', label: c.name, sub: `${c.productIds.length} products · ${total} units`, id: c.id, status: c.status })
    })

    const pSeen = new Set()
    ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(lq) || p.sku.toLowerCase().includes(lq))
      .slice(0, 3)
      .forEach(p => {
        if (!pSeen.has(p.id)) {
          pSeen.add(p.id)
          results.push({ type: 'product', label: p.name, sub: `${p.sku} · ₦${Number(p.price).toLocaleString()}`, id: p.id, category: p.category })
        }
      })

    return results.slice(0, 6)
  }, [collections])

  const recalc = () => {
    if (!wrapRef.current) return
    const r = wrapRef.current.getBoundingClientRect()
    setMenuPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width })
  }

  const handleInput = (e) => {
    const v = e.target.value
    onChange(v)
    setFocusedIdx(-1)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      recalc()
      setSuggestions(getSuggestions(v))
      setShowSugg(true)
    }, 120)
  }

  const handleFocus = () => {
    if (value) { recalc(); setShowSugg(true) }
  }

  const handleKey = (e) => {
    const n = suggestions.length
    if (e.key === 'ArrowDown')  { e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, n - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, -1)) }
    else if (e.key === 'Enter' && focusedIdx >= 0) pickItem(suggestions[focusedIdx])
    else if (e.key === 'Escape') setShowSugg(false)
  }

  const pickItem = (s) => {
    if (s.type === 'collection') onSelectCollection?.(s.id)
    if (s.type === 'product')    onSelectProduct?.(s.id)
    onChange(s.label)
    setShowSugg(false)
    setFocusedIdx(-1)
  }

  useEffect(() => {
    const h = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSugg(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const hl = (text, q) => {
    if (!q) return text
    const i = text.toLowerCase().indexOf(q.toLowerCase())
    if (i === -1) return text
    return (
      <>
        {text.slice(0, i)}
        <mark style={{ background: '#E6F7F2', color: '#22a080', padding: 0, borderRadius: 2 }}>
          {text.slice(i, i + q.length)}
        </mark>
        {text.slice(i + q.length)}
      </>
    )
  }

  const TYPE_ICONS = {
    collection: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
    product:    'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18',
  }

  const menuContent = showSugg && (
    <div className={styles.suggBox}
      style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, width: menuPos.width, zIndex: 99999 }}>
      {suggestions.length === 0 && value ? (
        <div className={styles.suggEmpty}>No results for "{value}"</div>
      ) : suggestions.map((s, i) => (
        <div key={i}
          className={`${styles.suggItem} ${i === focusedIdx ? styles.suggItemActive : ''}`}
          onMouseDown={() => pickItem(s)}
          onMouseEnter={() => setFocusedIdx(i)}>
          <span className={styles.suggIcon}>
            <Ic d={TYPE_ICONS[s.type]} size={13} stroke="#6B7280" />
          </span>
          <span className={styles.suggContent}>
            <span className={styles.suggLabel}>{hl(s.label, value)}</span>
            <span className={styles.suggSub}>{s.sub}</span>
          </span>
          {s.status && (
            <span className={styles.suggBadge} style={{
              background: s.status === 'active' ? '#ECFDF5' : '#F3F4F6',
              color: s.status === 'active' ? '#059669' : '#6B7280',
            }}>{s.status}</span>
          )}
          {s.category && (
            <span className={styles.suggBadge} style={{ background: '#EFF6FF', color: '#2563EB' }}>{s.category}</span>
          )}
        </div>
      ))}
    </div>
  )

  return (
    <div className={styles.searchBox} ref={wrapRef}>
      <span className={styles.searchIco}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /></span>
      <input
        ref={inputRef}
        className={styles.searchInput}
        placeholder={placeholder || 'Search collections…'}
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {value && (
        <button className={styles.searchClear} onClick={() => { onChange(''); setShowSugg(false) }}>✕</button>
      )}
      {showSugg && createPortal(menuContent, document.body)}
    </div>
  )
}

/* ── Collection Card ───────────────────────────────────────────── */
function CollectionCard({ collection, onEdit, onDelete, onManageInventory, onViewProducts, style }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const totalStock = Object.values(collection.locationInventory)
    .reduce((a, loc) => a + Object.values(loc).reduce((b, v) => b + v, 0), 0)

  const lowStockCount = (() => {
    let c = 0
    ALL_PRODUCTS.filter(p => collection.productIds.includes(p.id)).forEach(p => {
      LOCATIONS.filter(l => l.active).forEach(l => {
        const q = collection.locationInventory[l.id]?.[p.id] ?? 0
        if (q > 0 && q <= 5) c++
      })
    })
    return c
  })()

  return (
    <div className={styles.collCard} style={style}>
      <div className={styles.collImgWrap}>
        {collection.img
          ? <img src={collection.img} alt={collection.name} className={styles.collImg} />
          : (
            <div className={styles.collImgPh}>
              <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={28} stroke="#9CA3AF" />
            </div>
          )
        }
        <span className={styles.collStatusBadge} style={{
          background: collection.status === 'active' ? '#ECFDF5' : '#F3F4F6',
          color:      collection.status === 'active' ? '#059669' : '#6B7280',
        }}>
          {collection.status}
        </span>
        {lowStockCount > 0 && (
          <span className={styles.collLowBadge}>
            <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={11} stroke="#D97706" />
            {lowStockCount} low
          </span>
        )}
      </div>

      <div className={styles.collInfo}>
        <div className={styles.collName}>{collection.name}</div>
        {collection.desc && <div className={styles.collDesc}>{collection.desc}</div>}

        <div className={styles.collMeta}>
          <span className={styles.collMetaItem}>
            <Ic d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" size={12} />
            {collection.productIds.length} products
          </span>
          <span className={styles.collMetaItem}>
            <Ic d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={12} />
            {totalStock} units
          </span>
        </div>

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
        {confirmDelete ? (
          <>
            <span className={styles.confirmTxt}>Delete?</span>
            <button className={styles.actBtnRed} onClick={() => onDelete(collection.id)}>Yes</button>
            <button className={styles.actBtn} onClick={() => setConfirmDelete(false)}>No</button>
          </>
        ) : (
          <>
            <button className={styles.actBtnPrimary} onClick={() => onManageInventory(collection)}>
              <Ic d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={12} />
              Inventory
            </button>
            <button className={styles.actBtn} onClick={() => onViewProducts(collection)}>
              <Ic d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18" size={12} />
              Products
            </button>
            <button className={styles.actBtn} onClick={() => onEdit(collection)}>
              <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={12} />
            </button>
            <button className={styles.actBtnRed} onClick={() => setConfirmDelete(true)}>
              <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ── Locations Overview tab ────────────────────────────────────── */
function LocationsOverview({ collections, onManageLocations, navigate }) {
  return (
    <div className={styles.locOverview}>
      {LOCATIONS.map(loc => {
        const locType = LOCATION_TYPE_CFG[loc.type]
        const locStockByCollection = collections.map(c => {
          const products = ALL_PRODUCTS.filter(p => c.productIds.includes(p.id))
          const stock    = products.reduce((a, p) => a + (c.locationInventory[loc.id]?.[p.id] || 0), 0)
          return { collectionName: c.name, collectionId: c.id, stock }
        })
        const totalLocStock = locStockByCollection.reduce((a, b) => a + b.stock, 0)
        const outOfStock    = locStockByCollection.filter(c => c.stock === 0).length
        const lowStock      = (() => {
          let count = 0
          collections.forEach(c => {
            ALL_PRODUCTS.filter(p => c.productIds.includes(p.id)).forEach(p => {
              const q = c.locationInventory[loc.id]?.[p.id] ?? 0
              if (q > 0 && q <= 5) count++
            })
          })
          return count
        })()

        return (
          <div key={loc.id}
            className={`${styles.locOverviewCard} ${!loc.active ? styles.locOverviewCardInactive : ''}`}>
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
                <div className={styles.locOverviewStatVal} style={{ color: outOfStock > 0 ? '#EF4444' : '#059669' }}>
                  {outOfStock}
                </div>
                <div className={styles.locOverviewStatLbl}>Out of Stock</div>
              </div>
              <div className={styles.locOverviewStat}>
                <div className={styles.locOverviewStatVal} style={{ color: lowStock > 0 ? '#D97706' : '#059669' }}>
                  {lowStock}
                </div>
                <div className={styles.locOverviewStatLbl}>Low Stock</div>
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

            <div className={styles.locCardFooter}>
              <button className={styles.locCardBtn} onClick={onManageLocations}>
                <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={12} />
                Manage
              </button>
              <button className={styles.locCardBtn}
                onClick={() => navigate('/analytics', { state: { location: loc.id } })}>
                <Ic d="M18 20V10M12 20V4M6 20v-6" size={12} />
                Analytics
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */
export default function Collections() {
  const navigate = useNavigate()

  const [collections,  setCollections]  = useState(SEED_COLLECTIONS)
  const [modal,        setModal]        = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [invTarget,    setInvTarget]    = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [activeTab,    setActiveTab]    = useState('collections')
  const [visible,      setVisible]      = useState(false)
  const [sortBy,       setSortBy]       = useState('name')
  const [toast,        setToast]        = useState(null)
  const [viewProducts, setViewProducts] = useState(null)

  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t) }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const showToast = (msg, type = 'success') => setToast({ msg, type })

  /* ── Filtering + sorting ─────────────────────────────────────── */
  let filtered = collections.filter(c => {
    const q   = search.toLowerCase()
    const ms  = c.name.toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q)
    const mst = filterStatus === 'all' || c.status === filterStatus
    return ms && mst
  })

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'name')     return a.name.localeCompare(b.name)
    if (sortBy === 'products') return b.productIds.length - a.productIds.length
    if (sortBy === 'stock') {
      const stockOf = c => Object.values(c.locationInventory)
        .reduce((x, loc) => x + Object.values(loc).reduce((y, v) => y + v, 0), 0)
      return stockOf(b) - stockOf(a)
    }
    return 0
  })

  /* ── Mutations ───────────────────────────────────────────────── */
  const saveCollection = data => {
    if (editTarget) {
      setCollections(cs => cs.map(c => c.id === editTarget.id ? { ...c, ...data } : c))
      showToast('Collection updated')
    } else {
      setCollections(cs => [...cs, {
        id: `col-${Date.now()}`,
        ...data,
        locationInventory: Object.fromEntries(
          LOCATIONS.map(l => [l.id, Object.fromEntries(data.productIds.map(pid => [pid, 0]))])
        ),
      }])
      showToast('Collection created')
    }
    setModal(null); setEditTarget(null)
  }

  const saveInventory = newInventory => {
    setCollections(cs => cs.map(c => c.id === invTarget.id ? { ...c, locationInventory: newInventory } : c))
    setInvTarget(null)
    showToast('Inventory saved')
  }

  const deleteCollection = id => {
    setCollections(cs => cs.filter(c => c.id !== id))
    showToast('Collection deleted', 'error')
  }

  /* ── Stats ───────────────────────────────────────────────────── */
  const totalProducts  = [...new Set(collections.flatMap(c => c.productIds))].length
  const totalLocations = LOCATIONS.filter(l => l.active).length
  const totalStock     = collections.reduce((a, c) =>
    a + Object.values(c.locationInventory).reduce((b, loc) =>
      b + Object.values(loc).reduce((d, q) => d + q, 0), 0), 0)
  const lowStockAlerts = collections.reduce((a, c) => {
    let count = 0
    ALL_PRODUCTS.filter(p => c.productIds.includes(p.id)).forEach(p => {
      LOCATIONS.filter(l => l.active).forEach(l => {
        const q = c.locationInventory[l.id]?.[p.id] ?? 0
        if (q > 0 && q <= 5) count++
      })
    })
    return a + count
  }, 0)

  const STATS = [
    { label: 'Total Collections', value: collections.length, accent: '#1a1a2e', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',                                                  onClick: () => setFilterStatus('all') },
    { label: 'Products in Use',   value: totalProducts,      accent: '#2DBD97', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18',                                                onClick: () => navigate('/products') },
    { label: 'Active Locations',  value: totalLocations,     accent: '#3B82F6', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',                                                            onClick: () => setActiveTab('locations') },
    { label: 'Total Stock Units', value: totalStock,         accent: '#8B5CF6', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', onClick: () => {} },
    { label: 'Low Stock Alerts',  value: lowStockAlerts,     accent: lowStockAlerts > 0 ? '#EF4444' : '#9CA3AF', icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01', onClick: () => navigate('/inventory') },
  ]

  return (
    <div className={`${styles.page} ${visible ? styles.pageVisible : ''}`}>

      {/* ── Toast ────────────────────────────────────────────────── */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          <Ic d={toast.type === 'error' ? 'M18 6L6 18M6 6l12 12' : 'M20 6L9 17l-5-5'} size={13} stroke={toast.type === 'error' ? '#EF4444' : '#2DBD97'} />
          {toast.msg}
        </div>
      )}

      {/* ── Topbar ───────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pgTitle}>Collections</h1>
          <p className={styles.pgSub}>Organise products by theme, season, or channel</p>
        </div>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline} onClick={() => navigate('/inventory')}>
            <Ic d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" size={14} />
            Inventory
          </button>
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

        {/* ── KPI Stats ────────────────────────────────────────── */}
        <div className={styles.statsRow}>
          {STATS.map((s, i) => (
            <div key={s.label} className={styles.statCard}
              style={{ animationDelay: `${i * 55}ms`, cursor: 'pointer' }}
              onClick={s.onClick}
              role="button" tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && s.onClick()}>
              <div>
                <div className={styles.statTop}>
                  <span className={styles.statLabel}>{s.label}</span>
                  <Ic d={s.icon} size={15} stroke={s.accent} />
                </div>
                <div className={styles.statValue} style={{ color: s.accent }}>
                  <Counter target={s.value} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Alert banners ─────────────────────────────────────── */}
        {lowStockAlerts > 0 && (
          <div className={styles.alertBanner}
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/inventory')}>
            <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={15} stroke="#B45309" />
            <span>
              <strong>{lowStockAlerts} product–location combination{lowStockAlerts > 1 ? 's' : ''}</strong> running low on stock.
            </span>
            <span className={styles.alertLink}>View inventory →</span>
          </div>
        )}

        {/* ── Tab bar ──────────────────────────────────────────── */}
        <div className={styles.tabBar}>
          <div className={styles.tabs}>
            {[['collections', 'Collections'], ['locations', 'Locations Overview']].map(([key, label]) => (
              <button key={key}
                className={`${styles.tab} ${activeTab === key ? styles.tabOn : ''}`}
                onClick={() => setActiveTab(key)}>
                {label}
                {key === 'collections' && (
                  <span className={`${styles.tabBadge} ${activeTab === 'collections' ? styles.tabBadgeOn : ''}`}>
                    {collections.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className={styles.tabActions}>
            {activeTab === 'collections' && (
              <select className={styles.filterSel} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="name">Sort: Name</option>
                <option value="products">Sort: Products</option>
                <option value="stock">Sort: Stock</option>
              </select>
            )}
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
            <SearchWithSuggestions
              value={search}
              onChange={setSearch}
              collections={collections}
              onSelectCollection={id => {
                const col = collections.find(c => c.id === id)
                if (col) { setEditTarget(col); setModal('collection') }
              }}
              onSelectProduct={id => navigate('/products', { state: { highlight: id } })}
            />
          </div>
        </div>

        {/* ── Collections grid ──────────────────────────────────── */}
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
              <p>{search ? `No results for "${search}"` : 'Create your first collection to organise products by theme or season'}</p>
              {search
                ? <button className={styles.btnOutline} onClick={() => setSearch('')}>Clear search</button>
                : <button className={styles.btnPrimary} onClick={() => { setEditTarget(null); setModal('collection') }}>
                    <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" /> Create Collection
                  </button>
              }
            </div>
          ) : (
            <div className={styles.collGrid}>
              {filtered.map((c, i) => (
                <CollectionCard
                  key={c.id}
                  collection={c}
                  style={{ animationDelay: `${i * 50}ms` }}
                  onEdit={col => { setEditTarget(col); setModal('collection') }}
                  onDelete={deleteCollection}
                  onManageInventory={col => { setInvTarget(col); setModal('inventory') }}
                  onViewProducts={col => navigate('/products', { state: { collection: col.id } })}
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

        {activeTab === 'locations' && (
          <LocationsOverview
            collections={collections}
            onManageLocations={() => setModal('locations')}
            navigate={navigate}
          />
        )}
      </div>

      {/* ── Modals ───────────────────────────────────────────────── */}
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
