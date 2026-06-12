import { useEffect } from 'react'
import styles from './common.module.css'

/**
 * Promise-style confirmation dialog. Use through the `useConfirm()` hook
 * (see hook below) for a cleaner API than passing open/close props manually.
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',          // 'default' | 'danger'
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return
    const onKey = e => {
      if (e.key === 'Escape') onCancel?.()
      if (e.key === 'Enter')  onConfirm?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onConfirm, onCancel])

  if (!open) return null

  return (
    <div className={styles.confirmOverlay} onClick={onCancel} role="dialog" aria-modal="true">
      <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
        <h3 className={styles.confirmTitle}>{title}</h3>
        {message && <p className={styles.confirmMsg}>{message}</p>}
        <div className={styles.confirmActions}>
          <button type="button" className={styles.confirmCancel} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={variant === 'danger' ? styles.confirmDanger : styles.confirmPrimary}
            onClick={onConfirm}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}