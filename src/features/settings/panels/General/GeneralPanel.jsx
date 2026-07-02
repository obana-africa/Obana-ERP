import { useSettingsResource } from '../../hooks/useSettingsResource'
import { Section, Field, Input, Select, Card, Badge } from '../../components/Form'
import SaveBar from '../../components/SaveBar'
import PanelSkeleton from '../../components/PanelSkeleton'
import PanelError from '../../components/PanelError'
import Icon from '../../components/Icon'
import { ICONS } from '../../constants/icons'
import styles from './GeneralPanel.module.css'

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa',
  'Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger',
  'Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT',
]

const CURRENCY_OPTIONS = [
  { value: 'NGN', label: 'Nigerian Naira (NGN ₦)' },
  { value: 'USD', label: 'US Dollar (USD $)' },
  { value: 'GBP', label: 'British Pound (GBP £)' },
  { value: 'EUR', label: 'Euro (EUR €)' },
  { value: 'GHS', label: 'Ghanaian Cedi (GHS ₵)' },
  { value: 'KES', label: 'Kenyan Shilling (KES KSh)' },
]

const TIMEZONE_OPTIONS = [
  { value: 'Africa/Lagos',        label: '(GMT+01:00) West Central Africa' },
  { value: 'Africa/Accra',        label: '(GMT+00:00) Accra' },
  { value: 'Africa/Nairobi',      label: '(GMT+03:00) Nairobi' },
  { value: 'Africa/Johannesburg', label: '(GMT+02:00) Johannesburg' },
  { value: 'Europe/London',       label: '(GMT+00:00) London' },
  { value: 'America/New_York',    label: '(GMT-05:00) New York' },
]

const AUTO_FULFILL_OPTIONS = [
  { value: 'all',  label: "Automatically fulfill the order's line items" },
  { value: 'gift', label: 'Automatically fulfill only the gift cards of the order' },
  { value: 'none', label: "Don't fulfill any of the order's line items automatically" },
]

