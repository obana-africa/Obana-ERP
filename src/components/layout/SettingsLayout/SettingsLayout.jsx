import { Outlet } from 'react-router-dom'
import SettingsSidebar from './SettingsSidebar'   // your existing settings sidebar
import styles from './SettingsLayout.module.css'

export default function SettingsLayout() {
  return (
    <div className={styles.layout}>
      <SettingsSidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}