import styles from './ToggleSwitch.module.css';

export const ToggleSwitch = ({ checked, onChange }) => (
  <label className={styles.toggle}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <span className={styles.track} />
    <span className={styles.thumb} />
  </label>
);