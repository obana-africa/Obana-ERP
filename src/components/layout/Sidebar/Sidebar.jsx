import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css'

/* ─── Icon helper ────────────────────────────────────────── */
const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ─── Icon paths ─────────────────────────────────────────── */
const ICON = {
  dashboard:   ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  products:    ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'],
  collections: ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  inventory:   ['M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z', 'M3.27 6.96L12 12.01l8.73-5.05', 'M12 22.08V12'],
  transfers:   ['M7 16V4m0 0L3 8m4-4l4 4', 'M17 8v12m0 0l4-4m-4 4l-4-4'],
  orders:      ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', 'M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2'],
  customers:   ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75', 'M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  discounts:   ['M19 5L5 19', 'M6.5 6.5h.01', 'M17.5 17.5h.01', 'M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0'],
  analytics:   ['M18 20V10', 'M12 20V4', 'M6 20v-6'],
  content:     ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  blog:        ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'],
  menus:       ['M3 12h18', 'M3 6h18', 'M3 18h18'],
  files:       ['M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z', 'M13 2v7h7'],
  metaobjects: ['M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'],
  store:       ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  pos:         ['M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z'],
  integrations:['M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8', 'M7.5 4.21l4.5 2.6 4.5-2.6', 'M7.5 19.79V14.6L3 12', 'M21 12l-4.5 2.6v5.19', 'M3.27 6.96L12 12.01l8.73-5.05', 'M12 22.08V12'],
  settings:    ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  bell:        ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  chevron:     'M6 9l6 6 6-6',
}

/* ─── Nav definitions ─────────────────────────────────────── */
const PRODUCT_SUB = [
  {to: '/collections', icon: ICON.collections, label:'Collections' },
  { to: '/inventory',  icon: ICON.inventory,   label: 'Inventory'  },
  { to: '/transfers',  icon: ICON.transfers,   label: 'Transfers'  },
]

const CONTENT_SUB = [
  { to: '/content/blog-posts',  icon: ICON.blog,        label: 'Blog Posts'  },
  { to: '/content/menus',       icon: ICON.menus,       label: 'Menus'       },
  { to: '/content/files',       icon: ICON.files,       label: 'Files'       },
  { to: '/content/metaobjects', icon: ICON.metaobjects, label: 'Metaobjects' },
]

const MAIN_NAV = [
  { to: '/orders',    icon: ICON.orders,    label: 'Orders'    },
  { to: '/customers', icon: ICON.customers, label: 'Customers' },
  { to: '/discounts', icon: ICON.discounts, label: 'Discounts' },
  { to: '/analytics', icon: ICON.analytics, label: 'Analytics' },
]

const SALES_NAV = [
  { to: '/online-store', icon: ICON.store, label: 'Online Store'   },
  { to: '/pos',          icon: ICON.pos,   label: 'Point of Sale'  },
]

const APP_NAV = [
  { to: '/integrations', icon: ICON.integrations, label: 'Integrations' },
]

/* ─── Sub-nav link ───────────────────────────────────────── */
const SubLink = ({ to, icon, label }) => (
  <NavLink to={to}
    className={({ isActive }) => `${styles.subNavItem} ${isActive ? styles.subNavActive : ''}`}>
    <Ic d={icon} size={15} />
    <span>{label}</span>
  </NavLink>
)

/* ─── Top-level nav link ─────────────────────────────────── */
const NavItem = ({ to, icon, label, badge }) => (
  <NavLink to={to}
    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}>
    <span className={styles.navIcon}><Ic d={icon} size={18} /></span>
    <span className={styles.navLabel}>{label}</span>
    {badge && <span className={styles.badge}>{badge}</span>}
  </NavLink>
)

