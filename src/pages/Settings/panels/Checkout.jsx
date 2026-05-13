/**
 * Checkout.jsx
 * Full checkout settings panel — plugs into Settings.jsx as PanelCheckout.
 *
 * To wire into Settings.jsx:
 *   1. Import: import PanelCheckout from './panels/PanelCheckout'
 *   2. Add to the PANELS map: checkout: <PanelCheckout />
 *   3. The existing nav item { id: 'checkout' } already exists in NAV.
 */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Checkout.module.css'

/* ── Icon primitive ──────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Reusable primitives (mirror Settings.jsx patterns) ──────────── */
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

function Section({ title, subtitle, badge, children, action }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionHeadLeft}>
          <div className={styles.sectionTitleRow}>
            <h2 className={styles.sectionTitle}>{title}</h2>
            {badge && <span className={`${styles.badge} ${styles[`badge_${badge.color}`]}`}>{badge.label}</span>}
          </div>
          {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
        </div>
        {action && <div className={styles.sectionAction}>{action}</div>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children, row, borderBottom = true }) {
  return (
    <div className={`${styles.field} ${row ? styles.fieldRow : ''} ${!borderBottom ? styles.fieldNoBorder : ''}`}>
      {label && (
        <div className={styles.fieldLabel}>
          <label>{label}</label>
          {hint && <span className={styles.fieldHint}>{hint}</span>}
        </div>
      )}
      <div className={styles.fieldControl}>{children}</div>
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

function Select({ value, onChange, options, width }) {
  return (
    <select className={styles.select} style={width ? { width } : {}}
      value={value} onChange={e => onChange?.(e.target.value)}>
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value}
          value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}

function Radio({ name, value, checked, onChange, label, sub }) {
  return (
    <label className={styles.radioLabel}>
      <input type="radio" name={name} value={value} checked={checked}
        onChange={() => onChange?.(value)} className={styles.radioInput} />
      <div className={styles.radioContent}>
        <span className={styles.radioText}>{label}</span>
        {sub && <span className={styles.radioSub}>{sub}</span>}
      </div>
    </label>
  )
}

function Checkbox({ checked, onChange, label, sub, disabled }) {
  return (
    <label className={`${styles.checkLabel} ${disabled ? styles.checkDisabled : ''}`}>
      <input type="checkbox" checked={checked}
        onChange={e => onChange?.(e.target.checked)}
        disabled={disabled}
        className={styles.checkInput} />
      <div className={styles.checkContent}>
        <span className={styles.checkText}>{label}</span>
        {sub && <span className={styles.checkSub}>{sub}</span>}
      </div>
    </label>
  )
}

function InfoBanner({ icon, children, onDismiss, type = 'info' }) {
  return (
    <div className={`${styles.infoBanner} ${styles[`infoBanner_${type}`]}`}>
      {icon && <span className={styles.infoBannerIcon}>{icon}</span>}
      <span className={styles.infoBannerText}>{children}</span>
      {onDismiss && (
        <button className={styles.infoBannerClose} onClick={onDismiss}>
          <Ic d="M18 6L6 18M6 6l12 12" size={14} />
        </button>
      )}
    </div>
  )
}

function RowLink({ icon, label, sub, badge, onClick, chevron = true, toggle, toggleVal, onToggle }) {
  return (
    <div className={`${styles.rowLink} ${onClick ? styles.rowLinkClickable : ''}`}
      onClick={onClick}>
      {icon && (
        <div className={styles.rowLinkIcon}>
          <Ic d={icon} size={15} stroke="#6B7280" />
        </div>
      )}
      <div className={styles.rowLinkContent}>
        <div className={styles.rowLinkTitle}>
          {label}
          {badge && <span className={`${styles.badge} ${styles[`badge_${badge.color}`]}`}>{badge.label}</span>}
        </div>
        {sub && <div className={styles.rowLinkSub}>{sub}</div>}
      </div>
      {toggle && (
        <div onClick={e => { e.stopPropagation(); onToggle?.(!toggleVal) }}
          className={`${styles.toggle} ${toggleVal ? styles.toggleOn : ''}`}
          style={{ cursor: 'pointer' }}>
          <span className={styles.toggleThumb} />
        </div>
      )}
      {!toggle && chevron && <Ic d="M9 18l6-6-6-6" size={16} stroke="#9CA3AF" />}
    </div>
  )
}

function ConfigCard({ name, liveAt, children, onDuplicate, onCustomize }) {
  return (
    <div className={styles.configCard}>
      <div className={styles.configCardHead}>
        <div className={styles.configCardInfo}>
          <span className={styles.configCardName}>{name}</span>
          <span className={`${styles.badge} ${styles.badge_green}`}>Live</span>
        </div>
        {liveAt && <span className={styles.configCardDate}>Last saved: {liveAt}</span>}
        <div className={styles.configCardActions}>
          <button className={styles.iconBtn} title="More options">
            <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
          </button>
          <button className={styles.outlineBtn} onClick={onDuplicate}>Duplicate</button>
          <button className={styles.primaryBtn} onClick={onCustomize}>Customize</button>
        </div>
      </div>
      {children}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   INITIAL STATE
═══════════════════════════════════════════════════════════════════ */
const INITIAL = {
  /* Customer contact */
  contactMethod:          'phone_or_email',  // 'phone_or_email' | 'email'
  requireSignIn:          false,

  /* Customer info */
  fullName:               'require_first_last',
  companyName:            'dont_include',
  addressLine2:           'optional',
  shippingPhone:          'required',

  /* Order processing */
  emailMarketing:         'checkout_and_signin',
  emailMarketingLabel:    'Email me with news and offers',
  emailPreselectRegions:  [],
  smsMarketing:           'checkout_only',
  smsMarketingLabel:      'Text me with news and offers',
  tipping:                false,
  tipPresets:             [10, 15, 20],
  checkoutLang:           'en',

  /* Advanced */
  addToCartLimit:         true,

  /* Checkout rules */
  rules: [
    { id: 'rule-1', name: 'cart-transformer', provider: 'FBP | Fast Bundle', active: true },
  ],

  /* Abandoned checkout */
  abandonedCheckoutEmail: true,
  abandonedHours:         '10',

  /* Order status page */
  orderStatusAdditional:  '',
  hideOrderStatus:        false,

  /* Self-serve returns */
  selfServeReturns:       false,
  returnWindow:           '30',

  /* New customer accounts */
  newCustomerAccounts:    false,
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PANEL
═══════════════════════════════════════════════════════════════════ */
export default function PanelCheckout() {
  const navigate = useNavigate()

  const [form,    setForm]    = useState(INITIAL)
  const [saved,   setSaved]   = useState(JSON.stringify(INITIAL))
  const [saving,  setSaving]  = useState(false)
  const [banner,  setBanner]  = useState(true)
  const [toast,   setToast]   = useState(null)

  const dirty = JSON.stringify(form) !== saved

  const set = useCallback((k, v) => setForm(f => ({ ...f, [k]: v })), [])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const save = async () => {
    setSaving(true)
    try {
      // TODO: await api.put('/api/settings/checkout', form)
      await new Promise(r => setTimeout(r, 700))
      setSaved(JSON.stringify(form))
      showToast('Checkout settings saved')
    } catch {
      showToast('Failed to save. Please try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const discard = () => setForm(JSON.parse(saved))

  /* ── Tip presets ─────────────────────────────────────────────── */
  const updateTipPreset = (idx, val) => {
    const next = [...form.tipPresets]
    next[idx] = Number(val)
    set('tipPresets', next)
  }

  /* ── Rules ───────────────────────────────────────────────────── */
  const toggleRule = (id) => set('rules', form.rules.map(r => r.id === id ? { ...r, active: !r.active } : r))

  const addRule = () => {
    const newRule = {
      id:       `rule-${Date.now()}`,
      name:     'New rule',
      provider: 'Custom',
      active:   false,
    }
    set('rules', [...form.rules, newRule])
  }

  return (
    <div className={styles.panel}>

      {/* ── Toast ───────────────────────────────────────────────── */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'error' ? styles.toastError : ''}`}>
          <Ic d={toast.type === 'error' ? 'M18 6L6 18M6 6l12 12' : 'M20 6L9 17l-5-5'}
            size={13} stroke={toast.type === 'error' ? '#EF4444' : '#2DBD97'} />
          {toast.msg}
        </div>
      )}

      {/* ── Save bar ────────────────────────────────────────────── */}
      <SaveBar dirty={dirty} onSave={save} onDiscard={discard} saving={saving} />

      {/* ══ 1. CONFIGURATIONS ══════════════════════════════════════ */}
      <Section
        title="Configurations"
        badge={{ label: 'New', color: 'blue' }}
        subtitle="Customize checkout and customer accounts"
      >
        {banner && (
          <InfoBanner type="info" onDismiss={() => setBanner(false)}>
            Your customer accounts domain is using the default domain.{' '}
            <button className={styles.linkBtn} onClick={() => navigate('/settings/general')}>
              Change your customer accounts domain
            </button>
          </InfoBanner>
        )}

        <ConfigCard
          name="Taja configuration"
          liveAt="Today at 0:17"
          onDuplicate={() => showToast('Configuration duplicated')}
          onCustomize={() => navigate('/settings/checkout/customize')}
        />
      </Section>

      {/* ══ 2. CUSTOMER CONTACT ════════════════════════════════════ */}
      <Section
        title="Customer contact method"
        subtitle="The contact method customers enter at checkout will receive order and shipping notifications"
      >
        <Field borderBottom={false}>
          <div className={styles.radioGroup}>
            <Radio name="contact" value="phone_or_email" label="Phone number or email"
              sub="An SMS App is required to send SMS updates"
              checked={form.contactMethod === 'phone_or_email'}
              onChange={v => set('contactMethod', v)} />
            <Radio name="contact" value="email" label="Email"
              checked={form.contactMethod === 'email'}
              onChange={v => set('contactMethod', v)} />
          </div>
        </Field>

        <Field borderBottom={false}>
          <Checkbox
            checked={form.requireSignIn}
            onChange={v => set('requireSignIn', v)}
            label="Require customers to sign in to their account before checkout"
            sub="Customers can only use email when sign-in is required"
            disabled={form.contactMethod === 'phone_or_email'}
          />
        </Field>
      </Section>

      {/* ══ 3. CUSTOMER INFORMATION ════════════════════════════════ */}
      <Section title="Customer information">
        {[
          { key: 'fullName',      label: 'Full name',                          options: [{ value: 'require_first_last', label: 'Require first and last name' }, { value: 'optional', label: 'Optional' }, { value: 'dont_include', label: "Don't include" }] },
          { key: 'companyName',   label: 'Company name',                        options: [{ value: 'dont_include', label: "Don't include" }, { value: 'optional', label: 'Optional' }, { value: 'required', label: 'Required' }] },
          { key: 'addressLine2',  label: 'Address line 2 (apartment, unit, etc.)', options: [{ value: 'optional', label: 'Optional' }, { value: 'required', label: 'Required' }, { value: 'dont_include', label: "Don't include" }] },
          { key: 'shippingPhone', label: 'Shipping address phone number',        options: [{ value: 'required', label: 'Required' }, { value: 'optional', label: 'Optional' }, { value: 'dont_include', label: "Don't include" }] },
        ].map((item, i, arr) => (
          <Field key={item.key} label={item.label} row
            borderBottom={i < arr.length - 1}>
            <Select value={form[item.key]} onChange={v => set(item.key, v)} options={item.options} />
          </Field>
        ))}
      </Section>

      {/* ══ 4. MARKETING OPT-IN ════════════════════════════════════ */}
      <Section
        title="Marketing opt-in"
        subtitle="Show a checkbox for customers to sign up for marketing"
      >
        {/* Email marketing */}
        <div className={styles.marketingBlock}>
          <div className={styles.marketingLabel}>Email</div>
          <div className={styles.marketingRow}>
            <Select
              value={form.emailMarketing}
              onChange={v => set('emailMarketing', v)}
              options={[
                { value: 'checkout_and_signin', label: 'Checkout and sign-in' },
                { value: 'checkout_only',        label: 'Checkout only' },
                { value: 'disabled',             label: 'Disabled' },
              ]}
            />
            <div className={styles.marketingLabelEdit}>
              <input
                className={styles.marketingLabelInput}
                value={form.emailMarketingLabel}
                onChange={e => set('emailMarketingLabel', e.target.value)}
                placeholder="Email me with news and offers"
              />
              <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={14} stroke="#9CA3AF" />
            </div>
          </div>
          <div className={styles.preselRow}>
            <div>
              <div className={styles.preselTitle}>Preselect checkbox in certain regions</div>
              <div className={styles.preselSub}>
                {form.emailPreselectRegions.length === 0 ? 'None selected' : form.emailPreselectRegions.join(', ')}
              </div>
            </div>
            <button className={styles.iconBtn} onClick={() => {}}>
              <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={14} />
            </button>
          </div>
        </div>

        {/* SMS marketing */}
        <div className={styles.marketingBlock}>
          <div className={styles.marketingLabel}>SMS</div>
          <div className={styles.marketingRow}>
            <Select
              value={form.smsMarketing}
              onChange={v => set('smsMarketing', v)}
              options={[
                { value: 'checkout_only',        label: 'Checkout only' },
                { value: 'checkout_and_signin',  label: 'Checkout and sign-in' },
                { value: 'disabled',             label: 'Disabled' },
              ]}
            />
            <div className={styles.marketingLabelEdit}>
              <input
                className={styles.marketingLabelInput}
                value={form.smsMarketingLabel}
                onChange={e => set('smsMarketingLabel', e.target.value)}
                placeholder="Text me with news and offers"
              />
              <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={14} stroke="#9CA3AF" />
            </div>
          </div>
          <p className={styles.smsHint}>
            To launch SMS campaigns, you need to install an{' '}
            <button className={styles.linkBtn} onClick={() => navigate('/apps?category=sms')}>SMS App</button>
          </p>
        </div>
      </Section>

      {/* ══ 5. TIPPING ═════════════════════════════════════════════ */}
      <Section
        title="Tipping"
        subtitle="Customers can choose between 3 presets or enter a custom amount"
      >
        <Checkbox
          checked={form.tipping}
          onChange={v => set('tipping', v)}
          label="Show tipping options at checkout"
        />

        {form.tipping && (
          <div className={styles.tipPresets}>
            <div className={styles.tipPresetsLabel}>Tip presets (%)</div>
            <div className={styles.tipPresetsRow}>
              {form.tipPresets.map((pct, i) => (
                <div key={i} className={styles.tipPresetItem}>
                  <input
                    type="number" min={1} max={100}
                    className={styles.tipPresetInput}
                    value={pct}
                    onChange={e => updateTipPreset(i, e.target.value)}
                  />
                  <span className={styles.tipPresetPct}>%</span>
                </div>
              ))}
            </div>
            <p className={styles.tipHint}>Customers can also enter a custom tip amount.</p>
          </div>
        )}
      </Section>

      {/* ══ 6. CHECKOUT LANGUAGE ═══════════════════════════════════ */}
      <Section title="Checkout language">
        <Field label="Language" row borderBottom={false}>
          <div className={styles.langRow}>
            <Select
              value={form.checkoutLang}
              onChange={v => set('checkoutLang', v)}
              options={[
                { value: 'en',    label: 'English' },
                { value: 'fr',    label: 'French' },
                { value: 'es',    label: 'Spanish' },
                { value: 'ha',    label: 'Hausa' },
                { value: 'yo',    label: 'Yoruba' },
                { value: 'ig',    label: 'Igbo' },
                { value: 'pcm',   label: 'Nigerian Pidgin' },
              ]}
            />
            <button className={styles.outlineBtn}
              onClick={() => navigate('/settings/checkout/content')}>
              Edit checkout content
            </button>
          </div>
        </Field>
      </Section>

      {/* ══ 7. ADVANCED PREFERENCES ════════════════════════════════ */}
      <Section title="Advanced preferences">
        <RowLink
          icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
          label="Address collection"
          sub="Manage how you collect shipping and billing addresses"
          onClick={() => navigate('/settings/checkout/address-collection')}
        />
        <RowLink
          icon="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"
          label="Add-to-cart limit"
          sub="Protects your available inventory quantities from being revealed"
          badge={{ label: 'Recommended', color: 'blue' }}
          toggle
          toggleVal={form.addToCartLimit}
          onToggle={v => set('addToCartLimit', v)}
          onClick={() => navigate('/settings/checkout/cart-limit')}
        />
      </Section>

      {/* ══ 8. CHECKOUT RULES ══════════════════════════════════════ */}
      <Section
        title="Checkout rules"
        subtitle="Rules set parameters for how the cart or checkout responds to different customer scenarios. You can set product limits, perform age verification and more."
        action={
          <button className={styles.outlineBtn} onClick={addRule}>
            <Ic d="M12 5v14M5 12h14" size={13} />
            Add rule
          </button>
        }
      >
        {form.rules.map(rule => (
          <div key={rule.id} className={styles.ruleRow}>
            <div className={styles.ruleIcon}>
              <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={16} stroke="#6B7280" />
            </div>
            <div className={styles.ruleInfo}>
              <div className={styles.ruleName}>{rule.name}</div>
              <div className={styles.ruleProvider}>by {rule.provider}</div>
            </div>
            <span className={`${styles.badge} ${rule.active ? styles.badge_green : styles.badge_gray}`}>
              {rule.active ? 'Active' : 'Inactive'}
            </span>
            <button className={styles.iconBtn} title="Rule info">
              <Ic d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 8v4M12 16h.01" size={14} />
            </button>
            <Toggle value={rule.active} onChange={() => toggleRule(rule.id)} />
          </div>
        ))}

        {form.rules.length === 0 && (
          <div className={styles.emptyRules}>
            <Ic d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" size={24} stroke="#D1D5DB" />
            <p>No checkout rules configured</p>
            <button className={styles.primaryBtn} onClick={addRule}>Add your first rule</button>
          </div>
        )}
      </Section>

      {/* ══ 9. ABANDONED CHECKOUT ══════════════════════════════════ */}
      <Section
        title="Abandoned checkout"
        subtitle="Automatically send recovery emails to customers who abandon their checkout"
      >
        <Field borderBottom={false}>
          <Checkbox
            checked={form.abandonedCheckoutEmail}
            onChange={v => set('abandonedCheckoutEmail', v)}
            label="Automatically send abandoned checkout emails"
            sub="Emails are sent to customers who have entered their email address but didn't complete their order"
          />
        </Field>

        {form.abandonedCheckoutEmail && (
          <Field label="Send after" row borderBottom={false}>
            <Select
              value={form.abandonedHours}
              onChange={v => set('abandonedHours', v)}
              options={[
                { value: '1',  label: '1 hour' },
                { value: '6',  label: '6 hours' },
                { value: '10', label: '10 hours' },
                { value: '24', label: '24 hours' },
              ]}
            />
          </Field>
        )}

        <div className={styles.fieldDivider} />
        <div className={styles.sectionActionRow}>
          <span className={styles.sectionActionLabel}>View and edit abandoned checkout email</span>
          <button className={styles.outlineBtn}
            onClick={() => navigate('/settings/notifications?template=abandoned_checkout')}>
            <Ic d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" size={13} />
            View email template
          </button>
        </div>
      </Section>

      {/* ══ 10. ORDER STATUS PAGE ══════════════════════════════════ */}
      <Section
        title="Order status page"
        subtitle="Shown after a customer completes checkout"
      >
        <Field label="Additional scripts or content" hint="Supports HTML, Liquid, and JavaScript"
          borderBottom={false}>
          <textarea
            className={styles.codeTextarea}
            rows={5}
            value={form.orderStatusAdditional}
            onChange={e => set('orderStatusAdditional', e.target.value)}
            placeholder="<!-- Add tracking pixels, custom scripts, or additional content -->"
            spellCheck={false}
          />
        </Field>

        <div className={styles.fieldDivider} />

        <Field borderBottom={false}>
          <Checkbox
            checked={form.hideOrderStatus}
            onChange={v => set('hideOrderStatus', v)}
            label="Hide order status from customers"
            sub="Customers will not be able to view the status of their orders on the order status page"
          />
        </Field>
      </Section>

      {/* ══ 11. SELF-SERVE RETURNS ═════════════════════════════════ */}
      <Section
        title="Self-serve returns"
        subtitle="Let customers submit return requests from their order status page"
      >
        <Field borderBottom={form.selfServeReturns}>
          <div className={styles.returnToggleRow}>
            <div>
              <div className={styles.returnToggleLabel}>Enable self-serve returns</div>
              <div className={styles.returnToggleSub}>Customers can request returns without contacting support</div>
            </div>
            <Toggle value={form.selfServeReturns} onChange={v => set('selfServeReturns', v)} />
          </div>
        </Field>

        {form.selfServeReturns && (
          <Field label="Return window" row borderBottom={false}>
            <Select
              value={form.returnWindow}
              onChange={v => set('returnWindow', v)}
              options={[
                { value: '7',   label: '7 days' },
                { value: '14',  label: '14 days' },
                { value: '30',  label: '30 days' },
                { value: '60',  label: '60 days' },
                { value: '90',  label: '90 days' },
                { value: '0',   label: 'No time limit' },
              ]}
            />
          </Field>
        )}
      </Section>

      {/* ══ 12. NEW CUSTOMER ACCOUNTS ══════════════════════════════ */}
      <Section
        title="New customer accounts"
        subtitle="Use the new customer accounts experience — passwordless login with one-time codes"
      >
        <Field borderBottom={false}>
          <div className={styles.returnToggleRow}>
            <div>
              <div className={styles.returnToggleLabel}>Use new customer accounts</div>
              <div className={styles.returnToggleSub}>Customers log in with a one-time code sent to their email</div>
            </div>
            <Toggle value={form.newCustomerAccounts} onChange={v => set('newCustomerAccounts', v)} />
          </div>
        </Field>

        <div className={styles.fieldDivider} />

        <div className={styles.sectionActionRow}>
          <span className={styles.sectionActionLabel}>Manage customer account settings</span>
          <button className={styles.outlineBtn}
            onClick={() => navigate('/settings/customer-accounts')}>
            <Ic d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" size={13} />
            Customer accounts
          </button>
        </div>
      </Section>

    </div>
  )
}
