import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'


// ── Static data ───────────────────────────────────────────
const FEATURES = [
  { icon: '⚡', title: 'Fast Checkout',        desc: 'Process sales in seconds with an intuitive POS built for speed and reliability.' },
  { icon: '📦', title: 'Inventory Tracking',   desc: 'Monitor stock levels in real-time across all locations and get low-stock alerts.' },
  { icon: '💳', title: 'Multiple Payments',    desc: 'Accept cash, card, bank transfer, and mobile money seamlessly at every sale.' },
  { icon: '📊', title: 'Sales Analytics',      desc: 'Understand your best sellers, peak hours, and revenue trends across channels.' },
  { icon: '🛍️', title: 'Online Store',          desc: 'Launch a branded storefront synced with your POS — zero double-entry.' },
  { icon: '🔗', title: 'ERP Integration',      desc: 'CRM, accounting, inventory and POS — one unified system for your business.' },
]

const STATS = [
  { value: '10,000+', label: 'Businesses powered'     },
  { value: '₦2B+',   label: 'Transactions processed'  },
  { value: '99.9%',  label: 'Uptime guaranteed'       },
  { value: '4.9★',   label: 'Average rating'          },
]

const TESTIMONIALS = [
  {
    name: 'Adaeze Okonkwo', initials: 'AO',
    role: 'Owner, Ada\'s Boutique — Lagos',
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

// ── Mock dashboard card ───────────────────────────────────
const MOCK_ITEMS = [
  { name: 'Classic Ankara Dress × 3', amount: '₦45,000' },
  { name: 'Leather Crossbody Bag × 2', amount: '₦44,000' },
  { name: 'Premium Shea Butter × 8',   amount: '₦36,000' },
]

// ── LandingPage ───────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() =>
      setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className={styles.page}>

      {/* ── Navbar ── */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <img
              src="/public/logos/taja logo blue.png"
              alt="taja by Obana.Africa"
              className={styles.brandLogo}
            />
          </div>
          <div className={styles.navLinks}>
            <a href="#features"     className={styles.navLink}>Features</a>
            <a href="#stats"        className={styles.navLink}>Why Us</a>
            <a href="#testimonials" className={styles.navLink}>Reviews</a>
          </div>
          <div className={styles.navActions}>
            <button className={styles.btnOutline} onClick={() => navigate('/login')}>
              Sign in
            </button>
            <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Built for Nigerian businesses</div>
          <h1 className={styles.heroTitle}>
            The ERP that keeps<br />
            <span className={styles.heroAccent}>your business moving</span>
          </h1>
          <p className={styles.heroSub}>
            Sell faster, track smarter, and grow confidently — with a point of sale
            and online store system designed for how businesses actually work.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimaryLg} onClick={() => navigate('/login')}>
              Start for free →
            </button>
            <button className={styles.btnGhost} onClick={() => navigate('/dashboard')}>
              View demo
            </button>
          </div>
          <p className={styles.heroNote}>No credit card required · Free 14-day trial</p>
        </div>

        {/* Mock dashboard card */}
        <div className={styles.heroVisual}>
          <div className={styles.mockCard}>
            <div className={styles.mockHeader}>
              <div className={styles.mockDots}>
                <span /><span /><span />
              </div>
              <span className={styles.mockTitle}>Today's sales</span>
            </div>
            <div className={styles.mockAmount}>₦184,500</div>
            <div className={styles.mockSub}>32 transactions · up 24% from yesterday</div>
            <div className={styles.mockBars}>
              {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
                <div key={i} className={styles.mockBar}
                  style={{ height:`${h}%`, animationDelay:`${i * 0.1}s` }} />
              ))}
            </div>
            <div className={styles.mockItems}>
              {MOCK_ITEMS.map(item => (
                <div key={item.name} className={styles.mockItem}>
                  <span>{item.name}</span>
                  <div className={styles.mockItemRight}>
                    <span className={styles.mockAmt}>{item.amount}</span>
                    <span className={styles.mockPaid}>Paid</span>
                  </div>
                </div>
              ))}
            </div>
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
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Everything you need</p>
          <h2 className={styles.sectionTitle}>Built for the way you sell</h2>
          <p className={styles.sectionSub}>
            From a single market stall to a multi-location store — Obana has you covered.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
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
              onClick={() => setActiveTestimonial(i)}
            />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to grow your business?</h2>
        <p className={styles.ctaSub}>
          Join over 10,000 Nigerian businesses already using Obana.
        </p>
        <button className={styles.ctaBtn} onClick={() => navigate('/login')}>
          Get started for free →
        </button>
        <p className={styles.ctaNote}>No credit card required</p>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <img
              src="/public/logos/taja logo blue.png"
              alt="taja by Obana.Africa"
              className={styles.footerBrand}
            />
          <p className={styles.footerCopy}>© 2026 Obana Africa Ltd. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Privacy</a>
            <a href="#" className={styles.footerLink}>Terms</a>
            <a href="#" className={styles.footerLink}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
