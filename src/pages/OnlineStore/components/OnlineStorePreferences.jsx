/**
 * OnlineStorePreferences.jsx
 * Preferences page — sub-item of Online Store.
 * Route: /online-store/preferences
 *
 * Sections:
 *  1. Store access (password protection, B2B)
 *  2. Social sharing image and SEO
 *  3. Automatic redirection
 *  4. Spam protection
 *  5. Crawler access
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './OnlineStorePreferences.module.css'

/* ── Icon ─────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Toggle component ─────────────────────────────────────────── */
function Toggle({ value, onChange, disabled = false }) {
  return (
    <button
      className={`${s.toggle} ${value ? s.toggleOn : ''} ${disabled ? s.toggleDisabled : ''}`}
      onClick={() => !disabled && onChange(!value)}
      role="switch"
      aria-checked={value}
      disabled={disabled}
    >
      <span className={s.toggleThumb} />
    </button>
  )
}

/* ── Section card ─────────────────────────────────────────────── */
function SectionCard({ title, description, helpIcon = false, children, action }) {
  return (
    <div className={s.sectionCard}>
      <div className={s.sectionCardHeader}>
        <div className={s.sectionCardMeta}>
          <div className={s.sectionCardTitleRow}>
            <h2 className={s.sectionCardTitle}>{title}</h2>
            {helpIcon && (
              <button className={s.helpBtn} title="Learn more">
                <Ic d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM11 11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  size={15} stroke="none" fill="#9CA3AF" />
              </button>
            )}
          </div>
          {description && <p className={s.sectionCardDesc}>{description}</p>}
        </div>
        {action && <div className={s.sectionCardAction}>{action}</div>}
      </div>
      {children && <div className={s.sectionCardBody}>{children}</div>}
    </div>
  )
}

/* ── Setting row ──────────────────────────────────────────────── */
function SettingRow({ icon, label, description, value, onChange, disabled, extra, helpText }) {
  return (
    <div className={`${s.settingRow} ${disabled ? s.settingRowDisabled : ''}`}>
      <div className={s.settingRowLeft}>
        {icon && <span className={s.settingRowIcon}>{icon}</span>}
        <div className={s.settingRowText}>
          <div className={s.settingRowLabelRow}>
            <span className={s.settingRowLabel}>{label}</span>
            {helpText && (
              <button className={s.helpBtn} title={helpText}>
                <Ic d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM11 11v6h2v-6h-2zm0-4v2h2V7h-2z"
                  size={14} stroke="none" fill="#9CA3AF" />
              </button>
            )}
          </div>
          {description && <p className={s.settingRowDesc}>{description}</p>}
          {extra}
        </div>
      </div>
      <div className={s.settingRowRight}>
        <Toggle value={value} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  )
}

