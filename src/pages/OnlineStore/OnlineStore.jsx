
import { useState, useCallback, useRef, useEffect } from 'react'
import styles from './OnlineStore.module.css'
import StorefrontPreview from './components/StorefrontPreview'
import ThemeEditor from './components/ThemeEditor'
import IntegrationPanel from './components/IntegrationPanel'
import TemplateGallery from './components/TemplateGallery'

/* ─── Icon ──────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const ICON = {
  desktop:  ['M3 7h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z', 'M8 21h8m-4-2v2'],
  tablet:   ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M12 17h.01'],
  phone:    ['M12 18h.01', 'M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z'],
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'],
  publish:  ['M22 2L11 13', 'M22 2L15 22l-4-9-9-4 20-7z'],
  check:    'M20 6L9 17l-5-5',
  undo:     ['M3 7v6h6', 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'],
  redo:     ['M21 7v6h-6', 'M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  link:     ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  palette:  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z',
  layout:   ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  plug:     ['M7 22V11', 'M17 22V11', 'M12 2v4', 'M5 11h14', 'M5 7h14', 'M12 15a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-4h14v4a3 3 0 0 1-3 3h-2a3 3 0 0 1-1-2.83'],
  settings: ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
}

export const DEFAULT_THEME = {
  /* Identity — blank by default, user fills these in */
  storeName:      'My Store',
  logoText:       'My Store',
  tagline:        'Your store tagline here',
  faviconUrl:     '',
  logoUrl:        '',

  /* Colours */
  primary:        '#111827',
  accent:         '#2DBD97',
  bg:             '#ffffff',
  text:           '#111827',
  heroBg:         '#111827',
  heroTextColor:  '#ffffff',
  cardBg:         '#ffffff',
  cardBorder:     '#F3F4F6',
  footerBg:       '#111827',
  footerText:     '#ffffff',
  navBg:          '#ffffff',
  navText:        '#111827',

  /* Typography */
  headingFont:    'Playfair Display',
  bodyFont:       'DM Sans',
  headingWeight:  '700',
  bodySize:       '14',

  /* Shape & layout */
  radius:         8,
  btn:            'filled',
  navLayout:      'centered',
  productCols:    3,
  cardStyle:      'shadow',

  /* Hero section — blank prompts */
  heroTitle:      'Your Store Headline',
  heroSub:        'Describe your store and what makes it special',
  heroCta1:       'Shop Now',
  heroCta2:       'View Collections',
  heroImageUrl:   '',
  heroOverlayOpacity: 40,

  /* Announcement bar */
  announceText:   '🎉 Welcome to our store! Free shipping on orders above ₦20,000',
  announceBg:     '#111827',
  announceColor:  '#ffffff',

  /* Products section */
  featuredTitle:  'Featured Products',
  showRatings:    true,
  showBadges:     true,
  showQuickAdd:   true,
  showWishlist:   true,
  productsPerRow: 3,

  /* Promo banner */
  promoTitle:     'New Arrivals',
  promoSub:       'Check out our latest products',
  promoCta:       'Shop Now',

  /* Footer */
  footerTagline:  'Quality products, delivered to your door.',
  footerCopyright:'© 2026 My Store. All rights reserved.',

  /* Section visibility */
  showAnnounce:   true,
  showHero:       true,
  showCats:       true,
  showFeatured:   true,
  showPromo:      true,
  showTrust:      true,
  showNewsletter: true,
  showFooter:     true,

  /* Meta */
  activeTemplate: '',
  activePreset:   '',

  /* SEO */
  metaTitle:      '',
  metaDesc:       '',
  ogImage:        '',

  /* Custom CSS */
  customCss:      '',
}

