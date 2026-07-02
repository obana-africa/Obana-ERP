import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>

      {/* ── TOP: logo + nav links ── */}
      <div className={styles.footerTop}>

        {/* Brand col — logo + socials */}
        <div className={styles.footerBrandCol}>
          <img
            src="/logos/taoja-logo-white.png"
            alt="ta'oja"
            className={styles.footerLogo}
          />
          <div className={styles.footerSocials}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="Facebook">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="Instagram">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <rect x={2} y={2} width={20} height={20} rx={5}/>
                <circle cx={12} cy={12} r={4}/>
                <circle cx={17.5} cy={6.5} r={0.5} fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="X">
              <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.footerSocial} aria-label="LinkedIn">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x={2} y={9} width={4} height={12}/>
                <circle cx={4} cy={4} r={2}/>
              </svg>
            </a>
          </div>
        </div>
        

        {/* Nav link columns */}
        <div className={styles.footerCols}>
          <div className={styles.footerCol}>
            <p className={styles.footerColTitle}>About ta'oja</p>
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
            <a href="#" className={styles.footerLink}>Order Now & Pay Small Small (ONPSS)</a>
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

      <hr className={styles.footerDivider} />

      {/* ── BOTTOM: copyright + newsletter ── */}
      <div className={styles.footerBottom}>
        <div className={styles.footerBottomLeft}>
          <p className={styles.footerCopy}>
            © 2025 Obana.Africa (An ICON Tech &amp; Ecom Services Ltd Trademark).<br />
            All Rights Reserved.
          </p>
          <div className={styles.footerLegalLinks}>
            <a href="#" className={styles.footerBottomLink}>Terms &amp; Conditions</a>
            <span className={styles.footerLegalSep}>·</span>
            <a href="#" className={styles.footerBottomLink}>Privacy Policy</a>
          </div>
        </div>

        <div className={styles.footerNewsletter}>
          <p className={styles.footerNewsletterTitle}>Stay Connected</p>
          <p className={styles.footerNewsletterSub}>
            Subscribe for updates on sourcing opportunities, vendor programmes,
            and African market trends.
          </p>
          <form className={styles.footerNewsletterForm} onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              className={styles.footerNewsletterInput}
              placeholder="Enter your email..."
              aria-label="Newsletter email"
            />
            <button type="submit" className={styles.footerNewsletterBtn} aria-label="Subscribe">
              <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

    </footer>
  )
}