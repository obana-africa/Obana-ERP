import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'
import EverythingSection from './EverythingSection'
import ThriveSection from './ThriveSection'

// ── Static data ───────────────────────────────────────────
const STATS = [
  { value: '10,000+', label: 'Businesses powered'    },
  { value: '₦2K+',   label: 'Transactions processed' },
  { value: '99.9%',  label: 'Uptime guaranteed'      },
  { value: '4.9★',   label: 'Average Rating'         },
]

// ── Helpers ───────────────────────────────────────────────
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const saveToWaitlist = (email, source) => {
  const entry = { email: email.trim(), source, joinedAt: new Date().toISOString() }
  const existing = JSON.parse(localStorage.getItem('taja_waitlist') || '[]')
  localStorage.setItem('taja_waitlist', JSON.stringify([...existing, entry]))
  
   emailjs.send(
    'service_81lbacv',
    'template_jooia8e',
    { 
      user_email: entry.email, 
      message: 'source: ${source}',
      time: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' }), 
    },'9MT_fVS0T1iAhhljE')
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
    const fn = () => {
      const hero = document.getElementById('hero-section')
      const threshold = hero ? hero.offsetHeight : window.innerHeight
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
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
            <button className={styles.btnOutline} onClick={() => setShowNavModal(true)}>Learn more</button>
            <button className={styles.btnPrimary} onClick={() => setShowNavModal(true)}>
              Join waitlist
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero} id="hero-section">
        <img src="/images/hero-bg.png" alt="" aria-hidden="true" className={styles.heroBgImage} />
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            The easiest way to sell <br/> online and offline.
          </h1>
          <p className={styles.heroSub}>
           Taja gives you everything you need to create your <br/> online store, manage sales, and run your business <br/> seamlessly online and in-person.
          </p>
          <div className={styles.heroActions}>
            <WaitlistForm />
            <NotifyForm />
          </div>
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

        {/* Everything you to start a business section */}
            <EverythingSection setShowNavModal={setShowNavModal}/>

        {/* Thrive section */}
              <ThriveSection setShowNavModal={setShowNavModal}/>        

      {/* ══════════════════════════════════════════════
           PRICING PLANS
           ══════════════════════════════════════════════ */}
      <section className={styles.pricingSection} id="pricing">
        <h2 className={styles.pricingTitle}>Pricing Plans</h2>

        <div className={styles.pricingGrid}>
          {/* Starter */}
          <div className={styles.pricingCard}>
            <p className={styles.pricingTier}>Starter Sync</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>₦</span>
              <span className={styles.pricingAmount}>7,500</span>
              <span className={styles.pricingPer}>/month</span>
            </div>
            <p className={styles.pricingDesc}>Sellers using Zoho or small businesses that need basic selling tools</p>
            <button className={styles.pricingCta} onClick={() => setShowNavModal(true)}>Get started</button>
            <ul className={styles.pricingFeatures}>
              {['Account access', 'Sync with Zoho inventory', 'Manual product creation', 'Barcode scanning for sales', 'Sell using existing/generated barcodes', 
                'Create orders and sync to inventory', 'Basic order management', 'Basic sales tracking', 'POS access', '1 business location only', 
                'No online storefront', 'No advanced inventory management'].map(f => (
                <li key={f} className={styles.pricingFeature}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Growth — recommended */}
          <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
            <div className={styles.pricingBadge}>Recommended</div>
            <p className={styles.pricingTier}>Store Growth</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>₦</span>
              <span className={styles.pricingAmount}>9,500</span>
              <span className={styles.pricingPer}>/month</span>
            </div>
            <p className={styles.pricingDesc}>Businesses ready to sell online and offline	
              Everything in Starter Sync +</p>
            <button className={styles.pricingCtaFeatured} onClick={() => setShowNavModal(true)}>Upgrade to Growth</button>
            <ul className={styles.pricingFeatures}>
              {['Online store creation', 'Website storefront', 'Basic website customization', 'Customer checkout management', 
                  'Social commerce selling support', 'Basic analytics'].map(f => (
                <li key={f} className={styles.pricingFeature}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Professional */}
          <div className={styles.pricingCard}>
            <p className={styles.pricingTier}>Business Pro</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>₦</span>
              <span className={styles.pricingAmount}>15,000</span>
              <span className={styles.pricingPer}>/month</span>
            </div>
            <p className={styles.pricingDesc}>Businesses that want full operational control	
                                                Everything in Store Growth +</p>
            <button className={styles.pricingCta} onClick={() => setShowNavModal(true)}>Scale Your Business</button>
            <ul className={styles.pricingFeatures}>
              {['Full inventory management', 'Product creation at scale', 'Stock tracking', 'Product variants management' ,'Purchase/order tracking', 'Low stock alerts', 'Multi-channel product management'].map(f => (
                <li key={f} className={styles.pricingFeature}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.pricingCard}>
            <p className={styles.pricingTier}>Enterprise Scale	</p>
            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>₦</span>
              <span className={styles.pricingAmount}>25,000</span>
              <span className={styles.pricingPer}>/month</span>
            </div>
            <p className={styles.pricingDesc}>Established/high-volume sellers managing multiple operations	
Everything in Business Pro +</p>
            <button className={styles.pricingCta} onClick={() => setShowNavModal(true)}>Scale Your Business</button>
            <ul className={styles.pricingFeatures}>
              {['Multi-location inventory tracking', 'Staff accounts & permissions', 'Advanced analytics & reporting', 'CRM/customer management tools', 'Automated reports', 'Priority support', 'Advanced operational controls'].map(f => (
                <li key={f} className={styles.pricingFeature}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M20 6L9 17l-5-5"/></svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
           GET STARTED FAST
           ══════════════════════════════════════════════ */}
      <section className={styles.getStartedSection}>
        <h2 className={styles.getStartedTitle}>Get Started Fast</h2>

        <div className={styles.getStartedRow}>
          {/* Phone mockup visual */}
          <div className={styles.getStartedVisual}>
            <div className={styles.getStartedPhoneWrap}>
              <img
                src="/images/pos-phone.png"
                alt="Taja POS on mobile"
                className={styles.getStartedPhone}
                onError={e => { e.target.style.display='none' }}
              />
              {/* Fallback dashboard card behind phone */}
              <div className={styles.getStartedDashCard}>
                <img
                  src="/images/products-screenshot.png"
                  alt="Products dashboard"
                  className={styles.getStartedDash}
                  onError={e => { e.target.style.display='none' }}
                />
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className={styles.getStartedSteps}>
            {[
              { n: 1, label: 'Customize your store'     },
              { n: 2, label: 'Set up payments'           },
              { n: 3, label: 'Start selling everywhere'  },
            ].map(s => (
              <div key={s.n} className={styles.getStartedStep}>
                <div className={styles.getStartedNum}>{s.n}</div>
                <p className={styles.getStartedStepLabel}>{s.label}</p>
              </div>
            ))}

            <div className={styles.getStartedCtaRow}>
              <button className={styles.getStartedPrimary} onClick={() => setShowNavModal(true)}>Get started for free</button>
              <button className={styles.getStartedSecondary} onClick={() => setShowNavModal(true)}>Install now</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {/* <section className={styles.cta} id="cta">
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
      </section> */}

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrandCol}>
            <img src="/logos/taja logo white.png" alt="taja" className={styles.footerLogo} />
            <div className={styles.footerSocials}>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="Facebook">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="Instagram">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <rect x={2} y={2} width={20} height={20} rx={5}/><circle cx={12} cy={12} r={4}/><circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="X">
                <svg width={19} height={19} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="LinkedIn">
                <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x={2} y={9} width={4} height={12}/><circle cx={4} cy={4} r={2}/>
                </svg>
              </a>
            </div>
          </div>
          <div className={styles.footerCols}>
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
            <a href="#" className={styles.footerLink}>Order Now & Pay Small Small (ONPSS) </a>
            <a href="#" className={styles.footerLink}>Partner With Us</a>
           </div>
           <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>Start Trading</p>
            <a href="#" className={styles.footerLink}>Sell on Obana</a>
            <a href="#" className={styles.footerLink}>Buy in Bulk</a>
            <a href="#" className={styles.footerLink}>Earn as a Sales Partner</a>
           </div>
          </div>
        </div>

        <div className={styles.footerDivider}></div>

        <div className={styles.footerBottom}>
          <div className={styles.footerBottomLeft}>
          <p className={styles.footerCopy}>
            © 2025 Obana.Africa (An ICON Tech &amp; Ecom Services Ltd Trademark). <br />All Rights Reserved.{' '}
            <br /><a href="#" className={styles.footerBottomLink}>Terms &amp; Conditions</a>
            {' | '}
            <a href="#" className={styles.footerBottomLink}>Privacy Policy</a>
          </p>
          </div>
          <div className={styles.footerNewsletter}>
            <p className={styles.footerNewsletterTitle}>Stay Connected</p>
            <p className={styles.footerNewsletterSub}>
              Subscribe for updates on sourcing opportunities, vendor programmes, and African market trends.
            </p>
            <form className={styles.footerNewsletterForm} onSubmit={e => e.preventDefault()}>
              <input type="email" className={styles.footerNewsletterInput} placeholder="Enter your email..." />
              <button type="submit" className={styles.footerNewsletterBtn} aria-label="Subscribe">
               <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </footer>

    </div>
  )
}
