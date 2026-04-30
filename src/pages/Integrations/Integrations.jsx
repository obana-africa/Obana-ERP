/**
 * Integrations.jsx
 * Full integrations hub for Online Store + POS system
 * Route: /integrations
 *
 * Color palette: Navy #1b3b5f · Green #2DBD97 · Gold #E8C547
 */

import { useState, useEffect } from 'react'
import styles from './Integrations.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Data ────────────────────────────────────────────────────────── */
const CATEGORIES = ['All', 'Payments', 'Shipping', 'Accounting', 'Marketing', 'CRM', 'Inventory', 'POS Hardware']

const INTEGRATIONS = [
  /* ── Payments ── */
  {
    id: 'obana', name: 'Obana', category: 'Payments',
    logo: '💳', color: '#00C2FF', bgColor: '#E8F9FF',
    desc: 'Accept card, bank transfer, USSD and mobile money payments across Nigeria and Africa.',
    status: 'connect', since: 'Mar 2026',
    stats: { label: 'Processed', value: '₦2.4M' },
    tags: ['Card', 'Bank Transfer', 'USSD', 'Mobile Money'],
    popular: true,
    fields: [
      { key: 'publicKey', label: 'Public Key', placeholder: 'pk_live_xxxxxxxx', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'zohoCrm', name: 'Zoho CRM', category: 'Payments',
    logo: '💳', color: '#00C2FF', bgColor: '#E8F9FF',
    desc: 'Accept card, bank transfer, USSD and mobile money payments across Nigeria and Africa.',
    status: 'popular', since: 'Mar 2026',
    stats: { label: 'Processed', value: '₦2.4M' },
    tags: ['Card', 'Bank Transfer', 'USSD', 'Mobile Money'],
    popular: true,
    fields: [
      { key: 'publicKey', label: 'Public Key', placeholder: 'pk_live_xxxxxxxx', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'paystack', name: 'Paystack', category: 'Payments',
    logo: '💳', color: '#00C2FF', bgColor: '#E8F9FF',
    desc: 'Accept card, bank transfer, USSD and mobile money payments across Nigeria and Africa.',
    status: 'connected', since: 'Mar 2026',
    stats: { label: 'Processed', value: '₦2.4M' },
    tags: ['Card', 'Bank Transfer', 'USSD', 'Mobile Money'],
    popular: true,
    fields: [
      { key: 'publicKey', label: 'Public Key', placeholder: 'pk_live_xxxxxxxx', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'flutterwave', name: 'Flutterwave', category: 'Payments',
    logo: '🌊', color: '#F5A623', bgColor: '#FEF6E8',
    desc: 'Pan-African payment gateway supporting 150+ currencies across 9+ African countries.',
    status: 'available',
    stats: { label: 'Countries', value: '9+' },
    tags: ['Card', 'Mobile Money', 'Bank Transfer'],
    popular: true,
    fields: [
      { key: 'publicKey', label: 'Public Key', placeholder: 'FLWPUBK-xxxxxxxx', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'FLWSECK-xxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'stripe', name: 'Stripe', category: 'Payments',
    logo: '⚡', color: '#635BFF', bgColor: '#F0EFFF',
    desc: 'Global payment infrastructure for international customers paying in USD, EUR, GBP and more.',
    status: 'available',
    stats: { label: 'Currencies', value: '135+' },
    tags: ['International', 'Card', 'Wallets'],
    fields: [
      { key: 'publicKey', label: 'Publishable Key', placeholder: 'pk_live_xxxxxxxx', type: 'text' },
      { key: 'secretKey', label: 'Secret Key', placeholder: 'sk_live_xxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'opay', name: 'OPay', category: 'Payments',
    logo: '📱', color: '#1AAD19', bgColor: '#EAFAEA',
    desc: 'Nigeria\'s leading mobile wallet with 30M+ users. Accept OPay wallet payments instantly.',
    status: 'available',
    stats: { label: 'Users', value: '30M+' },
    tags: ['Wallet', 'USSD', 'QR Code'],
    fields: [
      { key: 'merchantId', label: 'Merchant ID', placeholder: 'OPY-xxxxxxxx', type: 'text' },
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
  },

  /* ── Shipping ── */
  {
    id: 'dhl', name: 'DHL Express', category: 'Shipping',
    logo: '✈️', color: '#FFCC00', bgColor: '#FFFBE6',
    desc: 'Global express shipping to 220+ countries. Automated label printing and tracking.',
    status: 'connected', since: 'Jan 2026',
    stats: { label: 'Shipped', value: '142 orders' },
    tags: ['International', 'Express', 'Tracking'],
    fields: [
      { key: 'accountNumber', label: 'Account Number', placeholder: '123456789', type: 'text' },
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'gig', name: 'GIG Logistics', category: 'Shipping',
    logo: '🚚', color: '#E63946', bgColor: '#FEF0F1',
    desc: 'Nigeria\'s largest logistics network with same-day delivery in Lagos and next-day nationwide.',
    status: 'available',
    stats: { label: 'Locations', value: '200+' },
    tags: ['Same-day', 'Nationwide', 'Nigeria'],
    popular: true,
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'GIG-xxxxxxxxxxxxxxxx', type: 'password' },
    ],
  },
  {
    id: 'sendbox', name: 'Sendbox', category: 'Shipping',
    logo: '📦', color: '#2DBD97', bgColor: '#E6F7F2',
    desc: 'Smart logistics aggregator. Compare and book from multiple couriers in one place.',
    status: 'available',
    stats: { label: 'Couriers', value: '12+' },
    tags: ['Aggregator', 'Price Compare', 'Nigeria'],
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'SBX-xxxxxxxxxxxxxxxx', type: 'password' },
    ],
  },

  /* ── Accounting ── */
  {
    id: 'zoho', name: 'Zoho Books', category: 'Accounting',
    logo: '📒', color: '#E8441C', bgColor: '#FEF0EC',
    desc: 'Sync orders, invoices and expenses automatically. Full accounting reconciliation.',
    status: 'connected', since: 'Feb 2026',
    stats: { label: 'Synced', value: '847 records' },
    tags: ['Invoicing', 'Expenses', 'Tax'],
    popular: true,
    fields: [
      { key: 'clientId', label: 'Client ID', placeholder: 'xxxxxxxxxxxxxxxx', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
      { key: 'orgId', label: 'Organisation ID', placeholder: 'xxxxxxxxxxxxxxxx', type: 'text' },
    ],
  },
  {
    id: 'quickbooks', name: 'QuickBooks', category: 'Accounting',
    logo: '📊', color: '#2CA01C', bgColor: '#EAFAE8',
    desc: 'Auto-sync sales, refunds and payouts to QuickBooks Online for seamless bookkeeping.',
    status: 'available',
    stats: { label: 'Users', value: '7M+' },
    tags: ['Bookkeeping', 'Tax', 'Payroll'],
    fields: [
      { key: 'clientId', label: 'Client ID', placeholder: 'xxxxxxxxxxxxxxxx', type: 'text' },
      { key: 'clientSecret', label: 'Client Secret', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
  },

  /* ── Marketing ── */
  {
    id: 'mailchimp', name: 'Mailchimp', category: 'Marketing',
    logo: '🐒', color: '#FFE01B', bgColor: '#FFFDE6',
    desc: 'Sync customer lists and trigger automated email campaigns based on purchase behaviour.',
    status: 'available',
    stats: { label: 'Subscribers', value: 'Unlimited' },
    tags: ['Email', 'Automation', 'Lists'],
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxx-us1', type: 'password' },
      { key: 'listId', label: 'Audience ID', placeholder: 'xxxxxxxxxxxxxxxx', type: 'text' },
    ],
  },
  {
    id: 'meta', name: 'Meta Ads', category: 'Marketing',
    logo: '👁', color: '#1877F2', bgColor: '#EBF3FE',
    desc: 'Connect your product catalog to Facebook and Instagram Shops. Run dynamic retargeting ads.',
    status: 'available',
    stats: { label: 'Reach', value: '3B+ users' },
    tags: ['Facebook', 'Instagram', 'Catalog'],
    popular: true,
    fields: [
      { key: 'accessToken', label: 'Access Token', placeholder: 'EAAxxxxxxxxxxxxxxxx', type: 'password' },
      { key: 'pixelId', label: 'Pixel ID', placeholder: '1234567890', type: 'text' },
    ],
  },
  {
    id: 'google', name: 'Google Shopping', category: 'Marketing',
    logo: '🔍', color: '#4285F4', bgColor: '#EBF2FF',
    desc: 'List your products on Google Search and Shopping. Drive high-intent organic traffic.',
    status: 'available',
    stats: { label: 'Daily searches', value: '8.5B' },
    tags: ['Search', 'Shopping', 'Ads'],
    fields: [
      { key: 'merchantId', label: 'Merchant Center ID', placeholder: '123456789', type: 'text' },
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
    ],
  },

  /* ── CRM ── */
  {
    id: 'hubspot', name: 'HubSpot CRM', category: 'CRM',
    logo: '🔶', color: '#FF7A59', bgColor: '#FFF0EB',
    desc: 'Sync customers, deals and purchase history. Full sales pipeline and contact management.',
    status: 'available',
    stats: { label: 'Free tier', value: 'Yes' },
    tags: ['Contacts', 'Pipeline', 'Free'],
    fields: [
      { key: 'apiKey', label: 'Private App Token', placeholder: 'pat-xxxxxxxx-xxxxxxxx', type: 'password' },
    ],
  },

  /* ── Inventory ── */
  {
    id: 'cin7', name: 'Cin7', category: 'Inventory',
    logo: '🏭', color: '#1b3b5f', bgColor: '#E8EEF5',
    desc: 'Advanced inventory and warehouse management. Multi-location stock sync in real time.',
    status: 'available',
    stats: { label: 'SKUs', value: 'Unlimited' },
    tags: ['Warehouse', 'Multi-location', 'B2B'],
    fields: [
      { key: 'apiKey', label: 'API Key', placeholder: 'xxxxxxxxxxxxxxxx', type: 'password' },
      { key: 'accountId', label: 'Account ID', placeholder: 'xxxxxxxxxxxxxxxx', type: 'text' },
    ],
  },

  /* ── POS Hardware ── */
  {
    id: 'sunmi', name: 'Sunmi POS', category: 'POS Hardware',
    logo: '🖥', color: '#1b3b5f', bgColor: '#E8EEF5',
    desc: 'Smart POS terminals with built-in printer. Supports Android apps and NFC payments.',
    status: 'connected', since: 'Apr 2026',
    stats: { label: 'Terminals', value: '3 active' },
    tags: ['Terminal', 'Printer', 'Android'],
    fields: [
      { key: 'deviceId', label: 'Device ID', placeholder: 'SUNMI-xxxxxxxx', type: 'text' },
    ],
  },
  {
    id: 'epson', name: 'Epson Printer', category: 'POS Hardware',
    logo: '🖨', color: '#00479D', bgColor: '#E8EFFA',
    desc: 'Thermal receipt printers with USB, Bluetooth and network connectivity.',
    status: 'available',
    stats: { label: 'Speed', value: '300mm/s' },
    tags: ['Receipt', 'Thermal', 'Bluetooth'],
    fields: [
      { key: 'ipAddress', label: 'IP Address / Port', placeholder: '192.168.1.100:9100', type: 'text' },
    ],
  },
]

/* ── Connection modal ────────────────────────────────────────────── */
function ConnectModal({ integration, onClose, onConnect }) {
  const [form, setForm] = useState({})
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)
  const [error, setError] = useState('')
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleTest = async () => {
    setTesting(true)
    setError('')
    await new Promise(r => setTimeout(r, 1400))
    const allFilled = integration.fields.every(f => form[f.key]?.trim())
    if (!allFilled) {
      setError('Please fill in all required fields before testing.')
      setTesting(false)
      return
    }
    setTested(true)
    setTesting(false)
  }

  const handleConnect = () => {
    onConnect(integration.id)
    onClose()
  }

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHead}>
          <div className={styles.modalLogo} style={{ background: integration.bgColor }}>
            <span style={{ fontSize: 28 }}>{integration.logo}</span>
          </div>
          <div>
            <h2 className={styles.modalTitle}>Connect {integration.name}</h2>
            <p className={styles.modalSub}>{integration.desc}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalFields}>
            {integration.fields.map(f => (
              <div key={f.key} className={styles.modalField}>
                <label className={styles.modalLabel}>{f.label}</label>
                <input
                  className={styles.modalInput}
                  type={f.type}
                  value={form[f.key] || ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  autoComplete="off"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className={styles.modalError}>
              <Ic d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" size={14} stroke="#EF4444" />
              {error}
            </div>
          )}

          {tested && !error && (
            <div className={styles.modalSuccess}>
              <Ic d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" size={14} stroke="#2DBD97" />
              Connection successful! Ready to connect.
            </div>
          )}

          <div className={styles.modalActions}>
            <button className={styles.modalCancelBtn} onClick={onClose}>Cancel</button>
            <button className={styles.modalTestBtn} onClick={handleTest} disabled={testing}>
              {testing ? (
                <><span className={styles.spinner} /> Testing…</>
              ) : 'Test Connection'}
            </button>
            <button className={styles.modalConnectBtn} onClick={handleConnect} disabled={!tested}>
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Integration card ────────────────────────────────────────────── */
function IntegrationCard({ integration, onConnect, onDisconnect, onConfigure }) {
  const connected = integration.status === 'connected'

  return (
    <div className={`${styles.card} ${connected ? styles.cardConnected : ''}`}>
      {integration.popular && !connected && (
        <span className={styles.popularBadge}>Popular</span>
      )}
      {connected && (
        <span className={styles.connectedBadge}>
          <span className={styles.connectedDot} />
          Connected
        </span>
      )}

      <div className={styles.cardTop}>
        <div className={styles.cardLogo} style={{ background: integration.bgColor }}>
          <span style={{ fontSize: 26 }}>{integration.logo}</span>
        </div>
        <div className={styles.cardInfo}>
          <h3 className={styles.cardName}>{integration.name}</h3>
          <span className={styles.cardCategory}>{integration.category}</span>
        </div>
      </div>

      <p className={styles.cardDesc}>{integration.desc}</p>

      <div className={styles.cardTags}>
        {integration.tags.map(t => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>

      {connected && integration.stats && (
        <div className={styles.cardStat}>
          <span className={styles.cardStatLabel}>{integration.stats.label}</span>
          <span className={styles.cardStatValue}>{integration.stats.value}</span>
          {integration.since && <span className={styles.cardSince}>since {integration.since}</span>}
        </div>
      )}

      <div className={styles.cardActions}>
        {connected ? (
          <>
            <button className={styles.configureBtn} onClick={() => onConfigure(integration)}>
              <Ic d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" size={13} />
              Configure
            </button>
            <button className={styles.disconnectBtn} onClick={() => onDisconnect(integration.id)}>
              Disconnect
            </button>
          </>
        ) : (
          <button className={styles.connectBtn} onClick={() => onConnect(integration)}>
            <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={13} />
            Connect
          </button>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   MAIN INTEGRATIONS PAGE
   ════════════════════════════════════════════════════════════════ */
export default function Integrations() {
  const [data, setData] = useState(INTEGRATIONS)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // all | connected | available
  const [modal, setModal] = useState(null)    // integration object
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const connected = data.filter(i => i.status === 'connected')
  const available = data.filter(i => i.status === 'available')

  const filtered = data.filter(i => {
    const matchCat    = category === 'All' || i.category === category
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
                        i.desc.toLowerCase().includes(search.toLowerCase()) ||
                        i.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    const matchFilter = filter === 'all' ? true : i.status === filter
    return matchCat && matchSearch && matchFilter
  })

  const handleConnect = (id) => {
    setData(prev => prev.map(i => i.id === id
      ? { ...i, status: 'connected', since: 'Apr 2026' } : i))
  }

  const handleDisconnect = (id) => {
    setData(prev => prev.map(i => i.id === id
      ? { ...i, status: 'available', since: undefined } : i))
  }

  return (
    <div className={`${styles.page} ${visible ? styles.pageVisible : ''}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Integrations</h1>
          <p className={styles.subtitle}>Connect your store and POS to the tools that power your business</p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>{connected.length}</span>
            <span className={styles.headerStatLabel}>Connected</span>
          </div>
          <div className={styles.headerStatDivider} />
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>{available.length}</span>
            <span className={styles.headerStatLabel}>Available</span>
          </div>
          <div className={styles.headerStatDivider} />
          <div className={styles.headerStat}>
            <span className={styles.headerStatValue}>{data.length}</span>
            <span className={styles.headerStatLabel}>Total</span>
          </div>
        </div>
      </div>

      {/* ── Connected summary bar ───────────────────────────────── */}
      {connected.length > 0 && (
        <div className={styles.connectedBar}>
          <div className={styles.connectedBarLeft}>
            <div className={styles.connectedPulse} />
            <span className={styles.connectedBarLabel}>{connected.length} active integration{connected.length > 1 ? 's' : ''}</span>
          </div>
          <div className={styles.connectedLogos}>
            {connected.map(i => (
              <div key={i.id} className={styles.connectedLogoChip}
                style={{ background: i.bgColor }} title={i.name}>
                {i.logo}
              </div>
            ))}
          </div>
          <button className={styles.viewConnectedBtn}
            onClick={() => setFilter(filter === 'connected' ? 'all' : 'connected')}>
            {filter === 'connected' ? 'Show all' : 'View connected →'}
          </button>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={15} stroke="#9CA3AF" />
          <input
            className={styles.searchInput}
            placeholder="Search integrations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.searchClear} onClick={() => setSearch('')}>
              <Ic d="M18 6L6 18M6 6l12 12" size={13} stroke="#9CA3AF" />
            </button>
          )}
        </div>

        <div className={styles.filterTabs}>
          {['all', 'connected', 'available'].map(f => (
            <button key={f}
              className={`${styles.filterTab} ${filter === f ? styles.filterTabOn : ''}`}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'connected' ? `Connected (${connected.length})` : `Available (${available.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* ── Category pills ──────────────────────────────────────── */}
      <div className={styles.categories}>
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`${styles.catPill} ${category === cat ? styles.catPillOn : ''}`}
            onClick={() => setCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* ── Empty state ─────────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className={styles.empty}>
          <span style={{ fontSize: 48 }}>🔌</span>
          <p className={styles.emptyTitle}>No integrations found</p>
          <p className={styles.emptySub}>Try a different search term or category</p>
          <button className={styles.emptyReset} onClick={() => { setSearch(''); setCategory('All'); setFilter('all') }}>
            Reset filters
          </button>
        </div>
      )}

      {/* ── Grid ────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <div className={styles.grid}>
          {filtered.map((integration, i) => (
            <div key={integration.id} style={{ animationDelay: `${i * 40}ms` }} className={styles.cardWrap}>
              <IntegrationCard
                integration={integration}
                onConnect={setModal}
                onDisconnect={handleDisconnect}
                onConfigure={setModal}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Request section ─────────────────────────────────────── */}
      <div className={styles.requestSection}>
        <div className={styles.requestLeft}>
          <p className={styles.requestTitle}>Don't see what you need?</p>
          <p className={styles.requestSub}>We add new integrations every month. Request a specific tool and our team will prioritize it.</p>
        </div>
        <button className={styles.requestBtn}>
          <Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />
          Request Integration
        </button>
      </div>

      {/* ── Modal ───────────────────────────────────────────────── */}
      {modal && (
        <ConnectModal
          integration={modal}
          onClose={() => setModal(null)}
          onConnect={handleConnect}
        />
      )}
    </div>
  )
}
