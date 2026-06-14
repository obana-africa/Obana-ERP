import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'

const NAV_FEATURES = [
  { icon: '🛒', title: 'Online Store',       desc: 'Launch a branded storefront in minutes'   },
  { icon: '⚡', title: 'Point of Sale',       desc: 'Fast, reliable in-person checkout'        },
  { icon: '📦', title: 'Inventory Tracking', desc: 'Real-time stock across all locations'     },
  { icon: '📊', title: 'Sales Analytics',    desc: 'Revenue trends and smart insights'        },
  { icon: '💳', title: 'Multiple Payments',  desc: 'Cash, card, mobile money & more'          },
  { icon: '🔗', title: 'ERP Integration',    desc: 'CRM, accounting and POS unified'          },
]

const NAV_WHY_US = [
  { icon: '⚡', title: 'Built for Speed',     desc: '99.9% uptime, sub-second load times'          },
  { icon: '🌍', title: 'Africa-First Design', desc: 'Supports ₦, mobile money, local logistics'    },
  { icon: '🔒', title: 'Enterprise Security', desc: 'Bank-grade encryption on all transactions'    },
  { icon: '🖥️', title: 'Omnichannel Ready',   desc: 'Online, in-store, and mobile — one dashboard' },
]

const NAV_STATS = [
  { value: '10,000+', label: 'Businesses powered'   },
  { value: '₦2K+',   label: 'Transactions processed' },
  { value: '99.9%',  label: 'Platform uptime'        },
  { value: '4.9★',   label: 'Average rating'         },
]

const NAV_REVIEWS = [
  { name: 'Amaka O.',  role: 'Fashion Retailer, Lagos',    stars: 5, text: 'Taoja transformed how I manage my store. Orders, inventory, payments — all in one place.'                  },
  { name: 'Emeka D.',  role: 'Electronics Vendor, Abuja',  stars: 5, text: 'The POS is incredibly fast. My checkout time dropped by 60% in the first week.'                            },
  { name: 'Fatima B.', role: 'Food Business, Kano',        stars: 5, text: 'Finally an ERP that understands Nigerian business. The mobile money integration alone is worth it.'         },
]

export default function Navbar({ scrolled, onWaitlistClick }) {
  const navigate = useNavigate()

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.navScrolled : ''}`}>
      <div className={styles.navInner}>

        {/* ── Brand + nav links ── */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <img src="/logos/taoja_logo.png" alt="ta'oja" className={styles.brandLogoImg} />
          </div>

          <div className={styles.navLinks}>

            {/* Features dropdown */}
            <div className={styles.navItem}>
              <button className={styles.navLink} type="button">
                Features <span className={styles.navChevron}>▾</span>
              </button>
              <div className={styles.dropdown}>
                <div className={styles.dropdownInner}>
                  <div className={styles.dropdownGrid}>
                    {NAV_FEATURES.map(f => (
                      <div key={f.title} className={styles.dropdownItem}>
                        <span className={styles.dropdownIcon}>{f.icon}</span>
                        <div>
                          <p className={styles.dropdownItemTitle}>{f.title}</p>
                          <p className={styles.dropdownItemDesc}>{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.dropdownFooter}>
                    <span className={styles.dropdownFooterText}>
                      All features built for modern African businesses
                    </span>
                    <button
                      type="button"
                      className={styles.dropdownFooterBtn}
                      onClick={onWaitlistClick}
                    >
                      Get early access →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Us dropdown */}
            <div className={styles.navItem}>
              <button className={styles.navLink} type="button">
                Why Us <span className={styles.navChevron}>▾</span>
              </button>
              <div className={styles.dropdown}>
                <div className={styles.dropdownInner}>
                  <div className={styles.dropdownWhyUs}>
                    <div className={styles.dropdownWhyCol}>
                      <p className={styles.dropdownColLabel}>Platform Strengths</p>
                      {NAV_WHY_US.map(w => (
                        <div key={w.title} className={styles.dropdownItem}>
                          <span className={styles.dropdownIcon}>{w.icon}</span>
                          <div>
                            <p className={styles.dropdownItemTitle}>{w.title}</p>
                            <p className={styles.dropdownItemDesc}>{w.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className={styles.dropdownWhyStats}>
                      <p className={styles.dropdownColLabel}>By The Numbers</p>
                      {NAV_STATS.map(s => (
                        <div key={s.label} className={styles.dropdownStat}>
                          <span className={styles.dropdownStatValue}>{s.value}</span>
                          <span className={styles.dropdownStatLabel}>{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews dropdown */}
            <div className={styles.navItem}>
              <button className={styles.navLink} type="button">
                Reviews <span className={styles.navChevron}>▾</span>
              </button>
              <div className={styles.dropdown}>
                <div className={styles.dropdownInner}>
                  <p className={styles.dropdownColLabel} style={{ marginBottom: '16px' }}>
                    What businesses say
                  </p>
                  <div className={styles.dropdownReviews}>
                    {NAV_REVIEWS.map(r => (
                      <div key={r.name} className={styles.dropdownReview}>
                        <div className={styles.dropdownReviewStars}>{'★'.repeat(r.stars)}</div>
                        <p className={styles.dropdownReviewText}>"{r.text}"</p>
                        <div className={styles.dropdownReviewAuthor}>
                          <div className={styles.dropdownReviewAvatar}>{r.name[0]}</div>
                          <div>
                            <p className={styles.dropdownReviewName}>{r.name}</p>
                            <p className={styles.dropdownReviewRole}>{r.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className={styles.dropdownFooter}>
                    <span className={styles.dropdownFooterText}>
                      Trusted by 10,000+ businesses across Nigeria
                    </span>
                    <button
                      type="button"
                      className={styles.dropdownFooterBtn}
                      onClick={onWaitlistClick}
                    >
                      Join them →
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── CTA buttons ── */}
        <div className={styles.navActions}>
          <button
            type="button"
            className={styles.btnOutline}
            onClick={onWaitlistClick}
          >
            Learn more
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => navigate('/register')}
          >
            Get started for free
          </button>
        </div>

      </div>
    </nav>
  )
}