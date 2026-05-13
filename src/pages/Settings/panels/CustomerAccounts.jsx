/**
 * CustomerAccounts.jsx
 * Customer accounts settings panel + Authentication sub-panel.
 * Includes the Change Domain modal.
 *
 * Wire into Settings.jsx:
 *   import PanelCustomerAccounts from './panels/CustomerAccounts'
 *   // In PANELS map:
 *   customer_accounts: <PanelCustomerAccounts />
 *
 * Also add to NAV in Settings.jsx:
 *   { id: 'customer_accounts', label: 'Customer accounts',
 *     icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' }
 */

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CustomerAccounts.module.css'

/* ── Icon primitive ──────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Reusable primitives (mirror Settings.jsx exactly) ───────────── */
function SaveBar({ dirty, onSave, onDiscard, saving }) {
  if (!dirty) return null
  return (
    <div className={styles.saveBar}>
      <span className={styles.saveBarMsg}>You have unsaved changes</span>
      <div className={styles.saveBarActions}>
        <button className={styles.discardBtn} onClick={onDiscard}>Discard</button>
        <button className={styles.saveBtn} onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}

function Section({ title, subtitle, icon, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        {icon && <Ic d={icon} size={16} stroke="#6B7280" />}
        <div>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
        </div>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button type="button" role="switch" aria-checked={value}
      className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
      onClick={() => onChange?.(!value)}>
      <span className={styles.toggleThumb} />
    </button>
  )
}

function Toast({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  return (
    <div className={`${styles.toast} ${type === 'error' ? styles.toastError : ''}`}>
      <Ic d={type === 'error' ? 'M18 6L6 18M6 6l12 12' : 'M20 6L9 17l-5-5'}
        size={13} stroke={type === 'error' ? '#EF4444' : '#2DBD97'} />
      {msg}
    </div>
  )
}

/* ── Change Domain Modal ─────────────────────────────────────────── */
function ChangeDomainModal({ currentDomain, storeDomain, onClose, onSave }) {
  const [subdomain, setSubdomain] = useState('account')
  const [saving,    setSaving]    = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSave = async () => {
    setSaving(true)
    // TODO: await api.put('/api/settings/customer-accounts/domain', { subdomain })
    await new Promise(r => setTimeout(r, 700))
    onSave(`${subdomain}.${storeDomain}`)
    setSaving(false)
  }

  const newDomain  = `${subdomain}.${storeDomain}`
  const isValid    = subdomain.trim().length >= 2 && /^[a-z0-9-]+$/.test(subdomain)

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>Change customer accounts domain</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.domainField}>
            <label className={styles.domainLabel}>Current domain</label>
            <div className={styles.domainReadonly}>{currentDomain}</div>
          </div>

          <div className={styles.domainField}>
            <label className={styles.domainLabel}>New domain</label>
            <div className={styles.domainInputRow}>
              <input
                ref={inputRef}
                className={`${styles.domainInput} ${!isValid && subdomain ? styles.domainInputError : ''}`}
                value={subdomain}
                onChange={e => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="account"
                spellCheck={false}
              />
              <span className={styles.domainSuffix}>.{storeDomain}</span>
            </div>
            {!isValid && subdomain && (
              <span className={styles.domainError}>Only lowercase letters, numbers, and hyphens</span>
            )}
          </div>

          {isValid && (
            <p className={styles.domainHint}>
              <strong>{newDomain}</strong> will become the primary domain for customer accounts,
              including the Order status page.
            </p>
          )}

          <button className={styles.learnMoreBtn}>Learn more</button>
        </div>

        <div className={styles.modalFoot}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.continueBtn} onClick={handleSave}
            disabled={!isValid || saving}>
            {saving ? 'Saving…' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Authentication Sub-panel ────────────────────────────────────── */
function PanelAuthentication({ onBack }) {
  const [shopLogin, setShopLogin] = useState(true)
  const [connections, setConnections] = useState([
    { id: 'google',   label: 'Google',   connected: false,
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
    { id: 'facebook', label: 'Facebook', connected: false,
      icon: <svg width="18" height="18" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" fill="#1877F2" stroke="none"/></svg> },
  ])
  const [toast, setToast] = useState(null)
  const [saved,  setSaved]  = useState(JSON.stringify({ shopLogin }))
  const [saving, setSaving] = useState(false)

  const dirty = JSON.stringify({ shopLogin }) !== saved

  const save = async () => {
    setSaving(true)
    // TODO: await api.put('/api/settings/customer-accounts/auth', { shopLogin })
    await new Promise(r => setTimeout(r, 700))
    setSaved(JSON.stringify({ shopLogin }))
    setSaving(false)
    setToast({ msg: 'Authentication settings saved', type: 'success' })
  }

  const toggleConnection = (id) => {
    setConnections(cs => cs.map(c => c.id === id ? { ...c, connected: !c.connected } : c))
    const conn = connections.find(c => c.id === id)
    setToast({
      msg: conn.connected ? `${conn.label} disconnected` : `${conn.label} connected`,
      type: 'success',
    })
    // TODO: await api.post('/api/integrations/oauth', { provider: id })
  }

  return (
    <div className={styles.panel}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <SaveBar dirty={dirty} onSave={save} onDiscard={() => setShopLogin(JSON.parse(saved).shopLogin)} saving={saving} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <button className={styles.breadcrumbBack} onClick={onBack}>
          <Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={14} stroke="#9CA3AF" />
          <span>Customer accounts</span>
        </button>
        <Ic d="M9 18l6-6-6-6" size={12} stroke="#9CA3AF" />
        <span className={styles.breadcrumbCurrent}>Authentication</span>
      </div>
      <p className={styles.breadcrumbSub}>Manage sign-in options and account access</p>

      {/* Sign-in options */}
      <Section title="Sign-in options">
        <div className={styles.authRow}>
          <div className={styles.authRowIcon} style={{ background: '#5A31F4' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className={styles.authRowInfo}>
            <div className={styles.authRowLabel}>Shop</div>
          </div>
          <Toggle value={shopLogin} onChange={setShopLogin} />
        </div>
      </Section>

      {/* Available connections */}
      <Section title="Available connections">
        {connections.map(conn => (
          <div key={conn.id} className={styles.authRow}>
            <div className={styles.authRowIconImg}>{conn.icon}</div>
            <div className={styles.authRowInfo}>
              <div className={styles.authRowLabel}>{conn.label}</div>
              {conn.connected && <div className={styles.authRowSub}>Connected</div>}
            </div>
            <button
              className={conn.connected ? styles.disconnectBtn : styles.connectBtn}
              onClick={() => toggleConnection(conn.id)}>
              {conn.connected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </Section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PANEL — Customer Accounts
═══════════════════════════════════════════════════════════════════ */
const STORE_DOMAIN = 'mystore.ng'
const INITIAL_DOMAIN = `https://${STORE_DOMAIN}/account`

export default function PanelCustomerAccounts() {
  const navigate = useNavigate()

  /* Sub-panel routing — 'main' | 'auth' */
  const [view, setView] = useState('main')

  /* State */
  const [showSignInLinks,  setShowSignInLinks]  = useState(true)
  const [selfServeReturns, setSelfServeReturns] = useState(false)
  const [storeCredit,      setStoreCredit]      = useState(false)
  const [accountUrl,       setAccountUrl]       = useState(INITIAL_DOMAIN)
  const [showDomainModal,  setShowDomainModal]  = useState(false)
  const [toast,            setToast]            = useState(null)
  const [saved,            setSaved]            = useState(null)
  const [saving,           setSaving]           = useState(false)

  const initialState = { showSignInLinks, selfServeReturns, storeCredit }
  const [savedState, setSavedState] = useState(JSON.stringify(initialState))
  const dirty = JSON.stringify({ showSignInLinks, selfServeReturns, storeCredit }) !== savedState

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const save = async () => {
    setSaving(true)
    try {
      // TODO: await api.put('/api/settings/customer-accounts', { showSignInLinks, selfServeReturns, storeCredit })
      await new Promise(r => setTimeout(r, 700))
      setSavedState(JSON.stringify({ showSignInLinks, selfServeReturns, storeCredit }))
      showToast('Customer account settings saved')
    } catch {
      showToast('Failed to save settings', 'error')
    } finally {
      setSaving(false)
    }
  }

  const discard = () => {
    const s = JSON.parse(savedState)
    setShowSignInLinks(s.showSignInLinks)
    setSelfServeReturns(s.selfServeReturns)
    setStoreCredit(s.storeCredit)
  }

  const handleDomainSave = (newDomain) => {
    setAccountUrl(`https://${newDomain}`)
    setShowDomainModal(false)
    showToast(`Domain updated to ${newDomain}`)
    // TODO: await api.put('/api/settings/customer-accounts/domain', { domain: newDomain })
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(accountUrl).then(() => showToast('URL copied to clipboard'))
  }

  /* Render auth sub-panel */
  if (view === 'auth') {
    return <PanelAuthentication onBack={() => setView('main')} />
  }

  return (
    <div className={styles.panel}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}

      <SaveBar dirty={dirty} onSave={save} onDiscard={discard} saving={saving} />

      {/* ══ 1. SIGN-IN LINKS ══════════════════════════════════════ */}
      <Section title="Sign-in links">
        <div className={styles.settingRow}>
          <div className={styles.settingRowIcon}>
            <Ic d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" size={15} stroke="#6B7280" />
          </div>
          <div className={styles.settingRowContent}>
            <div className={styles.settingRowLabel}>Show sign-in links</div>
            <div className={styles.settingRowSub}>
              Show sign-in links in the header of online store and at checkout
            </div>
          </div>
          <Toggle value={showSignInLinks} onChange={setShowSignInLinks} />
        </div>
      </Section>

      {/* ══ 2. CUSTOMER ACCOUNTS ══════════════════════════════════ */}
      <Section
        title="Customer accounts"
        icon="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
      >
        {/* Configurations */}
        <div className={styles.settingRow}>
          <div className={styles.settingRowIcon}>
            <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={15} stroke="#6B7280" />
          </div>
          <div className={styles.settingRowContent}>
            <div className={styles.settingRowLabel}>Configurations</div>
            <div className={styles.settingRowSub}>
              Configure apps, branding, and features for checkout and customer accounts
            </div>
          </div>
          <button className={styles.outlineBtn}
            onClick={() => navigate('/settings/checkout/customize')}>
            Customize
          </button>
        </div>

        {/* Authentication */}
        <div className={styles.settingRow} style={{ cursor: 'pointer' }}
          onClick={() => setView('auth')}>
          <div className={styles.settingRowIcon}>
            <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={15} stroke="#6B7280" />
          </div>
          <div className={styles.settingRowContent}>
            <div className={styles.settingRowLabel}>Authentication</div>
            <div className={styles.settingRowSub}>Manage sign-in methods and account access</div>
          </div>
          <button className={styles.outlineBtn} onClick={e => { e.stopPropagation(); setView('auth') }}>
            Manage
          </button>
        </div>

        {/* Self-serve returns */}
        <div className={styles.settingRow}>
          <div className={styles.settingRowIcon}>
            <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" size={15} stroke="#6B7280" />
          </div>
          <div className={styles.settingRowContent}>
            <div className={styles.settingRowLabel}>Self-serve returns</div>
            <div className={styles.settingRowSub}>
              Allow customers to request and manage returns. Customize what your customers can return
              with{' '}
              <button className={styles.inlineLink}
                onClick={() => navigate('/settings/checkout?section=return-rules')}>
                return rules
              </button>
            </div>
          </div>
          <Toggle value={selfServeReturns} onChange={setSelfServeReturns} />
        </div>

        {/* Store credit */}
        <div className={styles.settingRow}>
          <div className={styles.settingRowIcon}>
            <Ic d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z" size={15} stroke="#6B7280" />
          </div>
          <div className={styles.settingRowContent}>
            <div className={styles.settingRowLabel}>Store credit</div>
            <div className={styles.settingRowSub}>Allow customers to see and spend store credit</div>
          </div>
          <Toggle value={storeCredit} onChange={setStoreCredit} />
        </div>

        {/* URL */}
        <div className={styles.settingRowStacked}>
          <div className={styles.settingRowTop}>
            <div className={styles.settingRowIcon}>
              <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={15} stroke="#6B7280" />
            </div>
            <div className={styles.settingRowContent}>
              <div className={styles.settingRowLabel}>URL</div>
              <div className={styles.settingRowSub}>
                Use this URL anywhere you'd like customers to access customer accounts
              </div>
            </div>
            <button className={styles.outlineBtn} onClick={() => setShowDomainModal(true)}>
              Change domain
            </button>
          </div>
          <div className={styles.urlBox}>
            <span className={styles.urlText}>{accountUrl}</span>
            <button className={styles.copyBtn} onClick={copyUrl} title="Copy URL">
              <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={14} />
            </button>
          </div>
        </div>
      </Section>

      {/* ══ 3. REVERT NOTICE ══════════════════════════════════════ */}
      <div className={styles.revertNotice}>
        You can{' '}
        <button className={styles.inlineLink}
          onClick={() => navigate('/settings/customer-accounts/legacy')}>
          revert to legacy customer accounts
        </button>{' '}
        until 16 May 2026.
      </div>

      {/* ══ CHANGE DOMAIN MODAL ═══════════════════════════════════ */}
      {showDomainModal && (
        <ChangeDomainModal
          currentDomain={accountUrl}
          storeDomain={STORE_DOMAIN}
          onClose={() => setShowDomainModal(false)}
          onSave={handleDomainSave}
        />
      )}
    </div>
  )
}
