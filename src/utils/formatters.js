export const fmt  = (n) => `₦${Number(n || 0).toLocaleString()}`
export const fmtD = (s) => new Date(s).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
export const pct  = (orig, sale) => Math.round(((orig - sale) / orig) * 100)
export const uid  = () => `${Date.now()}-${Math.random().toString(36).slice(2,6)}`