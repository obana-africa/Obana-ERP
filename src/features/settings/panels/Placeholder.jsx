import Icon from '../components/Icon'
import { ICONS } from '../constants/icons'
import styles from '../components/shared.module.css'

/**
 * Placeholder shown for panels that haven't been migrated yet.
 * Renders the same outer container shape so the layout is stable.
 */
export default function PlaceholderPanel({ name = 'This panel' }) {
  return (
    <div className={styles.panel}>
      <div className={styles.panelError} style={{
        background: '#F1F4F8',
        borderColor: '#E8ECF1',
        color: '#6B7280',
      }}>
        <Icon d={ICONS.info} size={32} stroke="#9CA3AF" sw={1.5} />
        <div className={styles.panelErrorTitle} style={{ color: '#374151' }}>
          {name} settings — coming soon
        </div>
        <div className={styles.panelErrorMsg}>
          This panel hasn't been migrated to the new settings framework yet.
          It will work the same as the others when ready.
        </div>
      </div>
    </div>
  )
}