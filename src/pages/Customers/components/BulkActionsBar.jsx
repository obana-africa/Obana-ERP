import Icon from './Icon'
import { ICONS } from '../constants/icons'
import { useAuth } from '../../../auth/useAuth'
import styles from '../Customers.module.css'

export default function BulkActionsBar({ count, actions, onClear }) {
  const { hasPermission } = useAuth()
  const canBulk   = hasPermission('customers:bulk')
  const canDelete = hasPermission('customers:delete')

  return (
    <div className={styles.bulkBar} role="region" aria-label="Bulk actions">
      <div className={styles.bulkLeft}>
        <span className={styles.bulkCount}>{count} selected</span>
        <button type="button" className={styles.bulkClear} onClick={onClear}>
          Clear
        </button>
      </div>
      <div className={styles.bulkActions}>
        <button
          type="button"
          className={`${styles.bulkBtn} ${!canBulk ? styles.btnDisabled : ''}`}
          onClick={actions.emailSelected}
          disabled={!canBulk}
        >
          <Icon d={ICONS.mail} size={13} /> Send Email
        </button>
        <button
          type="button"
          className={`${styles.bulkBtn} ${!canBulk ? styles.btnDisabled : ''}`}
          onClick={actions.smsSelected}
          disabled={!canBulk}
        >
          <Icon d={ICONS.sms} size={13} /> Send SMS
        </button>
        <button
          type="button"
          className={`${styles.bulkBtn} ${!canBulk ? styles.btnDisabled : ''}`}
          onClick={actions.tagSelected}
          disabled={!canBulk}
        >
          <Icon d={ICONS.tag} size={13} /> Change Tag
        </button>
        <button
          type="button"
          className={`${styles.bulkBtnDanger} ${!canDelete ? styles.btnDisabled : ''}`}
          onClick={actions.deleteSelected}
          disabled={!canDelete || actions.isDeleting}
        >
          <Icon d={ICONS.trash} size={13} />
          {actions.isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  )
}