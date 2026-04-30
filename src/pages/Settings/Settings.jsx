/**
 * Settings.jsx
 * Full admin settings page — mirrors Shopify-style settings layout.
 * Route: /admin/settings
 *
 * Usage in your router:
 *   import AdminSettings from './pages/AdminSettings/AdminSettings'
 *   <Route path="/admin/settings" element={<AdminSettings />} />
 *
 * The settings icon in your dashboard should link to /admin/settings
 */

import { useState, useRef } from 'react'
import styles from './Settings.module.css'

/* ── Icon primitive ────────────────────────────────────────────── */
const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Nav items ─────────────────────────────────────────────────── */
const NAV = [
  { id: 'general',      label: 'General',             icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  { id: 'plan',         label: 'Plan',                icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { id: 'billing',      label: 'Billing',             icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z' },
  { id: 'users',        label: 'Users',               icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' },
  { id: 'payments',     label: 'Payments',            icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z' },
  { id: 'checkout',     label: 'Checkout',            icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0' },
  { id: 'shipping',     label: 'Shipping & Delivery', icon: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3m0 0h4l3 5v4h-7V8zM16 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0' },
  { id: 'taxes',        label: 'Taxes & Duties',      icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
  { id: 'locations',    label: 'Locations',           icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' },
  { id: 'notifications',label: 'Notifications',       icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0' },
  { id: 'security',     label: 'Security',            icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { id: 'policies',     label: 'Policies',            icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8' },
]

/* ── Reusable form primitives ──────────────────────────────────── */
function Section({ title, subtitle, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Field({ label, hint, children, row }) {
  return (
    <div className={`${styles.field} ${row ? styles.fieldRow : ''}`}>
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

function Input({ value, onChange, placeholder, type = 'text', prefix, disabled }) {
  return (
    <div className={`${styles.inputWrap} ${prefix ? styles.inputWrapPrefix : ''}`}>
      {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select className={styles.select} value={value} onChange={e => onChange?.(e.target.value)}>
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}

function Toggle({ value, onChange, label }) {
  return (
    <label className={styles.toggleWrap}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        onClick={() => onChange?.(!value)}>
        <span className={styles.toggleThumb} />
      </button>
      {label && <span className={styles.toggleLabel}>{label}</span>}
    </label>
  )
}

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

function Card({ children, onClick, chevron }) {
  return (
    <div className={`${styles.card} ${onClick ? styles.cardLink : ''}`} onClick={onClick}>
      <div className={styles.cardInner}>{children}</div>
      {chevron && <Ic d="M9 18l6-6-6-6" size={16} stroke="#9CA3AF" />}
    </div>
  )
}

function Badge({ color = 'green', children }) {
  return <span className={`${styles.badge} ${styles[`badge_${color}`]}`}>{children}</span>
}

/* ════════════════════════════════════════════════════════════════
   PANEL COMPONENTS
   ════════════════════════════════════════════════════════════════ */

/* ── General ────────────────────────────────────────────────────── */
function PanelGeneral() {
  const [form, setForm] = useState({
    storeName: 'My Store',
    storeEmail: 'myStore@email.com',
    phone: '*******',
    address: '*******',
    city: '*******',
    state: '********',
    country: '*******',
    zip: '*********',
    currency: 'NGN',
    unitSystem: 'metric',
    weightUnit: 'kg',
    timezone: 'Africa/Lagos',
    orderPrefix: '#',
    orderSuffix: '',
    autoFulfill: 'none',
    autoArchive: true,
  })
  const [saved, setSaved] = useState(JSON.stringify(form))
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(form) !== saved
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    // TODO: POST /api/admin/settings/general
    await new Promise(r => setTimeout(r, 800))
    setSaved(JSON.stringify(form))
    setSaving(false)
  }

  return (
    <>
      <SaveBar dirty={dirty} onSave={save} onDiscard={() => setForm(JSON.parse(saved))} saving={saving} />

      <Section title="Business details" subtitle="Used for payments, markets, and apps">
        <Card onClick={() => {}} chevron>
          <div className={styles.cardAvatar} style={{ background: '#1b3b5f' }}>
            {form.storeName[0]}
          </div>
          <div>
            <p className={styles.cardTitle}>{form.storeName}</p>
            <p className={styles.cardSub}>Nigeria</p>
          </div>
        </Card>
      </Section>

      <Section title="Store contact details">
        <Field label="Store name">
          <Input value={form.storeName} onChange={v => set('storeName', v)} placeholder="Your store name" />
        </Field>
        <Field label="Store contact email" hint="Customers see this email">
          <Input value={form.storeEmail} onChange={v => set('storeEmail', v)} type="email" placeholder="store@example.com" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={v => set('phone', v)} placeholder="+234 800 000 0000" />
        </Field>

        <div className={styles.addressGrid}>
          <Field label="Address">
            <Input value={form.address} onChange={v => set('address', v)} placeholder="Street address" />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={v => set('city', v)} placeholder="City" />
          </Field>
          <Field label="State">
            <Select value={form.state} onChange={v => set('state', v)} options={[
              'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
              'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
              'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
              'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'
            ]} />
          </Field>
          <Field label="ZIP / Postal code">
            <Input value={form.zip} onChange={v => set('zip', v)} placeholder="100001" />
          </Field>
        </div>
      </Section>

      <Section title="Store defaults">
        <Field label="Currency display">
          <Select value={form.currency} onChange={v => set('currency', v)} options={[
            { value: 'NGN', label: 'Nigerian Naira (NGN ₦)' },
            { value: 'USD', label: 'US Dollar (USD $)' },
            { value: 'GBP', label: 'British Pound (GBP £)' },
            { value: 'EUR', label: 'Euro (EUR €)' },
            { value: 'GHS', label: 'Ghanaian Cedi (GHS ₵)' },
            { value: 'KES', label: 'Kenyan Shilling (KES KSh)' },
          ]} />
        </Field>
        <Field label="Unit system">
          <Select value={form.unitSystem} onChange={v => set('unitSystem', v)} options={[
            { value: 'metric', label: 'Metric system' },
            { value: 'imperial', label: 'Imperial system' },
          ]} />
        </Field>
        <Field label="Default weight unit">
          <Select value={form.weightUnit} onChange={v => set('weightUnit', v)} options={[
            { value: 'kg', label: 'Kilogram (kg)' },
            { value: 'g',  label: 'Gram (g)' },
            { value: 'lb', label: 'Pound (lb)' },
            { value: 'oz', label: 'Ounce (oz)' },
          ]} />
        </Field>
        <Field label="Time zone">
          <Select value={form.timezone} onChange={v => set('timezone', v)} options={[
            { value: 'Africa/Lagos',    label: '(GMT+01:00) West Central Africa' },
            { value: 'Africa/Accra',    label: '(GMT+00:00) Accra' },
            { value: 'Africa/Nairobi',  label: '(GMT+03:00) Nairobi' },
            { value: 'Africa/Johannesburg', label: '(GMT+02:00) Johannesburg' },
            { value: 'Europe/London',   label: '(GMT+00:00) London' },
            { value: 'America/New_York',label: '(GMT-05:00) New York' },
          ]} />
        </Field>
      </Section>

      <Section title="Order ID format" subtitle="Shown on the order page, customer pages, and customer order notifications">
        <div className={styles.orderIdRow}>
          <Field label="Prefix">
            <Input value={form.orderPrefix} onChange={v => set('orderPrefix', v)} placeholder="#" />
          </Field>
          <div className={styles.orderIdPreview}>
            <p className={styles.orderIdLabel}>Preview</p>
            <p className={styles.orderIdExample}>
              {form.orderPrefix}1001{form.orderSuffix}, {form.orderPrefix}1002{form.orderSuffix}, …
            </p>
          </div>
          <Field label="Suffix">
            <Input value={form.orderSuffix} onChange={v => set('orderSuffix', v)} placeholder="-NG" />
          </Field>
        </div>
      </Section>

      <Section title="Order processing">
        <p className={styles.fieldGroupLabel}>After an order has been paid</p>
        {[
          { value: 'all',      label: "Automatically fulfill the order's line items" },
          { value: 'gift',     label: 'Automatically fulfill only the gift cards of the order' },
          { value: 'none',     label: "Don't fulfill any of the order's line items automatically" },
        ].map(opt => (
          <label key={opt.value} className={styles.radioRow}>
            <input type="radio" name="autoFulfill" value={opt.value}
              checked={form.autoFulfill === opt.value}
              onChange={() => set('autoFulfill', opt.value)} />
            <span>{opt.label}</span>
          </label>
        ))}

        <p className={styles.fieldGroupLabel} style={{ marginTop: 20 }}>
          After an order has been fulfilled and paid, or when all items have been refunded
        </p>
        <label className={styles.radioRow}>
          <input type="checkbox" checked={form.autoArchive}
            onChange={e => set('autoArchive', e.target.checked)} />
          <span>Automatically archive the order</span>
        </label>
        {form.autoArchive && (
          <p className={styles.radioHint}>The order will be removed from your list of open orders.</p>
        )}
      </Section>

      <Section title="Store assets">
        <Card onClick={() => {}} chevron>
          <div className={styles.cardIcon}><Ic d="M7 7h.01M7 3h5l10 10-7 7L5 10V5a2 2 0 0 1 2-2z" size={16} stroke="#1b3b5f" /></div>
          <div>
            <p className={styles.cardTitle}>Metafields</p>
            <p className={styles.cardSub}>Available in themes and configurable for Storefront API</p>
          </div>
        </Card>
        <Card onClick={() => {}} chevron>
          <div className={styles.cardIcon}><Ic d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" size={16} stroke="#1b3b5f" /></div>
          <div>
            <p className={styles.cardTitle}>Brand</p>
            <p className={styles.cardSub}>Integrate brand assets across sales channels, themes and apps</p>
          </div>
        </Card>
      </Section>
      <Section title="Resources">
  <Card onClick={() => window.open('https://docs.obana.africa/changelog', '_blank')} chevron>
    <div className={styles.cardIcon}>
      <Ic d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={16} stroke="#1b3b5f" />
    </div>
    <div>
      <p className={styles.cardTitle}>Change log</p>
      <p className={styles.cardSub}>See what's new in your platform</p>
    </div>
    <button className={styles.resourceBtn}>View change log</button>
  </Card>

  <Card onClick={() => window.open('https://support.obana.africa', '_blank')} chevron>
    <div className={styles.cardIcon}>
      <Ic d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM12 8v4M12 16h.01" size={16} stroke="#1b3b5f" />
    </div>
    <div>
      <p className={styles.cardTitle}>Help Center</p>
      <p className={styles.cardSub}>Browse guides, FAQs and tutorials</p>
    </div>
    <button className={styles.resourceBtn}>Get help</button>
  </Card>

  <Card onClick={() => window.open('https://partners.obana.africa', '_blank')} chevron>
    <div className={styles.cardIcon}>
      <Ic d="M16 18l6-6-6-6M8 6l-6 6 6 6" size={16} stroke="#1b3b5f" />
    </div>
    <div>
      <p className={styles.cardTitle}>Hire a Partner</p>
      <p className={styles.cardSub}>Find a certified Taja development partner</p>
    </div>
    <button className={styles.resourceBtn}>Hire a Partner</button>
  </Card>

  <Card onClick={() => {}} chevron>
    <div className={styles.cardIcon}>
      <Ic d="M3 12h18M3 6h18M3 18h18" size={16} stroke="#1b3b5f" />
    </div>
    <div>
      <p className={styles.cardTitle}>Keyboard shortcuts</p>
      <p className={styles.cardSub}>Speed up your workflow with shortcuts</p>
    </div>
  </Card>

  <Card onClick={() => {}} chevron>
    <div className={styles.cardIcon}>
      <Ic d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" size={16} stroke="#1b3b5f" />
    </div>
    <div>
      <p className={styles.cardTitle}>Store activity log</p>
      <p className={styles.cardSub}>Track all actions taken in your store</p>
    </div>
  </Card>
</Section>

<Section title="Transfer store" subtitle="Move this store into an organization or transfer to an external owner.">
  <div className={styles.transferRow}>
    <p className={styles.transferNote}>
      Transferring your store will reassign ownership and all associated data. This action cannot be undone.
    </p>
    <button className={styles.transferBtn}>Manage</button>
  </div>
</Section>
    </>
  )
}

/* ── Plan ───────────────────────────────────────────────────────── */
function PanelPlan() {
  return (
    <>
      <Section title="Current plan" subtitle="Your active subscription and usage">
        <div className={styles.planCard}>
          <div className={styles.planCardTop}>
            <div>
              <p className={styles.planName}>Starter Plan</p>
              <p className={styles.planPrice}>₦7,500 <span>/month</span></p>
            </div>
            <Badge color="green">Active</Badge>
          </div>
          <div className={styles.planFeatures}>
            {['Online Store','POS Access','Basic Analytics','Email Support','Up to 500 products'].map(f => (
              <div key={f} className={styles.planFeature}>
                <Ic d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" size={14} stroke="#2DBD97" />
                <span>{f}</span>
              </div>
            ))}
          </div>
          <div className={styles.planActions}>
            <button className={styles.upgradePlanBtn}>Upgrade Plan</button>
            <button className={styles.cancelPlanBtn}>Cancel Plan</button>
          </div>
        </div>
      </Section>

      <Section title="Usage this billing period">
        {[
          { label: 'Orders processed', used: 47, limit: 200, unit: 'orders' },
          { label: 'Products',         used: 83, limit: 500, unit: 'products' },
          { label: 'Storage',          used: 1.2, limit: 5, unit: 'GB' },
          { label: 'Staff accounts',   used: 2, limit: 3, unit: 'accounts' },
        ].map(u => (
          <div key={u.label} className={styles.usageRow}>
            <div className={styles.usageInfo}>
              <span>{u.label}</span>
              <span className={styles.usageCount}>{u.used} / {u.limit} {u.unit}</span>
            </div>
            <div className={styles.usageBar}>
              <div className={styles.usageBarFill} style={{ width: `${(u.used / u.limit) * 100}%` }} />
            </div>
          </div>
        ))}
      </Section>

      <Section title="Available plans">
        {[
          { name: 'Starter Sync', price: '₦7,500', period: '/month', desc: 'Small businesses getting started', current: true },
          { name: 'Store Growth', price: '₦9,500', period: '/month', desc: 'Growing businesses ready to scale', recommended: true },
          { name: 'Business Pro', price: '₦15,000', period: '/month', desc: 'Full operational control' },
          { name: 'Enterprise',   price: '₦25,000', period: '/month', desc: 'High-volume multi-location businesses' },
        ].map(p => (
          <div key={p.name} className={`${styles.planOption} ${p.current ? styles.planOptionCurrent : ''} ${p.recommended ? styles.planOptionRecommended : ''}`}>
            {p.recommended && <span className={styles.recommendedBadge}>Recommended</span>}
            <div className={styles.planOptionInfo}>
              <p className={styles.planOptionName}>{p.name}</p>
              <p className={styles.planOptionDesc}>{p.desc}</p>
            </div>
            <div className={styles.planOptionRight}>
              <p className={styles.planOptionPrice}>{p.price}<span>{p.period}</span></p>
              <button className={p.current ? styles.currentPlanBtn : styles.selectPlanBtn}>
                {p.current ? 'Current plan' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </Section>
    </>
  )
}

/* ── Billing ────────────────────────────────────────────────────── */
function PanelBilling() {
  const [invoices] = useState([
    { id: 'INV-2026-04', date: 'Apr 1, 2026', amount: '₦7,500', status: 'Paid' },
    { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: '₦7,500', status: 'Paid' },
    { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '₦7,500', status: 'Paid' },
    { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '₦7,500', status: 'Paid' },
  ])

  return (
    <>
      <Section title="Payment method" subtitle="Used for your subscription billing">
        <Card onClick={() => {}} chevron>
          <div className={styles.cardIcon}>💳</div>
          <div>
            <p className={styles.cardTitle}>•••• •••• •••• 4242</p>
            <p className={styles.cardSub}>Expires 08/28 · Visa</p>
          </div>
        </Card>
        <button className={styles.addPaymentBtn}>+ Add payment method</button>
      </Section>

      <Section title="Billing address">
        <Field label="Full name"><Input value="Tomiwa Aleminu" placeholder="Full name" /></Field>
        <Field label="Address"><Input value="77 Opebi Road, Ikeja, Lagos" placeholder="Billing address" /></Field>
        <Field label="Country"><Select value="Nigeria" options={['Nigeria','Ghana','Kenya','South Africa','United Kingdom','United States']} /></Field>
        <button className={styles.saveBtn} style={{ marginTop: 8 }}>Save billing address</button>
      </Section>

      <Section title="Invoice history">
        <div className={styles.invoiceTable}>
          <div className={styles.invoiceHeader}>
            <span>Invoice</span><span>Date</span><span>Amount</span><span>Status</span><span></span>
          </div>
          {invoices.map(inv => (
            <div key={inv.id} className={styles.invoiceRow}>
              <span className={styles.invoiceId}>{inv.id}</span>
              <span>{inv.date}</span>
              <span>{inv.amount}</span>
              <Badge color="green">{inv.status}</Badge>
              <button className={styles.downloadBtn}>
                <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={14} />
                PDF
              </button>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

/* ── Users ──────────────────────────────────────────────────────── */
function PanelUsers() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Tomiwa Aleminu', email: 'tomiwa@obana.africa', role: 'Owner', status: 'active', lastSeen: 'Now' },
    { id: 2, name: 'Ochije Nnani',   email: 'ochije@obana.africa', role: 'Admin', status: 'active', lastSeen: '2 hours ago' },
    { id: 3, name: 'Amaka Obi',      email: 'amaka@obana.africa',  role: 'Staff', status: 'active', lastSeen: 'Yesterday' },
    { id: 4, name: 'Emeka Dike',     email: 'emeka@obana.africa',  role: 'Staff', status: 'invited', lastSeen: 'Never' },
  ])

  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Staff')

  return (
    <>
      <Section title="Team members" subtitle="Manage who has access to your admin">
        <div className={styles.userListHeader}>
          <span>{users.length} members</span>
          <button className={styles.inviteBtn} onClick={() => setShowInvite(true)}>
            + Invite member
          </button>
        </div>

        {showInvite && (
          <div className={styles.inviteForm}>
            <h4 className={styles.inviteTitle}>Invite team member</h4>
            <Field label="Email address">
              <Input value={inviteEmail} onChange={setInviteEmail} type="email" placeholder="colleague@company.com" />
            </Field>
            <Field label="Role">
              <Select value={inviteRole} onChange={setInviteRole} options={['Admin', 'Staff', 'View only']} />
            </Field>
            <div className={styles.inviteActions}>
              <button className={styles.discardBtn} onClick={() => setShowInvite(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={() => {
                setUsers(u => [...u, { id: Date.now(), name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, status: 'invited', lastSeen: 'Never' }])
                setShowInvite(false)
                setInviteEmail('')
              }}>Send invite</button>
            </div>
          </div>
        )}

        <div className={styles.userList}>
          {users.map(u => (
            <div key={u.id} className={styles.userRow}>
              <div className={styles.userAvatar}>{u.name[0]}</div>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{u.name}</p>
                <p className={styles.userEmail}>{u.email}</p>
              </div>
              <Badge color={u.status === 'active' ? 'green' : 'yellow'}>{u.status === 'active' ? 'Active' : 'Invited'}</Badge>
              <span className={styles.userRole}>{u.role}</span>
              <span className={styles.userSeen}>{u.lastSeen}</span>
              {u.role !== 'Owner' && (
                <button className={styles.userRemoveBtn} onClick={() => setUsers(prev => prev.filter(x => x.id !== u.id))}>
                  <Ic d="M18 6L6 18M6 6l12 12" size={14} stroke="#EF4444" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Permissions by role">
        <div className={styles.permTable}>
          <div className={styles.permHeader}>
            <span>Permission</span><span>Owner</span><span>Admin</span><span>Staff</span><span>View only</span>
          </div>
          {[
            { label: 'View dashboard',       owner: true, admin: true,  staff: true,  view: true  },
            { label: 'Manage orders',        owner: true, admin: true,  staff: true,  view: false },
            { label: 'Manage products',      owner: true, admin: true,  staff: true,  view: false },
            { label: 'Manage customers',     owner: true, admin: true,  staff: false, view: false },
            { label: 'View reports',         owner: true, admin: true,  staff: false, view: true  },
            { label: 'Manage settings',      owner: true, admin: true,  staff: false, view: false },
            { label: 'Manage users',         owner: true, admin: false, staff: false, view: false },
            { label: 'Billing & plan',       owner: true, admin: false, staff: false, view: false },
          ].map(p => (
            <div key={p.label} className={styles.permRow}>
              <span>{p.label}</span>
              {['owner','admin','staff','view'].map(role => (
                <span key={role} className={p[role] ? styles.permYes : styles.permNo}>
                  {p[role]
                    ? <Ic d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" size={14} stroke="#2DBD97" />
                    : <Ic d="M18 6L6 18M6 6l12 12" size={14} stroke="#E5E7EB" />
                  }
                </span>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

/* ── Payments ───────────────────────────────────────────────────── */
function PanelPayments() {
  const [gateways, setGateways] = useState({
    paystack: { enabled: true, publicKey: 'pk_live_xxxx', secretKey: '' },
    flutterwave: { enabled: false, publicKey: '', secretKey: '' },
    cash: { enabled: true },
    transfer: { enabled: true },
    mobileMoney: { enabled: true },
  })

  return (
    <>
      <Section title="Payment gateways" subtitle="Configure how customers pay at checkout">
        {[
          { id: 'paystack', name: 'Paystack', icon: '💳', desc: 'Card, bank transfer, USSD — Nigeria & Africa' },
          { id: 'flutterwave', name: 'Flutterwave', icon: '🌊', desc: 'Pan-African payments, 150+ currencies' },
        ].map(gw => (
          <div key={gw.id} className={styles.gatewayCard}>
            <div className={styles.gatewayHead}>
              <span className={styles.gatewayIcon}>{gw.icon}</span>
              <div className={styles.gatewayInfo}>
                <p className={styles.gatewayName}>{gw.name}</p>
                <p className={styles.gatewaySub}>{gw.desc}</p>
              </div>
              <Toggle value={gateways[gw.id].enabled}
                onChange={v => setGateways(g => ({ ...g, [gw.id]: { ...g[gw.id], enabled: v } }))} />
            </div>
            {gateways[gw.id].enabled && (
              <div className={styles.gatewayFields}>
                <Field label="Public Key">
                  <Input value={gateways[gw.id].publicKey}
                    onChange={v => setGateways(g => ({ ...g, [gw.id]: { ...g[gw.id], publicKey: v } }))}
                    placeholder={gw.id === 'paystack' ? 'pk_live_…' : 'FLWPUBK-…'} />
                </Field>
                <Field label="Secret Key">
                  <Input value={gateways[gw.id].secretKey}
                    onChange={v => setGateways(g => ({ ...g, [gw.id]: { ...g[gw.id], secretKey: v } }))}
                    type="password" placeholder={gw.id === 'paystack' ? 'sk_live_…' : 'FLWSECK-…'} />
                </Field>
                <button className={styles.saveBtn}>Save {gw.name}</button>
              </div>
            )}
          </div>
        ))}
      </Section>

      <Section title="Manual payment methods">
        {[
          { id: 'cash', label: 'Cash on Delivery', icon: '💵', desc: 'Customer pays cash when order is delivered' },
          { id: 'transfer', label: 'Bank Transfer', icon: '🏦', desc: 'Customer transfers to your bank account' },
          { id: 'mobileMoney', label: 'Mobile Money', icon: '📱', desc: 'Wallets: OPay, Palmpay, Kuda, etc.' },
        ].map(m => (
          <div key={m.id} className={styles.manualMethod}>
            <span className={styles.gatewayIcon}>{m.icon}</span>
            <div style={{ flex: 1 }}>
              <p className={styles.gatewayName}>{m.label}</p>
              <p className={styles.gatewaySub}>{m.desc}</p>
            </div>
            <Toggle value={gateways[m.id]?.enabled}
              onChange={v => setGateways(g => ({ ...g, [m.id]: { enabled: v } }))} />
          </div>
        ))}
      </Section>
    </>
  )
}

/* ── Notifications ──────────────────────────────────────────────── */
function PanelNotifications() {
  const [notifs, setNotifs] = useState({
    newOrder: true, orderFulfilled: true, orderCancelled: true,
    lowStock: true, newCustomer: false, paymentFailed: true,
    refundRequested: true, reviewPosted: false,
    emailNewOrder: true, smsNewOrder: false,
    emailMarketing: true,
  })
  const toggle = k => setNotifs(n => ({ ...n, [k]: !n[k] }))

  return (
    <>
      <Section title="Admin notifications" subtitle="Choose which events trigger admin alerts">
        {[
          { key: 'newOrder',        label: 'New order placed',          desc: 'Alert when a customer places an order' },
          { key: 'orderFulfilled',  label: 'Order fulfilled',           desc: 'Alert when an order is shipped' },
          { key: 'orderCancelled',  label: 'Order cancelled',           desc: 'Alert when an order is cancelled' },
          { key: 'lowStock',        label: 'Low stock alert',           desc: 'When product stock falls below 5 units' },
          { key: 'newCustomer',     label: 'New customer registered',   desc: 'Alert on every new account creation' },
          { key: 'paymentFailed',   label: 'Payment failed',            desc: 'When a payment attempt fails' },
          { key: 'refundRequested', label: 'Refund requested',          desc: 'When a customer requests a refund' },
          { key: 'reviewPosted',    label: 'New product review',        desc: 'Alert when a product review is submitted' },
        ].map(n => (
          <div key={n.key} className={styles.notifRow}>
            <div>
              <p className={styles.notifLabel}>{n.label}</p>
              <p className={styles.notifDesc}>{n.desc}</p>
            </div>
            <Toggle value={notifs[n.key]} onChange={() => toggle(n.key)} />
          </div>
        ))}
      </Section>

      <Section title="Notification channels">
        <div className={styles.notifRow}>
          <div>
            <p className={styles.notifLabel}>Email — new orders</p>
            <p className={styles.notifDesc}>Receive order emails at your store contact address</p>
          </div>
          <Toggle value={notifs.emailNewOrder} onChange={() => toggle('emailNewOrder')} />
        </div>
        <div className={styles.notifRow}>
          <div>
            <p className={styles.notifLabel}>SMS — new orders</p>
            <p className={styles.notifDesc}>Receive SMS alerts for new orders (carrier charges apply)</p>
          </div>
          <Toggle value={notifs.smsNewOrder} onChange={() => toggle('smsNewOrder')} />
        </div>
        <div className={styles.notifRow}>
          <div>
            <p className={styles.notifLabel}>Marketing emails</p>
            <p className={styles.notifDesc}>Receive product updates, tips and offers from Taja</p>
          </div>
          <Toggle value={notifs.emailMarketing} onChange={() => toggle('emailMarketing')} />
        </div>
      </Section>
    </>
  )
}

/* ── Security ───────────────────────────────────────────────────── */
function PanelSecurity() {
  const [twoFA, setTwoFA] = useState(false)
  const [sessions] = useState([
    { id: 1, device: 'Chrome on macOS', location: 'Lagos, Nigeria', time: 'Active now', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Lagos, Nigeria', time: '3 hours ago' },
    { id: 3, device: 'Chrome on Windows', location: 'Abuja, Nigeria', time: '2 days ago' },
  ])

  return (
    <>
      <Section title="Password" subtitle="Change your admin account password">
        <Field label="Current password">
          <Input type="password" placeholder="Enter current password" />
        </Field>
        <Field label="New password">
          <Input type="password" placeholder="At least 8 characters" />
        </Field>
        <Field label="Confirm new password">
          <Input type="password" placeholder="Repeat new password" />
        </Field>
        <button className={styles.saveBtn}>Update password</button>
      </Section>

      <Section title="Two-factor authentication" subtitle="Add an extra layer of security to your account">
        <div className={styles.twoFARow}>
          <div>
            <p className={styles.notifLabel}>Authenticator app</p>
            <p className={styles.notifDesc}>Use an app like Google Authenticator or Authy</p>
          </div>
          <Toggle value={twoFA} onChange={setTwoFA} />
        </div>
        {twoFA && (
          <div className={styles.twoFASetup}>
            <p className={styles.twoFAHint}>Scan this QR code with your authenticator app, then enter the 6-digit code to verify.</p>
            <div className={styles.qrPlaceholder}>QR Code</div>
            <Field label="Verification code">
              <Input placeholder="000000" />
            </Field>
            <button className={styles.saveBtn}>Enable 2FA</button>
          </div>
        )}
      </Section>

      <Section title="Active sessions" subtitle="All devices currently signed in to your account">
        {sessions.map(s => (
          <div key={s.id} className={styles.sessionRow}>
            <div className={styles.sessionIcon}>
              <Ic d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" size={16} stroke="#1b3b5f" />
            </div>
            <div className={styles.sessionInfo}>
              <p className={styles.sessionDevice}>{s.device} {s.current && <Badge color="green">Current</Badge>}</p>
              <p className={styles.sessionMeta}>{s.location} · {s.time}</p>
            </div>
            {!s.current && (
              <button className={styles.revokeBtn}>Revoke</button>
            )}
          </div>
        ))}
        <button className={styles.cancelPlanBtn}>Sign out all other sessions</button>
      </Section>
    </>
  )
}

/* ── Policies ───────────────────────────────────────────────────── */
function PanelPolicies() {
  const [policies, setPolicies] = useState({
    refund: 'We offer a 7-day return policy on all items in their original condition. To initiate a return, contact us at support@obana.africa with your order number.',
    privacy: 'We collect your name, email, and order information to process your purchases. We do not sell your data to third parties.',
    terms: 'By placing an order with us, you agree to our terms of service. All prices are in Nigerian Naira (₦) and include VAT.',
    shipping: 'Standard delivery takes 2–5 business days across Nigeria. Lagos orders may be delivered in 24 hours. Free shipping on orders above ₦20,000.',
  })

  return (
    <>
      {[
        { key: 'refund',  title: 'Refund policy',   desc: 'Displayed on checkout and product pages' },
        { key: 'privacy', title: 'Privacy policy',  desc: 'Required by law — shown in footer' },
        { key: 'terms',   title: 'Terms of service',desc: 'Customers agree to this at checkout' },
        { key: 'shipping',title: 'Shipping policy', desc: 'Explains delivery times and costs' },
      ].map(p => (
        <Section key={p.key} title={p.title} subtitle={p.desc}>
          <textarea
            className={styles.policyTextarea}
            value={policies[p.key]}
            onChange={e => setPolicies(prev => ({ ...prev, [p.key]: e.target.value }))}
            rows={6}
          />
          <button className={styles.saveBtn} style={{ marginTop: 8 }}>Save {p.title.toLowerCase()}</button>
        </Section>
      ))}
    </>
  )
}

/* ── Shipping ───────────────────────────────────────────────────── */
function PanelShipping() {
  const [zones, setZones] = useState([
    { id: 1, name: 'Lagos',       states: ['Lagos'],                    rate: 1500, freeAbove: 20000 },
    { id: 2, name: 'South West',  states: ['Ogun','Oyo','Osun','Ondo'], rate: 2500, freeAbove: 25000 },
    { id: 3, name: 'Rest of Nigeria', states: ['All other states'],     rate: 3500, freeAbove: 30000 },
  ])

  return (
    <>
      <Section title="Shipping zones" subtitle="Set delivery rates per region">
        {zones.map(z => (
          <div key={z.id} className={styles.shippingZone}>
            <div className={styles.shippingZoneHead}>
              <p className={styles.shippingZoneName}>{z.name}</p>
              <span className={styles.shippingZoneStates}>{z.states.join(', ')}</span>
            </div>
            <div className={styles.shippingZoneRates}>
              <Field label="Flat rate (₦)">
                <Input type="number" value={z.rate}
                  onChange={v => setZones(prev => prev.map(x => x.id === z.id ? { ...x, rate: +v } : x))} />
              </Field>
              <Field label="Free shipping above (₦)">
                <Input type="number" value={z.freeAbove}
                  onChange={v => setZones(prev => prev.map(x => x.id === z.id ? { ...x, freeAbove: +v } : x))} />
              </Field>
            </div>
          </div>
        ))}
        <button className={styles.addPaymentBtn}>+ Add shipping zone</button>
        <button className={styles.saveBtn}>Save shipping settings</button>
      </Section>

      <Section title="Pickup locations">
        <Card onClick={() => {}} chevron>
          <div className={styles.cardIcon}><Ic d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" size={16} stroke="#1b3b5f" /></div>
          <div>
            <p className={styles.cardTitle}>77 Opebi Road, Ikeja</p>
            <p className={styles.cardSub}>Lagos, Nigeria · Pick up available</p>
          </div>
        </Card>
        <button className={styles.addPaymentBtn}>+ Add pickup location</button>
      </Section>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN ADMIN SETTINGS
   ════════════════════════════════════════════════════════════════ */
const PANELS = {
  general:       PanelGeneral,
  plan:          PanelPlan,
  billing:       PanelBilling,
  users:         PanelUsers,
  payments:      PanelPayments,
  checkout:      () => <Section title="Checkout settings" subtitle="Coming soon"><p className={styles.comingSoon}>Checkout customisation will be available in the next release.</p></Section>,
  shipping:      PanelShipping,
  taxes:         () => <Section title="Taxes & Duties" subtitle="Coming soon"><p className={styles.comingSoon}>Tax configuration will be available in the next release.</p></Section>,
  locations:     () => <Section title="Locations" subtitle="Coming soon"><p className={styles.comingSoon}>Multi-location management will be available in the next release.</p></Section>,
  notifications: PanelNotifications,
  security:      PanelSecurity,
  policies:      PanelPolicies,
}

export default function AdminSettings() {
  const [active, setActive] = useState('general')
  const contentRef = useRef(null)

  const ActivePanel = PANELS[active] || PanelGeneral

  const handleNav = (id) => {
    setActive(id)
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button className={styles.backBtn} onClick={() => window.history.back()}>
            <Ic d="M19 12H5M12 5l-7 7 7 7" size={16} />
          </button>
          <h1 className={styles.pageTitle}>Settings</h1>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.storeName}>My store</span>
          <div className={styles.topbarAvatar}></div>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar nav */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarInner}>
            <div className={styles.storeInfo}>
              <div className={styles.storeAvatar}>T</div>
              <div>
                <p className={styles.storeSidebarName}>My store</p>
                <p className={styles.storeSidebarUrl}>Mystore.ng</p>
              </div>
            </div>

            <nav className={styles.nav}>
              {NAV.map(item => (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${active === item.id ? styles.navItemActive : ''}`}
                  onClick={() => handleNav(item.id)}>
                  <Ic d={item.icon} size={15} stroke={active === item.id ? '#2DBD97' : '#6B7280'} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.content} ref={contentRef}>
          <div className={styles.contentInner}>
            <ActivePanel />
          </div>
        </main>
      </div>
    </div>
  )
}