/* ─── Expandable group ───────────────────────────────────── */
const ExpandGroup = ({ to, icon, label, isActive, isOpen, onToggle, children }) => (
  <div className={styles.navExpandGroup}>
    <div className={`${styles.navItem} ${styles.navExpandBtn} ${isActive ? styles.active : ''}`}>
      <NavLink to={to} className={styles.expandLink}>
        <span className={styles.navIcon}><Ic d={icon} size={18} /></span>
        <span className={styles.navLabel}>{label}</span>
      </NavLink>
      <button className={styles.arrowBtn} onClick={onToggle} aria-label={`Toggle ${label}`}>
        <span className={`${styles.navArrow} ${isOpen ? styles.navArrowOpen : ''}`}>
          <Ic d={ICON.chevron} size={16} />
        </span>
      </button>
    </div>
    <div className={`${styles.subNav} ${isOpen ? styles.subNavOpen : ''}`}>
      {children}
    </div>
  </div>
)

/* ─── Hamburger button ───────────────────────────────────── */
const Hamburger = ({ isOpen, onClick }) => (
  <button
    className={styles.hamburger}
    onClick={onClick}
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    aria-expanded={isOpen}
  >
    <span className={`${styles.hBar} ${styles.hBar1} ${isOpen ? styles.hBar1Open : ''}`} />
    <span className={`${styles.hBar} ${styles.hBar2} ${isOpen ? styles.hBar2Open : ''}`} />
    <span className={`${styles.hBar} ${styles.hBar3} ${isOpen ? styles.hBar3Open : ''}`} />
  </button>
)

/* ─── SIDEBAR ─────────────────────────────────────────────── */
const Sidebar = () => {
  const location = useLocation()

  const isProductsActive = location.pathname.startsWith('/products')
    || location.pathname.startsWith('/collections')
    || location.pathname.startsWith('/inventory')
    || location.pathname.startsWith('/transfers')
  const isContentActive = location.pathname.startsWith('/content')

  const [productsOpen, setProductsOpen] = useState(isProductsActive)
  const [contentOpen,  setContentOpen]  = useState(isContentActive)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <>
      <Hamburger isOpen={sidebarOpen} onClick={() => setSidebarOpen(v => !v)} />

      {sidebarOpen && (
        <div className={styles.backdrop} onClick={closeSidebar} aria-hidden="true" />
      )}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>

      {/* Store header */}
      <div className={styles.storeHeader}>
        <div className={styles.logo}>
          <img src="/public/logos/taja logo blue.png" alt="taja logo" className={styles.logoImg} />
        </div>
       
        <button className={styles.notifBtn} aria-label="Notifications">
          <Ic d={ICON.bell} size={17} />
        </button>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navGroup}>

          {/* Dashboard */}
          <NavItem to="/dashboard" icon={ICON.dashboard} label="Home" />

          {/* Products (expandable) */}
          <ExpandGroup
            to="/products"
            icon={ICON.products}
            label="Products"
            isActive={isProductsActive}
            isOpen={productsOpen}
            onToggle={() => setProductsOpen(v => !v)}>
            {PRODUCT_SUB.map(s => <SubLink key={s.to} {...s} />)}
          </ExpandGroup>

          {/* Content (expandable) */}
          <ExpandGroup
            to="/content"
            icon={ICON.content}
            label="Content"
            isActive={isContentActive}
            isOpen={contentOpen}
            onToggle={() => setContentOpen(v => !v)}>
            {CONTENT_SUB.map(s => <SubLink key={s.to} {...s} />)}
          </ExpandGroup>

          {/* Main nav items */}
          {MAIN_NAV.map(item => <NavItem key={item.to} {...item} />)}
        </div>

        <p className={styles.sectionTitle}>Sales Channels</p>
        <div className={styles.navGroup}>
          {SALES_NAV.map(item => <NavItem key={item.to} {...item} />)}
        </div>

        <p className={styles.sectionTitle}>Apps</p>
        <div className={styles.navGroup}>
          {APP_NAV.map(item => <NavItem key={item.to} {...item} />)}
        </div>
      </nav>

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <NavItem to="/settings" icon={ICON.settings} label="Settings" />
      </div>
      </aside>
    </>
  )
}

export default Sidebar

