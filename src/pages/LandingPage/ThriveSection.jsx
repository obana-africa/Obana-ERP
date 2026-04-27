/**
 * ThriveSection.jsx
 * "Everything Your Business Needs To Thrive"
 *
 * Place in: src/pages/LandingPage/ThriveSection.jsx
 *
 * Images needed in public/images/:
 *   thrive-pos.png          ← two phones mockup
 *   thrive-inventory.png    ← inventory table screenshot
 *   thrive-payments.png     ← dark payments dashboard
 *   thrive-analytics.png    ← revenue chart dashboard
 *   thrive-online-store.png ← online store dashboard
 *   thrive-erp.png          ← ERP/full dashboard
 *
 * Usage in LandingPage.jsx:
 *   import ThriveSection from './ThriveSection'
 *   ...
 *   <ThriveSection />
 */

import styles from './ThriveSection.module.css'

const CARDS = [
  {
    id: 'pos',
    img: '/images/thrive-pos.png',
    imgAlt: 'Point of Service POS screens',
    title: 'Point of Service',
    desc: 'Process sales in seconds with an intuitive POS built for speed and reliability. Handle high customer flow effortlessly, reduce wait times, and keep every transaction smooth and accurate.',
    cta: 'Get started for free',
    ctaStyle: 'dark',
    imgBg: '#ffffff',
  },
  {
    id: 'inventory',
    img: '/images/thrive-inventory.png',
    imgAlt: 'Inventory tracking dashboard',
    title: 'Inventory Tracking',
    desc: 'Monitor stock levels in real time across all your locations. Get instant low-stock alerts, avoid running out of bestsellers, and keep your inventory accurate without manual tracking.',
    cta: 'Get started for free',
    ctaStyle: 'gold',
    imgBg: '#f9fafb',
  },
  {
    id: 'payments',
    img: '/images/multiplepayment.png',
    imgAlt: 'Multiple payments dashboard',
    title: 'Multiple Payments',
    desc: 'Accept cash, card, bank transfer, and mobile money seamlessly at every sale. Give your customers flexible payment options while keeping every transaction fast, secure, and easy to manage.',
    cta: 'Get started for free',
    ctaStyle: 'dark',
    imgBg: '#1a1a2e',
  },
  {
    id: 'analytics',
    img: '/images/thrive-analytics.png',
    imgAlt: 'Sales analytics revenue chart',
    title: 'Sales Analytics',
    desc: 'Understand your best sellers, peak hours, and revenue trends across all your sales channels. Get clear insights that help you make smarter decisions and grow your business with confidence.',
    cta: 'Get started for free',
    ctaStyle: 'dark',
    imgBg: '#f9fafb',
  },
  {
    id: 'store',
    img: '/images/thrive-online-store.png',
    imgAlt: 'Online store dashboard',
    title: 'Online Store',
    desc: 'Launch a fully branded storefront that syncs seamlessly with your POS no double entry required. Manage products, orders, and inventory once, and keep everything updated across all your sales channels.',
    cta: 'Get started for free',
    ctaStyle: 'dark',
    imgBg: '#f9fafb',
  },
  {
    id: 'erp',
    img: '/images/thrive-online-store.png',
    imgAlt: 'ERP integration dashboard',
    title: 'ERP Integration',
    desc: 'CRM, accounting, inventory, and POS all in one unified system for your business. Manage customers, track finances, control stock, and process sales seamlessly from a single dashboard.',
    cta: 'Get started for free',
    ctaStyle: 'dark',
    imgBg: '#f9fafb',
  },
]

export default function ThriveSection({ setShowNavModal }) {
  return (
    <section className={styles.section}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          Everything Your Business Needs To Thrive
        </h2>
        <p className={styles.sub}>
          From inventory to payments, analytics to customer management. Taja simplifies the hard parts of
          running a business.
        </p>
      </div>

      {/* ── 3×2 card grid ── */}
      <div className={styles.grid}>
        {CARDS.map(card => (
          <div key={card.id} className={styles.card}>

            {/* Screenshot area */}
            <div className={styles.imgWrap} style={{ background: card.imgBg }}>
              <img
                src={card.img}
                alt={card.imgAlt}
                className={styles.img}
                loading="lazy"
              />
            </div>

            {/* Card body */}
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
              <button
                className={
                  card.ctaStyle === 'gold'
                    ? styles.ctaGold
                    : styles.ctaDark
                }
                onClick={() => setShowNavModal(true)}
              >
                {card.cta}
              </button>
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}
