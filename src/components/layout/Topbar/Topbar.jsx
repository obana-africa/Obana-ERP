import { useState, useRef, useEffect } from 'react'
import styles from './Topbar.module.css'

const Ic = ({ d, size = 18, stroke = 'currentColor', sw = 1.6, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const ICON = {
  search:  'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
  bell:    ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
  chevron: 'M6 9l6 6 6-6',
  x:       'M18 6L6 18M6 6l12 12',
  order:   ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', 'M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2'],
  user:    ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  tag:     ['M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z', 'M7 7h.01'],
}

const TYPE_COLOR = {
  order: { bg: '#EFF6FF', icon: '#3B82F6' },
  user:  { bg: '#ECFDF5', icon: '#10B981' },
  tag:   { bg: '#FEF3C7', icon: '#F59E0B' },
}

const INITIAL_NOTIFS = [
  { id: 1, type: 'order', title: 'New order received',       body: 'ORD-1008 from Chidi Anene — ₦47,000',     time: '2m ago',  read: false },
  { id: 2, type: 'user',  title: 'New customer registered',  body: 'Fatima Kabir just signed up via WhatsApp', time: '14m ago', read: false },
  { id: 3, type: 'tag',   title: 'Low stock alert',          body: 'Ankara Set (Size M) — only 2 units left',  time: '1h ago',  read: true  },
  { id: 4, type: 'order', title: 'Order status updated',     body: 'ORD-1003 marked as Shipped',              time: '3h ago',  read: true  },
]

const Topbar = ({ storeName = '', storeInitial = '' }) => {
  const [searchVal,   setSearchVal]   = useState('')
  const [searchFocus, setSearchFocus] = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifs,      setNotifs]      = useState(INITIAL_NOTIFS)

  const notifRef   = useRef()
  const profileRef = useRef()

  const unreadCount = notifs.filter(n => !n.read).length

  useEffect(() => {
    const handler = e => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Simulate live notifications (swap for WebSocket/SSE in production)
  useEffect(() => {
    const t = setInterval(() => {
      setNotifs(prev => [{
        id: Date.now(),
        type: 'order',
        title: 'New order received',
        body: `ORD-${1009 + prev.length} just came in`,
        time: 'just now',
        read: false,
      }, ...prev])
    }, 30000)
    return () => clearInterval(t)
  }, [])

  const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })))
  const markRead    = id => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  const dismiss     = id => setNotifs(ns => ns.filter(n => n.id !== id))

  return (
    <header className={styles.topbar}>

      {/* Logo */}
      <div className={styles.logo}>
        <img
          src="/public/logos/taja logo blue.png"
          alt="Taja"
          className={styles.logoImg}
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block' }}
        />
      </div>

      {/* Search */}
      <div className={`${styles.search} ${searchFocus ? styles.searchFocused : ''}`}>
        <Ic d={ICON.search} size={14} />
        <input
          className={styles.searchInput}
          placeholder="Search orders, customers, products…"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
        />
        <div className={styles.kbdGroup}>
          <kbd className={styles.kbd}>CTRL</kbd>
          <kbd className={styles.kbd}>K</kbd>
        </div>
      </div>

      {/* Right */}
      <div className={styles.right}>

        {/* Notification bell */}
        <div className={styles.dropWrap} ref={notifRef}>
          <button
            className={styles.iconBtn}
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false) }}
            aria-label="Notifications"
          >
            <Ic d={ICON.bell} size={17} />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div className={styles.notifPanel}>
              <div className={styles.panelHead}>
                <span className={styles.panelTitle}>Notifications</span>
                {unreadCount > 0 && (
                  <button className={styles.markAllBtn} onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className={styles.notifList}>
                {notifs.length === 0 && <div className={styles.empty}>You're all caught up</div>}
                {notifs.map(n => {
                  const cfg = TYPE_COLOR[n.type] || TYPE_COLOR.order
                  return (
                    <div
                      key={n.id}
                      className={`${styles.notifItem} ${!n.read ? styles.notifUnread : ''}`}
                      onClick={() => markRead(n.id)}
                    >
                      {!n.read && <span className={styles.unreadDot} />}
                      <div className={styles.notifIconWrap} style={{ background: cfg.bg }}>
                        <Ic d={ICON[n.type]} size={14} stroke={cfg.icon} />
                      </div>
                      <div className={styles.notifBody}>
                        <div className={styles.notifTitle}>{n.title}</div>
                        <div className={styles.notifText}>{n.body}</div>
                        <div className={styles.notifTime}>{n.time}</div>
                      </div>
                      <button
                        className={styles.dismissBtn}
                        onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                        aria-label="Dismiss"
                      >
                        <Ic d={ICON.x} size={11} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className={styles.dropWrap} ref={profileRef}>
          <button
            className={`${styles.profileBtn} ${profileOpen ? styles.profileBtnOpen : ''}`}
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false) }}
          >
            <span className={styles.avatar}>{storeInitial}</span>
            <span className={styles.storeName}>{storeName}</span>
            <span className={`${styles.chevron} ${profileOpen ? styles.chevronOpen : ''}`}>
              <Ic d={ICON.chevron} size={14} />
            </span>
          </button>

          {profileOpen && (
            <div className={styles.profilePanel}>
              <div className={styles.profileHead}>
                <span className={styles.avatarLg}>{storeInitial}</span>
                <div>
                  <div className={styles.profileName}>{storeName}</div>
                  <div className={styles.profileRole}>Store Admin</div>
                </div>
              </div>
              <div className={styles.divider} />
              {['Account settings', 'Switch store', 'Help & support'].map(item => (
                <button key={item} className={styles.dropItem}>{item}</button>
              ))}
              <div className={styles.divider} />
              <button className={`${styles.dropItem} ${styles.dropItemRed}`}>Log out</button>
            </div>
          )}
        </div>

      </div>
    </header>
  )
}

export default Topbar
