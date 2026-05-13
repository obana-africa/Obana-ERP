import { useState, useRef } from 'react'
import styles from './AdminProfile.module.css'

/* ─── SVG icon helper (matches Topbar.jsx pattern) ─────────────── */
const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const ICONS = {
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  store:    ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'],
  bell:     ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  credit:   ['M1 4h22v16H1z', 'M1 10h22'],
  globe:    'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  camera:   ['M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z', 'M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  check:    'M20 6L9 17l-5-5',
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  eyeOff:   ['M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19', 'M1 1l22 22'],
  key:      'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  phone:    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  mail:     ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
  trash:    ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7', 'M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  logout:   ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  plus:     'M12 5v14M5 12h14',
  x:        'M18 6L6 18M6 6l12 12',
  device:   ['M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z', 'M13 2v7h7'],
}

const NAV = [
  { id: 'profile',       label: 'General',           icon: 'user'   },
  { id: 'security',      label: 'Security',          icon: 'shield' },
  // { id: 'store',         label: 'Store',             icon: 'store'  },
  // { id: 'notifications', label: 'Notifications',     icon: 'bell'   },
  // { id: 'billing',       label: 'Billing',           icon: 'credit' },
  // { id: 'language',      label: 'Language & Region', icon: 'globe'  },
]

const Toggle = ({ checked, onChange }) => (
  <label className={styles.toggle}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
    <span className={styles.toggleTrack} />
    <span className={styles.toggleThumb} />
  </label>
)

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [toast, setToast]         = useState(null)
  const fileRef = useRef()

  const [profile, setProfile] = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    storeName: '',
    photoUrl:  null,
  })
  const [editProfile, setEditProfile] = useState({ ...profile })

  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })

  const [notifPrefs, setNotifPrefs] = useState({
    newOrder: true, lowStock: true, newCustomer: false,
    orderShipped: true, marketing: false, weeklyReport: true,
  })

  const [devices] = useState([
    { id: 1, name: 'Chrome on Windows',    location: 'Lagos, Nigeria', time: 'Apr 20, 3:25 pm',       current: true  },
    { id: 2, name: 'Mobile Safari on iOS', location: 'Lagos, Nigeria', time: 'Nov 4, 2024, 4:38 pm',  current: false },
    { id: 3, name: 'Mobile Safari on iOS', location: 'Lagos, Nigeria', time: 'Nov 19, 2024, 4:21 pm', current: false },
  ])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handlePhotoUpload = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setEditProfile(p => ({ ...p, photoUrl: URL.createObjectURL(file) }))
  }

  const saveProfile = () => {
    if (!editProfile.firstName.trim() || !editProfile.email.trim()) {
      showToast('Please fill in all required fields.', 'error'); return
    }
    setProfile({ ...editProfile })
    showToast('Profile updated successfully \u2713')
  }

  const savePassword = () => {
    if (!pwForm.current || !pwForm.next || !pwForm.confirm) {
      showToast('Please fill all password fields.', 'error'); return
    }
    if (pwForm.next !== pwForm.confirm) {
      showToast('New passwords do not match.', 'error'); return
    }
    if (pwForm.next.length < 8) {
      showToast('Password must be at least 8 characters.', 'error'); return
    }
    setPwForm({ current: '', next: '', confirm: '' })
    showToast('Password changed successfully \u2713')
  }

  const initials = `${editProfile.firstName?.[0] ?? ''}${editProfile.lastName?.[0] ?? ''}`.toUpperCase()
  const onEdit = field => e => setEditProfile(p => ({ ...p, [field]: e.target.value }))

  return (
    <div className={styles.page}>

      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Account Settings</div>
        {NAV.map(n => (
          <button
            key={n.id}
            className={`${styles.navItem} ${activeTab === n.id ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab(n.id)}
          >
            <Ic d={ICONS[n.icon]} size={16} stroke={activeTab === n.id ? 'var(--navy)' : 'var(--ink4)'} />
            {n.label}
          </button>
        ))}
        <div className={styles.sidebarDivider} />
        <button
          className={`${styles.navItem} ${styles.navItemLogout}`}
          onClick={() => showToast('You have been logged out.', 'error')}
        >
          <Ic d={ICONS.logout} size={16} stroke="var(--red)" />
          Log out
        </button>
      </aside>

      {/* MAIN */}
      <main className={styles.main}>

        {/* GENERAL */}
        {activeTab === 'profile' && (
          <>
            <h1 className={styles.pageTitle}>General</h1>
            <p className={styles.pageSub}>Manage your personal details and preferences.</p>

            <div className={styles.card}>
              <div className={styles.avatarSection}>
                <div className={styles.avatarRing} onClick={() => fileRef.current?.click()} title="Change photo">
                  {editProfile.photoUrl
                    ? <img src={editProfile.photoUrl} alt="avatar" />
                    : <span className={styles.avatarInitials}>{initials}</span>}
                  <div className={styles.avatarOverlay}><Ic d={ICONS.camera} size={20} stroke="#fff" /></div>
                </div>
                <div className={styles.avatarMeta}>
                  <div className={styles.avatarName}>{profile.firstName} {profile.lastName}</div>
                  <div className={styles.avatarRole}>Store Admin</div>
                  <div className={styles.avatarActions}>
                    <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => fileRef.current?.click()}>Upload photo</button>
                    {editProfile.photoUrl && (
                      <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setEditProfile(p => ({ ...p, photoUrl: null }))}>Remove</button>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First name *</label>
                    <input className={styles.formInput} value={editProfile.firstName} onChange={onEdit('firstName')} placeholder="First name" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last name *</label>
                    <input className={styles.formInput} value={editProfile.lastName} onChange={onEdit('lastName')} placeholder="Last name" />
                  </div>
                </div>
                <div className={`${styles.formGroup} ${styles.mt16}`}>
                  <label className={styles.formLabel}>
                    Email
                    <span className={styles.verifiedBadge}>
                      <Ic d={ICONS.check} size={11} stroke="var(--green)" sw={2.5} /> Verified
                    </span>
                  </label>
                  <input className={styles.formInput} value={editProfile.email} onChange={onEdit('email')} type="email" placeholder="Email address" />
                  <span className={styles.formHint}>Use your email as it appears on your government-issued ID.</span>
                </div>
                <div className={`${styles.formGroup} ${styles.mt16}`}>
                  <label className={styles.formLabel}>Phone number <span style={{ color: 'var(--ink4)', fontWeight: 400, fontSize: 12 }}>(optional)</span></label>
                  <input className={styles.formInput} value={editProfile.phone} onChange={onEdit('phone')} type="tel" placeholder="+234..." />
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setEditProfile({ ...profile })}>Discard</button>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={saveProfile}>Save changes</button>
              </div>
            </div>

            {/* Login services */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Login service</div>
                <div className={styles.cardDesc}>Connect an external login service to quickly and securely access your Taja account.</div>
              </div>
              <div className={styles.cardBodyFlush}>
                {[
                  { id: 'apple', emoji: '🍎', name: 'Apple', status: 'Not connected' },
                  { id: 'google', emoji: '🅖', name: 'Google', status: 'Not connected' },
                  { id: 'facebook', emoji: '📘', name: 'Facebook', status: 'Not connected' },
                ].map(p => (
                  <div className={styles.loginRow} key={p.id}>
                    <div className={styles.loginLeft}>
                      <div className={styles.loginLogo}>{p.emoji}</div>
                      <div>
                        <div className={styles.loginProvider}>{p.name}</div>
                        <div className={styles.loginStatus}>{p.status}</div>
                      </div>
                    </div>
                    <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>Connect</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Stores */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <div className={styles.cardTitle}>Stores</div>
                    <div className={styles.cardDesc}>View and access stores connected to your account.</div>
                  </div>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
                    <Ic d={ICONS.plus} size={13} /> Add store
                  </button>
                </div>
              </div>
              <div className={styles.cardBodyFlush}>
                <div className={styles.loginRow}>
                  <div className={styles.loginLeft}>
                    <div className={styles.loginLogo}><Ic d={ICONS.store} size={17} stroke="var(--navy)" /></div>
                    <div>
                      <div className={styles.loginProvider}>{profile.storeName}</div>
                      <div className={styles.loginStatus}>Owner · Lagos, Nigeria</div>
                    </div>
                  </div>
                  <span className={styles.activeBadge}>Active</span>
                </div>
              </div>
            </div>

            {/* Language */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Preferred language</div>
                <div className={styles.cardDesc}>This is the language you will see when logged in. It does not affect your customers' experience.</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Language</label>
                  <select className={styles.formInput}>
                    <option>English</option><option>Hausa</option><option>Yoruba</option><option>Igbo</option><option>French</option>
                  </select>
                </div>
                <div className={styles.regionalInfo}>
                  <strong>Regional format</strong><br />
                  Your number, time, date, and currency formats are set for <strong>English (Nigeria)</strong>.{' '}
                  <span className={styles.regionalLink}>Change regional format</span>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast('Language preference saved \u2713')}>Save</button>
              </div>
            </div>

            {/* Danger zone */}
            <div className={styles.dangerZone}>
              <div>
                <div className={styles.dangerTitle}>Delete account</div>
                <div className={styles.dangerSub}>Permanently remove your account and all associated data. This cannot be undone.</div>
              </div>
              <button className={`${styles.btn} ${styles.btnDangerGhost}`} onClick={() => showToast('Please contact support to delete your account.', 'error')}>
                <Ic d={ICONS.trash} size={14} stroke="var(--red)" /> Delete account
              </button>
            </div>
          </>
        )}

        {/* SECURITY */}
        {activeTab === 'security' && (
          <>
            <h1 className={styles.pageTitle}>Security</h1>
            <p className={styles.pageSub}>Manage your password, two-factor authentication, and active sessions.</p>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Change password</div>
                <div className={styles.cardDesc}>You last changed your password 7 months ago. We recommend changing it regularly.</div>
              </div>
              <div className={styles.cardBody}>
                {[
                  { key: 'current', label: 'Current password' },
                  { key: 'next',    label: 'New password' },
                  { key: 'confirm', label: 'Confirm new password' },
                ].map(f => (
                  <div className={`${styles.formGroup} ${styles.mb14}`} key={f.key}>
                    <label className={styles.formLabel}>{f.label}</label>
                    <div className={styles.formInputWrap}>
                      <input
                        type={showPw[f.key] ? 'text' : 'password'}
                        className={styles.formInput}
                        value={pwForm[f.key]}
                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder="••••••••"
                      />
                      <button className={styles.eyeBtn} type="button" onClick={() => setShowPw(p => ({ ...p, [f.key]: !p[f.key] }))}>
                        <Ic d={showPw[f.key] ? ICONS.eyeOff : ICONS.eye} size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <span className={styles.formHint}>Must be at least 8 characters and include a number and special character.</span>
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.btn} ${styles.btnGhost}`} onClick={() => setPwForm({ current: '', next: '', confirm: '' })}>Cancel</button>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={savePassword}>Change password</button>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <div className={styles.cardTitle}>Passkeys <span className={styles.recommendedBadge}>Recommended</span></div>
                    <div className={styles.cardDesc}>Log in with your fingerprint, face, or screen lock - no password needed.</div>
                  </div>
                  <button className={`${styles.btn} ${styles.btnGreen}`} onClick={() => showToast('Passkey setup coming soon!')}>
                    <Ic d={ICONS.key} size={14} stroke="#fff" /> Create passkey
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Two-step authentication</div>
                <div className={styles.cardDesc}>Verify your identity with a second factor after entering your password.</div>
              </div>
              <div className={styles.cardBodyFlush}>
                <div className={styles.securityItem}>
                  <div className={styles.securityItemLeft}>
                    <div className={styles.securityIcon} style={{ background: '#EFF6FF' }}>
                      <Ic d={ICONS.phone} size={18} stroke="var(--navy)" />
                    </div>
                    <div>
                      <div className={styles.securityTitle}>Authenticator app</div>
                      <div className={styles.securitySub}>Primary method · Active</div>
                    </div>
                  </div>
                  <button className={`${styles.btn} ${styles.btnDangerGhost} ${styles.btnSm}`} onClick={() => showToast('Removed authenticator app.', 'error')}>Remove</button>
                </div>
                <div className={styles.securityItem}>
                  <div className={styles.securityItemLeft}>
                    <div className={styles.securityIcon} style={{ background: 'var(--surface)' }}>
                      <Ic d={ICONS.mail} size={18} stroke="var(--ink3)" />
                    </div>
                    <div>
                      <div className={styles.securityTitle}>Backup email</div>
                      <div className={styles.securitySub}>Not configured</div>
                    </div>
                  </div>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`} onClick={() => showToast('Backup email setup coming soon!')}>
                    <Ic d={ICONS.plus} size={13} /> Add
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderRow}>
                  <div>
                    <div className={styles.cardTitle}>Active sessions</div>
                    <div className={styles.cardDesc}>You are currently logged in on these devices. Log out of any you do not recognise.</div>
                  </div>
                  <button className={`${styles.btn} ${styles.btnDangerGhost} ${styles.btnSm}`} onClick={() => showToast('Logged out of all other devices.')}>Log out all</button>
                </div>
              </div>
              <div className={styles.cardBodyFlush}>
                {devices.map(d => (
                  <div className={styles.deviceItem} key={d.id}>
                    <div className={styles.deviceLeft}>
                      <div className={styles.deviceIcon}><Ic d={ICONS.device} size={17} /></div>
                      <div>
                        <div className={styles.deviceName}>
                          {d.name}
                          {d.current && <span className={styles.deviceBadge}>This device</span>}
                        </div>
                        <div className={styles.deviceMeta}>{d.time} · {d.location}</div>
                      </div>
                    </div>
                    {!d.current && (
                      <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`} onClick={() => showToast(`Logged out of ${d.name}.`)}>Log out</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <>
            <h1 className={styles.pageTitle}>Notifications</h1>
            <p className={styles.pageSub}>Choose what activity triggers a notification and how you receive them.</p>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Email notifications</div>
                <div className={styles.cardDesc}>Alerts sent to {profile.email}</div>
              </div>
              <div className={styles.cardBodyFlush}>
                {[
                  { key: 'newOrder',     label: 'New order received',       sub: 'Every time a customer places an order' },
                  { key: 'lowStock',     label: 'Low stock alert',           sub: 'When a product has fewer than 5 units left' },
                  { key: 'newCustomer',  label: 'New customer registered',   sub: 'When someone signs up via the store or WhatsApp' },
                  { key: 'orderShipped', label: 'Order status updates',      sub: 'Shipped, delivered, and returned' },
                  { key: 'marketing',    label: 'Marketing & promotions',    sub: 'Tips, product updates, and offers from Taja' },
                  { key: 'weeklyReport', label: 'Weekly performance report', sub: "Summary of your store's activity every Monday" },
                ].map(n => (
                  <div className={styles.toggleRow} key={n.key}>
                    <div>
                      <div className={styles.toggleLabel}>{n.label}</div>
                      <div className={styles.toggleSub}>{n.sub}</div>
                    </div>
                    <Toggle checked={notifPrefs[n.key]} onChange={v => setNotifPrefs(p => ({ ...p, [n.key]: v }))} />
                  </div>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast('Notification preferences saved \u2713')}>Save preferences</button>
              </div>
            </div>
          </>
        )}

        {/* STORE */}
        {activeTab === 'store' && (
          <>
            <h1 className={styles.pageTitle}>Store</h1>
            <p className={styles.pageSub}>Manage your store name, currency, and contact details.</p>
            <div className={styles.card}>
              <div className={styles.cardHeader}><div className={styles.cardTitle}>Store details</div></div>
              <div className={styles.cardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Store name *</label>
                    <input className={styles.formInput} defaultValue={profile.storeName} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Industry</label>
                    <select className={styles.formInput}>
                      <option>Fashion & Apparel</option><option>Electronics</option><option>Food & Beverage</option><option>Beauty & Cosmetics</option><option>Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Currency</label>
                    <select className={styles.formInput}>
                      <option>NGN (N) - Nigerian Naira</option><option>USD ($) - US Dollar</option><option>GHS - Ghanaian Cedi</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Timezone</label>
                    <select className={styles.formInput}>
                      <option>Africa/Lagos (GMT+1)</option><option>Africa/Accra (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast('Store details saved \u2713')}>Save</button>
              </div>
            </div>
          </>
        )}

        {/* BILLING */}
        {/* {activeTab === 'billing' && (
          <>
            <h1 className={styles.pageTitle}>Billing</h1>
            <p className={styles.pageSub}>Manage your subscription plan and payment details.</p>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>Current plan <span className={styles.planBadge}>PRO</span></div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.planRow}>
                  <div>
                    <div className={styles.planName}>Taja Pro</div>
                    <div className={styles.planMeta}>N15,000 / month · Renews June 1, 2026</div>
                  </div>
                  <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => showToast('Upgrade flow coming soon!')}>Upgrade plan</button>
                </div>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderRow}>
                  <div className={styles.cardTitle}>Payment method</div>
                  <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`} onClick={() => showToast('Payment update coming soon!')}>
                    <Ic d={ICONS.edit} size={13} /> Edit
                  </button>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.paymentMethod}>
                  <div className={styles.paymentIcon}>💳</div>
                  <div>
                    <div className={styles.paymentCardName}>Mastercard ending ••••4532</div>
                    <div className={styles.paymentCardMeta}>Expires 09/2027</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )} */}

        {/* LANGUAGE */}
        {activeTab === 'language' && (
          <>
            <h1 className={styles.pageTitle}>Language & Region</h1>
            <p className={styles.pageSub}>Set your display language and regional format preferences.</p>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Display language</label>
                    <select className={styles.formInput}><option>English</option><option>Hausa</option><option>Yoruba</option></select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Regional format</label>
                    <select className={styles.formInput}><option>English (Nigeria)</option><option>English (US)</option><option>English (UK)</option></select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Date format</label>
                    <select className={styles.formInput}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Time format</label>
                    <select className={styles.formInput}><option>12-hour (AM/PM)</option><option>24-hour</option></select>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => showToast('Language settings saved \u2713')}>Save</button>
              </div>
            </div>
          </>
        )}

      </main>

      {/* TOAST */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <Ic d={toast.type === 'error' ? ICONS.x : ICONS.check} size={14} stroke="#fff" sw={2.5} />
          {toast.msg}
        </div>
      )}

    </div>
  )
}

export default AdminProfile
