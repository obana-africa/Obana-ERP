import styles from './shared.module.css'

/**
 * Skeleton shown while a settings panel's data loads.
 * Same outer container as the real panel so there's no layout shift.
 */
export default function PanelSkeleton({ sections = 3 }) {
  return (
    <div className={styles.panel} aria-busy="true" aria-label="Loading settings">
      {Array.from({ length: sections }).map((_, i) => (
        <div key={i} className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionHeadLeft}>
              <div>
                <span className={`${styles.skel} ${styles.skelTitle}`} />
                <span className={`${styles.skel} ${styles.skelSub}`} style={{ marginTop: 6 }} />
              </div>
            </div>
          </div>
          <div className={styles.sectionBody}>
            <span className={`${styles.skel} ${styles.skelRow}`} />
            <span className={`${styles.skel} ${styles.skelRow}`} />
            <span className={`${styles.skel} ${styles.skelRow}`} style={{ width: '60%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}