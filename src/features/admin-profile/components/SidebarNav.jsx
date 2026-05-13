import { Ic } from '@/shared/icons/Icons'; // adjust path to your icon helper
import { NAV_ITEMS } from '../constants';
import styles from './SidebarNav.module.css';

const ICON_MAP = {
  user: ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  bell: ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  store: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  credit: ['M1 4h22v16H1z', 'M1 10h22'],
  globe: 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
};

export const SidebarNav = ({ activeTab, onTabChange }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarTitle}>Account Settings</div>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
          onClick={() => onTabChange(item.id)}
        >
          <Ic d={ICON_MAP[item.icon]} size={16} />
          {item.label}
        </button>
      ))}
      <div className={styles.divider} />
      <button className={`${styles.navItem} ${styles.logout}`} onClick={() => console.log('logout')}>
        <Ic d={ICON_MAP.logout} size={16} /> Log out
      </button>
    </aside>
  );
};