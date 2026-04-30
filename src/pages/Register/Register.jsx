import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Register.module.css'

// ── Testimonials Data ──────────────────────────────────────────
const TESTIMONIALS = [
  {
    text: "taja completely changed how I run my fashion business. I used to spend hours tracking orders on paper — now everything is automated and I can focus on selling.",
    name: "Adaeze Okonkwo", role: "Fashion boutique owner, Lagos",
    initials: "AO", color: { bg: "#E8C547", text: "#1a1a2e" },
  },
  {
    text: "My online store went live in under 5 minutes. The inventory management alone saved me from so many stockout embarrassments. I can't imagine running my shop without it.",
    name: "Emmanuel Bassey", role: "Electronics reseller, Abuja",
    initials: "EB", color: { bg: "#9FE1CB", text: "#085041" },
  },
  {
    text: "I started getting international orders within a week of setting up my taja store. The analytics helped me understand which products were actually selling.",
    name: "Fatima Kabir", role: "Skincare brand founder, Kano",
    initials: "FK", color: { bg: "#F5C4B3", text: "#993C1D" },
  },
  {
    text: "The payment collection feature is a game changer. My customers pay instantly, I get notified, and my books are always accurate. This is exactly what Nigerian SMEs needed.",
    name: "Chukwuemeka Ibe", role: "Food vendor & caterer, Port Harcourt",
    initials: "CI", color: { bg: "#CECBF6", text: "#3C3489" },
  },
]

const CATEGORIES = [
  'Fashion & Apparel', 'Food & Beverages', 'Beauty & Skincare',
  'Electronics', 'Health & Wellness', 'Home & Lifestyle', 'Services', 'Other',
]

// ── Validation Rules ───────────────────────────────────────────
const VALIDATION_RULES = {
  firstName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'First name must be at least 2 characters using letters only'
  },
  lastName: {
    required: true,
    minLength: 2,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Last name must be at least 2 characters using letters only'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    pattern: /^\+?[\d\s-]{10,}$/,
    message: 'Please enter a valid phone number'
  },
  businessName: {
    required: true,
    minLength: 2,
    message: 'Business name is required'
  },
  category: {
    required: true,
    message: 'Please select a business category'
  },
  password: {
    required: true,
    minLength: 8,
    message: 'Password must be at least 8 characters'
  },
  terms: {
    required: true,
    message: 'You must agree to the terms of service'
  }
}

// ── Form Field Component ───────────────────────────────────────
const FormField = ({ label, name, type = 'text', value, onChange, error, placeholder, required, options, children, ...props }) => (
  <div className={styles.field}>
    <label htmlFor={name}>
      {label}
      {required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
    </label>
    
    {type === 'select' ? (
      <select id={name} name={name} value={value} onChange={onChange} {...props}>
        <option value="" disabled>{placeholder || 'Select...'}</option>
        {options?.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    ) : children || (
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    )}
    
    {error && (
      <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>
        {error}
      </span>
    )}
  </div>
)

// ── Password Strength Indicator ─────────────────────────────────
const PasswordStrength = ({ password }) => {
  const getStrength = (pwd) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strength = getStrength(password)
  const labels = ['Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#EF4444', '#F59E0B', '#2DBD97', '#059669']

  return password ? (
    <div style={{ marginTop: '8px' }}>
      <div className={styles.strengthBar}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`${styles.strengthSeg} ${
              i < strength ? (strength <= 2 ? styles.weak : strength === 3 ? styles.fair : styles.strong) : ''
            }`}
          />
        ))}
      </div>
      <div style={{ fontSize: '0.75rem', color: colors[strength - 1] || '#9CA3AF', marginTop: '4px', fontWeight: 600 }}>
        {labels[strength - 1] || 'Too weak'}
      </div>
    </div>
  ) : null
}

// ── Icons ──────────────────────────────────────────────────────
const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

// ── Initial Form State ─────────────────────────────────────────
const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  businessName: '',
  category: '',
  password: '',
  terms: false,
}

