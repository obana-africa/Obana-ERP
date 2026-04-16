import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

const FEATURES = [
  'Fast checkout & payment processing',
  'Real-time inventory across all locations',
  'Order history & sales analytics',
  'Online store synced with your POS',
]

export default function Login() {
  const navigate = useNavigate()
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const validate = () => {
    if (!form.email)                          return 'Email is required.'
    if (!/\S+@\S+\.\S+/.test(form.email))    return 'Invalid email format.'
    if (!form.password)                       return 'Password is required.'
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      // TODO: replace with authService.login(form) when backend is ready
      await new Promise(r => setTimeout(r, 900))
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>

      {/* ── Left panel ── */}
      <div className={styles.leftPanel}>
        <div className={styles.brand}>
          <span className={styles.brandName}>
            OBANA<span className={styles.brandDot}>.</span>
          </span>
        </div>

        <div className={styles.leftBody}>
          <h1 className={styles.leftHeading}>
            Sell smarter,<br />grow faster.
          </h1>
          <p className={styles.leftSub}>
            Your all-in-one ERP and point of sale system built for Nigerian businesses.
          </p>
          <ul className={styles.featureList}>
            {FEATURES.map(f => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.check}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <p className={styles.leftFooter}>© 2026 Obana Africa Ltd. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSub}>Sign in to your store account</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.field}>
              <label htmlFor="user_email" className={styles.label}>Email address</label>
              <input
                id="user_email"
                className={`${styles.input} ${error && !form.email ? styles.inputError : ''}`}
                type="email" name="email"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="user_password" className={styles.label}>Password</label>
              <input
                id="user_password"
                className={`${styles.input} ${error && !form.password ? styles.inputError : ''}`}
                type="password" name="password"
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className={styles.errorBox}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
                </svg>
                {error}
              </div>
            )}

            <button className={styles.forgot} type="button">
              Forgot password?
            </button>

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? (
                <span className={styles.spinner} />
              ) : 'Sign in →'}
            </button>
          </form>

          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>or</span>
            <span className={styles.dividerLine} />
          </div>

          <p className={styles.registerRow}>
            Don't have an account?{' '}
            <span className={styles.registerLink} onClick={() => navigate('/register')}>
              Create one free
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
