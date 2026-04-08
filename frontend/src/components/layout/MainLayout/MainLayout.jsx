import Sidebar from '../sidebar/Sidebar';
import styles from './MainLayout.module.css';

const MainLayout = ({ children }) => (
  <div className={styles.shell}>
    <Sidebar />
    <main className={styles.main}>
      {children}
    </main>
  </div>
);

export default MainLayout;