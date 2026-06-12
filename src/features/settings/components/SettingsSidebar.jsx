import { NavLink } from 'react-router-dom'
import { SETTINGS_NAV } from '../constants/nav'
import Icon from './Icon'
import styles from './SettingsSidebar.module.css'

/**
 * Settings sidebar.
 *
 * Renders a static nav of settings panels. Each item routes to
 * /settings/<path>. The active item is determined by react-router's NavLink
 * isActive (URL → match), not by local state — refresh persists position.
 */
export default function SettingsSidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Settings navigation">
      <div className={styles.sidebarInner}>
        <div className={styles.storeInfo}>
          <div className={styles.storeAvatar}>T</div>
          <div>
            <p className={styles.storeName}>My store</p>
            <p className={styles.storeUrl}>mystore.ng</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {SETTINGS_NAV.map(item => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
              end={item.path === 'general'}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    d={item.icon}
                    size={15}
                    stroke={isActive ? '#2DBD97' : '#6B7280'}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}