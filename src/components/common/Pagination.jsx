import styles from './common.module.css'

/**
 * Page-number pagination. Shows: « ‹ 1 2 [3] 4 5 › »
 * Compresses with ellipses when there are many pages.
 */
export default function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const go = p => () => onPageChange(Math.min(Math.max(1, p), totalPages))
  const pages = pageRange(page, totalPages)

  const from = (page - 1) * pageSize + 1
  const to   = Math.min(page * pageSize, total)

  return (
    <nav className={styles.pagination} aria-label="Pagination">
      <span className={styles.paginationInfo}>
        Showing <strong>{from.toLocaleString()}</strong>–<strong>{to.toLocaleString()}</strong> of{' '}
        <strong>{total.toLocaleString()}</strong>
      </span>
      <div className={styles.paginationControls}>
        <button type="button" className={styles.pageBtn} onClick={go(1)}
          disabled={page === 1} aria-label="First page">«</button>
        <button type="button" className={styles.pageBtn} onClick={go(page - 1)}
          disabled={page === 1} aria-label="Previous page">‹</button>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`gap-${i}`} className={styles.pageEllipsis}>…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
              onClick={go(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        <button type="button" className={styles.pageBtn} onClick={go(page + 1)}
          disabled={page === totalPages} aria-label="Next page">›</button>
        <button type="button" className={styles.pageBtn} onClick={go(totalPages)}
          disabled={page === totalPages} aria-label="Last page">»</button>
      </div>
    </nav>
  )
}

// Compact page list: 1 … 4 5 [6] 7 8 … 20
function pageRange(current, total) {
  const out = []
  const window = 1   // pages on each side of current
  const showLeft  = current - window > 2
  const showRight = current + window < total - 1

  out.push(1)
  if (showLeft) out.push('…')
  for (let p = Math.max(2, current - window); p <= Math.min(total - 1, current + window); p++) {
    out.push(p)
  }
  if (showRight) out.push('…')
  if (total > 1) out.push(total)
  return [...new Set(out)]
}