/**
 * ThemeEditor.jsx
 * Full theme customization panel: colours, typography, layout,
 * sections, content — all editable, all wired to live preview.
 */

import { useState, useRef, useEffect } from 'react'
import styles from '../OnlineStore.module.css'

const Ic = ({ d, size = 13, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)
const CHEV = 'M6 9l6 6 6-6'

const FONTS       = ['Playfair Display','Fraunces','Cormorant Garamond','DM Sans','Syne','Montserrat','Poppins','Lato','Georgia']
const BODY_FONTS  = ['DM Sans','Lato','Poppins','Montserrat','Open Sans','Roboto','Nunito']
const BTN_STYLES  = [{v:'filled',l:'Filled'},{v:'outline',l:'Outline'},{v:'rounded',l:'Rounded'},{v:'pill',l:'Pill'}]
const NAV_LAYOUTS = [{v:'left',l:'Left'},{v:'centered',l:'Centered'},{v:'split',l:'Split'}]
const COL_OPTS    = [{v:2,l:'2 Columns'},{v:3,l:'3 Columns'},{v:4,l:'4 Columns'}]
const CARD_STYLES = [{v:'shadow',l:'Shadow'},{v:'border',l:'Border'},{v:'flat',l:'Flat'}]

const COLOR_GROUPS = {
  primary:       ['#1a1a2e','#0f172a','#111827','#1e293b','#064e3b','#4c1d95','#881337','#78350f'],
  accent:        ['#2DBD97','#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#0ea5e9','#ec4899'],
  background:    ['#ffffff','#f9fafb','#f8fafc','#fffbf5','#f0fdf4','#fdf2f8','#1a1a2e','#0f172a'],
  text:          ['#111827','#1f2937','#374151','#1c1917','#1e1b4b','#ffffff','#f9fafb','#e5e7eb'],
}

const SECTIONS_DEF = [
  { id:'announce',   label:'Announcement Bar', icon:'📢', key:'showAnnounce'   },
  { id:'hero',       label:'Hero Banner',       icon:'🖼',  key:'showHero'       },
  { id:'cats',       label:'Category Pills',    icon:'🏷',  key:'showCats'       },
  { id:'featured',   label:'Featured Products', icon:'🛍',  key:'showFeatured'   },
  { id:'promo',      label:'Promo Banner',      icon:'📣',  key:'showPromo'      },
  { id:'trust',      label:'Trust Badges',      icon:'✅',  key:'showTrust'      },
  { id:'newsletter', label:'Newsletter',        icon:'📧',  key:'showNewsletter' },
  { id:'footer',     label:'Footer',            icon:'🦶',  key:'showFooter'     },
]

/* ─── Reusable primitives ────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <button
      className={`${styles.toggle} ${value ? styles.toggleOn : ''}`}
      onClick={() => onChange(!value)}
      role="switch" aria-checked={value} type="button">
      <span className={styles.toggleThumb} />
    </button>
  )
}

function Field({ label, children, row }) {
  if (row) return (
    <div className={styles.edRow}>
      <label className={styles.edLabel}>{label}</label>
      {children}
    </div>
  )
  return (
    <div className={styles.edField}>
      {label && <label className={styles.edLabel}>{label}</label>}
      {children}
    </div>
  )
}

function Select({ value, onChange, options }) {
  return (
    <select className={styles.edSelect}
      value={value}
      onChange={e => onChange(isNaN(e.target.value) ? e.target.value : +e.target.value)}>
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.v
        const l = typeof o === 'string' ? o : o.l
        return <option key={v} value={v}>{l}</option>
      })}
    </select>
  )
}

function ColorPicker({ label, value, onChange, group = 'primary' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const presets = COLOR_GROUPS[group] || COLOR_GROUPS.primary

  useEffect(() => {
    if (!open) return
    const fn = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  return (
    <div className={styles.cpWrap} ref={ref}>
      {label && <label className={styles.edLabel}>{label}</label>}
      <div className={styles.cpRow}>
        <button type="button" className={styles.cpSwatch}
          style={{ background: value }} onClick={() => setOpen(o => !o)} />
        <input className={styles.cpHex} value={value}
          onChange={e => onChange(e.target.value)} spellCheck={false} />
      </div>
      {open && (
        <div className={styles.cpDropdown}>
          <div className={styles.cpPresets}>
            {presets.map(c => (
              <button key={c} type="button"
                className={`${styles.cpPreset} ${c === value ? styles.cpPresetOn : ''}`}
                style={{ background: c }} onClick={() => { onChange(c); setOpen(false) }} title={c} />
            ))}
          </div>
          <input type="color" className={styles.cpNative} value={value}
            onChange={e => onChange(e.target.value)} />
        </div>
      )}
    </div>
  )
}

function Accordion({ title, icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.accordion}>
      <button type="button" className={styles.accordionHead}
        onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className={styles.accordionIcon}>{icon}</span>
        <span className={styles.accordionTitle}>{title}</span>
        <span className={`${styles.accordionChev} ${open ? styles.accordionChevOpen : ''}`}>
          <Ic d={CHEV} />
        </span>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  )
}

/* ─── Main ThemeEditor ──────────────────────────────────────── */
export default function ThemeEditor({ theme, update, updateMany }) {
  return (
    <div className={styles.panelBody}>

      {/* Sections visibility */}
      <Accordion title="Sections" icon="☰" defaultOpen>
        <p className={styles.panelHint} style={{ padding:'0 0 8px' }}>Toggle sections on/off</p>
        <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {SECTIONS_DEF.map(s => (
            <div key={s.id} className={styles.sectionRow}>
              <span className={styles.secIcon}>{s.icon}</span>
              <span className={styles.secLabel}>{s.label}</span>
              <Toggle value={theme[s.key]} onChange={v => update(s.key, v)} />
            </div>
          ))}
        </div>
      </Accordion>

      {/* Colours */}
      <Accordion title="Colours" icon="🎨" defaultOpen>
        <ColorPicker label="Primary"    value={theme.primary}       onChange={v => update('primary', v)}       group="primary" />
        <ColorPicker label="Accent"     value={theme.accent}        onChange={v => update('accent', v)}        group="accent" />
        <ColorPicker label="Background" value={theme.bg}            onChange={v => update('bg', v)}            group="background" />
        <ColorPicker label="Text"       value={theme.text}          onChange={v => update('text', v)}          group="text" />
        <ColorPicker label="Nav background" value={theme.navBg || theme.bg}  onChange={v => update('navBg', v)}  group="background" />
        <ColorPicker label="Nav text"       value={theme.navText || theme.text} onChange={v => update('navText', v)} group="text" />
        <ColorPicker label="Footer background" value={theme.footerBg || theme.primary} onChange={v => update('footerBg', v)} group="primary" />
      </Accordion>

      {/* Typography */}
      <Accordion title="Typography" icon="✏️">
        <Field label="Heading font">
          <Select value={theme.headingFont} onChange={v => update('headingFont', v)} options={FONTS} />
        </Field>
        <Field label="Body font">
          <Select value={theme.bodyFont} onChange={v => update('bodyFont', v)} options={BODY_FONTS} />
        </Field>
        <Field label={`Base font size — ${theme.bodySize || 14}px`}>
          <input type="range" min={12} max={18} step={1} value={theme.bodySize || 14}
            onChange={e => update('bodySize', e.target.value)} className={styles.edRange} />
        </Field>
      </Accordion>

      {/* Buttons & shape */}
      <Accordion title="Buttons & Shape" icon="🔲">
        <Field label="Button style">
          <Select value={theme.btn} onChange={v => update('btn', v)} options={BTN_STYLES} />
        </Field>
        <Field label="Card style">
          <Select value={theme.cardStyle || 'shadow'} onChange={v => update('cardStyle', v)} options={CARD_STYLES} />
        </Field>
        <Field label={`Border radius — ${theme.radius}px`}>
          <input type="range" min={0} max={24} step={1} value={theme.radius}
            onChange={e => update('radius', +e.target.value)} className={styles.edRange} />
        </Field>
      </Accordion>

      {/* Navigation */}
      <Accordion title="Navigation" icon="🗺">
        <Field label="Layout">
          <Select value={theme.navLayout} onChange={v => update('navLayout', v)} options={NAV_LAYOUTS} />
        </Field>
      </Accordion>

      {/* Hero section */}
      <Accordion title="Hero Banner" icon="🖼">
        <Field label="Heading">
          <textarea className={styles.edTextarea} value={theme.heroTitle}
            onChange={e => update('heroTitle', e.target.value)} rows={3} />
        </Field>
        <Field label="Subheading">
          <textarea className={styles.edTextarea} value={theme.heroSub}
            onChange={e => update('heroSub', e.target.value)} rows={3} />
        </Field>
        <Field label="Primary CTA">
          <input className={styles.edInput} value={theme.heroCta1 || 'Shop Now'}
            onChange={e => update('heroCta1', e.target.value)} />
        </Field>
        <Field label="Secondary CTA">
          <input className={styles.edInput} value={theme.heroCta2 || 'View Collections'}
            onChange={e => update('heroCta2', e.target.value)} />
        </Field>
        <Field label="Background image URL">
          <input className={styles.edInput} value={theme.heroImageUrl || ''}
            onChange={e => update('heroImageUrl', e.target.value)}
            placeholder="https://…/hero.jpg" />
        </Field>
        {theme.heroImageUrl && (
          <Field label={`Overlay opacity — ${theme.heroOverlayOpacity || 40}%`}>
            <input type="range" min={0} max={90} step={5}
              value={theme.heroOverlayOpacity || 40}
              onChange={e => update('heroOverlayOpacity', +e.target.value)}
              className={styles.edRange} />
          </Field>
        )}
        <ColorPicker label="Hero background" value={theme.heroBg}       onChange={v => update('heroBg', v)}      group="primary" />
        <ColorPicker label="Hero text"       value={theme.heroTextColor} onChange={v => update('heroTextColor', v)} group="text" />
      </Accordion>

      {/* Announcement bar */}
      <Accordion title="Announcement Bar" icon="📢">
        <Field label="Text">
          <textarea className={styles.edTextarea} value={theme.announceText}
            onChange={e => update('announceText', e.target.value)} rows={2} />
        </Field>
        <ColorPicker label="Background" value={theme.announceBg || theme.primary} onChange={v => update('announceBg', v)} group="primary" />
        <ColorPicker label="Text color" value={theme.announceColor || '#ffffff'}  onChange={v => update('announceColor', v)} group="text" />
      </Accordion>

      {/* Products */}
      <Accordion title="Products Grid" icon="🛍">
        <Field label="Section title">
          <input className={styles.edInput} value={theme.featuredTitle}
            onChange={e => update('featuredTitle', e.target.value)} />
        </Field>
        <Field label="Columns per row">
          <Select value={theme.productCols} onChange={v => update('productCols', +v)} options={COL_OPTS} />
        </Field>
        <Field label="Show ratings" row><Toggle value={theme.showRatings} onChange={v => update('showRatings', v)} /></Field>
        <Field label="Show badges"  row><Toggle value={theme.showBadges}  onChange={v => update('showBadges', v)}  /></Field>
        <Field label="Quick add"    row><Toggle value={theme.showQuickAdd} onChange={v => update('showQuickAdd', v)} /></Field>
        <Field label="Wishlist"     row><Toggle value={theme.showWishlist} onChange={v => update('showWishlist', v)} /></Field>
      </Accordion>

      {/* Promo banner */}
      <Accordion title="Promo Banner" icon="📣">
        <Field label="Title">
          <input className={styles.edInput} value={theme.promoTitle}
            onChange={e => update('promoTitle', e.target.value)} />
        </Field>
        <Field label="Subtitle">
          <input className={styles.edInput} value={theme.promoSub}
            onChange={e => update('promoSub', e.target.value)} />
        </Field>
        <Field label="CTA text">
          <input className={styles.edInput} value={theme.promoCta || 'Shop Now'}
            onChange={e => update('promoCta', e.target.value)} />
        </Field>
      </Accordion>

      {/* Store identity */}
      <Accordion title="Store Identity" icon="🏪">
        <Field label="Store name">
          <input className={styles.edInput} value={theme.storeName}
            onChange={e => update('storeName', e.target.value)} 
            placeholder="e.g. Adire Lagos, Kemi's Closet... "
            />

        </Field>
        <Field label="Logo text">
          <input className={styles.edInput} value={theme.logoText}
            onChange={e => update('logoText', e.target.value)} 
            placeholder= "Short version shown in navbar"
            />
        </Field>
        <Field label="Logo image URL">
          <input className={styles.edInput} value={theme.logoUrl || ''}
            onChange={e => update('logoUrl', e.target.value)}
            placeholder="https://…/logo.svg (overrides logo text)" />
        </Field>
        <Field label="Tagline">
          <input className={styles.edInput} value={theme.tagline}
            onChange={e => update('tagline', e.target.value)} 
            placeholder="e.g. Premium African Fashion & Beauty"
            />
        </Field>
      </Accordion>

      {/* Footer */}
      <Accordion title="Footer" icon="🦶">
        <Field label="Tagline">
          <input className={styles.edInput} value={theme.footerTagline || ''}
            onChange={e => update('footerTagline', e.target.value)} />
        </Field>
        <Field label="Copyright text">
          <input className={styles.edInput} value={theme.footerCopyright || ''}
            onChange={e => update('footerCopyright', e.target.value)} />
        </Field>
      </Accordion>

    </div>
  )
}
