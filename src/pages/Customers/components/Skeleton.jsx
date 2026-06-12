import styles from '../Customers.module.css'

/**
 * Loading skeletons. Same layout as the real components so there's no
 * layout shift when data arrives.
 */

export function StatsRowSkeleton({ count = 4 }) {
  return (
    <div className={styles.statsRow}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.statCard} aria-hidden="true">
          <div className={styles.statTop}>
            <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '50%' }} />
            <span className={`${styles.skel} ${styles.skelChip}`} />
          </div>
          <span className={`${styles.skel} ${styles.skelHeading}`} style={{ width: '70%' }} />
          <div className={styles.statFoot}>
            <span className={`${styles.skel} ${styles.skelPill}`} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CustomersTableSkeleton({ rows = 8 }) {
  return (
    <div className={styles.table} aria-busy="true" aria-label="Loading customers">
      <div className={styles.tableHead}>
        <span />
        <span>Customer</span><span>Contact</span><span>Location</span>
        <span>Orders</span><span>Total Spent</span><span>Segment</span><span>Status</span><span />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow} aria-hidden="true">
          <span><span className={`${styles.skel} ${styles.skelCheckbox}`} /></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`${styles.skel} ${styles.skelAvatar}`} />
            <span style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
              <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '70%' }} />
              <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '40%', height: 10 }} />
            </span>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '90%' }} />
            <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '70%' }} />
          </span>
          <span><span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '80%' }} /></span>
          <span><span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '40%' }} /></span>
          <span><span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '60%' }} /></span>
          <span><span className={`${styles.skel} ${styles.skelPill}`} /></span>
          <span><span className={`${styles.skel} ${styles.skelPill}`} /></span>
          <span style={{ display: 'flex', gap: 4 }}>
            <span className={`${styles.skel} ${styles.skelIconBtn}`} />
            <span className={`${styles.skel} ${styles.skelIconBtn}`} />
            <span className={`${styles.skel} ${styles.skelIconBtn}`} />
          </span>
        </div>
      ))}
    </div>
  )
}

export function CustomersGridSkeleton({ count = 6 }) {
  return (
    <div className={styles.custGrid} aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.custCard} aria-hidden="true">
          <div className={styles.custCardTop}>
            <span className={`${styles.skel} ${styles.skelAvatarLg}`} />
            <span style={{ display: 'flex', gap: 4 }}>
              <span className={`${styles.skel} ${styles.skelIconBtn}`} />
              <span className={`${styles.skel} ${styles.skelIconBtn}`} />
            </span>
          </div>
          <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '60%', height: 14 }} />
          <span className={`${styles.skel} ${styles.skelLine}`} style={{ width: '80%', marginTop: 6 }} />
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <span className={`${styles.skel} ${styles.skelPill}`} />
            <span className={`${styles.skel} ${styles.skelPill}`} />
          </div>
          <div className={`${styles.skel} ${styles.skelStatsStrip}`} />
        </div>
      ))}
    </div>
  )
}