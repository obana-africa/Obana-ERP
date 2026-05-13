
 /* API stubs marked // API:
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import styles from './PanelSalesChannels.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.6, fill = 'none', style: st }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...st }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Shared primitives ──────────────────────────────────────────── */
function Toast({ msg, type = 'success', onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t) }, [onDone])
  return (
    <div className={`${styles.toast} ${type === 'error' ? styles.toastError : type === 'warn' ? styles.toastWarn : ''}`}>
      <Ic d={type === 'error' ? 'M18 6L6 18M6 6l12 12' : type === 'warn' ? 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01' : 'M20 6L9 17l-5-5'} size={13}
        stroke={type === 'error' ? '#EF4444' : type === 'warn' ? '#D97706' : '#2DBD97'} />
      {msg}
    </div>
  )
}

function ConfirmModal({ title, body, confirmLabel = 'Confirm', danger, onConfirm, onClose }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.confirmModal}>
        <div className={styles.confirmHead}>
          <h3 className={styles.confirmTitle}>{title}</h3>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={15} />
          </button>
        </div>
        <p className={styles.confirmBody}>{body}</p>
        <div className={styles.confirmFoot}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button
            className={`${styles.confirmBtn} ${danger ? styles.confirmBtnDanger : ''}`}
            onClick={() => { onConfirm(); onClose() }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Portal dropdown ─────────────────────────────────────────────── */
function ChannelDropdown({ trigger, items }) {
  const [open, setOpen]   = useState(false)
  const [pos,  setPos]    = useState({ top: 0, right: 0 })
  const trigRef           = useRef(null)
  const menuRef           = useRef(null)

  const recalc = () => {
    if (!trigRef.current) return
    const r = trigRef.current.getBoundingClientRect()
    setPos({ top: r.bottom + window.scrollY + 4, right: window.innerWidth - r.right })
  }

  useEffect(() => {
    if (!open) return
    const h = e => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          trigRef.current && !trigRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const menu = open && createPortal(
    <div ref={menuRef} className={styles.dropMenu}
      style={{ position: 'fixed', top: pos.top, right: pos.right, zIndex: 9999 }}>
      {items.map((item, i) => {
        if (item.type === 'divider') return <div key={i} className={styles.dropDivider} />
        if (item.type === 'label')   return <div key={i} className={styles.dropLabel}>{item.text}</div>
        return (
          <button key={i}
            className={`${styles.dropItem} ${item.danger ? styles.dropItemDanger : ''}`}
            disabled={item.disabled}
            onClick={() => { item.onClick?.(); setOpen(false) }}>
            {item.icon && <Ic d={item.icon} size={14} stroke="currentColor" />}
            <span className={styles.dropItemContent}>
              <span className={styles.dropItemLabel}>{item.label}</span>
              {item.sub && <span className={styles.dropItemSub}>{item.sub}</span>}
            </span>
          </button>
        )
      })}
    </div>,
    document.body
  )

  return (
    <div ref={trigRef} style={{ position: 'relative' }}>
      <div onClick={() => { recalc(); setOpen(o => !o) }}>{trigger(open)}</div>
      {menu}
    </div>
  )
}

/* ── Channel logos ───────────────────────────────────────────────── */
const FacebookLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <defs><linearGradient id="fbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#18ACFE"/><stop offset="100%" stopColor="#0163E0"/>
    </linearGradient></defs>
    <rect width="24" height="24" rx="5" fill="url(#fbg)"/>
    <path d="M13.5 8.5H15V6h-2c-1.66 0-3 1.34-3 3v1H8.5v2.5H10V21h3v-8.5h2l.5-2.5H13V9a.5.5 0 0 1 .5-.5z" fill="white"/>
  </svg>
)

const InstagramLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <defs><linearGradient id="igg" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#FFDC80"/>
      <stop offset="25%" stopColor="#FCAF45"/>
      <stop offset="50%" stopColor="#E1306C"/>
      <stop offset="100%" stopColor="#833AB4"/>
    </linearGradient></defs>
    <rect width="24" height="24" rx="6" fill="url(#igg)"/>
    <circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="1.8"/>
    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
  </svg>
)

const POSLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#1b3b5f"/>
    <path d="M5 8h14a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" fill="none" stroke="#2DBD97" strokeWidth="1.5"/>
    <path d="M9 8V6a3 3 0 0 1 6 0v2" fill="none" stroke="#2DBD97" strokeWidth="1.5"/>
    <circle cx="12" cy="13" r="1.5" fill="#2DBD97"/>
  </svg>
)

const OnlineStoreLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#1b3b5f"/>
    <path d="M4 9l2-4h12l2 4" fill="none" stroke="#E8C547" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M3 9h18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" fill="#E8C547" opacity=".3"/>
    <rect x="6" y="13" width="12" height="7" rx="1" fill="none" stroke="#E8C547" strokeWidth="1.5"/>
  </svg>
)

const GoogleLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#fff" stroke="#E5E7EB" strokeWidth="1"/>
    <path d="M21.8 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.3c1.9-1.8 3-4.4 3-7.3z" fill="#4285F4"/>
    <path d="M12 22c2.7 0 5-.9 6.7-2.4l-3.3-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.6C4.7 19.8 8.1 22 12 22z" fill="#34A853"/>
    <path d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3a10 10 0 0 0 0 9.2L6.4 14z" fill="#FBBC05"/>
    <path d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8C16.9 2.9 14.6 2 12 2 8.1 2 4.7 4.2 3 7.4l3.4 2.6c.8-2.3 3-4.1 5.6-4.1z" fill="#EA4335"/>
  </svg>
)

const YouTubeLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#FF0000"/>
    <path d="M19.6 7.8a2.4 2.4 0 0 0-1.7-1.7C16.4 6 12 6 12 6s-4.4 0-5.9.1A2.4 2.4 0 0 0 4.4 7.8 25 25 0 0 0 4.3 12a25 25 0 0 0 .1 4.2c.3 1 1 1.4 1.7 1.7C7.6 18 12 18 12 18s4.4 0 5.9-.1a2.4 2.4 0 0 0 1.7-1.7 25 25 0 0 0 .1-4.2 25 25 0 0 0-.1-4.2z" fill="white" opacity=".2"/>
    <polygon points="10,9 10,15 15,12" fill="white"/>
  </svg>
)

const ChatGPTLogo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#10A37F"/>
    <path d="M12 4.5a4.5 4.5 0 0 1 4.24 6.01A4.5 4.5 0 0 1 12 19.5a4.5 4.5 0 0 1-4.24-8.99A4.5 4.5 0 0 1 12 4.5z" fill="none" stroke="white" strokeWidth="1.3"/>
    <path d="M6.5 9A5.5 5.5 0 0 1 12 4.5M17.5 9a5.5 5.5 0 0 1-1.26 8.01M6.5 15A5.5 5.5 0 0 0 12 19.5" fill="none" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

/* ── Seed data ───────────────────────────────────────────────────── */
const INSTALLED_CHANNELS_SEED = [
  {
    id: 'facebook_instagram',
    name: 'Facebook & Instagram',
    desc: 'Sell on Facebook Shops and Instagram Shopping',
    logo: 'fb_ig',
    status: 'active',
    connected: true,
    products: 842,
    orders: 127,
    revenue: 2840000,
    lastSync: '2 mins ago',
    issues: 0,
  },
  {
    id: 'pos',
    name: 'Point of Sale',
    desc: 'Sell in person at your retail store or pop-up',
    logo: 'pos',
    status: 'active',
    connected: true,
    products: 1204,
    orders: 89,
    revenue: 1560000,
    lastSync: '5 mins ago',
    issues: 0,
  },
  {
    id: 'online_store',
    name: 'Online Store',
    desc: 'Your primary storefront on theoutlet.ng',
    logo: 'online',
    status: 'active',
    connected: true,
    products: 1204,
    orders: 312,
    revenue: 8420000,
    lastSync: 'Just now',
    issues: 0,
  },
  {
    id: 'google_youtube',
    name: 'Google & YouTube',
    desc: 'Reach customers through Google Shopping and YouTube',
    logo: 'google',
    status: 'paused',
    connected: true,
    products: 630,
    orders: 43,
    revenue: 780000,
    lastSync: '1 hour ago',
    issues: 2,
  },
]