/* ─── Template presets ──────────────────────────────────────── */
export const TEMPLATES = [


  {
    id: 'blank', name: 'Start Blank', category: 'General',
    desc: 'Start from scratch — no preset colours or fonts',
    thumbnail: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&q=80',
    theme: {
      primary: '#111827', accent: '#2DBD97', bg: '#ffffff',
      text: '#111827', heroBg: '#111827', heroTextColor: '#ffffff',
      radius: 8, btn: 'filled', headingFont: 'DM Sans', cardStyle: 'flat'
    },
  },

  {
    id: 'midnight', name: 'Midnight Navy', category: 'Fashion',
    desc: 'Dark & premium — perfect for luxury African fashion',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    theme: { primary:'#1a1a2e', accent:'#2DBD97', bg:'#ffffff', text:'#111827', heroBg:'#1a1a2e', heroTextColor:'#ffffff', radius:8, btn:'filled', headingFont:'Playfair Display', cardStyle:'shadow' },
  },
  {
    id: 'earth', name: 'Earth Tones', category: 'Lifestyle',
    desc: 'Warm & organic — ideal for natural/sustainable brands',
    thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&q=80',
    theme: { primary:'#78350f', accent:'#d97706', bg:'#fffbf5', text:'#1c1917', heroBg:'#292524', heroTextColor:'#f5f5f4', radius:6, btn:'rounded', headingFont:'Fraunces', cardStyle:'border' },
  },
  {
    id: 'minimal', name: 'Clean Minimal', category: 'General',
    desc: 'Light & crisp — works for any product category',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80',
    theme: { primary:'#111827', accent:'#6366f1', bg:'#ffffff', text:'#111827', heroBg:'#f9fafb', heroTextColor:'#111827', radius:4, btn:'outline', headingFont:'Georgia', cardStyle:'flat' },
  },
  {
    id: 'bold', name: 'Bold Green', category: 'Beauty',
    desc: 'Fresh & vibrant — great for beauty and wellness',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
    theme: { primary:'#064e3b', accent:'#10b981', bg:'#ffffff', text:'#111827', heroBg:'#064e3b', heroTextColor:'#ffffff', radius:12, btn:'pill', headingFont:'Montserrat', cardStyle:'shadow' },
  },
  {
    id: 'luxury', name: 'Royal Purple', category: 'Fashion',
    desc: 'Elegant & rich — for high-end collections',
    thumbnail: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    theme: { primary:'#4c1d95', accent:'#8b5cf6', bg:'#fafafa', text:'#1e1b4b', heroBg:'#1e1b4b', heroTextColor:'#f5f3ff', radius:8, btn:'filled', headingFont:'Playfair Display', cardStyle:'shadow' },
  },
  {
    id: 'coral', name: 'Coral Pop', category: 'Accessories',
    desc: 'Vibrant & playful — for accessories and gifts',
    thumbnail: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    theme: { primary:'#9f1239', accent:'#f43f5e', bg:'#fff1f2', text:'#1c1917', heroBg:'#881337', heroTextColor:'#fff1f2', radius:16, btn:'pill', headingFont:'Poppins', cardStyle:'border' },
  },
]

/* ─── Panel tabs ─────────────────────────────────────────────── */
const PANEL_TABS = [
  { id: 'templates',    label: 'Templates',    icon: ICON.layout    },
  { id: 'theme',        label: 'Theme',        icon: ICON.palette   },
  { id: 'integrations', label: 'Integrations', icon: ICON.plug      },
  { id: 'settings',     label: 'Settings',     icon: ICON.settings  },
]

