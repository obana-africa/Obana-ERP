import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

// ── Static data ───────────────────────────────────────────
const STATS = [
  { value: '10,000+', label: 'Businesses powered'    },
  { value: '₦2B+',   label: 'Transactions processed' },
  { value: '99.9%',  label: 'Uptime guaranteed'      },
  { value: '4.9★',   label: 'Average Rating'         },
]

const TESTIMONIALS = [
  {
    name: 'Adaeze Okonkwo', initials: 'AO',
    role: "Owner, Ada's Boutique — Lagos",
    text: 'Since switching to Obana, my checkout time dropped by half. My staff love how easy it is to use across both our store and online.',
  },
  {
    name: 'Emeka Nwosu', initials: 'EN',
    role: 'Manager, TechHub Store — Abuja',
    text: 'The inventory alerts alone saved us from running out of our top products three times this month. The cross-location sync is excellent.',
  },
  {
    name: 'Fatima Bello', initials: 'FB',
    role: 'CEO, FashionFirst — Port Harcourt',
    text: 'We integrated the online store with our POS in one day. The Ankara collections are selling beautifully and stock updates instantly.',
  },
]

// ── Helpers ───────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const saveToWaitlist = (email, source) => {
  const entry = { email: email.trim(), source, joinedAt: new Date().toISOString() }
  const existing = JSON.parse(localStorage.getItem('obana_waitlist') || '[]')
  localStorage.setItem('obana_waitlist', JSON.stringify([...existing, entry]))
  // Uncomment once EmailJS is set up:
  // emailjs.send('SERVICE_ID','TEMPLATE_ID',{ user_email: entry.email, source },'PUBLIC_KEY')
  return entry
}

// ── Reusable waitlist pill ────────────────────────────────
function WaitlistForm({ onSuccess }) {
  const [email,      setEmail]      = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done,       setDone]       = useState(false)
  const [err,        setErr]        = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) { setErr('Please enter a valid email.'); return }
    setErr(''); setSubmitting(true)
    try   { saveToWaitlist(email, 'waitlist'); setDone(true); setEmail(''); onSuccess?.() }
    catch { setErr('Something went wrong. Try again.') }
    finally { setSubmitting(false) }
  }
  // Inside WaitlistForm, after setDone(true):
useEffect(() => {
  if (done) {
    const t = setTimeout(() => setDone(false), 3000)
    return () => clearTimeout(t)
  }
}, [done])
  if (done) return <div className={styles.successMsg}>🎉 You're on the list!</div>

  return (
    <form className={styles.emailWrap} onSubmit={handleSubmit} noValidate>
      <input
        type="email" className={styles.emailInput}
        placeholder="Email Address" value={email}
        onChange={e => { setEmail(e.target.value); setErr('') }}
        disabled={submitting}
      />
      <button type="submit" className={styles.btnWaitlist} disabled={submitting}>
        {submitting ? '...' : 'Join waitlist'}
      </button>
    </form>
  )
}

// ── Notify Me button + inline form ───────────────────────
function NotifyForm() {
  const [show,  setShow]  = useState(false)
  const [email, setEmail] = useState('')
  const [done,  setDone]  = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) return
    saveToWaitlist(email, 'notify')
    setDone(true); setShow(false); setEmail('')
  }

  useEffect(() => {
  if (done) {
    const t = setTimeout(() => setDone(false), 3000)
    return () => clearTimeout(t)
  }
}, [done])

  if (done) return <div className={styles.successMsg}>🔔 Done! We'll notify you at launch.</div>
  if (!show) return (
    <button className={styles.btnGhost} onClick={() => setShow(true)}>Notify me</button>
  )
  return (
    <form className={styles.notifyWrap} onSubmit={handleSubmit} noValidate>
      <input type="email" className={styles.notifyInput}
        placeholder="your@email.com" value={email}
        onChange={e => setEmail(e.target.value)} autoFocus />
      <button type="submit" className={styles.btnNotifySubmit}>Notify me →</button>
      <button type="button" className={styles.btnNotifyCancel}
        onClick={() => { setShow(false); setEmail('') }}>✕</button>
    </form>
  )
}

