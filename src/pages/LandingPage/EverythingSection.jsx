

import styles from './EverythingSection.module.css'

export default function EverythingSection() {
  return (
    <section className={styles.section}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          Everything You Need To Sell, All In One Place
        </h2>
        <p className={styles.sub}>
          Launch Your Online Store And Manage In-Person Sales With A Smart POS
          Built For Modern Businesses.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
           ROW 1: Create Your Online Store
           Text LEFT · Screenshot RIGHT
           ══════════════════════════════════════════════ */}
      <div className={styles.row}>

        {/* Text */}
        <div className={styles.textCol}>
          <span className={styles.tag}>
            <span className={styles.tagDot} />
            Online Store
          </span>
          <h3 className={styles.rowTitle}>Create Your Online Store</h3>
          <p className={styles.rowDesc}>
            Build a beautiful, fully functional store in minutes no coding needed.
            Customize your brand, add products, and start selling instantly.
          </p>
          <button className={styles.primaryBtn}>Get started for free</button>
        </div>

        {/* Screenshot + badges */}
        <div className={styles.visualCol}>
          <div className={styles.screenshotWrap}>
            <img
              src="/images/online-store-screenshot.png"
              alt="Online store products dashboard"
              className={styles.screenshot}
            />
            <div className={`${styles.badge} ${styles.badgeInstant}`}>
              <span className={styles.badgeIcon}>⚙️</span>
              Instant setup
            </div>
            <div className={`${styles.badge} ${styles.badgeSell}`}>
              <span className={styles.badgeIconYellow}>🟡</span>
              Sell immediately
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
           ROW 2: Sell Beyond Your Store
           TWO PHONES LEFT · Text RIGHT
           ══════════════════════════════════════════════ */}
      <div className={styles.row}>

        {/* ── Two overlapping phones ── */}
        <div className={styles.phonesCol}>

          {/* Badge: Easy management — pushed far left */}
          <div className={`${styles.badge} ${styles.badgeEasy}`}>
            <span className={styles.badgeIcon}>🔧</span>
            Easy management
          </div>

          {/* Back phone — top half visible, bottom tucked under front */}
          <div className={styles.phoneBack}>
            <img
              src="/images/pos-phone.png"
              alt=""
              aria-hidden="true"
              className={styles.phoneImgBack}
            />
          </div>

          {/* Front phone — top masked, bottom (payment methods) showing */}
          <div className={styles.phoneFront}>
            <img
              src="/images/pos-phone.png"
              alt="POS checkout on mobile"
              className={styles.phoneImgFront}
            />
            {/* Payment methods floating card on front phone */}
            <div className={styles.paymentCard}>
              <div className={styles.paymentHeader}>
                <span className={styles.paymentAmt}>$45,245.00</span>
              </div>
              {[
                { icon: '🟢', label: 'Cash',               sub: 'Customer pays with cash',       active: true  },
                { icon: '💳', label: 'Card',               sub: 'Credit or debit card',           active: false },
                { icon: '📱', label: 'Mobile Payment',     sub: 'Wallets and mobile money',      active: false },
                { icon: '🖊',  label: 'Manual Card Entry',  sub: 'Card details entered manually',  active: false },
              ].map(m => (
                <div key={m.label} className={`${styles.payMethod} ${m.active ? styles.payMethodOn : ''}`}>
                  <span className={styles.payIcon}>{m.icon}</span>
                  <div className={styles.payText}>
                    <p className={styles.payLabel}>{m.label}</p>
                    <p className={styles.paySub}>{m.sub}</p>
                  </div>
                  <div className={`${styles.radio} ${m.active ? styles.radioOn : ''}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Badge: Seamless payments — pushed far left below */}
          <div className={`${styles.badge} ${styles.badgeSeamless}`}>
            <span className={styles.badgeIcon}>💳</span>
            Seamless payments
          </div>
        </div>

        {/* Text */}
        <div className={styles.textCol}>
          <span className={styles.tag}>
            <span className={styles.tagDot} style={{ background: '#E8C547' }} />
            Point of Sale (POS)
          </span>
          <h3 className={styles.rowTitle}>Sell Beyond Your Store</h3>
          <p className={styles.rowDesc}>
            Whether in-store or on the go, accept payments and manage
            transactions with a powerful, easy-to-use POS.
          </p>
          <button className={styles.darkBtn}>Install now</button>
        </div>
      </div>

    </section>
  )
}