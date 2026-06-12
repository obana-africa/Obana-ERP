import styles from './LandingPage.module.css'

const PLANS = [
  {
    tier: 'Starter Sync',
    amount: '7,500',
    desc: 'Sellers using Zoho or small businesses that need basic selling tools',
    ctaLabel: 'Get started',
    featured: false,
    features: [
      'Account access',
      'Sync with Zoho inventory',
      'Manual product creation',
      'Barcode scanning for sales',
      'Sell using existing/generated barcodes',
      'Create orders and sync to inventory',
      'Basic order management',
      'Basic sales tracking',
      'POS access',
      '1 business location only',
      'No online storefront',
      'No advanced inventory management',
    ],
  },
  {
    tier: 'Store Growth',
    amount: '9,500',
    desc: 'Businesses ready to sell online and offline. Everything in Starter Sync +',
    ctaLabel: 'Upgrade to Growth',
    featured: true,
    badge: 'Recommended',
    features: [
      'Online store creation',
      'Website storefront',
      'Basic website customization',
      'Customer checkout management',
      'Social commerce selling support',
      'Basic analytics',
    ],
  },
  {
    tier: 'Business Pro',
    amount: '15,000',
    desc: 'Businesses that want full operational control. Everything in Store Growth +',
    ctaLabel: 'Scale Your Business',
    featured: false,
    features: [
      'Full inventory management',
      'Product creation at scale',
      'Stock tracking',
      'Product variants management',
      'Purchase/order tracking',
      'Low stock alerts',
      'Multi-channel product management',
    ],
  },
  {
    tier: 'Enterprise Scale',
    amount: '25,000',
    desc: 'Established/high-volume sellers managing multiple operations. Everything in Business Pro +',
    ctaLabel: 'Scale Your Business',
    featured: false,
    features: [
      'Multi-location inventory tracking',
      'Staff accounts & permissions',
      'Advanced analytics & reporting',
      'CRM/customer management tools',
      'Automated reports',
      'Priority support',
      'Advanced operational controls',
    ],
  },
]

const CheckIcon = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
    <path d="M20 6L9 17l-5-5"/>
  </svg>
)

export default function PricingSection({ onCtaClick }) {
  return (
    <section className={styles.pricingSection} id="pricing">
      <h2 className={styles.pricingTitle}>Pricing Plans</h2>

      <div className={styles.pricingGrid}>
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className={`${styles.pricingCard} ${plan.featured ? styles.pricingCardFeatured : ''}`}
          >
            {plan.badge && (
              <div className={styles.pricingBadge}>{plan.badge}</div>
            )}

            <p className={styles.pricingTier}>{plan.tier}</p>

            <div className={styles.pricingPrice}>
              <span className={styles.pricingCurrency}>₦</span>
              <span className={styles.pricingAmount}>{plan.amount}</span>
              <span className={styles.pricingPer}>/month</span>
            </div>

            <p className={styles.pricingDesc}>{plan.desc}</p>

            <button
              className={plan.featured ? styles.pricingCtaFeatured : styles.pricingCta}
              onClick={onCtaClick}
              type="button"
            >
              {plan.ctaLabel}
            </button>

            <ul className={styles.pricingFeatures}>
              {plan.features.map((f) => (
                <li key={f} className={styles.pricingFeature}>
                  <CheckIcon />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}