export default function GeneralPanel() {
  const s = useSettingsResource('general')

  if (s.isLoading) return <PanelSkeleton sections={5} />
  if (s.isError)   return <PanelError error={s.error} onRetry={s.refetch} />

  const { values: f, setField, isDirty, isSaving, save, discard } = s

  return (
    <div className={styles.panel}>
      <SaveBar dirty={isDirty} saving={isSaving} onSave={save} onDiscard={discard} />

      <Section title="Business details" subtitle="Used for payments, markets, and apps">
        <Card chevron onClick={() => {}}>
          <div className={styles.businessAvatar}>{(f.storeName || 'S')[0]}</div>
          <div>
            <p className={styles.cardTitle}>{f.storeName || 'Untitled store'}</p>
            <p className={styles.cardSub}>{f.country || 'Nigeria'}</p>
          </div>
        </Card>
      </Section>

      <Section title="Store contact details">
        <Field label="Store name" required>
          <Input
            value={f.storeName}
            onChange={v => setField('storeName', v)}
            placeholder="Your store name"
          />
        </Field>
        <Field label="Store contact email" hint="Customers see this email">
          <Input
            value={f.storeEmail}
            onChange={v => setField('storeEmail', v)}
            type="email"
            placeholder="store@example.com"
          />
        </Field>
        <Field label="Phone">
          <Input
            value={f.phone}
            onChange={v => setField('phone', v)}
            placeholder="+234 800 000 0000"
          />
        </Field>

        <div className={styles.addressGrid}>
          <Field label="Address">
            <Input value={f.address} onChange={v => setField('address', v)} placeholder="Street address" />
          </Field>
          <Field label="City">
            <Input value={f.city} onChange={v => setField('city', v)} placeholder="City" />
          </Field>
          <Field label="State">
            <Select value={f.state} onChange={v => setField('state', v)} options={NIGERIAN_STATES} />
          </Field>
          <Field label="ZIP / Postal code">
            <Input value={f.zip} onChange={v => setField('zip', v)} placeholder="100001" />
          </Field>
        </div>
      </Section>

      <Section title="Store defaults">
        <Field label="Currency display" row>
          <Select value={f.currency} onChange={v => setField('currency', v)} options={CURRENCY_OPTIONS} />
        </Field>
        <Field label="Unit system" row>
          <Select value={f.unitSystem} onChange={v => setField('unitSystem', v)} options={[
            { value: 'metric',   label: 'Metric system' },
            { value: 'imperial', label: 'Imperial system' },
          ]} />
        </Field>
        <Field label="Default weight unit" row>
          <Select value={f.weightUnit} onChange={v => setField('weightUnit', v)} options={[
            { value: 'kg', label: 'Kilogram (kg)' },
            { value: 'g',  label: 'Gram (g)' },
            { value: 'lb', label: 'Pound (lb)' },
            { value: 'oz', label: 'Ounce (oz)' },
          ]} />
        </Field>
        <Field label="Time zone" row>
          <Select value={f.timezone} onChange={v => setField('timezone', v)} options={TIMEZONE_OPTIONS} />
        </Field>
      </Section>

      <Section
        title="Order ID format"
        subtitle="Shown on the order page, customer pages, and customer order notifications"
      >
        <div className={styles.orderIdRow}>
          <Field label="Prefix">
            <Input value={f.orderPrefix} onChange={v => setField('orderPrefix', v)} placeholder="#" />
          </Field>
          <div className={styles.orderIdPreview}>
            <p className={styles.orderIdLabel}>Preview</p>
            <p className={styles.orderIdExample}>
              {f.orderPrefix}1001{f.orderSuffix}, {f.orderPrefix}1002{f.orderSuffix}, …
            </p>
          </div>
          <Field label="Suffix">
            <Input value={f.orderSuffix} onChange={v => setField('orderSuffix', v)} placeholder="-NG" />
          </Field>
        </div>
      </Section>

      <Section title="Order processing">
        <p className={styles.groupLabel}>After an order has been paid</p>
        {AUTO_FULFILL_OPTIONS.map(opt => (
          <label key={opt.value} className={styles.radioRow}>
            <input
              type="radio"
              name="autoFulfill"
              value={opt.value}
              checked={f.autoFulfill === opt.value}
              onChange={() => setField('autoFulfill', opt.value)}
            />
            <span>{opt.label}</span>
          </label>
        ))}

        <p className={styles.groupLabel} style={{ marginTop: 20 }}>
          After an order has been fulfilled and paid, or when all items have been refunded
        </p>
        <label className={styles.radioRow}>
          <input
            type="checkbox"
            checked={f.autoArchive}
            onChange={e => setField('autoArchive', e.target.checked)}
          />
          <span>Automatically archive the order</span>
        </label>
        {f.autoArchive && (
          <p className={styles.radioHint}>The order will be removed from your list of open orders.</p>
        )}
      </Section>

      <Section title="Store assets">
        <Card chevron onClick={() => {}}>
          <div className={styles.cardIcon}>
            <Icon d={ICONS.tag} size={16} stroke="#1b3b5f" />
          </div>
          <div>
            <p className={styles.cardTitle}>Metafields</p>
            <p className={styles.cardSub}>Available in themes and configurable for Storefront API</p>
          </div>
        </Card>
        <Card chevron onClick={() => {}}>
          <div className={styles.cardIcon}>
            <Icon d={ICONS.tag} size={16} stroke="#1b3b5f" />
          </div>
          <div>
            <p className={styles.cardTitle}>Brand</p>
            <p className={styles.cardSub}>Integrate brand assets across sales channels, themes and apps</p>
          </div>
        </Card>
      </Section>

      <Section title="Resources">
        <Card chevron onClick={() => window.open('https://docs.obana.africa/changelog', '_blank', 'noopener,noreferrer')}>
          <div className={styles.cardIcon}>
            <Icon d={ICONS.pencil} size={16} stroke="#1b3b5f" />
          </div>
          <div>
            <p className={styles.cardTitle}>Change log</p>
            <p className={styles.cardSub}>See what's new in your platform</p>
          </div>
        </Card>
        <Card chevron onClick={() => window.open('https://support.obana.africa', '_blank', 'noopener,noreferrer')}>
          <div className={styles.cardIcon}>
            <Icon d={ICONS.info} size={16} stroke="#1b3b5f" />
          </div>
          <div>
            <p className={styles.cardTitle}>Help Center</p>
            <p className={styles.cardSub}>Browse guides, FAQs and tutorials</p>
          </div>
        </Card>
        <Card chevron onClick={() => window.open('https://partners.obana.africa', '_blank', 'noopener,noreferrer')}>
          <div className={styles.cardIcon}>
            <Icon d={ICONS.users} size={16} stroke="#1b3b5f" />
          </div>
          <div>
            <p className={styles.cardTitle}>Hire a Partner</p>
            <p className={styles.cardSub}>Find a certified thaja development partner</p>
          </div>
        </Card>
        <Card chevron onClick={() => {}}>
          <div className={styles.cardIcon}>
            <Icon d={ICONS.grid} size={16} stroke="#1b3b5f" />
          </div>
          <div>
            <p className={styles.cardTitle}>Keyboard shortcuts</p>
            <p className={styles.cardSub}>Speed up your workflow with shortcuts</p>
          </div>
        </Card>
      </Section>

      <Section
        title="Transfer store"
        subtitle="Move this store into an organization or transfer to an external owner"
      >
        <div className={styles.transferRow}>
          <p className={styles.transferNote}>
            Transferring your store will reassign ownership and all associated data.
            This action cannot be undone.
          </p>
          <button type="button" className={styles.transferBtn}>Manage</button>
        </div>
      </Section>
    </div>
  )
}