const AGENTIC_STOREFRONTS_SEED = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Your products are discoverable in ChatGPT conversations',
    logo: 'chatgpt',
    status: 'active',
    products: 1204,
  },
]

const AVAILABLE_CHANNELS = [
  { id: 'tiktok',    name: 'TikTok',      desc: 'Sell through TikTok Shopping and live streams',        color: '#000', textColor: '#fff', letter: 'T' },
  { id: 'pinterest', name: 'Pinterest',   desc: 'Turn your products into shoppable Pins',                color: '#E60023', textColor: '#fff', letter: 'P' },
  { id: 'twitter',   name: 'X (Twitter)', desc: 'Reach customers on X with shoppable product links',     color: '#000', textColor: '#fff', letter: 'X' },
  { id: 'snapchat',  name: 'Snapchat',    desc: 'Run Dynamic Product Ads on Snapchat',                   color: '#FFFC00', textColor: '#000', letter: 'S' },
  { id: 'whatsapp',  name: 'WhatsApp',    desc: 'Sell directly through WhatsApp Business chats',         color: '#25D366', textColor: '#fff', letter: 'W' },
  { id: 'jumia',     name: 'Jumia',       desc: "List products on Nigeria's largest marketplace",         color: '#F68B1E', textColor: '#fff', letter: 'J' },
  { id: 'konga',     name: 'Konga',       desc: 'Reach millions of Nigerian shoppers on Konga',          color: '#D32F2F', textColor: '#fff', letter: 'K' },
]

const fmt = n => `₦${Number(n).toLocaleString()}`

