import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Logo from '../../../assets/images/logo/obana-logo.svg';
import {
  MdDashboard, MdPointOfSale, MdShoppingCart,
  MdInventory, MdPeople, MdLocalOffer,
  MdBarChart, MdSettings, MdStorefront,
  MdNotifications, MdContentPaste, MdHub,
  MdCollections, MdKeyboardArrowDown, MdSwapHoriz,
  MdArticle, MdMenu, MdFolder, MdDataObject,
} from "react-icons/md";
import styles from './Sidebar.module.css';

const mainNav = [
  { to: '/orders', icon: <MdShoppingCart />, label: 'Orders',  },
  { to: '/customers', icon: <MdPeople />, label: 'Customers' },
  { to: '/discounts', icon: <MdLocalOffer />, label: 'Discounts' },
  { to: '/analytics', icon: <MdBarChart />, label: 'Analytics' },
];

const productSubNav = [
  { to: '/collections', icon: <MdCollections />, label: 'Collections' },
  { to: '/inventory', icon: <MdInventory />, label: 'Inventory' },
  { to: 'transfers', icon: <MdSwapHoriz />, label: 'Transfers' },
];

const contentSubNav = [
  { to: '/content/blog-posts',   icon: <MdArticle />,    label: 'Blog Posts'   },
  { to: '/content/menus',        icon: <MdMenu />,       label: 'Menus'        },
  { to: '/content/files',        icon: <MdFolder />,     label: 'Files'        },
  { to: '/content/metaobjects',  icon: <MdDataObject />, label: 'Metaobjects'  },
]

const salesNav = [
  {to: '/online-store', icon: <MdStorefront />, label: 'Online Store' },
  { to: '/pos', icon: <MdPointOfSale />, label: 'Point of Sale' },
  
];

const appNav = [
  { to: '/integrations', icon: <MdHub />, label: 'Integrations' },
];

const Sidebar = () => {
  const location = useLocation()
  const isProductsActive = location.pathname.startsWith('/products') || location.pathname.startsWith('/inventory') || location.pathname.startsWith('/transfers')
  const isContentActive = location.pathname.startsWith('/content')
  const [productsOpen, setProductsOpen] = useState(isProductsActive)
  const [contentOpen, setContentOpen] = useState(isContentActive)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.storeHeader}>
        <div className={styles.logo}>
          <img src={Logo} alt="obana logo" width="28" height="28" style={{ objectFit: 'contain' }} />
        </div>
        <div className={styles.storeInfo}>
          <p className={styles.storeName}>OBANA.Africa</p>
          <p className={styles.storeSub}>Admin</p>
        </div>
        <div className={styles.notifBtn}>
          <MdNotifications size={18} />
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navGroup}>

          {/* Home — first item before Products */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}><MdDashboard /></span>
            <span className={styles.navLabel}>Home</span>
          </NavLink>

          {/* Products expandable group */}
          <div className={styles.navExpandGroup}>
           <div className={`${styles.navItem} ${styles.navExpandBtn} ${isProductsActive ? styles.active : ''}`}>
  <NavLink
    to="/products"
    style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, textDecoration: 'none', color: 'inherit' }}
  >
    <span className={styles.navIcon}><MdStorefront /></span>
    <span className={styles.navLabel}>Products</span>
  </NavLink>
  <button
    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center', color: 'inherit' }}
    onClick={() => setProductsOpen(v => !v)}
  >
    <span className={`${styles.navArrow} ${productsOpen ? styles.navArrowOpen : ''}`}>
      <MdKeyboardArrowDown size={18} />
    </span>
  </button>
</div>

            <div className={`${styles.subNav} ${productsOpen ? styles.subNavOpen : ''}`}>
            {productSubNav.map(({ to, icon, label }) => (
  <NavLink
    key={to}
    to={to}
    className={() => {
      const isCollections = to.includes('tab=collections')
      const isActive = isCollections
        ? location.pathname === '/products' && location.search.includes('tab=collections')
        : location.pathname === to
      return `${styles.subNavItem} ${isActive ? styles.subNavActive : ''}`
    }}
  >
    <span className={styles.subNavIcon}>{icon}</span>
    <span>{label}</span>
  </NavLink>
))}
            </div>
          </div>

      {/* Content expandable group */}
<div className={styles.navExpandGroup}>
  <div className={`${styles.navItem} ${styles.navExpandBtn} ${isContentActive ? styles.active : ''}`}>
    <NavLink
      to="/content"
      style={{ display:'flex', alignItems:'center', gap:0, flex:1, textDecoration:'none', color:'inherit' }}
    >
      <span className={styles.navIcon}><MdContentPaste /></span>
      <span className={styles.navLabel}>Content</span>
    </NavLink>
    <button
      style={{ background:'none', border:'none', cursor:'pointer', padding:'0 4px', display:'flex', alignItems:'center', color:'inherit' }}
      onClick={() => setContentOpen(v => !v)}
    >
      <span className={`${styles.navArrow} ${contentOpen ? styles.navArrowOpen : ''}`}>
        <MdKeyboardArrowDown size={18} />
      </span>
    </button>
  </div>

  <div className={`${styles.subNav} ${contentOpen ? styles.subNavOpen : ''}`}>
    {contentSubNav.map(({ to, icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `${styles.subNavItem} ${isActive ? styles.subNavActive : ''}`
        }
      >
        <span className={styles.subNavIcon}>{icon}</span>
        <span>{label}</span>
      </NavLink>
    ))}
  </div>
</div>

          {/* Rest of mainNav */}
          {mainNav.map(({ to, icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
              {badge && <span className={styles.badge}>{badge}</span>}
            </NavLink>
          ))}

        </div>

        <p className={styles.sectionTitle}>Sales channels</p>
        <div className={styles.navGroup}>
          {salesNav.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
            </NavLink>
          ))}
        </div>

        <p className={styles.sectionTitle}>Apps</p>
        <div className={styles.navGroup}>
          {appNav.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navIcon}>{icon}</span>
              <span className={styles.navLabel}>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className={styles.sidebarFooter}>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.navIcon}><MdSettings /></span>
          <span className={styles.navLabel}>Settings</span>
        </NavLink>
      </div>
    </aside>
  )
}

export default Sidebar;