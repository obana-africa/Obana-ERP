import Icon from './Icon'
import { ICONS } from '../constants/icons'
import styles from './shared.module.css'

export default function PanelError({ error, onRetry, title = 'Could not load settings' }) {
  const message = error?.userMessage || error?.message || 'An unexpected error occurred.'
  return (
    <div className={styles.panelError} role="alert">
      <Icon d={ICONS.alert} size={32} stroke="#B45309" sw={1.5} />
      <div className={styles.panelErrorTitle}>{title}</div>
      <div className={styles.panelErrorMsg}>{message}</div>
      {onRetry && (
        <button type="button" className={styles.saveBtn} onClick={onRetry} style={{ marginTop: 8 }}>
          Try again
        </button>
      )}
    </div>
  )
}