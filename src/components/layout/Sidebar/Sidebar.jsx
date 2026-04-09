import { NavLink } from 'react-router-dom';
import Logo from '../../../assets/images/logo/obana-logo.svg';
import {
  MdDashboard, MdPointOfSale, MdShoppingCart,
  MdInventory, MdPeople, MdLocalOffer,
  MdBarChart, MdSettings, MdStorefront,
  MdNotifications, MdContentPaste, MdHub,
} from 'react-icons/md';
import styles from './Sidebar.module.css';

const mainNav = [
  { to: '/dashboard', icon: <MdDashboard />, label: 'Home' },
  { to: '/orders', icon: <MdShoppingCart />, label: 'Orders',  },
  { to: '/products', icon: <MdStorefront />, label: 'Products' },
  { to: '/customers', icon: <MdPeople />, label: 'Customers' },
  { to: '/inventory', icon: <MdInventory />, label: 'Inventory' },
  { to: '/discounts', icon: <MdLocalOffer />, label: 'Discounts' },
  { to: '/content', icon: <MdContentPaste />, label: 'Content' },
  { to: '/analytics', icon: <MdBarChart />, label: 'Analytics' },
];

const salesNav = [
  {to: '/online-store', icon: <MdStorefront />, label: 'Online Store' },
  { to: '/pos', icon: <MdPointOfSale />, label: 'Point of Sale' },
  
];

const appNav = [
  { to: '/integrations', icon: <MdHub />, label: 'Integrations' },
];

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.storeHeader}>
      <div className={styles.logo}>
        <img src={Logo} alt="obana logo" width="28" height="28"style={{ objectFit: 'contain'}} />
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
);

export default Sidebar;