import { NavLink } from 'react-router-dom'
import { SEGMENTS, segmentPath } from '../constants/segments'
import styles from '../Customers.module.css'

export default function SegmentTabs({ counts, activeKey }) {
  return (
    <div className={styles.segmentRow} role="tablist" aria-label="Customer segments">
      {SEGMENTS.map(s => {
        const isActive = s.key === activeKey
        return (
          <NavLink
            key={s.key}
            to={segmentPath(s.key)}
            role="tab"
            aria-selected={isActive}
            className={`${styles.segPill} ${isActive ? styles.segPillOn : ''}`}
          >
            {s.label}
            <span className={styles.segCount}>{counts[s.key] ?? 0}</span>
          </NavLink>
        )
      })}
    </div>
  )
}