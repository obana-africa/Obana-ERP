import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { ICONS } from '../constants/icons'
import styles from '../Customers.module.css'

/**
 * Stat card with:
 *  - Animated value (CSS reveal on mount)
 *  - Trend pill (↑ +12% / ↓ -3% / —)
 *  - Mini sparkline (SVG, last 7 data points if provided)
 *  - Optional `to` prop turns the whole card into a navigable filter shortcut
 */
export default function StatCard({
  label,
  value,
  accent = '#1b3b5f',
  icon,
  trend,            // { dir: 'up' | 'down' | 'flat', delta: '+12%' }
  spark,            // optional array of numbers
  to,               // optional route to navigate to on click
  ariaLabel,
}) {
  const navigate = useNavigate()
  const clickable = !!to
  const handleClick = () => clickable && navigate(to)

  return (
    <button
      type="button"
      className={`${styles.statCard} ${clickable ? styles.statCardClickable : ''}`}
      onClick={handleClick}
      disabled={!clickable}
      aria-label={ariaLabel || `${label}: ${value}`}
    >
      <div className={styles.statTop}>
        <span className={styles.statLbl}>{label}</span>
        <span className={styles.statIcoWrap} style={{ background: `${accent}15`, color: accent }}>
          <Icon d={icon} size={14} />
        </span>
      </div>

      <div className={styles.statVal} style={{ color: accent }}>
        {value}
      </div>

      <div className={styles.statFoot}>
        {trend && <TrendPill trend={trend} />}
        {spark && spark.length > 1 && <Sparkline data={spark} accent={accent} />}
      </div>
    </button>
  )
}

function TrendPill({ trend }) {
  const { dir, delta } = trend
  const cls =
    dir === 'up'   ? styles.trendUp
    : dir === 'down' ? styles.trendDown
    : styles.trendFlat
  const ico = dir === 'up' ? ICONS.arrowUp : dir === 'down' ? ICONS.arrowDn : null
  return (
    <span className={`${styles.trend} ${cls}`}>
      {ico && <Icon d={ico} size={10} sw={2.4} />}
      {delta}
    </span>
  )
}

function Sparkline({ data, accent }) {
  const w = 64, h = 20, pad = 2
  const min = Math.min(...data), max = Math.max(...data)
  const range = max - min || 1
  const step = (w - pad * 2) / (data.length - 1)
  const points = data
    .map((v, i) => `${pad + i * step},${pad + (h - pad * 2) * (1 - (v - min) / range)}`)
    .join(' ')
  return (
    <svg width={w} height={h} className={styles.spark} aria-hidden="true">
      <polyline points={points} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}