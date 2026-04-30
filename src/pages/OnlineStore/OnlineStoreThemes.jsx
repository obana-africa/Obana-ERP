/**
 * OnlineStoreThemes.jsx
 * Shopify-style themes management page.
 * Route: /online-store/themes
 *
 * Clicking "Edit theme" routes to /online-store (the full builder).
 * Clicking "Online Store" in sidebar also routes here first.
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './OnlineStoreThemes.module.css'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Theme thumbnail placeholder ───────────────────────────────── */
function ThumbPlaceholder({ primary = '#1b3b5f', accent = '#2DBD97', bg = '#fff', name = '' }) {
  return (
    <div className={s.thumbPlaceholder} style={{ background: bg }}>
      <div className={s.thumbNav} style={{ background: primary }}>
        <div className={s.thumbNavDot} style={{ background: accent }} />
        <div className={s.thumbNavLine} style={{ background: `${accent}40` }} />
      </div>
      <div className={s.thumbHero} style={{ background: primary }}>
        <div className={s.thumbHeroText} style={{ background: `${accent}90` }} />
        <div className={s.thumbHeroSub} style={{ background: `${accent}50` }} />
        <div className={s.thumbHeroBtn} style={{ background: accent }} />
      </div>
      <div className={s.thumbGrid}>
        {[1, 2, 3].map(i => (
          <div key={i} className={s.thumbCard}>
            <div className={s.thumbCardImg} style={{ background: `${primary}15` }} />
            <div className={s.thumbCardLine} style={{ background: `${primary}30` }} />
            <div className={s.thumbCardLine} style={{ background: accent, width: '60%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Data ─────────────────────────────────────────────────────── */
const CURRENT_THEME = {
  id: 'midnight', name: 'Midnight Navy',
  primary: '#1b3b5f', accent: '#2DBD97', bg: '#ffffff',
  savedAt: 'Apr 28 at 11:44 am',
  version: '2.1.0',
  isLive: true,
}

const DRAFT_THEMES = [
  {
    id: 'earth', name: 'Earth Tones',
    primary: '#78350f', accent: '#d97706', bg: '#fffbf5',
    savedAt: 'Apr 25 at 9:12 am',
    version: '1.0.0',
  },
  {
    id: 'bold', name: 'Bold Green',
    primary: '#064e3b', accent: '#10b981', bg: '#ffffff',
    savedAt: 'Apr 20 at 3:30 pm',
    version: '1.2.0',
  },
]

const FREE_THEMES = [
  { id: 'minimal',   name: 'Clean Minimal', by: 'Taja',      primary: '#111827', accent: '#6366f1', bg: '#ffffff' },
  { id: 'coral',     name: 'Coral Pop',     by: 'Taja',      primary: '#9f1239', accent: '#f43f5e', bg: '#fff1f2' },
  { id: 'luxury',    name: 'Royal Purple',  by: 'Taja',      primary: '#4c1d95', accent: '#8b5cf6', bg: '#fafafa' },
]

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════ */
export default function OnlineStoreThemes() {
  const navigate = useNavigate()
  const [importOpen,   setImportOpen]   = useState(false)
  const [publishId,    setPublishId]    = useState(null)
  const [drafts,       setDrafts]       = useState(DRAFT_THEMES)
  const [moreOpen,     setMoreOpen]     = useState(null) // draft id with open dropdown
  const [currentTheme, setCurrentTheme] = useState(CURRENT_THEME)

  const handlePublish = (draft) => {
    setCurrentTheme({ ...draft, savedAt: 'Just now', isLive: true })
    setDrafts(prev => prev.filter(d => d.id !== draft.id))
    setPublishId(null)
  }

  const handleDuplicate = (draft) => {
    const copy = { ...draft, id: `${draft.id}-copy`, name: `${draft.name} (copy)`, savedAt: 'Just now' }
    setDrafts(prev => [...prev, copy])
    setMoreOpen(null)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this theme? This cannot be undone.')) {
      setDrafts(prev => prev.filter(d => d.id !== id))
    }
    setMoreOpen(null)
  }

  const handleAddFreeTheme = (theme) => {
    const draft = {
      id: `${theme.id}-${Date.now()}`,
      name: theme.name,
      primary: theme.primary, accent: theme.accent, bg: theme.bg,
      savedAt: 'Just now',
      version: '1.0.0',
    }
    setDrafts(prev => [...prev, draft])
  }

  return (
    <div className={s.page}>

      {/* ── Sticky header ──────────────────────────────────────── */}
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>
          <span className={s.pageTitleIcon}>🎨</span>
          Themes
        </h1>
        <div className={s.pageHeaderActions}>
          <button className={s.viewStoreBtn}
            onClick={() => navigate('/online-store')}>
            <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
            View store
          </button>

          <div className={s.importWrap}>
            <div className={s.importBtnGroup}>
              <button className={s.importBtn}
                onClick={() => navigate('/online-store')}>
                Edit current theme
              </button>
              <button className={s.importChevBtn} onClick={() => setImportOpen(o => !o)}>
                <Ic d="M6 9l6 6 6-6" size={14} />
              </button>
            </div>
            {importOpen && (
              <>
                <div className={s.importBackdrop} onClick={() => setImportOpen(false)} />
                <div className={s.importDropdown}>
                  <button className={s.importDropItem} onClick={() => { setImportOpen(false); navigate('/online-store') }}>
                    <Ic d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" size={14} />
                    Open theme editor
                  </button>
                  <button className={s.importDropItem} onClick={() => setImportOpen(false)}>
                    <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={14} />
                    Upload theme file (.zip)
                  </button>
                  <a className={s.importDropItem} href="https://themes.shopify.com" target="_blank" rel="noreferrer">
                    <Ic d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" size={14} />
                    Browse theme store
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Performance bar ────────────────────────────────────── */}
      <div className={s.perfBar}>
        <div className={s.perfItem}>
          <Ic d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" size={14} stroke="#6B7280" />
          <span className={s.perfLabel}>30 days</span>
        </div>
        <div className={s.perfDivider} />
        {[
          { label: 'LCP P75',                  value: '2104 ms',  badge: 'Good', good: true  },
          { label: 'INP P75',                  value: '96 ms',    badge: 'Good', good: true  },
          { label: 'Cumulative Layout Shift',  value: '0',        badge: null,   good: null  },
          { label: 'Sessions',                 value: '634',      badge: null,   good: null  },
        ].map((p, i) => (
          <div key={i} className={s.perfItem} style={{ gap: 6 }}>
            <span className={s.perfLabel}>{p.label}</span>
            <span className={s.perfNum}>{p.value}</span>
            {p.badge && (
              <span className={`${s.perfBadge} ${p.good ? s.perfGood : ''}`}>{p.badge}</span>
            )}
            {i < 3 && <div className={s.perfDivider} />}
          </div>
        ))}
      </div>

      {/* ── Current theme ──────────────────────────────────────── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <p className={s.sectionTitle}>Current theme</p>
            <p className={s.sectionSub}>This is the live theme visible to your customers.</p>
          </div>
        </div>

        <div className={s.currentThemeCard}>
          {/* Thumbnail */}
          <div className={s.currentThumb}>
            <ThumbPlaceholder
              primary={currentTheme.primary}
              accent={currentTheme.accent}
              bg={currentTheme.bg}
            />
            <div className={s.currentThumbSide}>
              <ThumbPlaceholder
                primary={currentTheme.primary}
                accent={currentTheme.accent}
                bg={currentTheme.bg}
              />
            </div>
          </div>

          {/* Info panel */}
          <div className={s.currentInfo}>
            <div className={s.currentMeta}>
              <span className={s.currentBadge}>Current theme</span>
              <h2 className={s.currentName}>{currentTheme.name}</h2>
              <p className={s.currentSaved}>Last saved: {currentTheme.savedAt}</p>
              <p className={s.currentVersion}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2DBD97', display: 'inline-block' }} />
                Version {currentTheme.version}
                <button className={s.versionChev}>
                  <Ic d="M6 9l6 6 6-6" size={12} />
                </button>
              </p>
            </div>
            <div className={s.currentActions}>
              <button className={s.editThemeBtn}
                onClick={() => navigate('/online-store')}>
                Edit theme
              </button>
              <button className={s.moreBtn} title="More actions">
                <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={16} sw={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Draft themes ───────────────────────────────────────── */}
      {drafts.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <div>
              <p className={s.sectionTitle}>Draft themes</p>
              <p className={s.sectionSub}>
                These themes are only visible to you. Publishing a theme from your library will switch it to your current theme.
              </p>
            </div>
          </div>

          <div className={s.draftList}>
            {drafts.map(draft => (
              <div key={draft.id} className={s.draftCard}>
                <div className={s.draftThumb}>
                  <ThumbPlaceholder
                    primary={draft.primary}
                    accent={draft.accent}
                    bg={draft.bg}
                  />
                </div>

                <div className={s.draftInfo}>
                  <p className={s.draftName}>{draft.name}</p>
                  <p className={s.draftMeta}>Last saved: {draft.savedAt}</p>
                  <p className={s.draftVersion}>
                    <span className={s.draftVersionDot} />
                    Version {draft.version}
                  </p>
                </div>

                <div className={s.draftActions}>
                  <div style={{ position: 'relative' }}>
                    <button className={s.draftMoreBtn}
                      onClick={() => setMoreOpen(moreOpen === draft.id ? null : draft.id)}>
                      <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
                    </button>
                    {moreOpen === draft.id && (
                      <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                          onClick={() => setMoreOpen(null)} />
                        <div className={s.draftDropdown}>
                          <button className={s.draftDropItem}
                            onClick={() => { navigate('/online-store'); setMoreOpen(null) }}>
                            <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
                            Edit
                          </button>
                          <button className={s.draftDropItem}
                            onClick={() => handleDuplicate(draft)}>
                            <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
                            Duplicate
                          </button>
                          <button className={s.draftDropItem}>
                            <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
                            Download
                          </button>
                          <hr className={s.draftDropDivider} />
                          <button className={`${s.draftDropItem} ${s.draftDropDanger}`}
                            onClick={() => handleDelete(draft.id)}>
                            <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} stroke="currentColor" />
                            Delete theme
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <button className={s.publishBtn}
                    onClick={() => setPublishId(draft.id)}>
                    Publish
                  </button>
                  <button className={s.editDraftBtn}
                    onClick={() => navigate('/online-store')}>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Free themes from store ──────────────────────────────── */}
      <div className={s.section}>
        <div className={s.themeStoreHeader}>
          <div>
            <p className={s.themeStoreLabel}>
              <span className={s.themeStoreLabelIcon}>🛍</span>
              Free themes
            </p>
            <p className={s.themeStoreSub}>
              Add a free theme to your library. You can customize it before publishing.
            </p>
          </div>
        </div>

        <div className={s.freeThemeGrid}>
          {FREE_THEMES.map(t => (
            <div key={t.id} className={s.freeThemeCard}>
              <div className={s.freeThemeThumb} style={{ background: t.primary }}>
                <ThumbPlaceholder primary={t.primary} accent={t.accent} bg={t.bg} />
              </div>
              <div className={s.freeThemeInfo}>
                <div>
                  <p className={s.freeThemeName}>{t.name}</p>
                  <p className={s.freeThemeBy}>by {t.by}</p>
                </div>
                <button className={s.addThemeBtn} onClick={() => handleAddFreeTheme(t)}>
                  Add
                </button>
              </div>
            </div>
          ))}

          {/* Explore more */}
          <div className={s.exploreCard}>
            <p className={s.exploreTitle}>Explore more themes</p>
            <p className={s.exploreSub}>
              Find premium themes built for African stores with advanced features.
            </p>
            <button className={s.exploreBtn}>
              <Ic d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" size={13} />
              Visit theme store
            </button>
          </div>
        </div>
      </div>

      {/* ── Publish confirm modal ───────────────────────────────── */}
      {publishId && (() => {
        const draft = drafts.find(d => d.id === publishId)
        if (!draft) return null
        return (
          <div className={s.modalBackdrop} onClick={() => setPublishId(null)}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
              <h3 className={s.modalTitle}>Publish "{draft.name}"?</h3>
              <p className={s.modalBody}>
                This will replace your current theme <strong>"{currentTheme.name}"</strong> as the live theme visible to all customers.
                Your current theme will be moved to draft themes.
              </p>
              <div className={s.modalActions}>
                <button className={s.modalCancel} onClick={() => setPublishId(null)}>Cancel</button>
                <button className={s.modalConfirm} onClick={() => handlePublish(draft)}>
                  Publish theme
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
