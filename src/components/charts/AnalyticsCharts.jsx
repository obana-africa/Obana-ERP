/* Reusable SVG chart primitives for Analytics page */

export function Sparkline({ data, color = '#2DBD97', height = 48 }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w   = 120, h = height
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function BarChart({ data, labels = [], color = '#1a1a2e', accentColor = '#2DBD97' }) {
  const max  = Math.max(...data)
  const h    = 160, w = 600
  const barW = Math.min(28, (w / data.length) - 4)
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 24}`} preserveAspectRatio="xMidYMid meet">
      {data.map((v, i) => {
        const barH   = (v / max) * h
        const x      = (i / data.length) * w + (w / data.length - barW) / 2
        const y      = h - barH
        const isLast = i === data.length - 1
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} fill={isLast ? accentColor : color} rx="3" opacity={isLast ? 1 : 0.75} />
            {labels[i] && (
              <text x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize="9" fill="#9CA3AF" fontFamily="DM Sans, sans-serif">
                {labels[i]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function DonutChart({ data }) {
  const total         = data.reduce((a, d) => a + d.pct, 0)
  const r             = 60, cx = 80, cy = 80, strokeW = 22
  const circumference = 2 * Math.PI * r
  let   cumulative    = 0
  return (
    <svg width="160" height="160" viewBox="0 0 160 160">
      {data.map((d, i) => {
        const dash   = (d.pct / total) * circumference
        const gap    = circumference - dash
        const offset = circumference - (cumulative / total) * circumference
        cumulative  += d.pct
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color}
            strokeWidth={strokeW} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={offset}
            style={{ transform:'rotate(-90deg)', transformOrigin:'80px 80px' }} />
        )
      })}
      <text x={cx} y={cy - 6}  textAnchor="middle" fontSize="11" fill="#6B7280" fontFamily="DM Sans, sans-serif">Total</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="16" fontWeight="700" fill="#111827" fontFamily="DM Sans, sans-serif">
        {data.reduce((a, d) => a + (d.count || 0), 0)}
      </text>
    </svg>
  )
}
