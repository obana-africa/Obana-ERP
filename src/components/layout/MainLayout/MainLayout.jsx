import { Outlet, useLocation } from 'react-router-dom'
import Topbar from '../Topbar/Topbar'
import Sidebar from '../Sidebar/Sidebar'
import styles from './MainLayout.module.css'

const NO_SIDEBAR_ROUTES = ['/online-store', '/pos']

const MainLayout = () => {
  const { pathname } = useLocation()
  const showSidebar = !NO_SIDEBAR_ROUTES.some(r => pathname.startsWith(r))

  return (
    <div className={styles.shell}>
      {/* Topbar spans full width at the very top */}
      <Topbar />

      {/* Everything below the topbar */}
      <div className={styles.body}>
        {showSidebar && <Sidebar />}
        <main className={showSidebar ? styles.main : styles.mainFull}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
