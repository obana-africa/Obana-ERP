import { useRef, useState, useEffect } from 'react'
import styles from './LandingPage.module.css'

const STEPS = [
  { n: 1, label: 'Customize your store'    },
  { n: 2, label: 'Set up payments'          },
  { n: 3, label: 'Start selling everywhere' },
]

export default function GetStartedSection({ onCtaClick }) {
  const gsRef = useRef(null)
  const [gsVisible, setGsVisible] = useState(false)  // 👈 always start false

  useEffect(() => {
    const el = gsRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setGsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])  // 👈 empty deps – runs once after mount

  return (
    <section className={styles.getStartedSection} ref={gsRef}>
      <h2 className={styles.getStartedTitle}>Get Started Fast</h2>

      <div className={styles.getStartedRow}>
        {/* Phone mockup visual */}
        <div className={`${styles.getStartedVisual} ${gsVisible ? styles.gsVisualVisible : ''}`}>
          <div className={styles.getStartedPhoneWrap}>
            <img
              src="/images/pos-phone.png"
              alt="thaja POS on mobile"
              className={styles.getStartedPhone}
              onError={e => { e.target.style.display = 'none' }}
            />
            <div className={styles.getStartedDashCard}>
              <img
                src="/images/products-screenshot.png"
                alt="Products dashboard"
                className={styles.getStartedDash}
                onError={e => { e.target.style.display = 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className={styles.getStartedSteps}>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`${styles.getStartedStep} ${gsVisible ? styles.gsStepVisible : ''}`}
              style={{ transitionDelay: `${0.2 + i * 0.15}s` }}
            >
              <div className={styles.getStartedNum}>{s.n}</div>
              <p className={styles.getStartedStepLabel}>{s.label}</p>
            </div>
          ))}

          <div
            className={`${styles.getStartedCtaRow} ${gsVisible ? styles.gsCtaVisible : ''}`}
            style={{ transitionDelay: '0.65s' }}
          >
            <button
              className={styles.getStartedPrimary}
              onClick={onCtaClick}
              type="button"
            >
              Get started for free
            </button>
            <button
              className={styles.getStartedSecondary}
              onClick={onCtaClick}
              type="button"
            >
              Install now
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}