const PAGES = ['Home', 'Shop', 'Blog', 'About']

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function OnlineStore() {
  const [theme,          setTheme]          = useState(DEFAULT_THEME)
  const [savedTheme,     setSavedTheme]     = useState(JSON.stringify(DEFAULT_THEME))
  const [history,        setHistory]        = useState([JSON.stringify(DEFAULT_THEME)])
  const [histIdx,        setHistIdx]        = useState(0)
  const [viewport,       setViewport]       = useState('desktop')
  const [activeTab,      setActiveTab]      = useState('templates')
  const [activePage,     setActivePage]     = useState('Home')
  const [saveFlash,      setSaveFlash]      = useState(false)
  const [published,      setPublished]      = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [integration,    setIntegration]    = useState(null) // connected store config

  const isDirty = JSON.stringify(theme) !== savedTheme

  /* History */
  const pushHistory = useCallback((next) => {
    const snap = JSON.stringify(next)
    setHistory(h => [...h.slice(0, histIdx + 1), snap])
    setHistIdx(i => i + 1)
  }, [histIdx])

  const update = useCallback((key, val) => {
    setTheme(prev => {
      const next = { ...prev, [key]: val }
      pushHistory(next)
      return next
    })
  }, [pushHistory])

  const updateMany = useCallback((patch) => {
    setTheme(prev => {
      const next = { ...prev, ...patch }
      pushHistory(next)
      return next
    })
  }, [pushHistory])

  const undo = useCallback(() => {
    if (histIdx > 0) { setTheme(JSON.parse(history[histIdx - 1])); setHistIdx(i => i - 1) }
  }, [histIdx, history])

  const redo = useCallback(() => {
    if (histIdx < history.length - 1) { setTheme(JSON.parse(history[histIdx + 1])); setHistIdx(i => i + 1) }
  }, [histIdx, history])

  /* Save (calls your API — replace endpoint as needed) */
  const save = useCallback(async () => {
    setSaving(true)
    try {
      // TODO: Replace with your actual API endpoint
      // await fetch('/api/store/theme', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ theme, integration }),
      // })
      setSavedTheme(JSON.stringify(theme))
      setSaveFlash(true)
      setTimeout(() => setSaveFlash(false), 2000)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }, [theme, integration])

  const publish = useCallback(async () => {
    await save()
    setPublished(true)
    // TODO: trigger CDN invalidation / deployment here
    setTimeout(() => setPublished(false), 3000)
  }, [save])

  const applyTemplate = useCallback((template) => {
    const next = { ...theme, ...template.theme, activeTemplate: template.id, activePreset: template.id }
    setTheme(next)
    pushHistory(next)
  }, [theme, pushHistory])

  /* Keyboard shortcuts */
  useEffect(() => {
    const fn = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo() }
      if (mod && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo() }
      if (mod && e.key === 's') { e.preventDefault(); save() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [undo, redo, save])

  return (
    <div className={styles.builder}>
{theme.storeName === 'My Store' && activeTab !== 'settings' && (
  <div className={styles.setupBanner}>
    <span>👋 Welcome! Start by setting your store name and identity.</span>
    <button className={styles.setupBannerBtn} onClick={() => setActiveTab('theme')}>
      Set up store →
    </button>
  </div>
)}
      {/* ── Topbar ───────────────────────────────────────────── */}
      <div className={styles.topbar}>
        // In the topbar, add a back button:
          <button className={styles.backBtn} onClick={() => navigate('/online-store')}>
           ← Themes
          </button>
        <div className={styles.topLeft}>
          <span className={styles.topTitle}>
            <Ic d={ICON.settings} size={14} /> Store Builder
          </span>
          <span className={styles.topStore}>{theme.storeName}</span>

          <div className={styles.pageSel}>
            {PAGES.map(p => (
              <button key={p}
                className={`${styles.pageBtn} ${activePage === p ? styles.pageBtnOn : ''}`}
                onClick={() => setActivePage(p)}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Viewport */}
        <div className={styles.vpWrap}>
          {[
            { id: 'desktop', icon: ICON.desktop, label: 'Desktop' },
            { id: 'tablet',  icon: ICON.tablet,  label: 'Tablet'  },
            { id: 'phone',   icon: ICON.phone,   label: 'Mobile'  },
          ].map(v => (
            <button key={v.id} title={v.label}
              className={`${styles.vpBtn} ${viewport === v.id ? styles.vpBtnOn : ''}`}
              onClick={() => setViewport(v.id)}>
              <Ic d={v.icon} size={15} />
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className={styles.topRight}>
          <button className={styles.histBtn} onClick={undo} disabled={histIdx === 0} title="Undo (Cmd+Z)">
            <Ic d={ICON.undo} size={14} />
          </button>
          <button className={styles.histBtn} onClick={redo} disabled={histIdx >= history.length - 1} title="Redo">
            <Ic d={ICON.redo} size={14} />
          </button>

          {integration && (
            <span className={styles.integBadge}>
              <Ic d={ICON.link} size={11} stroke="#2DBD97" /> {integration.platform}
            </span>
          )}

          <button
            className={`${styles.saveBtn} ${saveFlash ? styles.saveBtnFlash : ''} ${isDirty && !saveFlash ? styles.saveBtnDirty : ''}`}
            onClick={save} disabled={saving}>
            <Ic d={saving ? ICON.undo : ICON.save} size={13} />
            {saving ? 'Saving…' : saveFlash ? 'Saved!' : 'Save'}
          </button>
          <button
            className={`${styles.pubBtn} ${published ? styles.pubBtnDone : ''}`}
            onClick={publish}>
            <Ic d={published ? ICON.check : ICON.publish} size={13} stroke="#fff" />
            {published ? 'Published!' : 'Publish'}
          </button>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className={styles.body}>

        {/* Left panel */}
        <aside className={styles.panel}>
          <div className={styles.panelTabs}>
            {PANEL_TABS.map(t => (
              <button key={t.id}
                className={`${styles.panelTab} ${activeTab === t.id ? styles.panelTabOn : ''}`}
                onClick={() => setActiveTab(t.id)}>
                <Ic d={t.icon} size={13} />
                {t.label}
              </button>
            ))}
          </div>

          <div className={styles.panelScroll}>
            {activeTab === 'templates' && (
              <TemplateGallery
                templates={TEMPLATES}
                activeTemplate={theme.activeTemplate}
                onApply={applyTemplate}
              />
            )}
            {activeTab === 'theme' && (
              <ThemeEditor theme={theme} update={update} updateMany={updateMany} />
            )}
            {activeTab === 'integrations' && (
              <IntegrationPanel
                integration={integration}
                onConnect={setIntegration}
                onDisconnect={() => setIntegration(null)}
              />
            )}
            {activeTab === 'settings' && (
              <StoreSettings theme={theme} update={update} />
            )}
          </div>
        </aside>

        {/* Preview canvas */}
        <main className={styles.canvas}>
          <div className={`${styles.frame} ${styles[`frame_${viewport}`]}`}>
            <StorefrontPreview
              theme={theme}
              viewport={viewport}
              page={activePage}
              integration={integration}
            />
          </div>
          {isDirty && (
            <div className={styles.unsavedBadge}>● Unsaved changes</div>
          )}
        </main>
      </div>
    </div>
  )
}

/* ─── Store Settings panel ──────────────────────────────────── */
function StoreSettings({ theme, update }) {
  return (
    <div className={styles.panelBody}>
      <div className={styles.settingsSection}>
        <p className={styles.settingsSectionTitle}>SEO & Metadata</p>
        <SettingsField label="Page Title">
          <input className={styles.edInput} value={theme.metaTitle}
            onChange={e => update('metaTitle', e.target.value)}
            placeholder={`${theme.storeName} — African Fashion`} />
        </SettingsField>
        <SettingsField label="Meta Description">
          <textarea className={styles.edTextarea} value={theme.metaDesc}
            onChange={e => update('metaDesc', e.target.value)}
            placeholder="Describe your store for search engines…" rows={3} />
        </SettingsField>
        <SettingsField label="OG Image URL">
          <input className={styles.edInput} value={theme.ogImage}
            onChange={e => update('ogImage', e.target.value)}
            placeholder="https://…/og-image.jpg" />
        </SettingsField>
      </div>

      <div className={styles.settingsSection}>
        <p className={styles.settingsSectionTitle}>Custom CSS</p>
        <SettingsField label="Injected into storefront <head>">
          <textarea className={styles.edTextarea}
            value={theme.customCss}
            onChange={e => update('customCss', e.target.value)}
            placeholder=".my-class { color: red; }"
            rows={6}
            style={{ fontFamily: 'monospace', fontSize: 12 }} />
        </SettingsField>
      </div>

      <div className={styles.settingsSection}>
        <p className={styles.settingsSectionTitle}>Store URLs</p>
        <SettingsField label="Custom Domain">
          <input className={styles.edInput} placeholder="shop.yourdomain.com" />
        </SettingsField>
        <SettingsField label="Storefront Path">
          <input className={styles.edInput} placeholder="/online-store" disabled
            value="/online-store" style={{ color: '#9CA3AF' }} />
        </SettingsField>
      </div>
    </div>
  )
}

function SettingsField({ label, children }) {
  return (
    <div className={styles.edField}>
      <label className={styles.edLabel}>{label}</label>
      {children}
    </div>
  )
}
