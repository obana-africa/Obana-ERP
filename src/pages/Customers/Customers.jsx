import { useState, useRef } from 'react'
import styles from './Customers.module.css'

// ── Icons ────────────────────────────────────────────────
const Ico = ({ path, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {[].concat(path).map((d, i) => <path key={i} d={d} />)}
  </svg>
)

const icons = {
  users:      ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2','M23 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  user:       ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  plus:       'M12 5v14M5 12h14',
  search:     'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  filter:     ['M22 3H2l8 9.46V19l4 2v-8.54z'],
  close:      ['M18 6L6 18','M6 6l12 12'],
  edit:       ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  trash:      ['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6','M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  mail:       ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6'],
  phone:      'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z',
  map:        ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z','M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  naira:      ['M2 8h20','M2 16h20','M6 4v16','M18 4v16'],
  orders:     ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2','M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2'],
  chevDown:   'M6 9l6 6 6-6',
  chevRight:  'M9 18l6-6-6-6',
  chevLeft:   'M15 18l-6-6 6-6',
  check:      'M20 6L9 17l-5-5',
  star:       'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  tag:        ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z','M7 7h.01'],
  download:   ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  upload:     ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M17 8l-5-5-5 5','M12 3v12'],
  send:       ['M22 2L11 13','M22 2L15 22l-4-9-9-4 20-7z'],
  sms:        ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  grid:       ['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z'],
  list:       ['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  alert:      ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  calendar:   ['M3 9h18','M3 5h18','M8 3v4','M16 3v4','M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z'],
  info:       ['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 8h.01','M12 12v4'],
  refresh:    ['M1 4v6h6','M23 20v-6h-6','M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15'],
  eye:        ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  trophy:     ['M8 21h8m-4-4v4M12 17c-4 0-7-3-7-7V4h14v6c0 4-3 7-7 7z','M5 8H2m17 0h3'],
  repeat:     ['M17 1l4 4-4 4','M3 11V9a4 4 0 0 1 4-4h14','M7 23l-4-4 4-4','M21 13v2a4 4 0 0 1-4 4H3'],
}

// ── Helpers ──────────────────────────────────────────────
const fmt = (n) => `₦${Number(n || 0).toLocaleString()}`

const AVATAR_COLORS = [
  { bg: '#1a1a2e', color: '#E8C547' },
  { bg: '#2DBD97', color: '#fff' },
  { bg: '#E8C547', color: '#1a1a2e' },
  { bg: '#3B82F6', color: '#fff' },
  { bg: '#8B5CF6', color: '#fff' },
  { bg: '#EC4899', color: '#fff' },
]

const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

// ── Sample Data ──────────────────────────────────────────
const SAMPLE_CUSTOMERS = [
  {
    id: 'CUS-001', name: 'Adaeze Okonkwo', email: 'adaeze@gmail.com', phone: '+234 803 123 4567',
    address: '14 Adeola Odeku, Victoria Island, Lagos', city: 'Lagos', state: 'Lagos',
    totalOrders: 8, totalSpent: 186000, lastOrder: '2026-04-01', firstOrder: '2025-06-12',
    status: 'active', tag: 'VIP', channel: 'Website', notes: 'Prefers express delivery. Allergic to synthetic fabrics.',
    orders: [
      { id: 'ORD-1001', date: '2026-04-01', total: 52000, status: 'completed' },
      { id: 'ORD-0994', date: '2026-02-14', total: 45000, status: 'completed' },
      { id: 'ORD-0981', date: '2025-12-25', total: 38000, status: 'completed' },
    ]
  },
  {
    id: 'CUS-002', name: 'Emmanuel Bassey', email: 'emma.b@yahoo.com', phone: '+234 812 987 6543',
    address: '7 Wuse Zone 4, Abuja', city: 'Abuja', state: 'FCT',
    totalOrders: 3, totalSpent: 54000, lastOrder: '2026-04-02', firstOrder: '2025-10-05',
    status: 'active', tag: 'Regular', channel: 'Instagram', notes: '',
    orders: [
      { id: 'ORD-1002', date: '2026-04-02', total: 18000, status: 'pending' },
      { id: 'ORD-0972', date: '2025-12-01', total: 24000, status: 'completed' },
    ]
  },
  {
    id: 'CUS-003', name: 'Fatima Kabir', email: 'fatimak@hotmail.com', phone: '+234 706 234 5678',
    address: '22 Ahmadu Bello Way, Kano', city: 'Kano', state: 'Kano',
    totalOrders: 5, totalSpent: 112000, lastOrder: '2026-04-03', firstOrder: '2025-08-20',
    status: 'active', tag: 'VIP', channel: 'WhatsApp', notes: 'Bulk buyer. Give 5% discount on orders over ₦50k.',
    orders: [
      { id: 'ORD-1003', date: '2026-04-03', total: 28000, status: 'processing' },
      { id: 'ORD-0988', date: '2026-01-15', total: 56000, status: 'completed' },
    ]
  },
  {
    id: 'CUS-004', name: 'Chukwuemeka Ibe', email: 'emeka.ibe@gmail.com', phone: '+234 909 876 5432',
    address: '5 Rumuola Road, Port Harcourt', city: 'Port Harcourt', state: 'Rivers',
    totalOrders: 2, totalSpent: 46000, lastOrder: '2026-03-30', firstOrder: '2025-11-10',
    status: 'active', tag: 'New', channel: 'Website', notes: '',
    orders: [
      { id: 'ORD-1004', date: '2026-03-30', total: 24000, status: 'completed' },
      { id: 'ORD-0977', date: '2025-11-10', total: 22000, status: 'completed' },
    ]
  },
  {
    id: 'CUS-005', name: 'Ngozi Eze', email: 'ngozi.e@gmail.com', phone: '+234 803 456 7890',
    address: '19 Ogui Road, Enugu', city: 'Enugu', state: 'Enugu',
    totalOrders: 1, totalSpent: 22000, lastOrder: '2026-03-28', firstOrder: '2026-03-28',
    status: 'inactive', tag: 'New', channel: 'Website', notes: '',
    orders: [
      { id: 'ORD-1005', date: '2026-03-28', total: 22000, status: 'cancelled' },
    ]
  },
  {
    id: 'CUS-006', name: 'Bola Adesanya', email: 'bola.a@outlook.com', phone: '+234 817 654 3210',
    address: '8 Bodija Market, Ibadan', city: 'Ibadan', state: 'Oyo',
    totalOrders: 6, totalSpent: 134000, lastOrder: '2026-04-04', firstOrder: '2025-05-01',
    status: 'active', tag: 'VIP', channel: 'Facebook', notes: 'Wholesale buyer. Monthly reorder.',
    orders: [
      { id: 'ORD-1006', date: '2026-04-04', total: 45000, status: 'pending' },
    ]
  },
]

const TAG_CONFIG = {
  VIP:     { bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  Regular: { bg: '#EFF6FF', color: '#1E40AF', border: '#BFDBFE' },
  New:     { bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' },
  'At Risk':{ bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' },
}

const STATUS_CFG = {
  active:   { bg: '#ECFDF5', color: '#059669' },
  inactive: { bg: '#F3F4F6', color: '#6B7280' },
  blocked:  { bg: '#FEF2F2', color: '#DC2626' },
}

const ORDER_STATUS_CFG = {
  completed:  { bg: '#ECFDF5', color: '#059669' },
  pending:    { bg: '#FFFBEB', color: '#D97706' },
  processing: { bg: '#EFF6FF', color: '#2563EB' },
  cancelled:  { bg: '#FEF2F2', color: '#DC2626' },
}

// ── Tag Pill ─────────────────────────────────────────────
const TagPill = ({ tag }) => {
  const c = TAG_CONFIG[tag] || { bg: '#F3F4F6', color: '#374151', border: '#E5E7EB' }
  return <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.02em' }}>{tag}</span>
}

// ── Create / Edit Customer Modal ─────────────────────────
function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    city: customer?.city || '',
    state: customer?.state || '',
    channel: customer?.channel || 'Website',
    tag: customer?.tag || 'New',
    notes: customer?.notes || '',
    status: customer?.status || 'active',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const isEdit = !!customer

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{isEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
            <p className={styles.mSub}>{isEdit ? `Editing ${customer.name}` : 'Fill in customer details below'}</p>
          </div>
          <button className={styles.mClose} onClick={onClose}><Ico path={icons.close} size={18} /></button>
        </div>

        <div className={styles.mBody}>
          <div className={styles.formSection}>
            <p className={styles.formSectionTitle}>Personal Information</p>
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>Full Name <span className={styles.req}>*</span></label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Adaeze Okonkwo" />
              </div>
              <div className={styles.fg}>
                <label>Phone Number <span className={styles.req}>*</span></label>
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+234 800 000 0000" />
              </div>
            </div>
            <div className={styles.fg}>
              <label>Email Address</label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="customer@email.com" />
            </div>
          </div>

          <div className={styles.formSection}>
            <p className={styles.formSectionTitle}>Location</p>
            <div className={styles.fg}>
              <label>Delivery Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address" />
            </div>
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>City</label>
                <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="e.g. Lagos" />
              </div>
              <div className={styles.fg}>
                <label>State</label>
                <select value={form.state} onChange={e => set('state', e.target.value)}>
                  <option value="">Select state</option>
                  {['Lagos','Abuja (FCT)','Rivers','Kano','Oyo','Enugu','Kaduna','Anambra','Delta','Ogun','Imo','Kwara','Edo','Plateau','Benue','Other'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <p className={styles.formSectionTitle}>Customer Settings</p>
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>Acquisition Channel</label>
                <select value={form.channel} onChange={e => set('channel', e.target.value)}>
                  {['Website','Instagram','WhatsApp','Facebook','Twitter/X','TikTok','Referral','In-store','Phone','Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.fg}>
                <label>Customer Tag</label>
                <select value={form.tag} onChange={e => set('tag', e.target.value)}>
                  {['New','Regular','VIP','At Risk'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            {isEdit && (
              <div className={styles.fg}>
                <label>Status</label>
                <div className={styles.radioRow}>
                  {[{v:'active',l:'Active'},{v:'inactive',l:'Inactive'},{v:'blocked',l:'Blocked'}].map(s => (
                    <label key={s.v} className={styles.radioLbl}>
                      <input type="radio" name="custStatus" value={s.v} checked={form.status === s.v} onChange={() => set('status', s.v)} />
                      <span>{s.l}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <div className={styles.fg}>
              <label>Notes <span className={styles.opt}>(optional)</span></label>
              <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Add any relevant notes about this customer..." />
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnPrimary} disabled={!form.name || !form.phone}
              onClick={() => onSave({ ...form, id: customer?.id || `CUS-${Date.now()}`, totalOrders: customer?.totalOrders || 0, totalSpent: customer?.totalSpent || 0, lastOrder: customer?.lastOrder || null, firstOrder: customer?.firstOrder || new Date().toISOString().split('T')[0], orders: customer?.orders || [] })}>
              {isEdit ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Customer Detail Panel ────────────────────────────────
function CustomerDetail({ customer, onClose, onEdit, onDelete }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [note, setNote] = useState(customer.notes || '')
  const avatar = getAvatarColor(customer.name)

  return (
    <div className={styles.detailPanel}>
      {/* Panel Header */}
      <div className={styles.detailHeader}>
        <button className={styles.backBtn} onClick={onClose}>
          <Ico path={icons.chevLeft} size={16} /> Back to Customers
        </button>
        <div className={styles.detailHeaderActions}>
          <button className={styles.btnOutline} onClick={() => onEdit(customer)}>
            <Ico path={icons.edit} size={13} /> Edit
          </button>
          <button className={styles.btnOutlineDanger} onClick={() => { onDelete(customer.id); onClose() }}>
            <Ico path={icons.trash} size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Profile Hero */}
      <div className={styles.profileHero}>
        <div className={styles.profileHeroBg} />
        <div className={styles.profileHeroContent}>
          <div className={styles.profileAvatarLg} style={{ background: avatar.bg, color: avatar.color }}>
            {getInitials(customer.name)}
          </div>
          <div className={styles.profileInfo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 className={styles.profileName}>{customer.name}</h2>
              <TagPill tag={customer.tag} />
              <span style={{ background: STATUS_CFG[customer.status]?.bg, color: STATUS_CFG[customer.status]?.color, padding: '2px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, textTransform: 'capitalize' }}>{customer.status}</span>
            </div>
            <div className={styles.profileContacts}>
              <span className={styles.contactItem}><Ico path={icons.mail} size={13} />{customer.email || '—'}</span>
              <span className={styles.contactItem}><Ico path={icons.phone} size={13} />{customer.phone}</span>
              <span className={styles.contactItem}><Ico path={icons.map} size={13} />{customer.city}, {customer.state}</span>
              <span className={styles.contactItem}><Ico path={icons.tag} size={13} />{customer.channel}</span>
            </div>
          </div>
          <div className={styles.profileQuickActions}>
            <button className={styles.qActBtn} title="Send Email"><Ico path={icons.mail} size={15} /></button>
            <button className={styles.qActBtn} title="Send SMS"><Ico path={icons.sms} size={15} /></button>
            <button className={styles.qActBtn} title="Call"><Ico path={icons.phone} size={15} /></button>
          </div>
        </div>
      </div>

      {/* Stats Strip */}
      <div className={styles.profileStats}>
        {[
          { label: 'Total Orders', value: customer.totalOrders, icon: icons.orders, accent: '#2DBD97' },
          { label: 'Total Spent', value: fmt(customer.totalSpent), icon: icons.naira, accent: '#E8C547' },
          { label: 'Avg Order Value', value: customer.totalOrders ? fmt(Math.round(customer.totalSpent / customer.totalOrders)) : '₦0', icon: icons.trophy, accent: '#8B5CF6' },
          { label: 'Customer Since', value: customer.firstOrder ? new Date(customer.firstOrder).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' }) : '—', icon: icons.calendar, accent: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className={styles.profileStatCard}>
            <span className={styles.profileStatIco} style={{ color: s.accent }}><Ico path={s.icon} size={18} /></span>
            <div className={styles.profileStatVal}>{s.value}</div>
            <div className={styles.profileStatLbl}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className={styles.detailTabs}>
        {['overview','orders','notes'].map(t => (
          <button key={t} className={`${styles.dTab} ${activeTab === t ? styles.dTabOn : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.detailTabBody}>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <h4 className={styles.overviewCardTitle}>Contact Information</h4>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}><span className={styles.infoKey}>Email</span><span className={styles.infoVal}>{customer.email || '—'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Phone</span><span className={styles.infoVal}>{customer.phone}</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Address</span><span className={styles.infoVal}>{customer.address || '—'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>City</span><span className={styles.infoVal}>{customer.city || '—'}</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>State</span><span className={styles.infoVal}>{customer.state || '—'}</span></div>
              </div>
            </div>

            <div className={styles.overviewCard}>
              <h4 className={styles.overviewCardTitle}>Customer Profile</h4>
              <div className={styles.infoRows}>
                <div className={styles.infoRow}><span className={styles.infoKey}>Customer ID</span><span className={styles.infoVal} style={{ fontFamily: 'monospace', fontSize: 12 }}>{customer.id}</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Channel</span><span className={styles.infoVal}>{customer.channel}</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Segment</span><span className={styles.infoVal}><TagPill tag={customer.tag} /></span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Status</span><span className={styles.infoVal}><span style={{ ...STATUS_CFG[customer.status], padding:'2px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, textTransform:'capitalize', background:STATUS_CFG[customer.status]?.bg, color:STATUS_CFG[customer.status]?.color }}>{customer.status}</span></span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Last Order</span><span className={styles.infoVal}>{customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString('en-NG', { dateStyle: 'medium' }) : '—'}</span></div>
              </div>
            </div>

            <div className={styles.overviewCard} style={{ gridColumn: '1 / -1' }}>
              <h4 className={styles.overviewCardTitle}>Purchase Activity</h4>
              <div className={styles.activityBar}>
                <div className={styles.activityItem}>
                  <div className={styles.activityVal} style={{ color: '#2DBD97' }}>{customer.totalOrders}</div>
                  <div className={styles.activityLbl}>Total Orders</div>
                </div>
                <div className={styles.activityDivider} />
                <div className={styles.activityItem}>
                  <div className={styles.activityVal} style={{ color: '#E8C547' }}>{fmt(customer.totalSpent)}</div>
                  <div className={styles.activityLbl}>Lifetime Value</div>
                </div>
                <div className={styles.activityDivider} />
                <div className={styles.activityItem}>
                  <div className={styles.activityVal} style={{ color: '#8B5CF6' }}>
                    {customer.totalOrders ? fmt(Math.round(customer.totalSpent / customer.totalOrders)) : '₦0'}
                  </div>
                  <div className={styles.activityLbl}>Avg Order Value</div>
                </div>
                <div className={styles.activityDivider} />
                <div className={styles.activityItem}>
                  <div className={styles.activityVal} style={{ color: '#F59E0B' }}>
                    {customer.orders?.filter(o => o.status === 'completed').length || 0}
                  </div>
                  <div className={styles.activityLbl}>Completed</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === 'orders' && (
          <div>
            {customer.orders?.length === 0 ? (
              <div className={styles.emptyTab}>
                <Ico path={icons.orders} size={32} />
                <p>No orders from this customer yet</p>
              </div>
            ) : (
              <div className={styles.ordersTable}>
                <div className={styles.ordersTableHead}>
                  <span>Order ID</span><span>Date</span><span>Amount</span><span>Status</span>
                </div>
                {customer.orders?.map(o => (
                  <div key={o.id} className={styles.ordersTableRow}>
                    <span className={styles.orderId}>{o.id}</span>
                    <span style={{ fontSize: 13, color: 'var(--ink3)' }}>{new Date(o.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
                    <span style={{ fontWeight: 700, color: 'var(--navy)' }}>{fmt(o.total)}</span>
                    <span><span style={{ background: ORDER_STATUS_CFG[o.status]?.bg, color: ORDER_STATUS_CFG[o.status]?.color, padding: '2px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, textTransform: 'capitalize' }}>{o.status}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        {activeTab === 'notes' && (
          <div className={styles.notesTab}>
            <p className={styles.notesHint}>Internal notes about this customer. Not visible to the customer.</p>
            <textarea className={styles.notesArea} rows={6} value={note} onChange={e => setNote(e.target.value)} placeholder="Add a note about this customer — order preferences, special requests, communication history..." />
            <button className={styles.btnPrimary} style={{ marginTop: 10 }}>Save Note</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────
export default function CustomersDashboard() {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterChannel, setFilterChannel] = useState('all')
  const [view, setView] = useState('list')
  const [sortBy, setSortBy] = useState('name')
  const [modal, setModal] = useState(null)
  const [editCustomer, setEditCustomer] = useState(null)
  const [detailCustomer, setDetailCustomer] = useState(null)
  const [selected, setSelected] = useState([])

  const totalCustomers = customers.length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const totalRevenue = customers.reduce((a, c) => a + c.totalSpent, 0)
  const avgOrderValue = customers.length ? Math.round(customers.reduce((a, c) => a + (c.totalOrders ? c.totalSpent / c.totalOrders : 0), 0) / customers.length) : 0

  const filtered = customers.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q) || c.id.toLowerCase().includes(q)
    const matchTag = filterTag === 'all' || c.tag === filterTag
    const matchStatus = filterStatus === 'all' || c.status === filterStatus
    const matchChannel = filterChannel === 'all' || c.channel === filterChannel
    return matchSearch && matchTag && matchStatus && matchChannel
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'spent') return b.totalSpent - a.totalSpent
    if (sortBy === 'orders') return b.totalOrders - a.totalOrders
    if (sortBy === 'recent') return (b.lastOrder || '').localeCompare(a.lastOrder || '')
    return 0
  })

  const saveCustomer = (data) => {
    if (editCustomer) setCustomers(cs => cs.map(c => c.id === data.id ? data : c))
    else setCustomers(cs => [...cs, data])
    setModal(null); setEditCustomer(null)
  }

  const deleteCustomer = (id) => setCustomers(cs => cs.filter(c => c.id !== id))

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(c => c.id))

  if (detailCustomer) {
    const current = customers.find(c => c.id === detailCustomer.id) || detailCustomer
    return (
      <div className={styles.page}>
        <CustomerDetail
          customer={current}
          onClose={() => setDetailCustomer(null)}
          onEdit={(c) => { setEditCustomer(c); setModal('edit') }}
          onDelete={deleteCustomer}
        />
        {modal === 'edit' && editCustomer && (
          <CustomerModal customer={editCustomer} onClose={() => { setModal(null); setEditCustomer(null) }} onSave={saveCustomer} />
        )}
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Topbar */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Customers</h1>
        <div className={styles.topbarR}>
          <button className={styles.btnOutline}><Ico path={icons.download} size={13} /> Export</button>
          <button className={styles.btnOutline}><Ico path={icons.upload} size={13} /> Import</button>
          <button className={styles.btnPrimary} onClick={() => { setEditCustomer(null); setModal('create') }}>
            <Ico path={icons.plus} size={14} /> Add Customer
          </button>
        </div>
      </header>

      <div className={styles.content}>
        {/* Stats */}
        <div className={styles.statsRow}>
          {[
            { label: 'Total Customers', value: totalCustomers, icon: icons.users, accent: '#2DBD97' },
            { label: 'Active Customers', value: activeCustomers, icon: icons.user, accent: '#1a1a2e' },
            { label: 'Total Revenue', value: fmt(totalRevenue), icon: icons.naira, accent: '#E8C547' },
            { label: 'Avg Order Value', value: fmt(avgOrderValue), icon: icons.trophy, accent: '#8B5CF6' },
          ].map(s => (
            <div key={s.label} className={styles.statCard}>
              <div className={styles.statTop}>
                <span className={styles.statLbl}>{s.label}</span>
                <span style={{ color: s.accent }}><Ico path={s.icon} size={16} /></span>
              </div>
              <div className={styles.statVal}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Segment pills */}
        <div className={styles.segmentRow}>
          {['all','VIP','Regular','New','At Risk'].map(tag => (
            <button key={tag} className={`${styles.segPill} ${filterTag === tag ? styles.segPillOn : ''}`} onClick={() => setFilterTag(tag)}>
              {tag === 'all' ? 'All Customers' : tag}
              <span className={styles.segCount}>
                {tag === 'all' ? customers.length : customers.filter(c => c.tag === tag).length}
              </span>
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          <div className={styles.controlsL}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}><Ico path={icons.search} size={14} /></span>
              <input placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className={styles.controlsR}>
            <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
            <select className={styles.filterSel} value={filterChannel} onChange={e => setFilterChannel(e.target.value)}>
              <option value="all">All Channels</option>
              {['Website','Instagram','WhatsApp','Facebook','In-store'].map(c => <option key={c}>{c}</option>)}
            </select>
            <select className={styles.filterSel} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="name">Sort: Name</option>
              <option value="spent">Sort: Highest Spend</option>
              <option value="orders">Sort: Most Orders</option>
              <option value="recent">Sort: Recent</option>
            </select>
            <div className={styles.viewToggle}>
              <button className={`${styles.vBtn} ${view === 'list' ? styles.vBtnOn : ''}`} onClick={() => setView('list')}><Ico path={icons.list} size={14} /></button>
              <button className={`${styles.vBtn} ${view === 'grid' ? styles.vBtnOn : ''}`} onClick={() => setView('grid')}><Ico path={icons.grid} size={14} /></button>
            </div>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.length > 0 && (
          <div className={styles.bulkBar}>
            <span className={styles.bulkCount}>{selected.length} selected</span>
            <div className={styles.bulkActions}>
              <button className={styles.bulkBtn}><Ico path={icons.mail} size={13} /> Send Email</button>
              <button className={styles.bulkBtn}><Ico path={icons.sms} size={13} /> Send SMS</button>
              <button className={styles.bulkBtn}><Ico path={icons.tag} size={13} /> Change Tag</button>
              <button className={styles.bulkBtnDanger} onClick={() => { selected.forEach(id => deleteCustomer(id)); setSelected([]) }}>
                <Ico path={icons.trash} size={13} /> Delete
              </button>
            </div>
          </div>
        )}

        {/* Count */}
        <div className={styles.countRow}>
          <span className={styles.countTxt}><Ico path={icons.refresh} size={13} /> Showing {filtered.length} of {customers.length} customers</span>
        </div>

        {/* ── LIST VIEW ── */}
        {view === 'list' && (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={toggleAll} /></span>
              <span>Customer</span>
              <span>Contact</span>
              <span>Location</span>
              <span>Orders</span>
              <span>Total Spent</span>
              <span>Segment</span>
              <span>Status</span>
              <span></span>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.noRecord}>
                <Ico path={icons.users} size={40} />
                <p>No customers found</p>
                <button className={styles.btnOutline} onClick={() => { setEditCustomer(null); setModal('create') }}><Ico path={icons.plus} size={13} /> Add your first customer</button>
              </div>
            ) : filtered.map(c => {
              const av = getAvatarColor(c.name)
              return (
                <div key={c.id} className={`${styles.tableRow} ${selected.includes(c.id) ? styles.rowSel : ''}`}>
                  <span><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></span>
                  <span className={styles.custCell} onClick={() => setDetailCustomer(c)}>
                    <div className={styles.custAvatar} style={{ background: av.bg, color: av.color }}>{getInitials(c.name)}</div>
                    <div>
                      <div className={styles.custName}>{c.name}</div>
                      <div className={styles.custId}>{c.id}</div>
                    </div>
                  </span>
                  <span className={styles.contactCell}>
                    <div className={styles.contactLine}><Ico path={icons.phone} size={11} />{c.phone}</div>
                    {c.email && <div className={styles.contactLine}><Ico path={icons.mail} size={11} />{c.email}</div>}
                  </span>
                  <span className={styles.locationCell}>{c.city}, {c.state}</span>
                  <span className={styles.ordersCell}>
                    <div className={styles.orderCount}>{c.totalOrders}</div>
                    <div className={styles.orderLbl}>orders</div>
                  </span>
                  <span className={styles.spentCell}>{fmt(c.totalSpent)}</span>
                  <span><TagPill tag={c.tag} /></span>
                  <span>
                    <span style={{ background: STATUS_CFG[c.status]?.bg, color: STATUS_CFG[c.status]?.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
                  </span>
                  <span className={styles.actCell}>
                    <button className={styles.iconActBtn} title="View" onClick={() => setDetailCustomer(c)}><Ico path={icons.eye} size={13} /></button>
                    <button className={styles.iconActBtn} title="Edit" onClick={() => { setEditCustomer(c); setModal('edit') }}><Ico path={icons.edit} size={13} /></button>
                    <button className={styles.iconActBtnRed} title="Delete" onClick={() => deleteCustomer(c.id)}><Ico path={icons.trash} size={13} /></button>
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {view === 'grid' && (
          <div className={styles.custGrid}>
            {filtered.map(c => {
              const av = getAvatarColor(c.name)
              return (
                <div key={c.id} className={styles.custCard} onClick={() => setDetailCustomer(c)}>
                  <div className={styles.custCardTop}>
                    <div className={styles.custAvatarLg} style={{ background: av.bg, color: av.color }}>{getInitials(c.name)}</div>
                    <div className={styles.custCardActions} onClick={e => e.stopPropagation()}>
                      <button className={styles.iconActBtn} onClick={() => { setEditCustomer(c); setModal('edit') }}><Ico path={icons.edit} size={13} /></button>
                      <button className={styles.iconActBtnRed} onClick={() => deleteCustomer(c.id)}><Ico path={icons.trash} size={13} /></button>
                    </div>
                  </div>
                  <div className={styles.custCardName}>{c.name}</div>
                  <div className={styles.custCardSub}>{c.phone}</div>
                  {c.email && <div className={styles.custCardSub} style={{ fontSize: 11.5 }}>{c.email}</div>}
                  <div className={styles.custCardTags}>
                    <TagPill tag={c.tag} />
                    <span style={{ background: STATUS_CFG[c.status]?.bg, color: STATUS_CFG[c.status]?.color, padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{c.status}</span>
                  </div>
                  <div className={styles.custCardStats}>
                    <div className={styles.custCardStat}>
                      <div className={styles.custCardStatVal}>{c.totalOrders}</div>
                      <div className={styles.custCardStatLbl}>Orders</div>
                    </div>
                    <div className={styles.custCardStatDiv} />
                    <div className={styles.custCardStat}>
                      <div className={styles.custCardStatVal} style={{ fontSize: 13 }}>{fmt(c.totalSpent)}</div>
                      <div className={styles.custCardStatLbl}>Spent</div>
                    </div>
                    <div className={styles.custCardStatDiv} />
                    <div className={styles.custCardStat}>
                      <div className={styles.custCardStatVal}>{c.city}</div>
                      <div className={styles.custCardStatLbl}>City</div>
                    </div>
                  </div>
                </div>
              )
            })}
            <button className={styles.addCustCard} onClick={() => { setEditCustomer(null); setModal('create') }}>
              <Ico path={icons.plus} size={24} /><span>Add Customer</span>
            </button>
          </div>
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <CustomerModal
          customer={editCustomer}
          onClose={() => { setModal(null); setEditCustomer(null) }}
          onSave={saveCustomer}
        />
      )}
    </div>
  )
}
