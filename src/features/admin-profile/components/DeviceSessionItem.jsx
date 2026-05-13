import { Ic } from '@/shared/icons/Icons';
import styles from './DeviceSessionItem.module.css';

const deviceIcon = ['M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z', 'M13 2v7h7'];

export const DeviceSessionItem = ({ device, onLogout }) => {
  return (
    <div className={styles.deviceItem}>
      <div className={styles.deviceLeft}>
        <div className={styles.deviceIcon}>
          <Ic d={deviceIcon} size={17} />
        </div>
        <div>
          <div className={styles.deviceName}>
            {device.name}
            {device.current && <span className={styles.deviceBadge}>This device</span>}
          </div>
          <div className={styles.deviceMeta}>
            {device.time} · {device.location}
          </div>
        </div>
      </div>
      {!device.current && (
        <button className={styles.logoutBtn} onClick={() => onLogout(device.id)}>
          Log out
        </button>
      )}
    </div>
  );
};