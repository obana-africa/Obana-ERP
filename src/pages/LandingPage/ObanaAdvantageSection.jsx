import styles from './ObanaAdvantageSection.module.css'

const ADVANTAGES = [
  {
    id: 'inventory',
    eyebrow: 'Linked inventory',
    title: 'Your shop and stock, always in sync',
    desc: 'When you sign up to Taoja, your store is directly connected to Obana.Africa\'s inventory network. Products you sell are tracked in real time — no manual updates, no mismatched stock counts.',
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'financing',
    eyebrow: 'Inventory financing',
    title: 'Stock up now, pay as you sell',
    desc: 'Get access to inventory financing through Obana.Africa — so you can restock faster, take on larger orders, and grow without waiting on cash flow. Your sales history on Taoja builds your eligibility automatically.',
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x={1} y={4} width={22} height={16} rx={2} ry={2}/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    id: 'network',
    eyebrow: 'Obana.Africa network',
    title: 'Backed by Africa\'s commerce infrastructure',
    desc: 'Taoja is powered by Obana.Africa — a sourcing, logistics, and trade network built for Nigerian and African businesses. That means better supplier access, smarter restocking, and a platform that grows with you.',
    icon: (
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
]

export default function ObanaAdvantageSection({ onCtaClick }) {
  return (
    <section className={styles.section}>

      {/* ── Left: sticky headline panel ── */}
      <div className={styles.left}>
        <div className={styles.poweredBadge}>
          <img
            src="/logos/taojaLogo_white.png"
            alt="Taoja"
            className={styles.poweredLogo}
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
          <span>Powered by Obana.Africa</span>
        </div>

        <h2 className={styles.headline}>
          More than a POS.<br />
          A complete business advantage.
        </h2>

        <p className={styles.leftSub}>
          Signing up to Taoja connects you to infrastructure that most businesses
          don't get until they're much bigger.
        </p>

        <button
          className={styles.cta}
          onClick={onCtaClick}
          type="button"
        >
          Create your free account
        </button>

        {/* Stat strip */}
        <div className={styles.statStrip}>
          <div className={styles.stat}>
            <span className={styles.statValue}>100+</span>
            <span className={styles.statLabel}>Businesses on the network</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>₦0</span>
            <span className={styles.statLabel}>To get started</span>
          </div>
        </div>
      </div>

      {/* ── Right: advantage cards ── */}
      <div className={styles.right}>
        {ADVANTAGES.map((adv, i) => (
          <div key={adv.id} className={styles.card}>
            <div className={styles.cardTop}>
              <div className={styles.iconWrap}>{adv.icon}</div>
              <span className={styles.eyebrow}>{adv.eyebrow}</span>
            </div>
            <h3 className={styles.cardTitle}>{adv.title}</h3>
            <p className={styles.cardDesc}>{adv.desc}</p>
            {i === 1 && (
              <div className={styles.financingNote}>
                <span className={styles.financingDot} />
                Eligibility builds automatically from your sales history
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  )
}