import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import SettingsSidebar from './components/SettingsSidebar'
import Icon from './components/Icon'
import { ICONS } from './constants/icons'
import styles from './SettingsLayout.module.css'

/**
 * Settings shell — topbar + own sidebar + main content (via <Outlet />).
 *
 * Each routed panel renders in the Outlet. Sidebar + topbar persist between
 * panel navigations because they live above the Outlet boundary.
 *
 * The main scroll container is reset to the top on URL change, so
 * navigating between panels lands at the top of the new content.
 */
export default function SettingsLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef(null)

  // Scroll to top when switching panels
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <Icon d={ICONS.chevLeft} size={16} />
          </button>
          <h1 className={styles.pageTitle}>Settings</h1>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.topbarStore}>My store</span>
          <div className={styles.topbarAvatar} aria-hidden="true">T</div>
        </div>
      </div>

      <div className={styles.layout}>
        <SettingsSidebar />
        <main className={styles.content} ref={contentRef}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}