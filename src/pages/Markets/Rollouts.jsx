import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Markets.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Rollout illustration ──────────────────────────────────────── */
function RolloutIllo() {
  return (
    <svg width="140" height="110" viewBox="0 0 140 110" fill="none">
      <circle cx="70" cy="50" r="44" fill="#F3F4F6" />
      {/* Left card */}
      <rect x="10" y="20" width="50" height="70" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
      <rect x="17" y="28" width="36" height="20" rx="3" fill="#BFDBFE"/>
      <rect x="17" y="53" width="36" height="5" rx="2" fill="#E5E7EB"/>
      <rect x="17" y="62" width="28" height="5" rx="2" fill="#E5E7EB"/>
      <rect x="17" y="71" width="36" height="8" rx="2" fill="#1b3b5f"/>
      {/* Right card */}
      <rect x="80" y="20" width="50" height="70" rx="6" fill="white" stroke="#E5E7EB" strokeWidth="1.5"/>
      <rect x="87" y="28" width="36" height="20" rx="3" fill="#FECACA"/>
      <rect x="87" y="53" width="36" height="5" rx="2" fill="#E5E7EB"/>
      <rect x="87" y="62" width="28" height="5" rx="2" fill="#E5E7EB"/>
      <rect x="87" y="71" width="36" height="8" rx="2" fill="#1b3b5f"/>
      {/* Person icon top center */}
      <circle cx="70" cy="12" r="10" fill="#E5E7EB"/>
      <circle cx="70" cy="8" r="4" fill="#9CA3AF"/>
      <path d="M62 20c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#9CA3AF"/>
    </svg>
  )
}

export default function Rollouts() {
  const navigate = useNavigate()
  const [visible,  setVisible]  = useState(false)
  const [rollouts, setRollouts] = useState([])

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  return (
    <div className={`${s.page} ${visible ? s.visible : ''}`} style={{ display: 'flex', flexDirection: 'column' }}>

      <div className={s.pageHeader}>
        <div className={s.pageHeaderLeft}>
          <div className={s.titleIcon}>
            <Ic d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z" size={14} stroke="#1b3b5f" />
          </div>
          <h1 className={s.pageTitle}>Rollouts</h1>
        </div>
        <button className={s.btnPrimary} onClick={() => navigate('/markets/rollouts/new')}>
          Create rollout
        </button>
      </div>

      {rollouts.length === 0 ? (
        <div className={s.emptyState}>
          <div className={s.emptyIllo}><RolloutIllo /></div>
          <h3 className={s.emptyTitle}>Test and time your launches</h3>
          <p className={s.emptySub}>
            Schedule a set of changes for an upcoming sale, or try different
            designs to see which performs best
          </p>
          <button className={s.btnPrimary} onClick={() => navigate('/markets/rollouts/new')}>
            Create rollout
          </button>
          <a href="#" className={s.learnLink}>Learn more about rollouts</a>
        </div>
      ) : (
        <div className={s.tableWrap}>
          {/* Rollout list would render here */}
        </div>
      )}
    </div>
  )
}
