import styles from './shared.module.css'

/**
 * Unsaved-changes save bar.
 *
 * Replaces the 4 duplicate SaveBar implementations across panel files.
 * Renders nothing when not dirty.
 */
export default function SaveBar({
  dirty,
  saving,
  onSave,
  onDiscard,
  saveLabel = 'Save changes',
  message = 'You have unsaved changes',
}) {
  if (!dirty) return null
  return (
    <div className={styles.saveBar} role="status" aria-live="polite">
      <span className={styles.saveBarMsg}>{message}</span>
      <div className={styles.saveBarActions}>
        <button type="button" className={styles.discardBtn} onClick={onDiscard} disabled={saving}>
          Discard
        </button>
        <button type="button" className={styles.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : saveLabel}
        </button>
      </div>
    </div>
  )
}