/* ════════════════════════════════════════════════════════════════
   MAIN PANEL
════════════════════════════════════════════════════════════════ */
export default function PanelSalesChannels() {
  const navigate = useNavigate()

  const [installed,   setInstalled]   = useState(INSTALLED_CHANNELS_SEED)
  const [agentic,     setAgentic]     = useState(AGENTIC_STOREFRONTS_SEED)
  const [toast,       setToast]       = useState(null)
  const [confirm,     setConfirm]     = useState(null)
  const [addingId,    setAddingId]    = useState(null)
  const [syncing,     setSyncing]     = useState(null)

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type })
  }, [])

  /* ── Channel actions ─────────────────────────────────────────── */
  const removeChannel = (id) => {
    setInstalled(cs => cs.filter(c => c.id !== id))
    showToast('Sales channel removed', 'error')
    // API: await api.delete(`/api/settings/sales-channels/${id}`)
  }

  const togglePause = (id) => {
    setInstalled(cs => cs.map(c => c.id === id
      ? { ...c, status: c.status === 'active' ? 'paused' : 'active' }
      : c))
    const ch = installed.find(c => c.id === id)
    showToast(ch.status === 'active' ? `${ch.name} paused` : `${ch.name} resumed`)
    // API: await api.patch(`/api/settings/sales-channels/${id}`, { status })
  }

  const syncChannel = async (id) => {
    setSyncing(id)
    // API: await api.post(`/api/settings/sales-channels/${id}/sync`)
    await new Promise(r => setTimeout(r, 1400))
    setInstalled(cs => cs.map(c => c.id === id ? { ...c, lastSync: 'Just now', issues: 0 } : c))
    setSyncing(null)
    showToast('Sync complete')
  }

  const addChannel = async (ch) => {
    setAddingId(ch.id)
    // API: await api.post('/api/settings/sales-channels', { channelId: ch.id })
    await new Promise(r => setTimeout(r, 900))
    setInstalled(cs => [...cs, {
      id: ch.id, name: ch.name, desc: ch.desc, logo: ch.id,
      status: 'active', connected: true, products: 0, orders: 0, revenue: 0,
      lastSync: 'Never', issues: 0,
    }])
    setAddingId(null)
    showToast(`${ch.name} added`)
  }

  /* ── Per-channel dropdown items ──────────────────────────────── */
  const channelMenuItems = (ch) => [
    {
      icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
      label: 'View channel', sub: `Open ${ch.name} dashboard`,
      onClick: () => navigate(`/sales-channels/${ch.id}`),
    },
    {
      icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
      label: 'Channel settings', sub: 'Configure products and preferences',
      onClick: () => navigate(`/sales-channels/${ch.id}/settings`),
    },
    {
      icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
      label: 'Manage products',
      sub: `${ch.products.toLocaleString()} products listed`,
      onClick: () => navigate(`/products?channel=${ch.id}`),
    },
    {
      icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
      label: 'View orders',
      sub: `${ch.orders} orders this month`,
      onClick: () => navigate(`/orders?channel=${ch.id}`),
    },
    {
      icon: 'M18 20V10M12 20V4M6 20v-6',
      label: 'Analytics',
      sub: `Revenue: ${fmt(ch.revenue)}`,
      onClick: () => navigate(`/analytics?channel=${ch.id}`),
    },
    { type: 'divider' },
    {
      icon: 'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15',
      label: syncing === ch.id ? 'Syncing…' : 'Sync now',
      sub: `Last synced: ${ch.lastSync}`,
      disabled: syncing === ch.id,
      onClick: () => syncChannel(ch.id),
    },
    {
      icon: ch.status === 'active'
        ? 'M10 9v6m4-6v6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
        : 'M10 9l6 3-6 3V9zM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
      label: ch.status === 'active' ? 'Pause channel' : 'Resume channel',
      sub: ch.status === 'active' ? 'Stop selling on this channel' : 'Resume selling on this channel',
      onClick: () => togglePause(ch.id),
    },
    { type: 'divider' },
    {
      icon: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
      label: 'Remove channel',
      sub: 'Disconnect and remove',
      danger: true,
      onClick: () => setConfirm({
        title: `Remove ${ch.name}?`,
        body: `Removing ${ch.name} will stop all sales through this channel. Your products and orders won't be deleted.`,
        confirmLabel: 'Remove channel',
        danger: true,
        onConfirm: () => removeChannel(ch.id),
      }),
    },
  ]

  /* ── Logo renderer ───────────────────────────────────────────── */
  const renderLogo = (id) => {
    const map = {
      fb_ig:   <><FacebookLogo /><InstagramLogo /></>,
      pos:     <POSLogo />,
      online:  <OnlineStoreLogo />,
      google:  <><GoogleLogo /><YouTubeLogo /></>,
      chatgpt: <ChatGPTLogo />,
    }
    return map[id] || null
  }

  /* ── Totals ──────────────────────────────────────────────────── */
  const totalRevenue  = installed.reduce((a, c) => a + c.revenue, 0)
  const totalOrders   = installed.reduce((a, c) => a + c.orders, 0)
  const totalProducts = installed.reduce((a, c) => a + c.products, 0)
  const issueCount    = installed.reduce((a, c) => a + c.issues, 0)

  const alreadyInstalled = new Set(installed.map(c => c.id))

  return (
    <div className={styles.panel}>
      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
      {confirm && <ConfirmModal {...confirm} onClose={() => setConfirm(null)} />}

      {/* ══ KPI row ═══════════════════════════════════════════════ */}
      <div className={styles.kpiRow}>
        {[
          { label: 'Total revenue',    val: fmt(totalRevenue),              icon: 'M2 8h20M2 16h20M6 4v16M18 4v16', color: '#2DBD97' },
          { label: 'Orders this month', val: totalOrders.toLocaleString(),  icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2', color: '#1b3b5f' },
          { label: 'Products listed',   val: totalProducts.toLocaleString(), icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18', color: '#7C3AED' },
          { label: 'Issues detected',   val: String(issueCount),             icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01', color: issueCount > 0 ? '#EF4444' : '#9CA3AF' },
        ].map(k => (
          <div key={k.label} className={styles.kpiCard}>
            <div className={styles.kpiTop}>
              <Ic d={k.icon} size={14} stroke={k.color} />
              <span className={styles.kpiLabel}>{k.label}</span>
            </div>
            <div className={styles.kpiVal} style={{ color: k.color }}>{k.val}</div>
          </div>
        ))}
      </div>

      {/* ══ INSTALLED CHANNELS ════════════════════════════════════ */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Installed channels</h2>
            <p className={styles.sectionSub}>{installed.length} active sales channel{installed.length !== 1 ? 's' : ''}</p>
          </div>
          <button className={styles.appStoreBtn}
            onClick={() => navigate('/apps?category=sales-channels')}>
            <Ic d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" size={13} />
             App Store
          </button>
        </div>

        {/* Filter tabs */}
        <div className={styles.filterRow}>
          <button className={`${styles.filterTab} ${styles.filterTabOn}`}>Installed</button>
        </div>

        {/* Channel list */}
        <div className={styles.channelList}>
          {installed.map((ch, i) => (
            <div key={ch.id} className={styles.channelRow} style={{ animationDelay:`${i*50}ms` }}>
              {/* Logo */}
              <div className={styles.channelLogo}>{renderLogo(ch.logo)}</div>

              {/* Info */}
              <div className={styles.channelInfo}>
                <div className={styles.channelNameRow}>
                  <span className={styles.channelName}
                    onClick={() => navigate(`/sales-channels/${ch.id}`)}>
                    {ch.name}
                  </span>
                  <span className={`${styles.statusPill} ${ch.status === 'active' ? styles.statusActive : styles.statusPaused}`}>
                    <span className={styles.statusDot} />
                    {ch.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                  {ch.issues > 0 && (
                    <span className={styles.issuePill}>
                      <Ic d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" size={11} stroke="#DC2626" />
                      {ch.issues} issue{ch.issues > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <div className={styles.channelMeta}>
                  <span>{ch.products.toLocaleString()} products</span>
                  <span className={styles.metaDot}>·</span>
                  <span>{ch.orders} orders</span>
                  <span className={styles.metaDot}>·</span>
                  <span>{fmt(ch.revenue)}</span>
                  <span className={styles.metaDot}>·</span>
                  <span className={styles.syncTime}>
                    {syncing === ch.id ? (
                      <span className={styles.syncingLabel}>
                        <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" size={11} className={styles.spinIcon} />
                        Syncing…
                      </span>
                    ) : `Synced ${ch.lastSync}`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className={styles.channelActions}>
                <ChannelDropdown
                  trigger={(open) => (
                    <button className={`${styles.moreBtn} ${open ? styles.moreBtnActive : ''}`} title="Channel options">
                      <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
                    </button>
                  )}
                  items={channelMenuItems(ch)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ AGENTIC STOREFRONTS ═══════════════════════════════════ */}
      <div className={styles.section}>
        {/* Promo banner */}
        <div className={styles.agenticBanner}>
          <div className={styles.agenticBannerContent}>
            <div>
              <h3 className={styles.agenticBannerTitle}>Introducing agentic storefronts</h3>
              <p className={styles.agenticBannerDesc}>
                Get discovered across AI chats and channels. Customers can buy your products
                on the spot, without leaving the channel.
              </p>
              <button className={styles.learnMoreBtn}
                onClick={() => navigate('/apps?category=agentic')}>
                Learn more
              </button>
            </div>
            <div className={styles.agenticBannerArt}>
              <div className={styles.artProduct}>
                <div className={styles.artProd1}>👟</div>
                <div className={styles.artProd2}>🕶️</div>
              </div>
              <div className={styles.artBuyBtns}>
                <div className={styles.artBuy1}>Buy</div>
                <div className={styles.artBuy2}>Buy now</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionHead} style={{ borderTop: '1px solid #F3F4F6', paddingTop: 18 }}>
          <div>
            <h2 className={styles.sectionTitle}>Agentic storefronts</h2>
            <p className={styles.sectionSub}>Your active products are automatically discoverable.</p>
          </div>
        </div>

        <div className={styles.channelList}>
          {agentic.map((ch, i) => (
            <div key={ch.id} className={styles.channelRow} style={{ animationDelay:`${i*50}ms` }}>
              <div className={styles.channelLogo}>{renderLogo(ch.logo)}</div>
              <div className={styles.channelInfo}>
                <div className={styles.channelNameRow}>
                  <span className={styles.channelName}
                    onClick={() => navigate(`/sales-channels/agentic/${ch.id}`)}>
                    {ch.name}
                  </span>
                  <span className={`${styles.statusPill} ${styles.statusActive}`}>
                    <span className={styles.statusDot} />Active
                  </span>
                </div>
                <div className={styles.channelMeta}>
                  <span>{ch.products.toLocaleString()} products discoverable</span>
                </div>
              </div>
              <div className={styles.channelActions}>
                <ChannelDropdown
                  trigger={(open) => (
                    <button className={`${styles.moreBtn} ${open ? styles.moreBtnActive : ''}`}>
                      <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
                    </button>
                  )}
                  items={[
                    { icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', label: 'Settings', onClick: () => navigate(`/sales-channels/agentic/${ch.id}/settings`) },
                    { icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18', label: 'View products', onClick: () => navigate('/products') },
                    { type: 'divider' },
                    { icon: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', label: 'Remove', danger: true, onClick: () => {
                      setConfirm({
                        title: `Remove ${ch.name}?`,
                        body: 'Your products will no longer be discoverable through this channel.',
                        confirmLabel: 'Remove', danger: true,
                        onConfirm: () => setAgentic(a => a.filter(x => x.id !== ch.id)),
                      })
                    }},
                  ]}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Review note */}
        <div className={styles.agenticNote}>
          <Ic d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8h.01M12 12v4" size={14} stroke="#6B7280" />
          <span>
            Review how{' '}
            <button className={styles.linkBtn} onClick={() => navigate('/products')}>
              your product
            </button>{' '}
            data is sent to the Catalog for agentic storefronts.
          </span>
        </div>
      </div>

      {/* ══ ADD MORE CHANNELS ═════════════════════════════════════ */}
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <h2 className={styles.sectionTitle}>Add sales channels</h2>
            <p className={styles.sectionSub}>Expand your reach by selling on more platforms</p>
          </div>
        </div>

        <div className={styles.availableGrid}>
          {AVAILABLE_CHANNELS.map((ch, i) => {
            const already = alreadyInstalled.has(ch.id)
            return (
              <div key={ch.id} className={`${styles.availableCard} ${already ? styles.availableCardAdded : ''}`}
                style={{ animationDelay:`${i*40}ms` }}>
                <div className={styles.availableLogo}
                  style={{ background: ch.color, color: ch.textColor }}>
                  {ch.letter}
                </div>
                <div className={styles.availableInfo}>
                  <div className={styles.availableName}>{ch.name}</div>
                  <div className={styles.availableDesc}>{ch.desc}</div>
                </div>
                <button
                  className={already ? styles.addedBtn : styles.addBtn}
                  disabled={addingId === ch.id || already}
                  onClick={() => !already && addChannel(ch)}>
                  {addingId === ch.id ? (
                    <span className={styles.addingLabel}>
                      <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" size={12} className={styles.spinIcon} />
                      Adding…
                    </span>
                  ) : already ? (
                    <><Ic d="M20 6L9 17l-5-5" size={12} /> Added</>
                  ) : (
                    <><Ic d="M12 5v14M5 12h14" size={12} /> Add</>
                  )}
                </button>
              </div>
            )
          })}

          {/* Browse all CTA */}
          <div className={styles.browseCard}
            onClick={() => navigate('/apps?category=sales-channels')}>
            <div className={styles.browseIcon}>
              <Ic d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" size={22} stroke="#6B7280" sw={1.3} />
            </div>
            <div className={styles.browseName}>Browse all channels</div>
            <div className={styles.browseDesc}>Find more on the Shopify App Store</div>
          </div>
        </div>
      </div>
    </div>
  )
}
