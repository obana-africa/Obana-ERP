import { useEffect } from 'react';
import { Ic, ICONS } from '@/shared/icons/Icons';
import styles from './Toast.module.css';

export const Toast = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <Ic d={type === 'success' ? ICONS.check : ICONS.x} size={14} stroke="#fff" />
      {message}
    </div>
  );
};