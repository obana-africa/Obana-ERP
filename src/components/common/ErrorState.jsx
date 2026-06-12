import styles from './common.module.css'

/**
 * Inline error state for failed queries. Shows the user-safe error message
 * and a retry button.
 */
export default function ErrorState({ error, onRetry, title = 'Could not load data' }) {
  const message = error?.userMessage || error?.message || 'An unexpected error occurred.'

  return (
    <div className={styles.errorState} role="alert">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div className={styles.errorTitle}>{title}</div>
      <div className={styles.errorMsg}>{message}</div>
      {onRetry && (
        <button type="button" className={styles.errorRetry} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}