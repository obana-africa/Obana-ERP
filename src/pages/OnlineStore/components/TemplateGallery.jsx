/**
 * TemplateGallery.jsx
 * Visual template/theme picker.
 * Templates are defined in OnlineStore.jsx and passed as props.
 */

import { useState } from 'react'
import styles from '../OnlineStore.module.css'

const CATEGORIES = ['All', 'Fashion', 'Beauty', 'Lifestyle', 'General', 'Accessories']

export default function TemplateGallery({ templates, activeTemplate, onApply }) {
  const [filter,   setFilter]   = useState('All')
  const [preview,  setPreview]  = useState(null)

  const visible = filter === 'All'
    ? templates
    : templates.filter(t => t.category === filter)

  return (
    <div className={styles.panelBody}>
      <p className={styles.panelHint}>
        Choose a starting template. All colours, fonts, and content are fully editable after applying.
      </p>

      {/* Category filter */}
      <div className={styles.templateFilterRow}>
        {CATEGORIES.map(cat => (
          <button key={cat}
            className={`${styles.templateFilterBtn} ${filter === cat ? styles.templateFilterBtnOn : ''}`}
            onClick={() => setFilter(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className={styles.templateGrid}>
        {visible.map(t => (
          <div key={t.id}
            className={`${styles.templateCard} ${activeTemplate === t.id ? styles.templateCardOn : ''}`}>

            {/* Thumbnail */}
            <div className={styles.templateThumb}>
              <img src={t.thumbnail} alt={t.name}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                loading="lazy" />

              {/* Mini colour swatches overlay */}
              <div className={styles.templateSwatches}>
                {[t.theme.primary, t.theme.accent, t.theme.bg].map((c, i) => (
                  <div key={i} className={styles.templateSwatch} style={{ background: c }} />
                ))}
              </div>

              {/* Active indicator */}
              {activeTemplate === t.id && (
                <div className={styles.templateActiveBadge}>✓ Active</div>
              )}
            </div>

            {/* Info */}
            <div className={styles.templateInfo}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:6 }}>
                <p className={styles.templateName}>{t.name}</p>
                <span className={styles.templateCategory}>{t.category}</span>
              </div>
              <p className={styles.templateDesc}>{t.desc}</p>
            </div>

            {/* Actions */}
            <div className={styles.templateActions}>
              <button className={styles.templatePreviewBtn}
                onClick={() => setPreview(preview?.id === t.id ? null : t)}>
                {preview?.id === t.id ? 'Hide' : 'Preview'}
              </button>
              <button
                className={activeTemplate === t.id ? styles.templateAppliedBtn : styles.templateApplyBtn}
                onClick={() => onApply(t)}
                disabled={activeTemplate === t.id}>
                {activeTemplate === t.id ? 'Applied' : 'Apply'}
              </button>
            </div>

            {/* Inline colour preview */}
            {preview?.id === t.id && (
              <div className={styles.templateColorPreview}>
                <div style={{ background: t.theme.heroBg, padding:'14px 16px', borderRadius:'8px 8px 0 0' }}>
                  <p style={{ fontFamily: `${t.theme.headingFont}, serif`, fontSize:16, fontWeight:800, color: t.theme.heroTextColor || '#fff', margin:0 }}>
                    African Fashion
                  </p>
                  <p style={{ fontSize:10, color: t.theme.accent, margin:'3px 0 8px', fontWeight:600 }}>
                    PREMIUM COLLECTION
                  </p>
                  <div style={{ display:'flex', gap:6 }}>
                    <div style={{ padding:'5px 12px', borderRadius: t.theme.btn === 'pill' ? '99px' : 6, background: t.theme.accent, color:'#fff', fontSize:10, fontWeight:700 }}>
                      Shop Now
                    </div>
                    <div style={{ padding:'5px 12px', borderRadius: t.theme.btn === 'pill' ? '99px' : 6, border:'1px solid rgba(255,255,255,0.3)', color:'rgba(255,255,255,0.8)', fontSize:10, fontWeight:700 }}>
                      Collections
                    </div>
                  </div>
                </div>
                <div style={{ background: t.theme.bg, padding:'10px 12px', borderRadius:'0 0 8px 8px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  {[1,2].map(i => (
                    <div key={i} style={{ background: t.theme.cardBg || '#F9FAFB', borderRadius: t.theme.radius || 6, overflow:'hidden', border:`1px solid ${t.theme.cardBorder || '#E5E7EB'}` }}>
                      <div style={{ height:50, background:'linear-gradient(135deg,#F3F4F6,#E5E7EB)' }} />
                      <div style={{ padding:'6px 8px' }}>
                        <div style={{ fontSize:9, color: t.theme.accent, fontWeight:700, marginBottom:2 }}>FASHION</div>
                        <div style={{ fontSize:10, fontWeight:600, color: t.theme.text }}>Product Name</div>
                        <div style={{ fontSize:11, fontWeight:800, color: t.theme.primary, marginTop:3 }}>₦12,500</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Custom theme note */}
      <div className={styles.templateCustomNote}>
        <p style={{ fontSize:11.5, color:'#6B7280', lineHeight:1.5, margin:0 }}>
          💡 Templates set your starting colours and fonts. Use the <strong>Theme</strong> tab to customise every detail.
          Connect an external store in <strong>Integrations</strong> to pull in your real products.
        </p>
      </div>
    </div>
  )
}