// ════════════════════════════════════════════════════════════════
// MAIN REGISTER COMPONENT
// ════════════════════════════════════════════════════════════════
export default function Register() {
  const navigate = useNavigate()
  const timerRef = useRef(null)
  const formRef = useRef(null)

  // ── State ──────────────────────────────────────────────────
  const [current, setCurrent] = useState(0)
  const [showPwd, setShowPwd] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')

  // ── Testimonial Auto-Rotate ─────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % TESTIMONIALS.length)
    }, 5000)
  }, [])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  const goTo = useCallback((idx) => {
    clearInterval(timerRef.current)
    setCurrent(idx)
    startTimer()
  }, [startTimer])

  // ── Form Validation ────────────────────────────────────────
  const validateField = useCallback((name, value) => {
    const rules = VALIDATION_RULES[name]
    if (!rules) return ''

    if (rules.required) {
      if (typeof value === 'boolean' && !value) return rules.message
      if (!value || (typeof value === 'string' && !value.trim())) return rules.message
    }

    if (rules.minLength && value.length < rules.minLength) return rules.message
    if (rules.pattern && !rules.pattern.test(value)) return rules.message

    return ''
  }, [])

  const validateForm = useCallback(() => {
    const newErrors = {}
    Object.keys(VALIDATION_RULES).forEach(field => {
      const error = validateField(field, form[field])
      if (error) newErrors[field] = error
    })
    return newErrors
  }, [form, validateField])

  // ── Event Handlers ─────────────────────────────────────────
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value

    setForm(prev => ({ ...prev, [name]: newValue }))
    
    // Real-time validation for touched fields
    if (touched[name]) {
      const error = validateField(name, newValue)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
    
    // Clear server error when user types
    if (serverError) setServerError('')
  }, [touched, validateField, serverError])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, form[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [form, validateField])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate all fields
    const allTouched = Object.keys(VALIDATION_RULES).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {})
    setTouched(allTouched)
    
    const formErrors = validateForm()
    setErrors(formErrors)
    
    if (Object.keys(formErrors).length > 0) {
      // Scroll to first error
      const firstError = document.querySelector('[data-error]')
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Submit form
    setIsLoading(true)
    setServerError('')

    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate success (90% of the time) or error
          Math.random() > 0.1 ? resolve() : reject(new Error('Email already exists'))
        }, 1500)
      })

      setSubmitted(true)
      
      // Store user data (in production, this comes from backend)
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        businessName: form.businessName,
        category: form.category,
      }
      
      // Store in localStorage or sessionStorage for persistence
      localStorage.setItem('taja_user', JSON.stringify(userData))
      
      // Navigate after success
      setTimeout(() => {
        navigate('/dashboard', { 
          state: { 
            welcome: true,
            user: userData 
          } 
        })
      }, 1500)
      
    } catch (error) {
      setServerError(error.message || 'Registration failed. Please try again.')
      setIsLoading(false)
      setSubmitted(false)
    }
  }

  // ── Keyboard Accessibility ─────────────────────────────────
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') {
        goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
      } else if (e.key === 'ArrowRight') {
        goTo((current + 1) % TESTIMONIALS.length)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [current, goTo])

  return (
    <div className={styles.page}>
      {/* ════════════════════════════════════════════════════════
          LEFT PANEL - Static Background
          ════════════════════════════════════════════════════════ */}
      <div className={styles.left}>
        <div className={styles.leftInner}>
          {/* Logo */}
          <div className={styles.logo}>
            <img
              src="/src/assets/images/logo/taja logo white.png"
              alt="taja logo"
              className={styles.logoImg}
            />
          </div>

          {/* Hero Content */}
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
              ].map(s => (
                <div key={s.label} className={styles.statItem}>
                  <div className={styles.statNum}>{s.num}</div>
                  <div className={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial Carousel */}
            <div className={styles.testimonialTrack} role="region" aria-label="Customer testimonials">
              {TESTIMONIALS.map((t, i) => (
                <div 
                  key={i} 
                  className={`${styles.slide} ${i === current ? styles.slideActive : ''}`}
                  aria-hidden={i !== current}
                >
                  <div className={styles.card}>
                    <span className={styles.quoteChar} aria-hidden="true">"</span>
                    <blockquote>
                      <p className={styles.testimonialText}>{t.text}</p>
                    </blockquote>
                    <div className={styles.author}>
                      <div 
                        className={styles.avatar}
                        style={{ background: t.color.bg, color: t.color.text }}
                        aria-hidden="true"
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

            {/* Navigation Dots */}
            <div className={styles.dots} role="tablist" aria-label="Testimonial navigation">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                  onClick={() => goTo(i)}
                  aria-label={`Testimonial ${i + 1}`}
                  aria-selected={i === current}
                  role="tab"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          RIGHT PANEL - Scrollable Form
          ════════════════════════════════════════════════════════ */}
      <div className={styles.right}>
        <div className={styles.formWrapper}>
          {/* Form Header */}
          <div className={styles.formTop}>
            <div className={styles.eyebrow}>Get started for free</div>
            <h2 className={styles.formTitle}>Create your account</h2>
            <p className={styles.formDesc}>
              Already have an account?{' '}
              <span 
                className={styles.link} 
                onClick={() => navigate('/login')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate('/login')}
              >
                Sign in
              </span>
            </p>
          </div>

          {/* Server Error Alert */}
          {serverError && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: '#DC2626',
              fontSize: '0.875rem'
            }} role="alert">
              {serverError}
            </div>
          )}

          {/* Registration Form */}
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            {/* Name Fields */}
            <div className={styles.fieldRow}>
              <FormField
                label="First name"
                name="firstName"
                placeholder="Adaeze"
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && errors.firstName}
                required
                autoComplete="given-name"
                data-error={errors.firstName ? 'true' : undefined}
              />
              <FormField
                label="Last name"
                name="lastName"
                placeholder="Okonkwo"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && errors.lastName}
                required
                autoComplete="family-name"
                data-error={errors.lastName ? 'true' : undefined}
              />
            </div>

            {/* Email */}
            <FormField
              label="Email address"
              name="email"
              type="email"
              placeholder="you@business.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              required
              autoComplete="email"
              data-error={errors.email ? 'true' : undefined}
            />

            {/* Phone */}
            <FormField
              label="Phone number"
              name="phone"
              type="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
              autoComplete="tel"
            />

            {/* Business Name */}
            <FormField
              label="Business name"
              name="businessName"
              placeholder="e.g. Adaeze's Boutique"
              value={form.businessName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.businessName && errors.businessName}
              required
              data-error={errors.businessName ? 'true' : undefined}
            />

            {/* Category */}
            <FormField
              label="Business category"
              name="category"
              type="select"
              value={form.category}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.category && errors.category}
              required
              options={CATEGORIES}
              placeholder="Select your category"
              data-error={errors.category ? 'true' : undefined}
            />

            {/* Password */}
            <div className={styles.field}>
              <label htmlFor="password">
                Password
                <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
              </label>
              <div className={styles.pwdWrap}>
                <input
                  id="password"
                  name="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                  data-error={errors.password ? 'true' : undefined}
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPwd(v => !v)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {touched.password && errors.password && (
                <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>
                  {errors.password}
                </span>
              )}
              {form.password && <PasswordStrength password={form.password} />}
            </div>

            {/* Terms Checkbox */}
            <div className={styles.checkRow}>
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={touched.terms && !!errors.terms}
              />
              <label htmlFor="terms" className={styles.checkLabel}>
                I agree to taja's{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                I consent to receiving product updates by email.
              </label>
            </div>
            {touched.terms && errors.terms && (
              <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '-16px', marginBottom: '16px', display: 'block' }}>
                {errors.terms}
              </span>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`${styles.btnSubmit} ${submitted ? styles.btnSuccess : ''}`}
              disabled={submitted || isLoading}
            >
              {submitted ? (
                '✓ Account created! Redirecting...'
              ) : isLoading ? (
                'Creating account...'
              ) : (
                <>
                  <span>Create free account</span>
                  <span className={styles.arrow}>→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Google Auth */}
          <button 
            className={styles.btnGoogle}
            onClick={() => {
              // TODO: Implement Google OAuth
              console.log('Google sign-up clicked')
            }}
            type="button"
          >
            <GoogleIcon /> Continue with Google
          </button>

          {/* Sign In Link */}
          <p className={styles.signinLink}>
            Already selling with taja?{' '}
            <span 
              className={styles.link}
              onClick={() => navigate('/')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            >
              Sign in to your account
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}