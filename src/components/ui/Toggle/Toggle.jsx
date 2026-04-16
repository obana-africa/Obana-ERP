import styles from './Toggle.module.css'

const Toggle = ({ on, onChange }) => (
  <div
    className={`${styles.toggle} ${on ? styles.on : ''}`}
    onClick={onChange}
    role="switch"
    aria-checked={on}
  >
    <div className={styles.thumb} />
  </div>
)

export default Toggle