import { useState, useEffect, useRef } from 'react'
import styles from './LandingPage.module.css'

import Navbar                from './Navbar'
import WaitlistForm          from './WaitlistForm'
import FeaturesSection       from './FeaturesSection'
import EverythingSection     from './EverythingSection'
import ThriveSection         from './ThriveSection'
import ObanaAdvantageSection from './ObanaAdvantageSection'
import GetStartedSection     from './GetStartedSection'
import Footer                from './Footer'

// ── Static data ───────────────────────────────────────────
const STATS = [
  { value: '10,000+', label: 'Businesses powered'    },
  { value: '₦2K+',   label: 'Transactions processed' },
  { value: '99.9%',  label: 'Uptime guaranteed'      },
  { value: '4.9★',   label: 'Average Rating'         },
]

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

// ── NotifyForm ────────────────────────────────────────────
// Hero "Notify me" — uses Formspree, no extra backend needed
function NotifyForm() {
  const [show,     setShow]     = useState(false)
  const [email,    setEmail]    = useState('')
  const [status,   setStatus]   = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setErrorMsg('Please enter a valid email')
      setStatus('error')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(
        'https://formspree.io/f/mbdeprda',
        {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json',
          },
          body: JSON.stringify({ email: email.trim(), source: 'notify-me' }),
        },
      )
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      setEmail('')
      setShow(false)
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  useEffect(() => {
    if (status !== 'success') return
    const t = setTimeout(() => setStatus('idle'), 4000)
    return () => clearTimeout(t)
  }, [status])

  if (status === 'success') {
    return <div className={styles.successMsg} role="status">🔔 Done! We will notify you at launch.</div>
  }

  if (!show) {
    return (
      <button type="button" className={styles.btnGhost} onClick={() => setShow(true)}>
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
        onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
        autoFocus
        disabled={status === 'loading'}
        aria-label="Email address for launch notification"
      />
      <button type="submit" className={styles.btnNotifySubmit} disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Notify me'}
      </button>
      <button
        type="button"
        className={styles.btnNotifyCancel}
        aria-label="Cancel"
        onClick={() => { setShow(false); setEmail(''); setStatus('idle') }}
      >
        X
      </button>
      {status === 'error' && (
        <span role="alert" style={{ color: '#f87171', fontSize: '0.7rem', position: 'absolute', bottom: '-20px', left: 0 }}>
          {errorMsg}
        </span>
      )}
    </form>
  )
}

// ── NavWaitlistModal ──────────────────────────────────────
function NavWaitlistModal({ onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    const onEscape       = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown',   onEscape)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown',   onEscape)
    }
  }, [onClose])

  return (
    <div className={styles.navModalBackdrop} role="dialog" aria-modal="true" aria-label="Join the waitlist">
      <div className={styles.navModal} ref={ref}>
        <button type="button" className={styles.navModalClose} onClick={onClose} aria-label="Close">X</button>
        <p className={styles.navModalTitle}>Join the waitlist</p>
        <p className={styles.navModalSub}>
          Be first to know when ta'oja launches. You will get a confirmation email straight away.
        </p>
        <WaitlistForm onSuccess={onClose} source="navbar" buttonText="Join waitlist" />
      </div>
    </div>
  )
}

// ── LandingPage ───────────────────────────────────────────
export default function LandingPage() {
  const [scrolled,     setScrolled]     = useState(false)
  const [showNavModal, setShowNavModal] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const hero      = document.getElementById('hero-section')
      const threshold = hero ? hero.offsetHeight : window.innerHeight
      setScrolled(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = showNavModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showNavModal])

  const openModal  = () => setShowNavModal(true)
  const closeModal = () => setShowNavModal(false)

  return (
    <div className={styles.page}>

      {showNavModal && <NavWaitlistModal onClose={closeModal} />}

      <Navbar scrolled={scrolled} onWaitlistClick={openModal} />

      <section className={styles.hero} id="hero-section">
        <img src="/images/hero-bg.png" alt="" aria-hidden="true" className={styles.heroBgImage} />
        <div className={styles.heroBgOverlay} />
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            The easiest way to sell online and offline.
          </h1>
          <p className={styles.heroSub}>
            ta'oja gives you everything you need to create your online store,
            manage sales, and run your business seamlessly online and in-person.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.btnWaitlist} onClick={openModal}>
              Join waitlist
            </button>
            <NotifyForm />
          </div>
        </div>
      </section>

      <section className={styles.stats} id="stats">
        {STATS.map(s => (
          <div key={s.label} className={styles.statItem}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </section>

      <FeaturesSection />
      <EverythingSection       setShowNavModal={setShowNavModal} />
      <ThriveSection           setShowNavModal={setShowNavModal} />
      <ObanaAdvantageSection   onCtaClick={openModal} />
      <GetStartedSection       onCtaClick={openModal} />
      <Footer />

    </div>
  )
}