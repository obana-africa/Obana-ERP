/**
 * WebshopBuilder.jsx
 * Full Shopify-style webshop builder.
 * Route: /online-store/editor  or  /online-store/editor/:themeId
 *
 * Left panel  — Section tree (Header / Template sections / Footer)
 *               + Theme, Integrations, Settings tabs
 * Right panel — Live storefront preview (desktop / tablet / mobile)
 * Topbar      — Back ← Themes | Store name | Page switcher | Viewport | Undo/Redo | Save | Publish
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate, useParams }                    from 'react-router-dom'
import styles from './WebshopBuilder.module.css'

/* ─── Tiny SVG icon ─────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none', className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ─── Icon paths ────────────────────────────────────────────── */
const IC = {
  back:     'M19 12H5M12 5l-7 7 7 7',
  desktop:  ['M2 8h20v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8zM2 8V6a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v2', 'M8 21h8m-4-2v2'],
  tablet:   ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M12 17h.01'],
  phone:    ['M12 18h.01', 'M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z'],
  save:     ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'],
  publish:  ['M22 2L11 13', 'M22 2L15 22l-4-9-9-4 20-7z'],
  check:    'M20 6L9 17l-5-5',
  undo:     ['M3 7v6h6', 'M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'],
  redo:     ['M21 7v6h-6', 'M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13'],
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  chevR:    'M9 18l6-6-6-6',
  chevD:    'M6 9l6 6 6-6',
  chevU:    'M18 15l-6-6-6 6',
  drag:     ['M8 6h.01M8 12h.01M8 18h.01M16 6h.01M16 12h.01M16 18h.01'],
  hide:     ['M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94', 'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19', 'M1 1l22 22'],
  plus:     'M12 5v14M5 12h14',
  trash:    ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
  palette:  ['M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10', 'M12 2c2 4 4 6 4 10', 'M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0'],
  layout:   ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  plug:     ['M12 22V12', 'M5 12H2a10 10 0 0 0 20 0h-3', 'M8 6l4-4 4 4', 'M8 2h8'],
  gear:     ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
}

/* ─── Default theme ─────────────────────────────────────────── */
const DEFAULT_THEME = {
  storeName: 'My Store', logoText: 'My Store',
  primary: '#1b3b5f', accent: '#fbbf24',
  bg: '#ffffff', text: '#111827',
  heroBg: '#1b3b5f', heroTextColor: '#ffffff',
  navBg: '#ffffff', navText: '#111827',
  footerBg: '#1b3b5f', footerText: '#ffffff',
  cardBg: '#ffffff', cardBorder: '#E5E7EB',
  headingFont: 'DM Sans', bodyFont: 'DM Sans',
  radius: 8, btn: 'filled',
  heroTitle: 'Your Store Headline',
  heroSub: 'Describe your store and what makes it special',
  heroCta1: 'Shop Now', heroCta2: 'View Collections',
  announceText: ' Free shipping on orders above ₦20,000',
  announceBg: '#1b3b5f', announceColor: '#ffffff',
  featuredTitle: 'Featured Products',
  showAnnounce: true, showHero: true, showCats: true,
  showFeatured: true, showPromo: true, showNewsletter: true, showFooter: true,
  metaTitle: '', metaDesc: '', customCss: '',
}

/* ─── Section tree data ─────────────────────────────────────── */
const INITIAL_SECTIONS = {
  header: [
    { id: 'announce',   label: 'Announcement bar', icon: '', visible: true },
    { id: 'nav',        label: 'Header',            icon: '', visible: true },
  ],
  template: [
    { id: 'slideshow',  label: 'Slideshow',         icon: '', visible: true },
    { id: 'new-arr',    label: 'New Arrivals',       icon: '', visible: true },
    { id: 'wardrobe',   label: 'Wardrobe Reset',     icon: '', visible: true },
    { id: 'brands',     label: 'Top Brands',        icon: '', visible: true },
    { id: 'featured',   label: 'Featured collection',icon: '', visible: true },
    { id: 'african',    label: 'African Inspired',   icon: '', visible: true, sub: true },
    { id: 'categories', label: 'Categories',         icon: '', visible: true },
    { id: 'shirts',     label: 'Shirts collection',  icon: '', visible: true },
    { id: 'sec1',       label: 'Section',            icon: '',  visible: true },
    { id: 'sec2',       label: 'Section',            icon: '',  visible: true },
  ],
  footer: [
    { id: 'email-sig',  label: 'Email signup',       icon: '', visible: true },
    { id: 'footer',     label: 'Footer',             icon: '', visible: true },
    { id: 'custom-liq', label: 'Custom Liquid',      icon: '<>', visible: true },
  ],
}

