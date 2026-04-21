import { useState, useCallback } from 'react'
import styles from './OnlineStore.module.css'
import { STORE_PRODUCTS, STORE_BLOG_POSTS, TRUST_BADGES } from '../../data/onlineStore'

const Ic = ({ d, size=16, stroke='currentColor', sw=1.8, fill='none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    {[].concat(d).map((p,i) => <path key={i} d={p}/>)}
  </svg>
)

const ICON = {
  desktop:['M3 7h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z','M8 21h8m-4-2v2'],
  tablet: ['M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z','M12 17h.01'],
  phone:  ['M12 18h.01','M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z'],
  palette:['M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z'],
  type:   ['M4 7V4h16v3','M9 20h6','M12 4v16'],
  layout: ['M3 3h7v7H3z','M14 3h7v7h-7z','M14 14h7v7h-7z','M3 14h7v7H3z'],
  sections:['M3 3h18v4H3z','M3 10h18v4H3z','M3 17h18v4H3z'],
  settings:['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z','M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'],
  chevDown:'M6 9l6 6 6-6',
  save:   ['M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z','M17 21v-8H7v8','M7 3v5h8'],
  publish:['M22 2L11 13','M22 2L15 22l-4-9-9-4 20-7z'],
  check:  'M20 6L9 17l-5-5',
  undo:   ['M3 7v6h6','M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13'],
  redo:   ['M21 7v6h-6','M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13'],
  plus:   'M12 5v14M5 12h14',
  move:   ['M5 9l-3 3 3 3','M9 5l3-3 3 3','M15 19l3 3 3-3','M19 9l3 3-3 3','M2 12h20','M12 2v20'],
  eye:    ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
  cart:   ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z','M3 6h18','M16 10a4 4 0 0 1-8 0'],
}

const PRESETS = [
  { id:'midnight', name:'Midnight Navy',  desc:'Dark & premium',   primary:'#1a1a2e', accent:'#2DBD97', bg:'#ffffff', text:'#111827', heroBg:'#1a1a2e', radius:8,  btn:'filled'  },
  { id:'earth',    name:'Earth Tones',    desc:'Warm & organic',   primary:'#78350f', accent:'#d97706', bg:'#fffbf5', text:'#1c1917', heroBg:'#292524', radius:6,  btn:'rounded' },
  { id:'minimal',  name:'Clean Minimal',  desc:'Light & crisp',    primary:'#111827', accent:'#6366f1', bg:'#ffffff', text:'#111827', heroBg:'#f9fafb', radius:4,  btn:'outline' },
  { id:'bold',     name:'Bold Green',     desc:'Fresh & vibrant',  primary:'#064e3b', accent:'#10b981', bg:'#ffffff', text:'#111827', heroBg:'#064e3b', radius:12, btn:'pill'    },
  { id:'luxury',   name:'Royal Purple',   desc:'Elegant & rich',   primary:'#4c1d95', accent:'#8b5cf6', bg:'#fafafa', text:'#1e1b4b', heroBg:'#1e1b4b', radius:8,  btn:'filled'  },
  { id:'coral',    name:'Coral Pop',      desc:'Vibrant & playful',primary:'#9f1239', accent:'#f43f5e', bg:'#fff1f2', text:'#1c1917', heroBg:'#881337', radius:16, btn:'pill'    },
]

const SECTIONS_DEF = [
  { id:'announce',   label:'Announcement Bar',  icon:'📢', key:'showAnnounce'    },
  { id:'hero',       label:'Hero Banner',        icon:'🖼',  key:'showHero'        },
  { id:'cats',       label:'Category Pills',     icon:'🏷',  key:'showCats'        },
  { id:'featured',   label:'Featured Products',  icon:'🛍',  key:'showFeatured'    },
  { id:'promo',      label:'Promo Banner',       icon:'📣',  key:'showPromo'       },
  { id:'trust',      label:'Trust Badges',       icon:'✅',  key:'showTrust'       },
  { id:'newsletter', label:'Newsletter',         icon:'📧',  key:'showNewsletter'  },
  { id:'footer',     label:'Footer',             icon:'🦶',  key:'showFooter'      },
]

const FONTS       = ['Playfair Display','Fraunces','Georgia','DM Sans','Inter','Montserrat','Poppins','Lato']
const BODY_FONTS  = ['DM Sans','Inter','Lato','Poppins','Montserrat','Open Sans','Roboto']
const BTN_STYLES  = [{v:'filled',l:'Filled'},{v:'outline',l:'Outline'},{v:'rounded',l:'Rounded'},{v:'pill',l:'Pill'}]
const NAV_LAYOUTS = [{v:'left',l:'Left'},{v:'centered',l:'Centered'},{v:'split',l:'Split'}]
const COL_OPTS    = [{v:2,l:'2 columns'},{v:3,l:'3 columns'},{v:4,l:'4 columns'}]
const PAGES       = ['Home','Shop','Blog','About']

const PRIMARY_PRESETS = ['#1a1a2e','#1b3b5f','#111827','#064e3b','#7c3aed','#b91c1c','#78350f','#0f172a']
const ACCENT_PRESETS  = ['#2DBD97','#3b82f6','#f59e0b','#10b981','#8b5cf6','#ef4444','#0ea5e9','#ec4899']
const BG_PRESETS      = ['#ffffff','#f9fafb','#f0fdf4','#fefce8','#fdf2f8','#1a1a2e','#0f172a','#1c1917']
const TEXT_PRESETS    = ['#111827','#374151','#1c1917','#1e1b4b','#ffffff','#f9fafb']
const HERO_BG_PRESETS = ['#1a1a2e','#1b3b5f','#064e3b','#4c1d95','#881337','#111827','#f9fafb','#ffffff']

const DEFAULT_THEME = {
  storeName:'taja by Obana.Africa', logoText:'taja', tagline:'Premium African Fashion & Beauty',
  primary:'#1a1a2e', accent:'#2DBD97', bg:'#ffffff', text:'#111827',
  heroBg:'#1a1a2e', heroTextColor:'#ffffff',
  heroTitle:'African Fashion,\nRedefined',
  heroSub:'Premium Ankara, Kaftan & Beauty — shipped across Nigeria in 48 hours',
  headingFont:'Playfair Display', bodyFont:'DM Sans', radius:8, btn:'filled',
  navLayout:'centered',
  announceText:'🎉 Free shipping on orders above ₦20,000 · Use SUMMER25 for 25% off',
  featuredTitle:'Featured Products', productCols:3, showRatings:true, showBadges:true,
  promoTitle:'New Arrivals This Week', promoSub:'Discover the latest in African fashion',
  footerText:'© 2026 Obana Africa Ltd. All rights reserved.',
  showAnnounce:true, showHero:true, showCats:true, showFeatured:true,
  showPromo:true, showTrust:true, showNewsletter:true, showFooter:true,
  activePreset:'midnight',
}

/* ── Tiny helpers ────────────────────────────────────────── */
const fmt = n => `₦${Number(n||0).toLocaleString()}`
const pct = (o,s) => Math.round(((o-s)/o)*100)

/* ── Sub-components ─────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <button className={`${styles.toggle} ${value?styles.toggleOn:''}`}
      onClick={() => onChange(!value)} role="switch" aria-checked={value}>
      <span className={styles.toggleThumb}/>
    </button>
  )
}

function EdField({ label, children }) {
  return <div className={styles.edField}>{label && <label className={styles.edLabel}>{label}</label>}{children}</div>
}

function EdInput({ label, value, onChange, placeholder, textarea }) {
  return (
    <EdField label={label}>
      {textarea
        ? <textarea className={styles.edTextarea} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}/>
        : <input className={styles.edInput} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>}
    </EdField>
  )
}

function EdSelect({ label, value, onChange, options }) {
  return (
    <EdField label={label}>
      <select className={styles.edSelect} value={value} onChange={e=>onChange(isNaN(e.target.value)?e.target.value:+e.target.value)}>
        {options.map(o=>{
          const v=typeof o==='string'?o:(o.v??o); const l=typeof o==='string'?o:(o.l??o)
          return <option key={v} value={v}>{l}</option>
        })}
      </select>
    </EdField>
  )
}

function EdRow({ label, children }) {
  return <div className={styles.edRow}><label className={styles.edLabel}>{label}</label>{children}</div>
}

function ColorPicker({ label, value, onChange, presets }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.cpWrap}>
      <label className={styles.edLabel}>{label}</label>
      <div className={styles.cpRow}>
        <button className={styles.cpSwatch} style={{background:value}} onClick={()=>setOpen(o=>!o)}/>
        <input className={styles.cpHex} value={value} onChange={e=>onChange(e.target.value)}/>
      </div>
      {open && (
        <div className={styles.cpDropdown}>
          <div className={styles.cpPresets}>
            {presets.map(c=>(
              <button key={c} className={`${styles.cpPreset} ${c===value?styles.cpPresetOn:''}`}
                style={{background:c}} onClick={()=>{onChange(c);setOpen(false)}}/>
            ))}
          </div>
          <input type="color" className={styles.cpNative} value={value} onChange={e=>onChange(e.target.value)}/>
        </div>
      )}
    </div>
  )
}

function Accordion({ title, icon, defaultOpen=false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={styles.accordion}>
      <button className={styles.accordionHead} onClick={()=>setOpen(o=>!o)}>
        <span className={styles.accordionIcon}>{icon}</span>
        <span className={styles.accordionTitle}>{title}</span>
        <span className={`${styles.accordionChev} ${open?styles.accordionChevOpen:''}`}>
          <Ic d={ICON.chevDown} size={13}/>
        </span>
      </button>
      {open && <div className={styles.accordionBody}>{children}</div>}
    </div>
  )
}

/* ── Panels ──────────────────────────────────────────────── */
function SectionsPanel({ theme, update, activeSection, setActiveSection }) {
  return (
    <div className={styles.panelBody}>
      <p className={styles.panelHint}>Click to edit · Toggle to show/hide</p>
      <div className={styles.sectionsList}>
        {SECTIONS_DEF.map(s => (
          <div key={s.id}
            className={`${styles.sectionRow} ${activeSection===s.id?styles.sectionRowActive:''}`}
            onClick={()=>setActiveSection(s.id)}>
            <span className={styles.dragHandle}><Ic d={ICON.move} size={13} stroke="#D1D5DB"/></span>
            <span className={styles.secIcon}>{s.icon}</span>
            <span className={styles.secLabel}>{s.label}</span>
            <Toggle value={theme[s.key]} onChange={v=>{update(s.key,v)}}/>
          </div>
        ))}
      </div>
      <button className={styles.addSecBtn}><Ic d={ICON.plus} size={13}/> Add section</button>
    </div>
  )
}

function DesignPanel({ theme, update }) {
  return (
    <div className={styles.panelBody}>
      <Accordion title="Colours" icon="🎨" defaultOpen>
        <ColorPicker label="Primary colour"  value={theme.primary}        onChange={v=>update('primary',v)}       presets={PRIMARY_PRESETS}/>
        <ColorPicker label="Accent colour"   value={theme.accent}         onChange={v=>update('accent',v)}        presets={ACCENT_PRESETS}/>
        <ColorPicker label="Background"      value={theme.bg}             onChange={v=>update('bg',v)}            presets={BG_PRESETS}/>
        <ColorPicker label="Text colour"     value={theme.text}           onChange={v=>update('text',v)}          presets={TEXT_PRESETS}/>
      </Accordion>
      <Accordion title="Typography" icon="✏️">
        <EdSelect label="Heading font" value={theme.headingFont} onChange={v=>update('headingFont',v)} options={FONTS}/>
        <EdSelect label="Body font"    value={theme.bodyFont}    onChange={v=>update('bodyFont',v)}    options={BODY_FONTS}/>
      </Accordion>
      <Accordion title="Buttons & Shape" icon="🔲">
        <EdSelect label="Button style" value={theme.btn}     onChange={v=>update('btn',v)}    options={BTN_STYLES}/>
        <EdField label={`Border radius: ${theme.radius}px`}>
          <input type="range" min="0" max="24" step="1" value={theme.radius}
            onChange={e=>update('radius',+e.target.value)} className={styles.edRange}/>
        </EdField>
      </Accordion>
      <Accordion title="Navigation" icon="🗺">
        <EdSelect label="Nav layout" value={theme.navLayout} onChange={v=>update('navLayout',v)} options={NAV_LAYOUTS}/>
      </Accordion>
    </div>
  )
}

function ContentPanel({ theme, update }) {
  return (
    <div className={styles.panelBody}>
      <Accordion title="Store Identity" icon="🏪" defaultOpen>
        <EdInput label="Logo text"   value={theme.logoText}   onChange={v=>update('logoText',v)}/>
        <EdInput label="Store name"  value={theme.storeName}  onChange={v=>update('storeName',v)}/>
        <EdInput label="Tagline"     value={theme.tagline}    onChange={v=>update('tagline',v)}/>
      </Accordion>
      <Accordion title="Announcement Bar" icon="📢">
        <EdRow label="Show bar"><Toggle value={theme.showAnnounce} onChange={v=>update('showAnnounce',v)}/></EdRow>
        <EdInput value={theme.announceText} onChange={v=>update('announceText',v)} textarea placeholder="Announcement text…"/>
      </Accordion>
      <Accordion title="Hero Banner" icon="🖼">
        <EdInput label="Heading"    value={theme.heroTitle}    onChange={v=>update('heroTitle',v)}    textarea/>
        <EdInput label="Subheading" value={theme.heroSub}      onChange={v=>update('heroSub',v)}      textarea/>
        <ColorPicker label="Hero background" value={theme.heroBg}        onChange={v=>update('heroBg',v)}        presets={HERO_BG_PRESETS}/>
        <ColorPicker label="Hero text"       value={theme.heroTextColor} onChange={v=>update('heroTextColor',v)} presets={['#ffffff','#f9fafb','#111827','#1a1a2e']}/>
      </Accordion>
      <Accordion title="Products" icon="🛍">
        <EdInput label="Section title" value={theme.featuredTitle} onChange={v=>update('featuredTitle',v)}/>
        <EdSelect label="Columns" value={theme.productCols} onChange={v=>update('productCols',+v)} options={COL_OPTS}/>
        <EdRow label="Show ratings"><Toggle value={theme.showRatings} onChange={v=>update('showRatings',v)}/></EdRow>
        <EdRow label="Show badges"><Toggle value={theme.showBadges} onChange={v=>update('showBadges',v)}/></EdRow>
      </Accordion>
      <Accordion title="Promo Banner" icon="📣">
        <EdRow label="Show promo"><Toggle value={theme.showPromo} onChange={v=>update('showPromo',v)}/></EdRow>
        <EdInput label="Title"    value={theme.promoTitle} onChange={v=>update('promoTitle',v)}/>
        <EdInput label="Subtitle" value={theme.promoSub}   onChange={v=>update('promoSub',v)}/>
      </Accordion>
      <Accordion title="Footer" icon="🦶">
        <EdInput label="Footer text" value={theme.footerText} onChange={v=>update('footerText',v)}/>
      </Accordion>
    </div>
  )
}

function PresetsPanel({ theme, applyPreset }) {
  return (
    <div className={styles.panelBody}>
      <p className={styles.panelHint}>Choose a preset to start with</p>
      <div className={styles.presetGrid}>
        {PRESETS.map(p => (
          <button key={p.id}
            className={`${styles.presetCard} ${theme.activePreset===p.id?styles.presetCardOn:''}`}
            onClick={()=>applyPreset(p)}>
            <div className={styles.presetSwatches}>
              <div className={styles.presetSwatch} style={{background:p.primary}}/>
              <div className={styles.presetSwatch} style={{background:p.accent}}/>
              <div className={`${styles.presetSwatch} ${styles.presetSwatchBg}`} style={{background:p.bg}}/>
            </div>
            <div className={styles.presetName}>{p.name}</div>
            <div className={styles.presetDesc}>{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── Storefront Preview ──────────────────────────────────── */
function StorefrontPreview({ theme, viewport }) {
  const r = theme.radius
  const cols = theme.productCols || 3
  const prods = STORE_PRODUCTS.slice(0, cols * 2)
  const isPhone = viewport === 'phone'
  const pad = isPhone ? '16px' : '24px'
  const heroFS = isPhone ? '26px' : viewport==='tablet' ? '36px' : '48px'

  const btnBase = {
    padding: '10px 22px', border: 'none', cursor: 'pointer',
    fontFamily: `${theme.bodyFont}, sans-serif`, fontSize: '13px', fontWeight: 700,
    borderRadius: theme.btn==='pill' ? '99px' : `${Math.min(r+2,16)}px`, transition: 'all .15s',
  }
  const btnPrimary = theme.btn==='outline'
    ? { ...btnBase, background:'transparent', border:`2px solid ${theme.accent}`, color:theme.accent }
    : { ...btnBase, background:theme.accent, color:'#fff' }
  const btnGhost = { ...btnBase, background:'transparent', border:`1.5px solid rgba(255,255,255,0.35)`, color:theme.heroTextColor }

  return (
    <div style={{background:theme.bg, color:theme.text, fontFamily:`${theme.bodyFont}, sans-serif`, overflow:'hidden'}}>

      {/* Announcement */}
      {theme.showAnnounce && (
        <div style={{background:theme.primary, color:'#fff', textAlign:'center', padding:'9px 40px', fontSize:'12.5px', fontWeight:500}}>
          {theme.announceText}
        </div>
      )}

      {/* Header */}
      <header style={{display:'flex', alignItems:'center', padding:`13px ${pad}`, borderBottom:'1px solid #E5E7EB', background:theme.bg, gap:'20px', position:'sticky', top:0, zIndex:10}}>
        {theme.navLayout==='split' && (
          <nav style={{display:'flex', gap:'18px'}}>
            {['Shop','Collections','About'].map(l=><span key={l} style={{fontSize:'13px', fontWeight:500, color:'#374151', cursor:'pointer'}}>{l}</span>)}
          </nav>
        )}
        <div style={{fontFamily:`${theme.headingFont}, serif`, fontSize:isPhone?'16px':'20px', fontWeight:900, color:theme.primary, letterSpacing:'-.04em', flexShrink:0}}>
          {theme.logoText}
        </div>
        {theme.navLayout!=='split' && (
          <nav style={{display:'flex', gap:'18px', flex:1, justifyContent:theme.navLayout==='centered'?'center':'flex-start'}}>
            {['Shop','Collections','About'].map(l=><span key={l} style={{fontSize:'13px', fontWeight:500, color:'#374151', cursor:'pointer'}}>{l}</span>)}
          </nav>
        )}
        <div style={{display:'flex', alignItems:'center', gap:'14px', marginLeft:'auto', flexShrink:0, color:'#6B7280'}}>
          <Ic d={ICON.eye} size={16}/>
          <div style={{position:'relative', display:'flex'}}>
            <Ic d={ICON.cart} size={16}/>
            <span style={{position:'absolute', top:'-5px', right:'-5px', width:'14px', height:'14px', borderRadius:'50%', background:theme.primary, color:'#fff', fontSize:'8px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center'}}>0</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      {theme.showHero && (
        <section style={{background:theme.heroBg, padding:`${isPhone?'40px':viewport==='tablet'?'60px':'80px'} ${pad}`, minHeight:isPhone?'240px':'320px', display:'flex', alignItems:'center'}}>
          <div style={{maxWidth:'560px'}}>
            <p style={{fontSize:'11px', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:theme.accent, marginBottom:'14px'}}>{theme.tagline}</p>
            <h1 style={{fontFamily:`${theme.headingFont}, serif`, fontSize:heroFS, fontWeight:900, lineHeight:1.1, letterSpacing:'-.03em', color:theme.heroTextColor, marginBottom:'14px'}}>
              {theme.heroTitle.split('\n').map((l,i)=><span key={i}>{l}<br/></span>)}
            </h1>
            <p style={{fontSize:'14px', opacity:.7, lineHeight:1.7, marginBottom:'24px', color:theme.heroTextColor, maxWidth:'420px'}}>{theme.heroSub}</p>
            <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
              <button style={btnPrimary}>Shop Now</button>
              <button style={btnGhost}>View Collections</button>
            </div>
          </div>
        </section>
      )}

      {/* Category pills */}
      {theme.showCats && (
        <div style={{display:'flex', gap:'8px', padding:`16px ${pad} 0`, flexWrap:'wrap'}}>
          {['All','Fashion','Beauty','Accessories','Gift Sets'].map((c,i)=>(
            <button key={c} style={{padding:'6px 14px', borderRadius:'99px', border:`1px solid ${i===0?theme.primary:'#E5E7EB'}`, background:i===0?theme.primary:'#F9FAFB', color:i===0?'#fff':'#374151', fontSize:'12px', fontWeight:500, cursor:'pointer', fontFamily:'inherit'}}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Featured products */}
      {theme.showFeatured && (
        <section style={{padding:`28px ${pad}`}}>
          <h2 style={{fontFamily:`${theme.headingFont}, serif`, fontSize:'22px', fontWeight:700, color:theme.text, marginBottom:'20px', letterSpacing:'-.02em'}}>{theme.featuredTitle}</h2>
          <div style={{display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:'16px'}}>
            {prods.map(p=>{
              const hasDsc = p.compareAt && p.compareAt > p.price
              return (
                <div key={p.id} style={{border:'1px solid #E5E7EB', borderRadius:`${r}px`, overflow:'hidden', cursor:'pointer', transition:'transform .2s,box-shadow .2s'}}>
                  <div style={{position:'relative', aspectRatio:'4/5', overflow:'hidden', background:'#F3F4F6'}}>
                    <img src={p.img} alt={p.name} style={{width:'100%', height:'100%', objectFit:'cover'}} loading="lazy"/>
                    {theme.showBadges && p.badge && (
                      <span style={{position:'absolute', top:'8px', left:'8px', background:theme.primary, color:'#fff', padding:'3px 8px', borderRadius:'99px', fontSize:'9px', fontWeight:700, textTransform:'uppercase', letterSpacing:'.04em'}}>{p.badge}</span>
                    )}
                    {hasDsc && <span style={{position:'absolute', top:'8px', right:'8px', background:'#EF4444', color:'#fff', padding:'3px 8px', borderRadius:'99px', fontSize:'10px', fontWeight:700}}>−{pct(p.compareAt,p.price)}%</span>}
                  </div>
                  <div style={{padding:'10px 12px 14px'}}>
                    <p style={{fontSize:'10px', color:'#9CA3AF', fontWeight:600, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:'3px'}}>{p.category}</p>
                    <h3 style={{fontSize:'13px', fontWeight:600, color:theme.text, marginBottom:'5px', lineHeight:1.3}}>{p.name}</h3>
                    {theme.showRatings && <div style={{fontSize:'11px', color:'#F59E0B', marginBottom:'4px'}}>{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5-Math.round(p.rating))} <span style={{color:'#9CA3AF', fontSize:'10px'}}>({p.reviews})</span></div>}
                    <div style={{display:'flex', alignItems:'center', gap:'6px', fontWeight:700, fontSize:'14px'}}>
                      <span style={{color:theme.primary}}>{fmt(p.price)}</span>
                      {hasDsc && <span style={{fontSize:'11px', textDecoration:'line-through', color:'#9CA3AF', fontWeight:400}}>{fmt(p.compareAt)}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Promo banner */}
      {theme.showPromo && (
        <div style={{margin:`0 ${pad} 28px`, background:`linear-gradient(135deg,${theme.primary},${theme.accent})`, borderRadius:`${r}px`, padding:'30px 26px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'16px', flexWrap:'wrap'}}>
          <div>
            <h3 style={{fontFamily:`${theme.headingFont}, serif`, fontSize:'20px', fontWeight:700, color:'#fff', marginBottom:'6px'}}>{theme.promoTitle}</h3>
            <p style={{fontSize:'13px', color:'rgba(255,255,255,.65)'}}>{theme.promoSub}</p>
          </div>
          <button style={{background:'#fff', color:theme.primary, border:'none', borderRadius:`${r}px`, padding:'10px 22px', fontWeight:700, fontSize:'13px', cursor:'pointer', flexShrink:0}}>Shop Now</button>
        </div>
      )}

      {/* Trust badges */}
      {theme.showTrust && (
        <div style={{display:'grid', gridTemplateColumns:`repeat(${isPhone?2:4},1fr)`, borderTop:'1px solid #E5E7EB'}}>
          {TRUST_BADGES.map(t=>(
            <div key={t.title} style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'22px 12px', borderRight:'1px solid #E5E7EB'}}>
              <span style={{fontSize:'22px', marginBottom:'6px'}}>{t.icon}</span>
              <strong style={{fontSize:'12px', fontWeight:700, color:theme.text, marginBottom:'3px'}}>{t.title}</strong>
              <p style={{fontSize:'11px', color:'#6B7280', lineHeight:1.4}}>{t.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Newsletter */}
      {theme.showNewsletter && (
        <div style={{background:theme.primary, padding:`36px ${pad}`, textAlign:'center'}}>
          <h3 style={{fontFamily:`${theme.headingFont}, serif`, fontSize:'22px', fontWeight:700, color:'#fff', marginBottom:'8px'}}>Stay in the loop</h3>
          <p style={{color:'rgba(255,255,255,.55)', fontSize:'13px', marginBottom:'20px'}}>New arrivals, exclusive deals and style tips in your inbox.</p>
          <div style={{display:'flex', gap:'8px', maxWidth:'380px', margin:'0 auto', flexWrap:'wrap'}}>
            <input type="email" placeholder="your@email.com" style={{flex:1, padding:'10px 14px', borderRadius:`${r}px`, border:'none', fontSize:'13px', minWidth:'160px'}}/>
            <button style={{...btnPrimary, padding:'10px 18px', fontSize:'13px'}}>Subscribe</button>
          </div>
        </div>
      )}

      {/* Footer */}
      {theme.showFooter && (
        <footer style={{background:theme.primary, padding:`24px ${pad}`}}>
          <div style={{display:'flex', alignItems:'center', gap:'16px', flexWrap:'wrap'}}>
            <span style={{fontFamily:`${theme.headingFont}, serif`, fontSize:'16px', fontWeight:900, color:'rgba(255,255,255,.85)', letterSpacing:'-.04em'}}>{theme.logoText}</span>
            <span style={{fontSize:'11px', color:'rgba(255,255,255,.3)', marginLeft:'auto'}}>{theme.footerText}</span>
            <div style={{display:'flex', gap:'14px'}}>
              {['Privacy','Terms','Support'].map(l=><span key={l} style={{fontSize:'11px', color:'rgba(255,255,255,.4)', cursor:'pointer'}}>{l}</span>)}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

/* ── MAIN BUILDER ─────────────────────────────────────────── */
export default function OnlineStore() {
  const [theme,        setTheme]        = useState(DEFAULT_THEME)
  const [savedTheme,   setSavedTheme]   = useState(JSON.stringify(DEFAULT_THEME))
  const [history,      setHistory]      = useState([JSON.stringify(DEFAULT_THEME)])
  const [histIdx,      setHistIdx]      = useState(0)
  const [viewport,     setViewport]     = useState('desktop')
  const [activeTab,    setActiveTab]    = useState('sections')
  const [activeSection,setActiveSection]= useState(null)
  const [activePage,   setActivePage]   = useState('Home')
  const [saveFlash,    setSaveFlash]    = useState(false)
  const [published,    setPublished]    = useState(false)

  const isDirty = JSON.stringify(theme) !== savedTheme

  const pushHistory = useCallback((next) => {
    const snap = JSON.stringify(next)
    setHistory(h => [...h.slice(0, histIdx+1), snap])
    setHistIdx(i => i+1)
  }, [histIdx])

  const update = useCallback((key, val) => {
    setTheme(prev => {
      const next = {...prev, [key]:val}
      pushHistory(next)
      return next
    })
  }, [pushHistory])

  const undo = () => {
    if (histIdx > 0) { const prev=JSON.parse(history[histIdx-1]); setTheme(prev); setHistIdx(i=>i-1) }
  }
  const redo = () => {
    if (histIdx < history.length-1) { const next=JSON.parse(history[histIdx+1]); setTheme(next); setHistIdx(i=>i+1) }
  }

  const save = () => {
    setSavedTheme(JSON.stringify(theme))
    setSaveFlash(true)
    setTimeout(()=>setSaveFlash(false), 2000)
  }
  const publish = () => {
    save()
    setPublished(true)
    setTimeout(()=>setPublished(false), 3000)
  }

  const applyPreset = (p) => {
    const next = { ...theme, primary:p.primary, accent:p.accent, bg:p.bg, text:p.text, heroBg:p.heroBg, radius:p.radius, btn:p.btn, activePreset:p.id }
    setTheme(next)
    pushHistory(next)
  }

  const PANEL_TABS = [
    { id:'sections', label:'Sections', icon:ICON.sections  },
    { id:'design',   label:'Design',   icon:ICON.palette   },
    { id:'content',  label:'Content',  icon:ICON.type      },
    { id:'presets',  label:'Presets',  icon:ICON.layout    },
  ]

  return (
    <div className={styles.builder}>

      {/* ── Topbar ── */}
      <div className={styles.topbar}>
        <div className={styles.topLeft}>
          <span className={styles.topTitle}><Ic d={ICON.settings} size={14}/> Theme Editor</span>
          <span className={styles.topStore}>{theme.storeName}</span>
          <div className={styles.pageSel}>
            {PAGES.map(p=>(
              <button key={p} className={`${styles.pageBtn} ${activePage===p?styles.pageBtnOn:''}`}
                onClick={()=>setActivePage(p)}>{p}</button>
            ))}
          </div>
        </div>

        <div className={styles.vpWrap}>
          {[{id:'desktop',icon:ICON.desktop},{id:'tablet',icon:ICON.tablet},{id:'phone',icon:ICON.phone}].map(v=>(
            <button key={v.id} className={`${styles.vpBtn} ${viewport===v.id?styles.vpBtnOn:''}`}
              onClick={()=>setViewport(v.id)}>
              <Ic d={v.icon} size={15}/>
            </button>
          ))}
        </div>

        <div className={styles.topRight}>
          <button className={styles.histBtn} onClick={undo} disabled={histIdx===0} title="Undo"><Ic d={ICON.undo} size={14}/></button>
          <button className={styles.histBtn} onClick={redo} disabled={histIdx>=history.length-1} title="Redo"><Ic d={ICON.redo} size={14}/></button>
          <button className={`${styles.saveBtn} ${saveFlash?styles.saveBtnFlash:''} ${isDirty&&!saveFlash?styles.saveBtnDirty:''}`} onClick={save}>
            <Ic d={ICON.save} size={13}/>{saveFlash?'Saved!':'Save'}
          </button>
          <button className={`${styles.pubBtn} ${published?styles.pubBtnDone:''}`} onClick={publish}>
            <Ic d={published?ICON.check:ICON.publish} size={13} stroke="#fff"/>
            {published?'Published!':'Publish'}
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {/* ── Left panel ── */}
        <div className={styles.panel}>
          <div className={styles.panelTabs}>
            {PANEL_TABS.map(t=>(
              <button key={t.id} className={`${styles.panelTab} ${activeTab===t.id?styles.panelTabOn:''}`}
                onClick={()=>setActiveTab(t.id)}>
                <Ic d={t.icon} size={13}/>
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.panelScroll}>
            {activeTab==='sections' && <SectionsPanel theme={theme} update={update} activeSection={activeSection} setActiveSection={id=>{setActiveSection(id);setActiveTab('content')}}/>}
            {activeTab==='design'   && <DesignPanel   theme={theme} update={update}/>}
            {activeTab==='content'  && <ContentPanel  theme={theme} update={update}/>}
            {activeTab==='presets'  && <PresetsPanel  theme={theme} applyPreset={applyPreset}/>}
          </div>
        </div>

        {/* ── Preview ── */}
        <div className={styles.canvas}>
          <div className={`${styles.frame} ${styles[`frame_${viewport}`]}`}>
            <StorefrontPreview theme={theme} viewport={viewport}/>
          </div>
          {isDirty && <div className={styles.unsavedBadge}>Unsaved changes</div>}
        </div>
      </div>
    </div>
  )
}