// ── Navbar waitlist modal ────────────────────────────────
function NavWaitlistModal({ onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const click = (e) => { if (!ref.current?.contains(e.target)) onClose() }
    const key   = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', click)
    document.addEventListener('keydown',   key)
    return () => {
      document.removeEventListener('mousedown', click)
      document.removeEventListener('keydown',   key)
    }
  }, [onClose])

  return (
    <div className={styles.navModalBackdrop}>
      <div className={styles.navModal} ref={ref}>
        <button className={styles.navModalClose} onClick={onClose}>✕</button>
        <p className={styles.navModalTitle}>Join the waitlist</p>
        <p className={styles.navModalSub}>Be first to know when Taja launches.</p>
        <WaitlistForm />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled,          setScrolled]          = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [showNavModal,      setShowNavModal]      = useState(false)
  const [showAllFeatures,   setShowAllFeatures]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const t = setInterval(() =>
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showNavModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showNavModal])

  return (
    <div className={styles.page}>

      {/* ── Navbar modal ── */}
      {showNavModal && <NavWaitlistModal onClose={() => setShowNavModal(false)} />}

      {/* ── Navbar ── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <img src="/logos/taja logo white.png" alt="taja" className={styles.brandLogo} />
            <div className={styles.navLinks}>
              <a href="#features"     className={styles.navLink}>Features</a>
              <a href="#stats"        className={styles.navLink}>Why Us</a>
              <a href="#testimonials" className={styles.navLink}>Reviews</a>
            </div>
          </div>
          <div className={styles.navActions}>
            <button className={styles.btnOutline}>Learn more</button>
            <button className={styles.btnPrimary} onClick={() => setShowNavModal(true)}>
              Join waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <img src="/images/hero-bg.png" alt="" aria-hidden="true" className={styles.heroBgImage} />
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            The ERP That Keeps<br />
            <span className={styles.heroAccent}>Your Business Moving</span>
          </h1>
          <p className={styles.heroSub}>
            Sell faster, track smarter, and grow confidently with a point of sale
            and online store system designed for how businesses actually work.
          </p>
          <div className={styles.heroActions}>
            <WaitlistForm />
            <NotifyForm />
          </div>
          <p className={styles.heroNote}>No credit card required · Free 14-day trial</p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className={styles.stats} id="stats">
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section className={styles.features} id="features">
        <div className={styles.featuresHeader}>
          <div className={styles.featuresHeaderLeft}>
            <h2 className={styles.featuresSectionTitle}>Built For The<br />Way You Sell</h2>
          </div>
          <p className={styles.featuresSectionSub}>
            From a single market stall to a multi-location store,<br />
            Obana.Africa has you covered.
          </p>
        </div>

        <div className={styles.featureCards}>
          <div className={styles.featureCard}>
            <div className={styles.featureImgWrap}>
              <img src="/images/feature-checkout.png" alt="Fast Checkout" className={styles.featureImg} loading="lazy" />
            </div>
            <h3 className={styles.featureTitle}>Fast Checkout</h3>
            <p className={styles.featureDesc}>Process sales in seconds with an intuitive POS built for speed and reliability.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureImgWrap}>
              <img src="/images/feature-analytics.png" alt="Sales Analytics" className={styles.featureImg} loading="lazy" />
            </div>
            <h3 className={styles.featureTitle}>Sales Analytics</h3>
            <p className={styles.featureDesc}>Understand your best sellers, peak hours, and revenue trends across channels.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureImgWrap}>
              <img src="/images/feature-inventory.png" alt="Inventory Tracking" className={styles.featureImg} loading="lazy" />
            </div>
            <h3 className={styles.featureTitle}>Inventory Tracking</h3>
            <p className={styles.featureDesc}>Monitor stock levels in real-time across all locations and get low-stock alerts.</p>
          </div>
        </div>

        {showAllFeatures && (
          <div className={styles.featureCards} style={{ marginTop: 24 }}>
            {[
              { icon: '💳', title: 'Multiple Payments',  desc: 'Accept cash, card, bank transfer, and mobile money seamlessly at every sale.' },
              { icon: '🛍️', title: 'Online Store',        desc: 'Launch a branded storefront synced with your POS — zero double-entry.' },
              { icon: '🔗', title: 'ERP Integration',    desc: 'CRM, accounting, inventory and POS — one unified system for your business.' },
            ].map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureImgWrap} style={{ display:'flex', alignItems:'center', justifyContent:'center', background:'#E6F7F2' }}>
                  <span style={{ fontSize: 52 }}>{f.icon}</span>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className={styles.featuresSeeMore}>
          <button className={styles.btnSeeMore} onClick={() => setShowAllFeatures(v => !v)}>
            {showAllFeatures ? 'See less ▲' : 'See more ▼'}
          </button>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Trusted by thousands</p>
          <h2 className={styles.sectionTitle}>What our merchants say</h2>
        </div>
        <div className={styles.testimonialCards}>
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name}
              className={`${styles.testimonialCard} ${i === activeTestimonial ? styles.testimonialActive : ''}`}>
              <p className={styles.testimonialText}>"{t.text}"</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.initials}</div>
                <div>
                  <p className={styles.testimonialName}>{t.name}</p>
                  <p className={styles.testimonialRole}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.testimonialDots}>
          {TESTIMONIALS.map((_, i) => (
            <button key={i}
              className={`${styles.dot} ${i === activeTestimonial ? styles.dotActive : ''}`}
              onClick={() => setActiveTestimonial(i)} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta} id="cta">
        <img src="/images/cta-bg.png" alt="" aria-hidden="true" className={styles.ctaBgImage} />
        <div className={styles.ctaOverlay} />
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready To Grow Your Business?</h2>
          <p className={styles.ctaSub}>Join Over 10,000 Nigerian Businesses Already Using Obana.Africa</p>
          <div className={styles.ctaActions}>
            <WaitlistForm />
            <NotifyForm />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrandCol}>
            <img src="/logos/taja logo white.png" alt="taja" className={styles.footerLogo} />
            <div className={styles.footerSocials}>
              <a href="#" className={styles.footerSocial} aria-label="Facebook">
                <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" className={styles.footerSocial} aria-label="Instagram">
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x={2} y={2} width={20} height={20} rx={5}/>
                  <circle cx={12} cy={12} r={4}/>
                  <circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="#" className={styles.footerSocial} aria-label="X">
                <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className={styles.footerSocial} aria-label="LinkedIn">
                <svg width={15} height={15} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx={4} cy={4} r={2}/>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>About taja</p>
            <a href="#" className={styles.footerLink}>About Us</a>
            <a href="#" className={styles.footerLink}>Blog</a>
            <a href="#" className={styles.footerLink}>FAQs</a>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Sourcing Solutions</p>
            <a href="#" className={styles.footerLink}>Circular Sourcing</a>
            <a href="#" className={styles.footerLink}>African Inspired Sourcing</a>
            <a href="#" className={styles.footerLink}>Request for Sourcing</a>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Partnership & Growth</p>
            <a href="#" className={styles.footerLink}>Request Shipment</a>
            <a href="#" className={styles.footerLink}>Order Now & Pay Small Smal </a>
            <a href="#" className={styles.footerLink}>Partner With Us</a>
          </div>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Start Trading</p>
            <a href="#" className={styles.footerLink}>Sell on Obana</a>
            <a href="#" className={styles.footerLink}>Buy in Bulk</a>
            <a href="#" className={styles.footerLink}>Earn as a Sales Partner</a>
          </div>

         
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>
            © 2025 Obana.Africa (An ICON Tech &amp; Ecom Services Ltd Trademark). All Rights Reserved.{' '}
            <a href="#" className={styles.footerBottomLink}>Terms &amp; Conditions</a>
            {' | '}
            <a href="#" className={styles.footerBottomLink}>Privacy Policy</a>
          </p>
          <div className={styles.footerNewsletter}>
            <p className={styles.footerNewsletterTitle}>Stay Connected</p>
            <p className={styles.footerNewsletterSub}>
              Subscribe for updates on sourcing opportunities, vendor programmes, and African market trends.
            </p>
            <form className={styles.footerNewsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" className={styles.footerNewsletterInput} placeholder="Enter your email..." />
              <button type="submit" className={styles.footerNewsletterBtn} aria-label="Subscribe">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </footer>

    </div>
  )
}
