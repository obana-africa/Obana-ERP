import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './MainLayout.module.css';

const MainLayout = () => (
  <div className={styles.shell}>
    <Sidebar />
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);

export default MainLayout;