/* ── Signature modal ──────────────────────────────────────────── */
function SignatureModal({ onClose, onCreated }) {
  const [name,    setName]    = useState('')
  const [expiry,  setExpiry]  = useState('30')
  const [saving,  setSaving]  = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const sig = {
      id:        `sig-${Date.now()}`,
      name:      name.trim(),
      signature: btoa(`${name}-${Date.now()}`).slice(0, 32),
      createdAt: new Date(),
      expiresAt: expiry === 'never' ? null : new Date(Date.now() + Number(expiry) * 86400000),
      status:    'active',
    }
    onCreated(sig)
    setSaving(false)
    onClose()
  }

  return (
    <div className={s.modalBackdrop} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>
        <div className={s.modalHeader}>
          <h3 className={s.modalTitle}>Create signature</h3>
          <button className={s.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>
        <p className={s.modalDesc}>
          Signatures allow trusted crawlers to access your store. Copy the generated values into your HTTP crawler requests.
        </p>
        <div className={s.modalField}>
          <label className={s.modalFieldLabel}>Signature name</label>
          <input className={s.modalInput} value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Google Search Console"
            autoFocus />
        </div>
        <div className={s.modalField}>
          <label className={s.modalFieldLabel}>Expiry</label>
          <select className={s.modalSelect} value={expiry} onChange={e => setExpiry(e.target.value)}>
            <option value="7">7 days</option>
            <option value="30">30 days</option>
            <option value="90">90 days</option>
            <option value="365">1 year</option>
            <option value="never">Never</option>
          </select>
        </div>
        <div className={s.modalActions}>
          <button className={s.modalCancel} onClick={onClose}>Cancel</button>
          <button className={s.modalConfirm} onClick={handleCreate} disabled={!name.trim() || saving}>
            {saving ? <><span className={s.spinner} /> Creating…</> : 'Create signature'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   INITIAL STATE
   ══════════════════════════════════════════════════════════════ */
const INITIAL = {
  passwordProtection: false,
  b2bOnly:            false,
  homePageTitle:      '',
  metaDesc:           'Shop 100% original Nike, Adidas, Boohooman, Celio, Fred Perry, Guess, Pull & Bear, Ralph Lauren, Jack & Jones, Lacoste, Tommy Hilfiger & more in Nigeria. In-store at Opebi Ikeja & Lekki Lagos. Fast delivery nationwide. Pay in Naira',
  socialImageUrl:     '',
  countryRedirect:    true,
  languageRedirect:   false,
  spamForms:          false,
  spamLogin:          false,
}

const INITIAL_SIGNATURES = []

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function OnlineStorePreferences() {
  const navigate    = useNavigate()
  const fileRef     = useRef(null)

  const [prefs,         setPrefs]         = useState(INITIAL)
  const [savedPrefs,    setSavedPrefs]    = useState(JSON.stringify(INITIAL))
  const [signatures,    setSignatures]    = useState(INITIAL_SIGNATURES)
  const [sigTab,        setSigTab]        = useState('all')
  const [sigModal,      setSigModal]      = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [toast,         setToast]         = useState(null)
  const [socialPreview, setSocialPreview] = useState(null)
  const [imageUploading, setImageUploading] = useState(false)

  const isDirty = JSON.stringify(prefs) !== savedPrefs

  const set = (key, val) => setPrefs(p => ({ ...p, [key]: val }))

  /* ── Save ── */
  const save = useCallback(async () => {
    setSaving(true)
    try {
      // TODO: await api.patch('/online-store/preferences', prefs)
      await new Promise(r => setTimeout(r, 700))
      setSavedPrefs(JSON.stringify(prefs))
      showToast('Preferences saved')
    } catch {
      showToast('Failed to save. Please try again.', 'error')
    } finally { setSaving(false) }
  }, [prefs])

  /* ── Keyboard shortcut ── */
  useEffect(() => {
    const fn = e => { if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save() } }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [save])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── Social image upload ── */
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setSocialPreview(ev.target.result)
      set('socialImageUrl', ev.target.result)
      setImageUploading(false)
    }
    reader.readAsDataURL(file)
  }

  /* ── Filtered signatures ── */
  const filteredSigs = signatures.filter(sig => {
    if (sigTab === 'all')     return true
    if (sigTab === 'active')  return sig.status === 'active'
    if (sigTab === 'expired') return sig.status === 'expired'
    return true
  })

  const titleLen = prefs.homePageTitle.length
  const descLen  = prefs.metaDesc.length

  return (
    <div className={s.page}>

      {/* Toast */}
      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toastError : s.toastSuccess}`}>
          <Ic d={toast.type === 'error'
            ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
            : 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'}
            size={15} stroke={toast.type === 'error' ? '#ef4444' : '#22c55e'} />
          {toast.msg}
        </div>
      )}

      {/* Signature modal */}
      {sigModal && (
        <SignatureModal
          onClose={() => setSigModal(false)}
          onCreated={sig => { setSignatures(prev => [...prev, sig]); showToast('Signature created') }}
        />
      )}

      {/* ── Page header ── */}
      <div className={s.pageHeader}>
        <div className={s.breadcrumb}>
          <button className={s.breadcrumbBack} onClick={() => navigate('/online-store')}>
            <Ic d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
              size={16} stroke="var(--color-primary)" />
          </button>
          <Ic d="M9 18l6-6-6-6" size={14} stroke="#9CA3AF" />
          <h1 className={s.pageTitle}>Preferences</h1>
        </div>
        <div className={s.pageHeaderRight}>
          {isDirty && !saving && <span className={s.dirtyBadge}>● Unsaved changes</span>}
          <button className={s.saveBtn} onClick={save} disabled={saving || !isDirty}>
            {saving ? <><span className={s.spinner} /> Saving…</> : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className={s.content}>

        {/* ─── 1. Store access ──────────────────────────────── */}
        <SectionCard title="Store access">
          <SettingRow
            icon={<Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={16} stroke="#6B7280" />}
            label="Password protection"
            helpText="When enabled, visitors must enter a password to access your store."
            description="Restrict access to visitors with the password"
            value={prefs.passwordProtection}
            onChange={v => set('passwordProtection', v)}
          />
          {prefs.passwordProtection && (
            <div className={s.passwordFieldWrap}>
              <label className={s.fieldLabel}>Store password</label>
              <div className={s.passwordInputRow}>
                <input className={s.fieldInput} type="password" placeholder="Enter store password" />
                <button className={s.fieldBtn}>Update password</button>
              </div>
            </div>
          )}
          <SettingRow
            icon={<Ic d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" size={16} stroke="#6B7280" />}
            label="Restrict access to B2B customers only"
            helpText="B2B customers will need to log in and verify their account to access your store."
            description={
              <span>
                B2B customers will need to log in and verify their account to access your store.{' '}
                <a className={s.inlineLink} href="#manage" onClick={e => e.preventDefault()}>Manage companies</a>
              </span>
            }
            value={prefs.b2bOnly}
            onChange={v => set('b2bOnly', v)}
          />
        </SectionCard>

        {/* ─── 2. Social sharing image and SEO ─────────────── */}
        <SectionCard title="Social sharing image and SEO" helpIcon>
          <div className={s.seoLayout}>
            {/* Social image */}
            <div className={s.seoLeft}>
              <div
                className={s.socialImageCard}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                {socialPreview || prefs.socialImageUrl ? (
                  <img src={socialPreview || prefs.socialImageUrl} alt="Social preview" className={s.socialImageImg} />
                ) : (
                  <div className={s.socialImagePlaceholder}>
                    <Ic d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 15"
                      size={28} stroke="#D1D5DB" />
                    <span className={s.socialImageHint}>
                      {imageUploading ? 'Uploading…' : 'Click to upload image'}
                    </span>
                  </div>
                )}
                <div className={s.socialImageOverlay}>
                  <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    size={18} stroke="#fff" />
                  <span>Upload image</span>
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={handleImageUpload} />
              {/* Social preview card */}
              <div className={s.socialPreviewCard}>
                <div className={s.socialPreviewBrand}>THEOUTLET.NG</div>
                <div className={s.socialPreviewTitle}>{(prefs.homePageTitle || '').slice(0, 30)}…</div>
                <div className={s.socialPreviewDesc}>{(prefs.metaDesc || '').slice(0, 60)}…</div>
              </div>
            </div>

            {/* SEO fields */}
            <div className={s.seoRight}>
              <div className={s.fieldGroup}>
                <label className={s.fieldLabel}>Home page title</label>
                <input
                  className={`${s.fieldInput} ${titleLen > 70 ? s.fieldInputWarn : ''}`}
                  value={prefs.homePageTitle}
                  onChange={e => set('homePageTitle', e.target.value)}
                  maxLength={100}
                  placeholder="Your store name | Tagline"
                />
                <p className={`${s.fieldHint} ${titleLen > 70 ? s.fieldHintWarn : ''}`}>
                  {titleLen} of 70 characters used
                  {titleLen > 70 && ' — title may be truncated in search results'}
                </p>
              </div>

              <div className={s.fieldGroup}>
                <label className={s.fieldLabel}>Meta description</label>
                <textarea
                  className={`${s.fieldTextarea} ${descLen > 320 ? s.fieldInputWarn : ''}`}
                  value={prefs.metaDesc}
                  onChange={e => set('metaDesc', e.target.value)}
                  rows={5}
                  maxLength={400}
                  placeholder="Describe your store for search engines…"
                />
                <p className={`${s.fieldHint} ${descLen > 320 ? s.fieldHintWarn : ''}`}>
                  {descLen} of 320 characters used
                </p>
              </div>

              {/* Google SERP preview */}
              {(prefs.homePageTitle || prefs.metaDesc) && (
                <div className={s.serpPreview}>
                  <p className={s.serpUrl}>yourstore.com</p>
                  <p className={s.serpTitle}>{prefs.homePageTitle || 'Your Store'}</p>
                  {prefs.metaDesc && (
                    <p className={s.serpDesc}>{prefs.metaDesc.slice(0, 160)}{prefs.metaDesc.length > 160 ? '…' : ''}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </SectionCard>

        {/* ─── 3. Automatic redirection ─────────────────────── */}
        <SectionCard title="Automatic redirection">
          <SettingRow
            icon={<Ic d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zM3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z"
              size={16} stroke="#6B7280" />}
            label="Country/region"
            description="Displays the storefront that matches a visitor's location"
            value={prefs.countryRedirect}
            onChange={v => set('countryRedirect', v)}
          />
          <SettingRow
            icon={<Ic d="M4 5h3m-3 4h5m-5 4h3M4 17h4M16 3l-8 18M10 3l8 18" size={16} stroke="#6B7280" />}
            label="Language"
            description="Displays the language that matches a visitor's browser, when available"
            value={prefs.languageRedirect}
            onChange={v => set('languageRedirect', v)}
          />
        </SectionCard>

        {/* ─── 4. Spam protection ───────────────────────────── */}
        <SectionCard
          title="Spam protection"
          description="Enabling hCaptcha can protect your store from spam. Some customers may need to complete the hCaptcha task."
        >
          <SettingRow
            icon={<Ic d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={16} stroke="#6B7280" />}
            label="Enable on contact and comment forms"
            value={prefs.spamForms}
            onChange={v => set('spamForms', v)}
          />
          <SettingRow
            icon={<Ic d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" size={16} stroke="#6B7280" />}
            label="Enable on login, create account and password recovery pages"
            value={prefs.spamLogin}
            onChange={v => set('spamLogin', v)}
          />
        </SectionCard>

        {/* ─── 5. Crawler access ────────────────────────────── */}
        <SectionCard
          title="Crawler access"
          helpIcon
          description="Authorize external tools to crawl your store. Copy the full values for Signature, Signature-Input, and Signature-Agent, then paste them into your HTTP crawler requests."
          action={
            <button className={s.createSigBtn} onClick={() => setSigModal(true)}>
              Create signature
            </button>
          }
        >
          {/* Filter tabs */}
          <div className={s.crawlerTabs}>
            {['all', 'active', 'expired'].map(tab => (
              <button key={tab}
                className={`${s.crawlerTab} ${sigTab === tab ? s.crawlerTabOn : ''}`}
                onClick={() => setSigTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Signatures list or empty state */}
          {filteredSigs.length === 0 ? (
            <div className={s.crawlerEmpty}>
              <div className={s.crawlerEmptyIllustration}>
                <div className={s.crawlerEmptyDoc}>
                  <div className={s.crawlerEmptyDocPage} />
                  <div className={s.crawlerEmptyDocCorner} />
                  <div className={s.crawlerEmptyDocLine} />
                  <div className={s.crawlerEmptyDocLine} style={{ width: '60%' }} />
                  <div className={s.crawlerEmptyDocLine} style={{ width: '80%' }} />
                </div>
              </div>
              <h3 className={s.crawlerEmptyTitle}>Manage crawler access</h3>
              <p className={s.crawlerEmptyDesc}>
                Create signatures that allow trusted tools to crawl your store
              </p>
              <button className={s.crawlerEmptyBtn} onClick={() => setSigModal(true)}>
                Create signature
              </button>
            </div>
          ) : (
            <div className={s.sigList}>
              {filteredSigs.map(sig => (
                <div key={sig.id} className={s.sigRow}>
                  <div className={s.sigInfo}>
                    <p className={s.sigName}>{sig.name}</p>
                    <p className={s.sigMeta}>
                      Created {sig.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {sig.expiresAt && ` · Expires ${sig.expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      {!sig.expiresAt && ' · Never expires'}
                    </p>
                    <code className={s.sigCode}>{sig.signature}</code>
                  </div>
                  <div className={s.sigActions}>
                    <span className={`${s.sigBadge} ${sig.status === 'active' ? s.sigBadgeActive : s.sigBadgeExpired}`}>
                      {sig.status.charAt(0).toUpperCase() + sig.status.slice(1)}
                    </span>
                    <button className={s.sigCopyBtn}
                      onClick={() => navigator.clipboard.writeText(sig.signature).then(() => showToast('Signature copied'))}>
                      <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2"
                        size={14} />
                      Copy
                    </button>
                    <button className={s.sigDeleteBtn}
                      onClick={() => {
                        if (window.confirm(`Delete signature "${sig.name}"?`)) {
                          setSignatures(prev => prev.filter(x => x.id !== sig.id))
                          showToast('Signature deleted')
                        }
                      }}>
                      <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>

      {/* ── Save bar ── */}
      {isDirty && (
        <div className={s.saveBar}>
          <span className={s.saveBarMsg}>You have unsaved changes</span>
          <div className={s.saveBarActions}>
            <button className={s.saveBarDiscard}
              onClick={() => { setPrefs(JSON.parse(savedPrefs)); setSocialPreview(null) }}>
              Discard
            </button>
            <button className={s.saveBarSave} onClick={save} disabled={saving}>
              {saving ? <><span className={s.spinner} /> Saving…</> : 'Save'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