const PAGES    = ['Home', 'Shop', 'Blog', 'About']
const VIEWPORTS = [
  { id: 'desktop', icon: IC.desktop, label: 'Desktop' },
  { id: 'tablet',  icon: IC.tablet,  label: 'Tablet'  },
  { id: 'phone',   icon: IC.phone,   label: 'Mobile'  },
]
const PANEL_TABS = [
  { id: 'sections',     label: 'Sections',      icon: IC.layout  },
  { id: 'theme',        label: 'Theme',         icon: IC.palette },
  { id: 'integrations', label: 'Integrations',  icon: IC.plug    },
  { id: 'settings',     label: 'Settings',      icon: IC.gear    },
]

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function WebshopBuilder() {
  const navigate   = useNavigate()
  const { themeId } = useParams()

  const [theme,      setTheme]      = useState(DEFAULT_THEME)
  const [savedTheme, setSavedTheme] = useState(JSON.stringify(DEFAULT_THEME))
  const [history,    setHistory]    = useState([JSON.stringify(DEFAULT_THEME)])
  const [histIdx,    setHistIdx]    = useState(0)
  const [sections,   setSections]   = useState(INITIAL_SECTIONS)
  const [viewport,   setViewport]   = useState('desktop')
  const [activeTab,  setActiveTab]  = useState('sections')
  const [activePage, setActivePage] = useState('Home')
  const [activeSection, setActiveSection] = useState(null)
  const [expanded,   setExpanded]   = useState({ header: true, template: true, footer: true })
  const [saving,     setSaving]     = useState(false)
  const [saveFlash,  setSaveFlash]  = useState(false)
  const [published,  setPublished]  = useState(false)
  const [themeName,  setThemeName]  = useState(themeId ? 'Trade' : 'My Store')

  const isDirty = JSON.stringify(theme) !== savedTheme

  /* ── History helpers ── */
  const pushHistory = useCallback((next) => {
    const snap = JSON.stringify(next)
    setHistory(h => [...h.slice(0, histIdx + 1), snap])
    setHistIdx(i => i + 1)
  }, [histIdx])

  const update = useCallback((key, val) => {
    setTheme(prev => { const n = { ...prev, [key]: val }; pushHistory(n); return n })
  }, [pushHistory])

  const undo = useCallback(() => {
    if (histIdx > 0) { setTheme(JSON.parse(history[histIdx - 1])); setHistIdx(i => i - 1) }
  }, [histIdx, history])

  const redo = useCallback(() => {
    if (histIdx < history.length - 1) { setTheme(JSON.parse(history[histIdx + 1])); setHistIdx(i => i + 1) }
  }, [histIdx, history])

  /* ── Save ── */
  const save = useCallback(async () => {
    setSaving(true)
    try {
      // TODO: await api.post('/themes/' + themeId, { theme, sections })
      await new Promise(r => setTimeout(r, 700)) // simulate latency
      setSavedTheme(JSON.stringify(theme))
      setSaveFlash(true)
      setTimeout(() => setSaveFlash(false), 2000)
    } finally { setSaving(false) }
  }, [theme, themeId])

  const publish = useCallback(async () => {
    await save()
    setPublished(true)
    // TODO: trigger CDN / deployment pipeline
    setTimeout(() => setPublished(false), 3000)
  }, [save])

  /* ── Keyboard shortcuts ── */
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

  /* ── Section actions ── */
  const toggleVisible = (group, id) => {
    setSections(prev => ({
      ...prev,
      [group]: prev[group].map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    }))
  }

  const removeSection = (group, id) => {
    setSections(prev => ({
      ...prev,
      [group]: prev[group].filter(s => s.id !== id)
    }))
    if (activeSection?.id === id) setActiveSection(null)
  }

  const addSection = (group) => {
    const newSec = {
      id: `sec-${Date.now()}`,
      label: 'New section',
      icon: '▦',
      visible: true,
    }
    setSections(prev => ({ ...prev, [group]: [...prev[group], newSec] }))
  }

  /* ─────────────────────────────────────────────────────────── */
  return (
    <div className={styles.builder}>

      {/* ══ TOPBAR ════════════════════════════════════════════ */}
      <header className={styles.topbar}>
        {/* Left: back + store name + page selector */}
        <div className={styles.topLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/online-store/themes')} title="Back to Themes">
            <Ic d={IC.back} size={14} stroke="#fff" />
            <span>Themes</span>
          </button>

          <div className={styles.topDivider} />

          <span className={styles.topThemeName}>{themeName}</span>
          <span className={`${styles.topBadge} ${styles.topBadgeActive}`}>Active</span>

          <div className={styles.pageSel}>
            {PAGES.map(p => (
              <button key={p}
                className={`${styles.pageBtn} ${activePage === p ? styles.pageBtnOn : ''}`}
                onClick={() => setActivePage(p)}>
                {p}
              </button>
            ))}
            <button className={styles.pageBtn} title="More pages">
              <Ic d={IC.chevD} size={12} />
            </button>
          </div>
        </div>

        {/* Center: viewport switcher */}
        <div className={styles.vpWrap}>
          {VIEWPORTS.map(v => (
            <button key={v.id} title={v.label}
              className={`${styles.vpBtn} ${viewport === v.id ? styles.vpBtnOn : ''}`}
              onClick={() => setViewport(v.id)}>
              <Ic d={v.icon} size={15} />
            </button>
          ))}
        </div>

        {/* Right: undo/redo + save + publish */}
        <div className={styles.topRight}>
          <button className={styles.iconBtn} onClick={undo} disabled={histIdx === 0} title="Undo (⌘Z)">
            <Ic d={IC.undo} size={14} />
          </button>
          <button className={styles.iconBtn} onClick={redo} disabled={histIdx >= history.length - 1} title="Redo">
            <Ic d={IC.redo} size={14} />
          </button>

          <div className={styles.topDivider} />

          <button className={styles.previewBtn} onClick={() => window.open('/', '_blank')} title="Preview store">
            <Ic d={IC.eye} size={14} />
            Preview
          </button>

          <button
            className={`${styles.saveBtn} ${saveFlash ? styles.saveBtnFlash : ''} ${isDirty && !saveFlash ? styles.saveBtnDirty : ''}`}
            onClick={save} disabled={saving}>
            <Ic d={saving ? IC.undo : IC.save} size={13} />
            {saving ? 'Saving…' : saveFlash ? 'Saved ✓' : 'Save'}
          </button>

          <button
            className={`${styles.pubBtn} ${published ? styles.pubBtnDone : ''}`}
            onClick={publish}>
            <Ic d={published ? IC.check : IC.publish} size={13} stroke="#fff" />
            {published ? 'Published!' : 'Publish'}
          </button>
        </div>
      </header>

      {/* ══ BODY ══════════════════════════════════════════════ */}
      <div className={styles.body}>

        {/* ── LEFT PANEL ─────────────────────────────────── */}
        <aside className={styles.panel}>

          {/* Panel tab bar */}
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

          {/* Panel content */}
          <div className={styles.panelScroll}>

            {/* ── SECTIONS TAB ──────────────────────────── */}
            {activeTab === 'sections' && (
              <div className={styles.sectionTree}>

                {/* Page header row */}
                <div className={styles.treePageHeader}>
                  <span className={styles.treePageLabel}>Home page</span>
                </div>

                {/* HEADER group */}
                <SectionGroup
                  label="Header"
                  items={sections.header}
                  isOpen={expanded.header}
                  onToggle={() => setExpanded(e => ({ ...e, header: !e.header }))}
                  activeId={activeSection?.id}
                  onSelect={setActiveSection}
                  onToggleVisible={(id) => toggleVisible('header', id)}
                  onRemove={(id) => removeSection('header', id)}
                  onAdd={() => addSection('header')}
                />

                {/* TEMPLATE group */}
                <SectionGroup
                  label="Template"
                  items={sections.template}
                  isOpen={expanded.template}
                  onToggle={() => setExpanded(e => ({ ...e, template: !e.template }))}
                  activeId={activeSection?.id}
                  onSelect={setActiveSection}
                  onToggleVisible={(id) => toggleVisible('template', id)}
                  onRemove={(id) => removeSection('template', id)}
                  onAdd={() => addSection('template')}
                />

                {/* FOOTER group */}
                <SectionGroup
                  label="Footer"
                  items={sections.footer}
                  isOpen={expanded.footer}
                  onToggle={() => setExpanded(e => ({ ...e, footer: !e.footer }))}
                  activeId={activeSection?.id}
                  onSelect={setActiveSection}
                  onToggleVisible={(id) => toggleVisible('footer', id)}
                  onRemove={(id) => removeSection('footer', id)}
                  onAdd={() => addSection('footer')}
                />
              </div>
            )}

            {/* ── THEME TAB ─────────────────────────────── */}
            {activeTab === 'theme' && (
              <ThemePanel theme={theme} update={update} />
            )}

            {/* ── INTEGRATIONS TAB ──────────────────────── */}
            {activeTab === 'integrations' && (
              <IntegrationsPanel />
            )}

            {/* ── SETTINGS TAB ──────────────────────────── */}
            {activeTab === 'settings' && (
              <SettingsPanel theme={theme} update={update} />
            )}
          </div>
        </aside>

        {/* ── PREVIEW CANVAS ─────────────────────────── */}
        <main className={styles.canvas}>
          <div className={`${styles.frame} ${styles[`frame_${viewport}`]}`}>
            <StorefrontPreview
              theme={theme}
              sections={sections}
              viewport={viewport}
              page={activePage}
              activeSection={activeSection}
            />
          </div>
          {isDirty && <div className={styles.unsavedBadge}>● Unsaved changes</div>}
        </main>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SECTION GROUP — collapsible group with rows
   ══════════════════════════════════════════════════════════════ */
function SectionGroup({ label, items, isOpen, onToggle, activeId, onSelect, onToggleVisible, onRemove, onAdd }) {
  return (
    <div className={styles.secGroup}>
      {/* Group header */}
      <button className={styles.secGroupHead} onClick={onToggle}>
        <Ic d={isOpen ? IC.chevD : IC.chevR} size={13} stroke="#6B7280" />
        <span className={styles.secGroupLabel}>{label}</span>
      </button>

      {isOpen && (
        <>
          {items.map(sec => (
            <SectionRow
              key={sec.id}
              sec={sec}
              isActive={activeId === sec.id}
              onSelect={() => onSelect(sec)}
              onToggleVisible={() => onToggleVisible(sec.id)}
              onRemove={() => onRemove(sec.id)}
            />
          ))}

          {/* Add section button */}
          <button className={styles.addSectionBtn} onClick={onAdd}>
            <Ic d={IC.plus} size={13} stroke="var(--color-primary)" />
            Add section
          </button>
        </>
      )}
    </div>
  )
}

/* ── Single section row ────────────────────────────────────── */
function SectionRow({ sec, isActive, onSelect, onToggleVisible, onRemove }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`${styles.secRow} ${isActive ? styles.secRowActive : ''} ${sec.sub ? styles.secRowSub : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Drag handle */}
      <span className={styles.secDrag}>
        <Ic d={IC.drag} size={13} stroke="#D1D5DB" sw={2} />
      </span>

      {/* Section icon — acts as expand chevron if sub */}
      {sec.sub
        ? <span className={styles.secSubDash}>—</span>
        : <span className={styles.secIcon}>{sec.icon}</span>
      }

      {/* Label */}
      <button className={styles.secLabel} onClick={onSelect}>
        {sec.label}
      </button>

      {/* Actions — appear on hover */}
      <div className={`${styles.secActions} ${hovered ? styles.secActionsVisible : ''}`}>
        <button className={styles.secActionBtn} onClick={onToggleVisible}
          title={sec.visible ? 'Hide section' : 'Show section'}>
          <Ic d={sec.visible ? IC.eye : IC.hide} size={13} stroke="#9CA3AF" />
        </button>
        <button className={styles.secActionBtn} onClick={onRemove} title="Remove section">
          <Ic d={IC.trash} size={13} stroke="#9CA3AF" />
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   THEME PANEL
   ══════════════════════════════════════════════════════════════ */
function ThemePanel({ theme, update }) {
  return (
    <div className={styles.panelBody}>
      <Accordion icon="" title="Colors">
        <ColorField label="Primary"    value={theme.primary}       onChange={v => update('primary', v)} />
        <ColorField label="Accent"     value={theme.accent}        onChange={v => update('accent', v)} />
        <ColorField label="Background" value={theme.bg}            onChange={v => update('bg', v)} />
        <ColorField label="Text"       value={theme.text}          onChange={v => update('text', v)} />
        <ColorField label="Nav Bg"     value={theme.navBg}         onChange={v => update('navBg', v)} />
        <ColorField label="Hero Bg"    value={theme.heroBg}        onChange={v => update('heroBg', v)} />
        <ColorField label="Footer Bg"  value={theme.footerBg}      onChange={v => update('footerBg', v)} />
      </Accordion>

      <Accordion icon="" title="Typography">
        <Field label="Heading font">
          <select className={styles.select} value={theme.headingFont} onChange={e => update('headingFont', e.target.value)}>
            {['DM Sans','Playfair Display','Montserrat','Poppins','Fraunces','Georgia'].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Body font">
          <select className={styles.select} value={theme.bodyFont} onChange={e => update('bodyFont', e.target.value)}>
            {['DM Sans','Inter','Roboto','Open Sans','Lato'].map(f => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </Accordion>

      <Accordion icon="" title="Layout & Shape">
        <Field label={`Border radius: ${theme.radius}px`}>
          <input type="range" min={0} max={24} value={theme.radius}
            className={styles.range} onChange={e => update('radius', Number(e.target.value))} />
        </Field>
        <Field label="Button style">
          <select className={styles.select} value={theme.btn} onChange={e => update('btn', e.target.value)}>
            {['filled','outline','pill','rounded'].map(b => <option key={b}>{b}</option>)}
          </select>
        </Field>
      </Accordion>

      <Accordion icon="" title="Announcement Bar">
        <ToggleRow label="Show" value={theme.showAnnounce} onChange={v => update('showAnnounce', v)} />
        <Field label="Text">
          <input className={styles.input} value={theme.announceText} onChange={e => update('announceText', e.target.value)} />
        </Field>
        <ColorField label="Background" value={theme.announceBg}    onChange={v => update('announceBg', v)} />
        <ColorField label="Text color" value={theme.announceColor} onChange={v => update('announceColor', v)} />
      </Accordion>

      <Accordion icon="" title="Hero Section">
        <ToggleRow label="Show" value={theme.showHero} onChange={v => update('showHero', v)} />
        <Field label="Headline">
          <input className={styles.input} value={theme.heroTitle} onChange={e => update('heroTitle', e.target.value)} />
        </Field>
        <Field label="Subtext">
          <textarea className={styles.textarea} rows={2} value={theme.heroSub} onChange={e => update('heroSub', e.target.value)} />
        </Field>
        <Field label="CTA 1"><input className={styles.input} value={theme.heroCta1} onChange={e => update('heroCta1', e.target.value)} /></Field>
        <Field label="CTA 2"><input className={styles.input} value={theme.heroCta2} onChange={e => update('heroCta2', e.target.value)} /></Field>
      </Accordion>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   INTEGRATIONS PANEL
   ══════════════════════════════════════════════════════════════ */
const INTEGRATIONS = [
  { id: 'shopify',   name: 'Shopify',    icon: '', desc: 'Sync products & orders',   connected: false },
  { id: 'woocom',    name: 'WooCommerce',icon: '', desc: 'Import from WooCommerce',   connected: false },
  { id: 'paystack',  name: 'Paystack',   icon: '', desc: 'Accept payments',           connected: true  },
  { id: 'flutterw',  name: 'Flutterwave',icon: '', desc: 'Multi-currency payments',   connected: false },
  { id: 'analytics', name: 'Analytics',  icon: '', desc: 'Google Analytics 4',        connected: false },
]

function IntegrationsPanel() {
  const [list, setList] = useState(INTEGRATIONS)
  const [open, setOpen]  = useState(null)

  const toggle = (id) => setOpen(o => o === id ? null : id)
  const connect = (id) => setList(l => l.map(x => x.id === id ? { ...x, connected: true } : x))
  const disconnect = (id) => setList(l => l.map(x => x.id === id ? { ...x, connected: false } : x))

  return (
    <div className={styles.panelBody}>
      <p className={styles.panelHint}>Connect your store to external platforms and payment providers.</p>
      {list.map(integ => (
        <div key={integ.id}>
          <button className={`${styles.integRow} ${open === integ.id ? styles.integRowOpen : ''}`}
            onClick={() => toggle(integ.id)}>
            <span className={styles.integIcon}>{integ.icon}</span>
            <div className={styles.integInfo}>
              <p className={styles.integName}>{integ.name}</p>
              <p className={styles.integDesc}>{integ.desc}</p>
            </div>
            {integ.connected && <span className={styles.integBadge}>Connected</span>}
            <Ic d={IC.chevD} size={13} stroke="#9CA3AF"
              className={open === integ.id ? styles.chevOpen : ''} />
          </button>

          {open === integ.id && (
            <div className={styles.integForm}>
              {integ.connected ? (
                <div className={styles.integConnected}>
                  <div className={styles.integConnectedDot} />
                  <div>
                    <p className={styles.integConnectedName}>{integ.name} connected</p>
                    <p className={styles.integConnectedSub}>Last synced: just now</p>
                  </div>
                  <button className={styles.integDisconnect} onClick={() => disconnect(integ.id)}>
                    Disconnect
                  </button>
                </div>
              ) : (
                <>
                  <Field label="API Key">
                    <input className={styles.input} placeholder="sk_live_…" type="password" />
                  </Field>
                  <Field label="Store URL">
                    <input className={styles.input} placeholder="https://yourstore.com" />
                  </Field>
                  <button className={styles.integConnectBtn} onClick={() => connect(integ.id)}>
                    Connect {integ.name}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SETTINGS PANEL
   ══════════════════════════════════════════════════════════════ */
function SettingsPanel({ theme, update }) {
  return (
    <div className={styles.panelBody}>
      <Accordion icon="" title="SEO & Metadata" defaultOpen>
        <Field label="Page title">
          <input className={styles.input} value={theme.metaTitle}
            onChange={e => update('metaTitle', e.target.value)}
            placeholder={`${theme.storeName} — Shop Now`} />
        </Field>
        <Field label="Meta description">
          <textarea className={styles.textarea} rows={3} value={theme.metaDesc}
            onChange={e => update('metaDesc', e.target.value)}
            placeholder="Describe your store for search engines…" />
        </Field>
      </Accordion>
      <Accordion icon="" title="Store URL">
        <Field label="Custom domain">
          <input className={styles.input} placeholder="shop.yourdomain.com" />
        </Field>
        <Field label="Storefront path">
          <input className={styles.input} value="/online-store" disabled style={{ color: '#9CA3AF' }} />
        </Field>
      </Accordion>
      <Accordion icon="" title="Custom CSS">
        <Field label="Injected into storefront <head>">
          <textarea className={styles.textarea} rows={6} value={theme.customCss}
            onChange={e => update('customCss', e.target.value)}
            placeholder=".my-class { color: red; }"
            style={{ fontFamily: 'monospace', fontSize: 11 }} />
        </Field>
      </Accordion>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   STOREFRONT PREVIEW
   ══════════════════════════════════════════════════════════════ */
function StorefrontPreview({ theme, sections, viewport, page, activeSection }) {
  const r = theme.radius
  const btnRadius = theme.btn === 'pill' ? 99 : theme.btn === 'rounded' ? r + 4 : r

  const Btn = ({ children, variant = 'primary', style = {} }) => (
    <button style={{
      padding: '10px 20px', borderRadius: btnRadius, fontWeight: 700,
      fontSize: 13, cursor: 'pointer', fontFamily: theme.bodyFont,
      background: variant === 'primary' ? theme.accent : 'transparent',
      color: variant === 'primary' ? '#fff' : theme.accent,
      border: `2px solid ${theme.accent}`,
      transition: 'all 0.15s',
      ...style,
    }}>{children}</button>
  )

  const visible = (id) => {
    for (const group of Object.values(sections)) {
      const found = group.find(s => s.id === id)
      if (found) return found.visible
    }
    return true
  }

  const highlight = (id) => activeSection?.id === id
    ? { outline: '2px solid #fbbf24', outlineOffset: 2 }
    : {}

  const isMobile = viewport === 'phone'

  return (
    <div style={{ fontFamily: theme.bodyFont, background: theme.bg, minHeight: '100vh', color: theme.text }}>

      {/* Announcement bar */}
      {visible('announce') && (
        <div style={{ background: theme.announceBg, color: theme.announceColor,
          textAlign: 'center', padding: '8px 16px', fontSize: 12, fontWeight: 600,
          ...highlight('announce') }}>
          {theme.announceText}
        </div>
      )}

      {/* Nav */}
      {visible('nav') && (
        <nav style={{ background: theme.navBg, color: theme.navText,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: isMobile ? '12px 16px' : '14px 40px',
          borderBottom: `1px solid ${theme.cardBorder}`,
          ...highlight('nav') }}>
          <span style={{ fontWeight: 800, fontSize: isMobile ? 16 : 18, color: theme.primary }}>
            {theme.logoText || theme.storeName}
          </span>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 24, fontSize: 13, fontWeight: 500, color: theme.navText }}>
              {['Brands','Men','Africa Inspired','Find Locations'].map(l => (
                <span key={l} style={{ cursor: 'pointer', opacity: 0.8 }}>{l}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, color: theme.navText }}>
            {['','',''].map(i => <span key={i} style={{ cursor: 'pointer', fontSize: 16 }}>{i}</span>)}
          </div>
        </nav>
      )}

      {/* Hero */}
      {visible('slideshow') && page === 'Home' && (
        <div style={{
          background: theme.heroBg, color: theme.heroTextColor,
          padding: isMobile ? '48px 20px' : '80px 60px',
          textAlign: 'center', position: 'relative',
          ...highlight('slideshow') }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', opacity: 0.7, marginBottom: 8, textTransform: 'uppercase' }}>
            New Season
          </p>
          <h1 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? 28 : 48, fontWeight: 800, margin: '0 0 16px', lineHeight: 1.15 }}>
            {theme.heroTitle}
          </h1>
          <p style={{ fontSize: isMobile ? 14 : 16, opacity: 0.75, marginBottom: 28, maxWidth: 520, margin: '0 auto 28px' }}>
            {theme.heroSub}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn>{theme.heroCta1}</Btn>
            <Btn variant="secondary">{theme.heroCta2}</Btn>
          </div>
        </div>
      )}

      {/* Featured products */}
      {visible('featured') && page === 'Home' && (
        <div style={{ padding: isMobile ? '32px 16px' : '48px 40px', ...highlight('featured') }}>
          <h2 style={{ fontFamily: theme.headingFont, fontSize: isMobile ? 20 : 26, fontWeight: 800, marginBottom: 24, color: theme.primary }}>
            {theme.featuredTitle}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { name: 'Essentials Jacket', price: '₦28,000', badge: 'New' },
              { name: 'Logo Full-Zip', price: '₦22,500', badge: 'Sale' },
              { name: '3-Stripes Hoodie', price: '₦19,000', badge: '' },
              { name: 'Bayern T-Shirt', price: '₦12,000', badge: 'Hot' },
            ].map((p, i) => (
              <div key={i} style={{
                background: theme.cardBg, borderRadius: r,
                border: `1px solid ${theme.cardBorder}`,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              }}>
                <div style={{ height: isMobile ? 120 : 180, background: `${theme.primary}12`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <span style={{ fontSize: 36 }}>👕</span>
                  {p.badge && (
                    <span style={{ position: 'absolute', top: 8, left: 8,
                      background: theme.accent, color: '#fff',
                      fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 99 }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 4px', color: theme.text }}>{p.name}</p>
                  <p style={{ fontSize: 13, fontWeight: 800, color: theme.primary, margin: 0 }}>{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {visible('categories') && page === 'Home' && (
        <div style={{ padding: isMobile ? '24px 16px' : '32px 40px', background: `${theme.primary}06`, ...highlight('categories') }}>
          <h3 style={{ fontFamily: theme.headingFont, fontSize: 18, fontWeight: 700, marginBottom: 16, color: theme.primary }}>
            Shop by Category
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Men','Women','Kids','Accessories','Footwear'].map(cat => (
              <div key={cat} style={{
                padding: '10px 20px', borderRadius: btnRadius,
                background: theme.cardBg, border: `1.5px solid ${theme.cardBorder}`,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', color: theme.text,
              }}>{cat}</div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      {visible('email-sig') && page === 'Home' && (
        <div style={{
          background: `${theme.primary}08`, padding: isMobile ? '32px 20px' : '48px',
          textAlign: 'center', borderTop: `1px solid ${theme.cardBorder}`,
          ...highlight('email-sig') }}>
          <h3 style={{ fontFamily: theme.headingFont, fontSize: 20, fontWeight: 700, marginBottom: 8, color: theme.primary }}>
            Stay in the loop
          </h3>
          <p style={{ fontSize: 13, color: `${theme.text}99`, marginBottom: 20 }}>
            Get exclusive deals and new arrivals straight to your inbox.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', maxWidth: 400, margin: '0 auto' }}>
            <input style={{
              flex: 1, padding: '10px 14px', borderRadius: r,
              border: `1.5px solid ${theme.cardBorder}`, fontSize: 13, outline: 'none',
              fontFamily: theme.bodyFont,
            }} placeholder="your@email.com" />
            <Btn>Subscribe</Btn>
          </div>
        </div>
      )}

      {/* Footer */}
      {visible('footer') && (
        <footer style={{
          background: theme.footerBg, color: theme.footerText,
          padding: isMobile ? '32px 20px' : '48px 60px',
          ...highlight('footer') }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: 32 }}>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 8, opacity: 1 }}>{theme.storeName}</p>
              <p style={{ fontSize: 12, opacity: 0.6, lineHeight: 1.6 }}>
                Quality products, delivered to your door.
              </p>
            </div>
            {[['Shop', ['New Arrivals', 'Men', 'Women', 'Sale']],
              ['Help', ['FAQ', 'Shipping', 'Returns']],
              ['Company', ['About Us', 'Careers', 'Contact']]].map(([title, links]) => (
              <div key={title}>
                <p style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, marginBottom: 10 }}>{title}</p>
                {links.map(l => <p key={l} style={{ fontSize: 13, opacity: 0.7, marginBottom: 6, cursor: 'pointer' }}>{l}</p>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: 'rgba(255,255,255,0.12) 1px solid', marginTop: 32, paddingTop: 20, fontSize: 11, opacity: 0.5, textAlign: 'center' }}>
            © {new Date().getFullYear()} {theme.storeName}. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   SHARED UI PRIMITIVES
   ══════════════════════════════════════════════════════════════ */

/* Accordion */
function Accordion({ icon, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionHead} onClick={() => setOpen(o => !o)}>
        <span className={styles.accordionIcon}>{icon}</span>
        <span className={styles.accordionTitle}>{title}</span>
        <Ic d={open ? IC.chevU : IC.chevD} size={13} stroke="#9CA3AF" />
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  )
}

/* Field wrapper */
function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      {children}
    </div>
  )
}

/* Color field with hex input + native picker */
function ColorField({ label, value, onChange }) {
  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel}>{label}</label>
      <div className={styles.colorRow}>
        <input type="color" className={styles.colorNative}
          value={value} onChange={e => onChange(e.target.value)} />
        <div className={styles.colorSwatch} style={{ background: value }} />
        <input className={styles.colorHex} value={value}
          onChange={e => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && onChange(e.target.value)} />
      </div>
    </div>
  )
}

/* Toggle row */
function ToggleRow({ label, value, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <button className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
        onClick={() => onChange(!value)}>
        <span className={styles.toggleThumb} />
      </button>
    </div>
  )
}
