import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import Logo from '../../assets/images/logo/obana-logo.svg';

const features = [
  {
    icon: '⚡',
    title: 'Fast checkout',
    desc: 'Process sales in seconds with an intuitive interface built for speed.',
  },
  {
    icon: '📦',
    title: 'Inventory tracking',
    desc: 'Monitor stock levels in real-time and get alerts before you run out.',
  },
  {
    icon: '💳',
    title: 'Multiple payments',
    desc: 'Accept cash, card, and bank transfers seamlessly at every sale.',
  },
  {
    icon: '📊',
    title: 'Sales analytics',
    desc: 'Understand your best sellers, peak hours, and revenue trends.',
  },
  {
    icon: '🧾',
    title: 'Order history',
    desc: 'Access every transaction ever made — searchable and exportable.',
  },
  {
    icon: '🔗',
    title: 'Easy integration',
    desc: 'Plug straight into your existing business system via REST API.',
  },
];

const stats = [
  { value: '10,000+', label: 'Businesses powered' },
  { value: '₦2B+', label: 'Transactions processed' },
  { value: '99.9%', label: 'Uptime guaranteed' },
  { value: '4.9★', label: 'Average rating' },
];

const testimonials = [
  {
    name: 'Adaeze Okonkwo',
    role: 'Owner, Ada\'s Kitchen - Lagos',
    text: 'Since switching to Bumpa POS, my checkout time dropped by half. My staff love how easy it is.',
    initials: 'AO',
  },
  {
    name: 'Emeka Nwosu',
    role: 'Manager, TechHub Store — Abuja',
    text: 'The inventory alerts alone saved us from running out of our top products three times this month.',
    initials: 'EN',
  },
  {
    name: 'Fatima Bello',
    role: 'CEO, FashionFirst — Port Harcourt',
    text: 'We integrated it with our online store in one day. The API docs are clean and the support is excellent.',
    initials: 'FB',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* Navbar */}
      <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <div className={styles.brandLogo}><img src={Logo} alt="Obana Logo" /></div>
            {/* <span className={styles.brandName}>OBANA</span> */}
          </div>
          <div className={styles.navLinks}>
            <a href="#features" className={styles.navLink}>Features</a>
            <a href="#stats" className={styles.navLink}>Why us</a>
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

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Built for Nigerian businesses</div>
          <h1 className={styles.heroTitle}>
            The POS that keeps<br />
            <span className={styles.heroAccent}>your business moving</span>
          </h1>
          <p className={styles.heroSub}>
            Sell faster, track smarter, and grow confidently — with a point of sale
            system designed for how Nigerian businesses actually work.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
              Start for free →
            </button>
            <button className={styles.btnGhost} onClick={() => navigate('/dashboard')}>
              View demo
            </button>
          </div>
          <p className={styles.heroNote}>No credit card required · Free 14-day trial</p>
        </div>

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
                <div key={i} className={styles.mockBar} style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <div className={styles.mockItems}>
              {['Jollof Rice × 12', 'Chicken Burger × 8', 'Smoothie × 6'].map((item) => (
                <div key={item} className={styles.mockItem}>
                  <span>{item}</span>
                  <span className={styles.mockPaid}>Paid</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats} id="stats">
        {stats.map((s) => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Everything you need</p>
          <h2 className={styles.sectionTitle}>Built for the way you sell</h2>
          <p className={styles.sectionSub}>
            From the market stall to the multi-location store — OBANA POS has you covered.
          </p>
        </div>
        <div className={styles.featureGrid}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials} id="testimonials">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Trusted by thousands</p>
          <h2 className={styles.sectionTitle}>What our merchants say</h2>
        </div>
        <div className={styles.testimonialCards}>
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`${styles.testimonialCard} ${i === activeTestimonial ? styles.testimonialActive : ''}`}
            >
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
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeTestimonial ? styles.dotActive : ''}`}
              onClick={() => setActiveTestimonial(i)}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to grow your business?</h2>
        <p className={styles.ctaSub}>
          Join over 10,000 Nigerian businesses already using OBANA POS.
        </p>
        <button className={styles.ctaBtn} onClick={() => navigate('/login')}>
          Get started for free →
        </button>
        <p className={styles.ctaNote}>No credit card required</p>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <div className={styles.brandLogo}><img src="/src/assets/images/logo/obana-logo.svg" alt="" /></div>
            {/* <span className={styles.brandName}>OBANA POS</span> */}
          </div>
          <p className={styles.footerCopy}>© 2026 OBANA. All rights reserved.</p>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>Privacy</a>
            <a href="#" className={styles.footerLink}>Terms</a>
            <a href="#" className={styles.footerLink}>Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
