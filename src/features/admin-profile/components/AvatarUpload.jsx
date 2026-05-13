import { useRef } from 'react';
import { Ic } from '@/shared/icons/Icons';
import styles from './AvatarUpload.module.css';

const cameraIcon = ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'];

export const AvatarUpload = ({ initialPhoto, onUpload, firstName = '', lastName = '' }) => {
  const fileRef = useRef();
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    onUpload(formData);
  };

  return (
    <div className={styles.avatarSection}>
      <div className={styles.avatarRing} onClick={() => fileRef.current?.click()} title="Change photo">
        {initialPhoto ? (
          <img src={initialPhoto} alt="avatar" />
        ) : (
          <span className={styles.avatarInitials}>{initials}</span>
        )}
        <div className={styles.avatarOverlay}>
          <Ic d={cameraIcon} size={20} stroke="#fff" />
        </div>
      </div>
      <div className={styles.avatarMeta}>
        <div className={styles.avatarName}>{firstName} {lastName}</div>
        <div className={styles.avatarRole}>Store Admin</div>
        <div className={styles.avatarActions}>
          <button className={styles.btnOutline} onClick={() => fileRef.current?.click()}>Upload photo</button>
          {initialPhoto && (
            <button className={styles.btnGhost} onClick={() => onUpload(null)}>Remove</button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      </div>
    </div>
  );
};