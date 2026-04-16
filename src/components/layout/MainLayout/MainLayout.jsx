import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import styles from './MainLayout.module.css'

// Routes that render without the sidebar
const NO_SIDEBAR_ROUTES = ['/online-store', '/pos']

const MainLayout = () => {
  const { pathname } = useLocation()
  const showSidebar = !NO_SIDEBAR_ROUTES.some(r => pathname.startsWith(r))

  return (
    <div className={styles.shell}>
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? styles.main : styles.mainFull}>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
