import { useState } from 'react'
import styles from './LandingPage.module.css'

const MAIN_FEATURES = [
  {
    img: '/images/feature-checkout.png',
    alt: 'Fast Checkout',
    title: 'Fast Checkout',
    desc: 'Process sales in seconds with an intuitive POS built for speed and reliability.',
  },
  {
    img: '/images/feature-analytics.png',
    alt: 'Sales Analytics',
    title: 'Sales Analytics',
    desc: 'Understand your best sellers, peak hours, and revenue trends across channels.',
  },
  {
    img: '/images/feature-inventory.png',
    alt: 'Inventory Tracking',
    title: 'Inventory Tracking',
    desc: 'Monitor stock levels in real-time across all locations and get low-stock alerts.',
  },
]

const EXTRA_FEATURES = [
  {
    icon: '💳',
    title: 'Multiple Payments',
    desc: 'Accept cash, card, bank transfer, and mobile money seamlessly at every sale.',
  },
  {
    icon: '🛍️',
    title: 'Online Store',
    desc: 'Launch a branded storefront synced with your POS — zero double-entry.',
  },
  {
    icon: '🔗',
    title: 'ERP Integration',
    desc: 'CRM, accounting, inventory and POS — one unified system for your business.',
  },
]

export default function FeaturesSection() {
  const [showAll, setShowAll] = useState(false)
  //  const [showAllFeatures, setShowAllFeatures] = useState(false)

  return (
    <section className={styles.features} id="features">
      <div className={styles.featuresHeader}>
        <div className={styles.featuresHeaderLeft}>
          <h2 className={styles.featuresSectionTitle}>Built For The<br />Way You Sell</h2>
        </div>
        <p className={styles.featuresSectionSub}>
          From a single market stall to a multi-location store,<br />
          taoja has you covered.
        </p>
      </div>

      <div className={styles.featureCards}>
        {MAIN_FEATURES.map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <div className={styles.featureImgWrap}>
              <img
                src={f.img}
                alt={f.alt}
                className={styles.featureImg}
                loading="lazy"
              />
            </div>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      {showAll && (
        <div className={styles.featureCards} style={{ marginTop: 24 }}>
          {EXTRA_FEATURES.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <div
                className={styles.featureImgWrap}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E6F7F2' }}
              >
                <span style={{ fontSize: 52 }}>{f.icon}</span>
              </div>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.featuresSeeMore}>
        <button
          className={styles.btnSeeMore}
          onClick={() => setShowAll((v) => !v)}
          type="button"
        >
          {showAll ? 'See less ▲' : 'See more ▼'}
        </button>
      </div>
    </section>
  )
}