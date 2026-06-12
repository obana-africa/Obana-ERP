import { TAG_CONFIG, STATUS_CFG } from '../../../data/customers'
import styles from '../Customers.module.css'

const FALLBACK_TAG = { bg: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' }

export function TagPill({ tag }) {
  const cfg = TAG_CONFIG[tag] || FALLBACK_TAG
  return (
    <span
      className={styles.pill}
      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
    >
      {tag}
    </span>
  )
}

export function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || FALLBACK_TAG
  return (
    <span
      className={`${styles.pill} ${styles.pillStatus}`}
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {status}
    </span>
  )
}