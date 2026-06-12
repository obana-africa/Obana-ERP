import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'
import FeaturesSection from './FeaturesSection'
import EverythingSection from './EverythingSection'
import ThriveSection from './ThriveSection'
// import PricingSection   from './PricingSection'
import GetStartedSection from './GetStartedSection'
import Footer from './Footer'

// ── Static data ───────────────────────────────────────────
const STATS = [
  { value: '10,000+', label: 'Businesses powered'    },
  { value: '₦2K+',   label: 'Transactions processed' },
  { value: '99.9%',  label: 'Uptime guaranteed'      },
  { value: '4.9★',   label: 'Average Rating'         },
]

// ── Helper: Email validation ─────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPhone = (v) => !v || /^\+?[\d\s-]{8,}$/.test(v.trim())

// ── API base URL (set in .env) ──────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'https://your-backend.com/api'
// ── Waitlist Form using Formspree ─────────────────────────
function WaitlistForm({ onSuccess, source = 'waitlist', buttonText = 'Join waitlist' }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    phone: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!isValidEmail(formData.email)) errors.email = 'Valid email required';
    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (formData.phone && !isValidPhone(formData.phone)) errors.phone = 'Valid phone number required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('loading');
    setErrorMsg('');

    // Build FormData (Formspree expects this format)
    const formPayload = new FormData();
    formPayload.append('fullName', formData.fullName.trim());
    formPayload.append('email', formData.email.trim());
    formPayload.append('businessName', formData.businessName.trim());
    formPayload.append('phone', formData.phone.trim());
    formPayload.append('source', source);

    try {
      const response = await fetch('https://formspree.io/f/mbdeprda', {
        method: 'POST',
        body: formPayload,
        headers: {
          'Accept': 'application/json', // tells Formspree to return JSON
        },
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          fullName: '',
          email: '',
          businessName: '',
          phone: '',
        });
        onSuccess?.();
      } else {
        const data = await response.json();
        // Formspree returns errors in data.errors
        if (data.errors && Object.keys(data.errors).length) {
          const firstError = Object.values(data.errors)[0];
          throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          throw new Error(data.error || 'Something went wrong. Please try again.');
        }
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === 'success') {
    return (
      <div className={styles.successMsg}>
        🎉 You're on the list! Check your inbox for confirmation.
      </div>
    );
  }

  return (
    <form className={styles.waitlistForm} onSubmit={handleSubmit} noValidate>
      <div className={styles.formGroup}>
        <input
          type="text"
          name="fullName"
          className={styles.formInput}
          placeholder="Full name *"
          value={formData.fullName}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.fullName}
        />
        {fieldErrors.fullName && <span className={styles.fieldError}>{fieldErrors.fullName}</span>}
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          name="email"
          className={styles.formInput}
          placeholder="Email address *"
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.email}
        />
        {fieldErrors.email && <span className={styles.fieldError}>{fieldErrors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="businessName"
          className={styles.formInput}
          placeholder="Business name *"
          value={formData.businessName}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.businessName}
        />
        {fieldErrors.businessName && <span className={styles.fieldError}>{fieldErrors.businessName}</span>}
      </div>

      <div className={styles.formGroup}>
        <input
          type="tel"
          name="phone"
          className={styles.formInput}
          placeholder="Phone number (optional)"
          value={formData.phone}
          onChange={handleChange}
          disabled={status === 'loading'}
          aria-invalid={!!fieldErrors.phone}
        />
        {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
      </div>

      <button
        type="submit"
        className={styles.btnWaitlist}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting...' : buttonText}
      </button>

      {status === 'error' && (
        <div className={styles.errorMsg} style={{ color: '#e53e3e', fontSize: '0.75rem', marginTop: '12px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}
    </form>
  );
}// ── Notify Me Form (inline, slide-in) – remains simple email only ──
function NotifyForm() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setErrorMsg('Valid email required')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const response = await fetch(`${API_BASE}/waitlist/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'notify' }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) throw new Error('Already on the waitlist!')
        throw new Error(data.message || 'Failed')
      }

      setStatus('success')
      setEmail('')
      setShow(false)
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(timer)
    }
  }, [status])

  if (status === 'success') {
    return <div className={styles.successMsg}>🔔 Done! We'll notify you at launch.</div>
  }

  if (!show) {
    return (
      <button className={styles.btnGhost} onClick={() => setShow(true)}>
        Notify me
      </button>
    )
  }

  return (
    <form className={styles.notifyWrap} onSubmit={handleSubmit} noValidate>
      <input
        type="email"
        className={styles.notifyInput}
        placeholder="your@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (status === 'error') setStatus('idle')
        }}
        autoFocus
        disabled={status === 'loading'}
      />
      <button type="submit" className={styles.btnNotifySubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Notify me →'}
      </button>
      <button
        type="button"
        className={styles.btnNotifyCancel}
        onClick={() => {
          setShow(false)
          setEmail('')
          setStatus('idle')
        }}
      >
        ✕
      </button>
      {status === 'error' && (
        <div style={{ color: '#e53e3e', fontSize: '0.7rem', position: 'absolute', bottom: '-20px', left: 0 }}>
          {errorMsg}
        </div>
      )}
    </form>
  )
}

// ── Navbar Waitlist Modal (reuses WaitlistForm) ───────────
function NavWaitlistModal({ onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  return (
    <div className={styles.navModalBackdrop}>
      <div className={styles.navModal} ref={ref}>
        <button className={styles.navModalClose} onClick={onClose}>✕</button>
        <p className={styles.navModalTitle}>Join the waitlist</p>
        <p className={styles.navModalSub}>Be first to know when Taoja launches.</p>
        <WaitlistForm onSuccess={onClose} source="navbar" buttonText="Join waitlist" />
      </div>
    </div>
  )
}

// ── Main LandingPage Component ────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [showNavModal, setShowNavModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero-section')
      const threshold = hero ? hero.offsetHeight : window.innerHeight
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showNavModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showNavModal])

  return (
    <div className={styles.page}>
      {showNavModal && <NavWaitlistModal onClose={() => setShowNavModal(false)} />}

      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}>
              <img src="/logos/taojaLogo_white.png" alt="taoja" className={styles.brandLogoImg} />
            </div>
            <div className={styles.navLinks}>
              {/* Features dropdown */}
              <div className={styles.navItem}>
                <button className={styles.navLink}>Features <span className={styles.navChevron}>▾</span></button>
                <div className={styles.dropdown}>
                  <div className={styles.dropdownInner}>
                    <div className={styles.dropdownGrid}>
                      {[
                        { icon: '', title: 'Online Store', desc: 'Launch a branded storefront in minutes' },
                        { icon: '', title: 'Point of Sale', desc: 'Fast, reliable in-person checkout' },
                        { icon: '', title: 'Inventory Tracking', desc: 'Real-time stock across all locations' },
                        { icon: '', title: 'Sales Analytics', desc: 'Revenue trends and smart insights' },
                        { icon: '', title: 'Multiple Payments', desc: 'Cash, card, mobile money & more' },
                        { icon: '', title: 'ERP Integration', desc: 'CRM, accounting and POS unified' },
                      ].map(f => (
                        <div key={f.title} className={styles.dropdownItem}>
                          <span className={styles.dropdownIcon}>{f.icon}</span>
                          <div>
                            <p className={styles.dropdownItemTitle}>{f.title}</p>
                            <p className={styles.dropdownItemDesc}>{f.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.dropdownFooter}>
                      <span className={styles.dropdownFooterText}>All features built for modern African businesses</span>
                      <button className={styles.dropdownFooterBtn} onClick={() => setShowNavModal(true)}>Get early access →</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Why Us dropdown */}
              <div className={styles.navItem}>
                <button className={styles.navLink}>Why Us <span className={styles.navChevron}>▾</span></button>
                <div className={styles.dropdown}>
                  <div className={styles.dropdownInner}>
                    <div className={styles.dropdownWhyUs}>
                      <div className={styles.dropdownWhyCol}>
                        <p className={styles.dropdownColLabel}>Platform Strengths</p>
                        {[
                          { icon: '', title: 'Built for Speed', desc: '99.9% uptime, sub-second load times' },
                          { icon: '', title: 'Africa-First Design', desc: 'Supports ₦, mobile money, local logistics' },
                          { icon: '', title: 'Enterprise Security', desc: 'Bank-grade encryption on all transactions' },
                          { icon: '', title: 'Omnichannel Ready', desc: 'Online, in-store, and mobile — one dashboard' },
                        ].map(w => (
                          <div key={w.title} className={styles.dropdownItem}>
                            <span className={styles.dropdownIcon}>{w.icon}</span>
                            <div>
                              <p className={styles.dropdownItemTitle}>{w.title}</p>
                              <p className={styles.dropdownItemDesc}>{w.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className={styles.dropdownWhyStats}>
                        <p className={styles.dropdownColLabel}>By The Numbers</p>
                        {[
                          { value: '10,000+', label: 'Businesses powered' },
                          { value: '₦2K+',   label: 'Transactions processed' },
                          { value: '99.9%',  label: 'Platform uptime' },
                          { value: '4.9★',   label: 'Average rating' },
                        ].map(s => (
                          <div key={s.label} className={styles.dropdownStat}>
                            <span className={styles.dropdownStatValue}>{s.value}</span>
                            <span className={styles.dropdownStatLabel}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews dropdown */}
              <div className={styles.navItem}>
                <button className={styles.navLink}>Reviews <span className={styles.navChevron}>▾</span></button>
                <div className={styles.dropdown}>
                  <div className={styles.dropdownInner}>
                    <p className={styles.dropdownColLabel} style={{marginBottom: '16px'}}>What businesses say</p>
                    <div className={styles.dropdownReviews}>
                      {[
                        { name: 'Amaka O.', role: 'Fashion Retailer, Lagos', text: 'Taoja transformed how I manage my store. Orders, inventory, payments — all in one place.', stars: 5 },
                        { name: 'Emeka D.', role: 'Electronics Vendor, Abuja', text: 'The POS is incredibly fast. My checkout time dropped by 60% in the first week.', stars: 5 },
                        { name: 'Fatima B.', role: 'Food Business, Kano', text: 'Finally an ERP that understands Nigerian business. The mobile money integration alone is worth it.', stars: 5 },
                      ].map(r => (
                        <div key={r.name} className={styles.dropdownReview}>
                          <div className={styles.dropdownReviewStars}>{'★'.repeat(r.stars)}</div>
                          <p className={styles.dropdownReviewText}>"{r.text}"</p>
                          <div className={styles.dropdownReviewAuthor}>
                            <div className={styles.dropdownReviewAvatar}>{r.name[0]}</div>
                            <div>
                              <p className={styles.dropdownReviewName}>{r.name}</p>
                              <p className={styles.dropdownReviewRole}>{r.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.dropdownFooter}>
                      <span className={styles.dropdownFooterText}>Trusted by 10,000+ businesses across Nigeria</span>
                      <button className={styles.dropdownFooterBtn} onClick={() => setShowNavModal(true)}>Join them →</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.navActions}>
            <button className={styles.btnOutline} onClick={() => setShowNavModal(true)}>Learn more</button>
            <button className={styles.btnPrimary} onClick={() => navigate('/register')}>Get started for free</button>
          </div>
        </div>
      </nav>

      {/* Hero section – now with a button that opens the modal */}
      <section className={styles.hero} id="hero-section">
        <img src="/images/hero-bg.png" alt="" aria-hidden="true" className={styles.heroBgImage} />
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>The easiest way to sell <br /> online and offline.</h1>
          <p className={styles.heroSub}>
            Taoja gives you everything you need to create your <br /> online store, manage sales, and run your business <br /> seamlessly online and in-person.
          </p>
          <div className={styles.heroActions}>
            {/* Replace inline form with modal trigger button */}
            <button 
              className={styles.btnWaitlist}
              onClick={() => setShowNavModal(true)}
            >
              Join waitlist
            </button>
            <NotifyForm />
          </div>
        </div>
      </section>

      {/* Stats section */}
      <section className={styles.stats} id="stats">
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <FeaturesSection />
      <EverythingSection setShowNavModal={setShowNavModal} />
      <ThriveSection setShowNavModal={setShowNavModal} />
      {/* <PricingSection    onCtaClick={() => setShowNavModal(true)} /> */}
      <GetStartedSection onCtaClick={() => setShowNavModal(true)} />
      <Footer />
    </div>
  )
}