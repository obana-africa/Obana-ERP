import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import styles from './Register.module.css'

const TESTIMONIALS = [
  {
    text: "Obana completely changed how I run my fashion business. I used to spend hours tracking orders on paper — now everything is automated and I can focus on selling.",
    name: "Adaeze Okonkwo",
    role: "Fashion boutique owner, Lagos",
    initials: "AO",
    color: { bg: "#E8C547", text: "#1a1a2e" },
  },
  {
    text: "My online store went live in under 5 minutes. The inventory management alone saved me from so many stockout embarrassments. I can't imagine running my shop without it.",
    name: "Emmanuel Bassey",
    role: "Electronics reseller, Abuja",
    initials: "EB",
    color: { bg: "#9FE1CB", text: "#085041" },
  },
  {
    text: "I started getting international orders within a week of setting up my Obana store. The analytics helped me understand which products were actually selling.",
    name: "Fatima Kabir",
    role: "Skincare brand founder, Kano",
    initials: "FK",
    color: { bg: "#F5C4B3", text: "#993C1D" },
  },
  {
    text: "The payment collection feature is a game changer. My customers pay instantly, I get notified, and my books are always accurate. This is exactly what Nigerian SMEs needed.",
    name: "Chukwuemeka Ibe",
    role: "Food vendor & caterer, Port Harcourt",
    initials: "CI",
    color: { bg: "#CECBF6", text: "#3C3489" },
  },
]

function PasswordStrength({ password }) {
  const getScore = (val) => {
    let score = 0
    if (val.length >= 8) score++
    if (/[A-Z]/.test(val)) score++
    if (/[0-9]/.test(val)) score++
    if (/[^A-Za-z0-9]/.test(val)) score++
    return score
  }
  const score = getScore(password)
  const cls = score <= 1 ? styles.weak : score <= 2 ? styles.fair : styles.strong
  return (
    <div className={styles.strengthBar}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={`${styles.strengthSeg} ${i < score ? cls : ''}`} />
      ))}
    </div>
  )
}

export default function SignUp() {
  const [current, setCurrent] = useState(0)
  const [showPwd, setShowPwd] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    businessName: '', category: '', password: '', terms: false,
  })
  const timerRef = useRef(null)

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length)
    }, 5000)
  }

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const goTo = (idx) => {
    clearInterval(timerRef.current)
    setCurrent(idx)
    startTimer()
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className={styles.page}>

      {/* ── LEFT PANEL ── */}
      <div className={styles.left}>
        <div className={styles.leftInner}>

          {/* Logo */}
          <div className={styles.logo}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
              <circle cx="18" cy="18" r="10" fill="none" stroke="#094488" strokeWidth="2.5" />
              <circle cx="18" cy="18" r="3.5" fill="#083374" />
            </svg>
            <span className={styles.logoName}>obana</span>
          </div>

          {/* Headline */}
          <div className={styles.hero}>
            <h1 className={styles.headline}>
              Grow your business<br /><em>the smart way</em>
            </h1>
            <p className={styles.sub}>
              Manage inventory, track orders, collect payments and build your online store — all in one place.
            </p>

            {/* Stats */}
            <div className={styles.stats}>
              {[
                { num: '50K+', label: 'Business owners' },
                { num: '₦2B+', label: 'Sales processed' },
                { num: '4.9★', label: 'App Store rating' },
              ].map((s) => (
                <div key={s.label} className={styles.statItem}>
                  <div className={styles.statNum}>{s.num}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className={styles.testimonialTrack}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}>
                  <div className={styles.card}>
                    <span className={styles.quoteChar}>"</span>
                    <p className={styles.testimonialText}>{t.text}</p>
                    <div className={styles.author}>
                      <div
                        className={styles.avatar}
                        style={{ background: t.color.bg, color: t.color.text }}
                      >
                        {t.initials}
                      </div>
                      <div>
                        <div className={styles.authorName}>{t.name}</div>
                        <div className={styles.authorRole}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className={styles.dots}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.right}>
        <div className={styles.formWrapper}>

          <div className={styles.formTop}>
            <div className={styles.eyebrow}>Get started for free</div>
            <h2 className={styles.formTitle}>Create your account</h2>
            <p className={styles.formDesc}>
              Already have an account?<Link to="/login" className={styles.link}>Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label htmlFor="firstName">First name</label>
                <input id="firstName" name="firstName" type="text" placeholder="Adaeze"
                  value={form.firstName} onChange={handleChange} autoComplete="given-name" required />
              </div>
              <div className={styles.field}>
                <label htmlFor="lastName">Last name</label>
                <input id="lastName" name="lastName" type="text" placeholder="Okonkwo"
                  value={form.lastName} onChange={handleChange} autoComplete="family-name" required />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" placeholder="you@business.com"
                value={form.email} onChange={handleChange} autoComplete="email" required />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000"
                value={form.phone} onChange={handleChange} autoComplete="tel" />
            </div>

            <div className={styles.field}>
              <label htmlFor="businessName">Business name</label>
              <input id="businessName" name="businessName" type="text" placeholder="e.g. Adaeze's Boutique"
                value={form.businessName} onChange={handleChange} required />
            </div>

            <div className={styles.field}>
              <label htmlFor="category">Business category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange} required>
                <option value="" disabled>Select your category</option>
                {['Fashion & Apparel','Food & Beverages','Beauty & Skincare','Electronics','Health & Wellness','Home & Lifestyle','Services','Other'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.pwdWrap}>
                <input id="password" name="password" type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={handleChange} autoComplete="new-password" required />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd((v) => !v)} aria-label="Toggle password">
                  {showPwd ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            <div className={styles.checkRow}>
              <input type="checkbox" id="terms" name="terms"
                checked={form.terms} onChange={handleChange} required />
              <label htmlFor="terms" className={styles.checkLabel}>
                I agree to Obana's <a href="/terms" className={styles.link}>Terms of Service</a> and <a href="/privacy" className={styles.link}>Privacy Policy</a>. I consent to receiving product updates by email.
              </label>
            </div>

            <button
              type="submit"
              className={`${styles.btnSubmit} ${submitted ? styles.btnSuccess : ''}`}
              disabled={submitted}
            >
              {submitted ? '✓ Account created!' : <><span>Create free account</span><span className={styles.arrow}>→</span></>}
            </button>

          </form>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with</span>
            <div className={styles.dividerLine} />
          </div>

          <button className={styles.btnGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <p className={styles.signinLink}>
            Already selling with Obana? <a href="/login" className={styles.link}>Sign in to your account</a>
          </p>

        </div>
      </div>
    </div>
  )
}
