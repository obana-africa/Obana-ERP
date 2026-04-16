import { useState } from 'react'
import styles from '../Customers.module.css'
import { fmt, fmtD } from '../../../utils/formatters'
import { TAG_CONFIG, STATUS_CFG, ORDER_STATUS_CFG, AVATAR_COLORS } from '../../../data/customers'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const getAvatarColor = name => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
const getInitials    = name => name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()

const TagPill = ({ tag }) => {
  const cfg = TAG_CONFIG[tag] || { bg:'#F3F4F6', color:'#6B7280', border:'#E5E7EB' }
  return (
    <span style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:700 }}>
      {tag}
    </span>
  )
}

const DETAIL_TABS = ['overview','orders','notes']

/**
 * Props:
 *  customer — full customer object
 *  onClose  — () => void
 *  onEdit   — () => void  (triggers parent edit modal)
 *  onDelete — (id) => void
 */
const CustomerDetail = ({ customer, onClose, onEdit, onDelete }) => {
  const [activeTab, setActiveTab]   = useState('overview')
  const [notes,     setNotes]       = useState(customer.notes || '')
  const av = getAvatarColor(customer.name)

  const daysSinceOrder = customer.lastOrder
    ? Math.floor((new Date() - new Date(customer.lastOrder)) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className={styles.detailOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.detailPanel}>

        {/* Profile header */}
        <div className={styles.profileHeader}>
          <button className={styles.detailClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>

          <div className={styles.profileTop}>
            <div className={styles.profileAvatarLg} style={{ background:av.bg, color:av.color }}>
              {getInitials(customer.name)}
            </div>
            <div className={styles.profileMeta}>
              <div className={styles.profileName}>{customer.name}</div>
              <div className={styles.profileId}>{customer.id}</div>
              <div className={styles.profileTags}>
                <TagPill tag={customer.tag} />
                <span style={{ background:STATUS_CFG[customer.status]?.bg, color:STATUS_CFG[customer.status]?.color, padding:'3px 10px', borderRadius:20, fontSize:11.5, fontWeight:600, textTransform:'capitalize' }}>
                  {customer.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className={styles.profileActions}>
            <button className={styles.qActBtn} title="Send Email">
              <Ic d={['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z','M22 6l-10 7L2 6']} size={14} />
            </button>
            <button className={styles.qActBtn} title="Send SMS">
              <Ic d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" size={14} />
            </button>
            <button className={styles.qActBtn} title="Edit" onClick={onEdit}>
              <Ic d={['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z']} size={14} />
            </button>
            <button className={styles.qActBtnDanger} title="Delete"
              onClick={() => { onDelete(customer.id); onClose() }}>
              <Ic d={['M3 6h18','M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6']} size={14} />
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div className={styles.profileStats}>
          {[
            { val:customer.totalOrders, lbl:'Orders',    ico:'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2' },
            { val:fmt(customer.totalSpent), lbl:'Total Spent', ico:['M2 8h20','M2 16h20','M6 4v16','M18 4v16'] },
            { val:fmt(customer.totalSpent / Math.max(customer.totalOrders,1)), lbl:'Avg Order', ico:'M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3' },
            { val:daysSinceOrder !== null ? `${daysSinceOrder}d` : '—', lbl:'Days Since Order', ico:'M8 3v4M16 3v4M3 9h18M3 5h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z' },
          ].map(s => (
            <div key={s.lbl} className={styles.profileStatCard}>
              <Ic d={s.ico} size={16} className={styles.profileStatIco} />
              <div className={styles.profileStatVal}>{s.val}</div>
              <div className={styles.profileStatLbl}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={styles.detailTabs}>
          {DETAIL_TABS.map(t => (
            <button key={t}
              className={`${styles.dTab} ${activeTab === t ? styles.dTabOn : ''}`}
              onClick={() => setActiveTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.detailTabBody}>

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className={styles.overviewGrid}>
              <div className={styles.overviewCard}>
                <div className={styles.overviewCardTitle}>Contact Details</div>
                <div className={styles.infoRows}>
                  {[
                    { k:'Phone',   v:customer.phone   },
                    { k:'Email',   v:customer.email || '—' },
                    { k:'Channel', v:customer.channel },
                    { k:'City',    v:`${customer.city}, ${customer.state}` },
                    { k:'Address', v:customer.address || '—' },
                  ].map(r => (
                    <div key={r.k} className={styles.infoRow}>
                      <span className={styles.infoKey}>{r.k}</span>
                      <span className={styles.infoVal}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.overviewCard}>
                <div className={styles.overviewCardTitle}>Purchase History</div>
                <div className={styles.infoRows}>
                  {[
                    { k:'First Order',  v:fmtD(customer.firstOrder) },
                    { k:'Last Order',   v:fmtD(customer.lastOrder)  },
                    { k:'Total Orders', v:customer.totalOrders       },
                    { k:'Total Spent',  v:fmt(customer.totalSpent)   },
                    { k:'Avg Order',    v:fmt(Math.round(customer.totalSpent / Math.max(customer.totalOrders,1))) },
                  ].map(r => (
                    <div key={r.k} className={styles.infoRow}>
                      <span className={styles.infoKey}>{r.k}</span>
                      <span className={styles.infoVal}>{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            customer.orders?.length > 0 ? (
              <div className={styles.ordersTable}>
                <div className={styles.ordersTableHead}>
                  <span>Order ID</span><span>Date</span><span>Amount</span><span>Status</span>
                </div>
                {customer.orders.map(o => (
                  <div key={o.id} className={styles.ordersTableRow}>
                    <span className={styles.orderId}>{o.id}</span>
                    <span>{fmtD(o.date)}</span>
                    <span style={{ fontWeight:700 }}>{fmt(o.total)}</span>
                    <span>
                      <span style={{
                        background:ORDER_STATUS_CFG[o.status]?.bg,
                        color:ORDER_STATUS_CFG[o.status]?.color,
                        padding:'3px 10px', borderRadius:20,
                        fontSize:11.5, fontWeight:600, textTransform:'capitalize',
                      }}>
                        {o.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyTab}>
                <Ic d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" size={32} stroke="#9CA3AF" />
                <p>No orders yet</p>
              </div>
            )
          )}

          {/* ── NOTES ── */}
          {activeTab === 'notes' && (
            <div className={styles.notesTab}>
              <p className={styles.notesHint}>Internal notes — visible only to staff</p>
              <textarea
                className={styles.notesArea}
                rows={6}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Add notes about this customer…"
              />
              <button className={styles.btnPrimary} style={{ alignSelf:'flex-start' }}>
                <Ic d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" size={13} stroke="#fff" />
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomerDetail
