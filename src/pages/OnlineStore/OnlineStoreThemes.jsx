/**
 * OnlineStoreThemes.jsx
 * Themes management page — styled to match thaja dashboard palette.
 * Route: /online-store/themes
 *
 * "Edit theme" → navigates to /online-store (the full builder)
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './OnlineStoreThemes.module.css'

/* ── SVG Icon ──────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Theme thumbnail ───────────────────────────────────────────── */
function ThumbPlaceholder({ primary = '#1b3b5f', accent = '#fbbf24', bg = '#fff' }) {
  return (
    <div className={s.thumbPlaceholder} style={{ background: bg }}>
      <div className={s.thumbNav} style={{ background: primary }}>
        <div className={s.thumbNavDot} style={{ background: accent }} />
        <div className={s.thumbNavLine} style={{ background: `${accent}50` }} />
      </div>
      <div className={s.thumbHero} style={{ background: primary }}>
        <div className={s.thumbHeroText} style={{ background: `${accent}90` }} />
        <div className={s.thumbHeroSub}  style={{ background: `${accent}50` }} />
        <div className={s.thumbHeroBtn}  style={{ background: accent }} />
      </div>
      <div className={s.thumbGrid}>
        {[1, 2, 3].map(i => (
          <div key={i} className={s.thumbCard}>
            <div className={s.thumbCardImg} style={{ background: `${primary}18` }} />
            <div className={s.thumbCardLine} style={{ background: `${primary}30` }} />
            <div className={s.thumbCardLine} style={{ background: accent, width: '60%' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Static data (replace with API calls in production) ─────────── */
const INITIAL_CURRENT = {
  id: 'midnight',
  name: 'Midnight Navy',
  primary: '#1b3b5f',
  accent: '#fbbf24',
  bg: '#ffffff',
  savedAt: 'May 5 at 2:23 pm',
  version: '15.4.1',
  isLive: true,
}

const INITIAL_DRAFTS = [
  { id: 'dawn',     name: 'Dawn',         primary: '#1b3b5f', accent: '#fbbf24', bg: '#fff',    savedAt: 'Aug 14 at 11:58 am', version: '15.4.1' },
  { id: 'holiday',  name: 'Copy of Dawn', primary: '#9f1239', accent: '#f43f5e', bg: '#fff1f2', savedAt: 'Dec 12, 2024',       version: '15.4.1' },
  { id: 'sale',     name: 'Copy of Dawn', primary: '#064e3b', accent: '#10b981', bg: '#ffffff', savedAt: 'Nov 20, 2024',       version: '15.4.1' },
  { id: 'dark',     name: 'Copy of Dawn', primary: '#111827', accent: '#6366f1', bg: '#fafafa', savedAt: 'Sep 23, 2024',       version: '15.4.1' },
]

const FREE_THEMES = [
  { id: 'horizon',  name: 'Horizon',       by: 'thaja', primary: '#1b3b5f', accent: '#fbbf24', bg: '#fff'    },
  { id: 'tinker',   name: 'Tinker',        by: 'thaja', primary: '#78350f', accent: '#d97706', bg: '#fffbf5' },
  { id: 'savor',    name: 'Savor',         by: 'thaja', primary: '#7f1d1d', accent: '#ef4444', bg: '#fff'    },
  { id: 'atelier',  name: 'Atelier',       by: 'thaja', primary: '#1e1b4b', accent: '#8b5cf6', bg: '#fafafa' },
  { id: 'ritual',   name: 'Ritual',        by: 'thaja', primary: '#292524', accent: '#f43f5e', bg: '#fff1f2' },
]

const PERF_METRICS = [
  { label: 'LCP P75',                 value: '2406 ms', badge: 'Good', good: true  },
  { label: 'INP P75',                 value: '104 ms',  badge: 'Good', good: true  },
  { label: 'Cumulative Layout Shift', value: '0',       badge: null,   good: null  },
  { label: 'Sessions',                value: '634',     badge: null,   good: null  },
]

/* ══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function OnlineStoreThemes() {
  const navigate = useNavigate()

  const [currentTheme, setCurrentTheme] = useState(INITIAL_CURRENT)
  const [drafts,        setDrafts]       = useState(INITIAL_DRAFTS)
  const [showAll,       setShowAll]      = useState(false)
  const [importOpen,    setImportOpen]   = useState(false)
  const [publishId,     setPublishId]    = useState(null)
  const [moreOpen,      setMoreOpen]     = useState(null)
  const [currentMore,   setCurrentMore]  = useState(false)
  const [addedThemes,   setAddedThemes]  = useState(new Set())
  const [toast,         setToast]        = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── Publish ── */
  const handlePublish = (draft) => {
    const prev = currentTheme
    setCurrentTheme({ ...draft, savedAt: 'Just now', isLive: true })
    setDrafts(d => [{ ...prev, savedAt: 'Just now' }, ...d.filter(x => x.id !== draft.id)])
    setPublishId(null)
    showToast(`"${draft.name}" is now live`)
  }

  /* ── Draft actions ── */
  const handleDuplicate = (draft) => {
    const copy = { ...draft, id: `${draft.id}-${Date.now()}`, name: `${draft.name} (copy)`, savedAt: 'Just now' }
    setDrafts(d => [...d, copy])
    setMoreOpen(null)
    showToast(`"${draft.name}" duplicated`)
  }

  const handleDelete = (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDrafts(d => d.filter(x => x.id !== id))
    setMoreOpen(null)
    showToast(`Theme deleted`, 'error')
  }

  const handleDownload = (draft) => {
    // Placeholder — in production POST to /api/themes/:id/export
    showToast(`Preparing download for "${draft.name}"…`)
    setMoreOpen(null)
  }

  /* ── Add free theme ── */
  const handleAddFreeTheme = (theme) => {
    if (addedThemes.has(theme.id)) return
    const draft = { ...theme, id: `${theme.id}-${Date.now()}`, savedAt: 'Just now', version: '1.0.0' }
    setDrafts(d => [...d, draft])
    setAddedThemes(s => new Set([...s, theme.id]))
    showToast(`"${theme.name}" added to your library`)
  }

  const visibleDrafts = showAll ? drafts : drafts.slice(0, 4)

  return (
    <div className={s.page}>

      {/* ── Toast ──────────────────────────────────────────────────── */}
      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toastError : s.toastSuccess}`}>
          <Ic d={toast.type === 'error'
            ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
            : 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'}
            size={15} stroke={toast.type === 'error' ? 'var(--color-error)' : 'var(--color-success)'} />
          {toast.msg}
        </div>
      )}

      {/* ── Sticky header ──────────────────────────────────────────── */}
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>
          <Ic d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L13 15.414V21a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 19v-3.586L4.293 7.707A1 1 0 0 1 4 7V5z"
            size={18} stroke="var(--color-primary)" />
          Themes
        </h1>

        <div className={s.pageHeaderActions}>
          <button className={s.viewStoreBtn} onClick={() => window.open('/', '_blank')}>
            <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" size={14} />
            View store
          </button>

          {/* Import / Edit split button */}
          <div className={s.importWrap}>
            <div className={s.importBtnGroup}>
              <button className={s.importBtn} onClick={() => navigate('/online-store/editor')}>
                Edit current theme
              </button>
              <button className={s.importChevBtn} onClick={() => setImportOpen(o => !o)}
                aria-label="More options">
                <Ic d="M6 9l6 6 6-6" size={14} />
              </button>
            </div>

            {importOpen && (
              <>
                <div className={s.importBackdrop} onClick={() => setImportOpen(false)} />
                <div className={s.importDropdown}>
                  {[
                    { icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', label: 'Open theme editor', action: () => { navigate('/online-store/editor'); setImportOpen(false) } },
                    { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',                                                      label: 'Upload theme (.zip)',   action: () => { showToast('Upload coming soon'); setImportOpen(false) } },
                    { icon: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',                                         label: 'Browse theme store',    action: () => { window.open('https://themes.shopify.com','_blank'); setImportOpen(false) } },
                  ].map(item => (
                    <button key={item.label} className={s.importDropItem} onClick={item.action}>
                      <Ic d={item.icon} size={14} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Performance bar ────────────────────────────────────────── */}
      <div className={s.perfBar}>
        <div className={s.perfItem}>
          <Ic d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={14} stroke="var(--color-accent)" />
          <span className={s.perfLabel}>30 days</span>
        </div>
        <div className={s.perfDivider} />
        {PERF_METRICS.map((p, i) => (
          <div key={i} className={s.perfItem}>
            <span className={s.perfLabel}>{p.label}</span>
            <span className={s.perfNum}>{p.value}</span>
            {p.badge && (
              <span className={`${s.perfBadge} ${p.good ? s.perfGood : ''}`}>{p.badge}</span>
            )}
            {i < PERF_METRICS.length - 1 && <div className={s.perfDivider} />}
          </div>
        ))}
      </div>

      {/* ── Current theme ──────────────────────────────────────────── */}
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <div>
            <p className={s.sectionTitle}>Current theme</p>
            <p className={s.sectionSub}>This is the theme your customers see when they visit your store.</p>
          </div>
        </div>

        <div className={s.currentThemeCard}>
          {/* Thumbnail — main + side preview */}
          <div className={s.currentThumb}>
            <ThumbPlaceholder primary={currentTheme.primary} accent={currentTheme.accent} bg={currentTheme.bg} />
            <div className={s.currentThumbSide}>
              <ThumbPlaceholder primary={currentTheme.primary} accent={currentTheme.accent} bg={currentTheme.bg} />
            </div>
          </div>

          {/* Info + actions */}
          <div className={s.currentInfo}>
            <div className={s.currentMeta}>
              <span className={s.currentBadge}>
                <span className={s.liveDot} /> Live
              </span>
              <h2 className={s.currentName}>{currentTheme.name}</h2>
              <p className={s.currentSaved}>Last saved: {currentTheme.savedAt}</p>
              <p className={s.currentVersion}>
                <span className={s.versionDot} />
                Version {currentTheme.version} available
                <Ic d="M6 9l6 6 6-6" size={12} stroke="var(--color-accent)" />
              </p>
            </div>

            <div className={s.currentActions}>
              <button className={s.editThemeBtn} onClick={() => navigate('/online-store')}>
                Edit theme
              </button>
              <div style={{ position: 'relative' }}>
                <button className={s.moreBtn} title="More actions"
                  onClick={() => setCurrentMore(o => !o)}>
                  <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={16} sw={2.5} />
                </button>
                {currentMore && (
                  <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setCurrentMore(false)} />
                    <div className={s.draftDropdown} style={{ right: 0, top: '100%', marginTop: 4 }}>
                      <button className={s.draftDropItem} onClick={() => { navigate('/online-store/editor'); setCurrentMore(false) }}>
                        <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
                        Edit
                      </button>
                      <button className={s.draftDropItem} onClick={() => { handleDuplicate(currentTheme); setCurrentMore(false) }}>
                        <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
                        Duplicate
                      </button>
                      <button className={s.draftDropItem} onClick={() => { handleDownload(currentTheme) }}>
                        <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
                        Download
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Draft themes ───────────────────────────────────────────── */}
      {drafts.length > 0 && (
        <div className={s.section}>
          <div className={s.sectionHeader}>
            <div>
              <p className={s.sectionTitle}>Draft themes</p>
              <p className={s.sectionSub}>
                Only visible to you. Publishing a draft will replace your current live theme.
              </p>
            </div>
          </div>

          <div className={s.draftList}>
            {visibleDrafts.map(draft => (
              <DraftCard
                key={draft.id}
                draft={draft}
                moreOpen={moreOpen === draft.id}
                onMoreToggle={() => setMoreOpen(moreOpen === draft.id ? null : draft.id)}
                onMoreClose={() => setMoreOpen(null)}
                onEdit={() => navigate('/online-store/editor')}
                onDuplicate={() => handleDuplicate(draft)}
                onDownload={() => handleDownload(draft)}
                onDelete={() => handleDelete(draft.id, draft.name)}
                onPublish={() => setPublishId(draft.id)}
              />
            ))}
          </div>

          {drafts.length > 4 && (
            <button className={s.showAllBtn} onClick={() => setShowAll(v => !v)}>
              {showAll ? 'Show less ↑' : `Show all (${drafts.length}) ↓`}
            </button>
          )}
        </div>
      )}

      {/* ── Discover themes ─────────────────────────────────────────── */}
      <div className={s.section}>
        <div className={s.themeStoreHeader}>
          <div>
            <p className={s.themeStoreLabel}>Discover themes</p>
            <p className={s.themeStoreSub}>Add a theme to your library. Customize before publishing.</p>
          </div>
          <button className={s.visitStoreBtn}>
            <Ic d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" size={13} />
            Visit Theme Store
          </button>
        </div>

        {/* AI storefront generator */}
        <div className={s.aiCard}>
          <p className={s.aiTitle}>Create a custom storefront</p>
          <p className={s.aiSub}>Describe your business to generate a unique theme with personalized content</p>
          <div className={s.aiInputRow}>
            <input className={s.aiInput} placeholder="e.g. modern African fashion boutique…" />
            <button className={s.aiBtn}>
              <Ic d="M13 10V3L4 14h7v7l9-11h-7z" size={13} fill="currentColor" stroke="none" />
              Create
            </button>
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
                <button
                  className={`${s.addThemeBtn} ${addedThemes.has(t.id) ? s.addThemeBtnDone : ''}`}
                  onClick={() => handleAddFreeTheme(t)}
                  disabled={addedThemes.has(t.id)}>
                  {addedThemes.has(t.id) ? '✓ Added' : 'Add'}
                </button>
              </div>
            </div>
          ))}

          {/* Explore more card */}
          <div className={s.exploreCard}>
            <div className={s.exploreIcon}>🛍️</div>
            <p className={s.exploreTitle}>Explore more themes</p>
            <p className={s.exploreSub}>Browse professionally designed free and paid themes for your store.</p>
            <button className={s.exploreBtn}>
              <Ic d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" size={13} />
              Visit Theme Store
            </button>
          </div>
        </div>
      </div>

      {/* ── Publish confirm modal ──────────────────────────────────── */}
      {publishId && (() => {
        const draft = drafts.find(d => d.id === publishId)
        if (!draft) return null
        return (
          <div className={s.modalBackdrop} onClick={() => setPublishId(null)}>
            <div className={s.modal} onClick={e => e.stopPropagation()}>
              <div className={s.modalIcon}>🚀</div>
              <h3 className={s.modalTitle}>Publish "{draft.name}"?</h3>
              <p className={s.modalBody}>
                This will replace <strong>"{currentTheme.name}"</strong> as your live theme.
                Your current theme will be moved to drafts.
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

/* ── Draft card sub-component ──────────────────────────────────── */
function DraftCard({ draft, moreOpen, onMoreToggle, onMoreClose, onEdit, onDuplicate, onDownload, onDelete, onPublish }) {
  return (
    <div className={s.draftCard}>
      <div className={s.draftThumb}>
        <ThumbPlaceholder primary={draft.primary} accent={draft.accent} bg={draft.bg} />
      </div>

      <div className={s.draftInfo}>
        <p className={s.draftName}>{draft.name}</p>
        <p className={s.draftMeta}>Last saved: {draft.savedAt}</p>
        <p className={s.draftVersion}>
          <span className={s.draftVersionDot} />
          Version {draft.version} available
        </p>
      </div>

      <div className={s.draftActions}>
        <div style={{ position: 'relative' }}>
          <button className={s.draftMoreBtn} onClick={onMoreToggle} aria-label="More actions">
            <Ic d="M5 12h.01M12 12h.01M19 12h.01" size={15} sw={2.5} />
          </button>
          {moreOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={onMoreClose} />
              <div className={s.draftDropdown}>
                <button className={s.draftDropItem} onClick={onEdit}>
                  <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} />
                  Edit
                </button>
                <button className={s.draftDropItem} onClick={onDuplicate}>
                  <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
                  Duplicate
                </button>
                <button className={s.draftDropItem} onClick={onDownload}>
                  <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" size={13} />
                  Download
                </button>
                <hr className={s.draftDropDivider} />
                <button className={`${s.draftDropItem} ${s.draftDropDanger}`} onClick={onDelete}>
                  <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} stroke="currentColor" />
                  Delete theme
                </button>
              </div>
            </>
          )}
        </div>

        <button className={s.publishBtn} onClick={onPublish}>Publish</button>
        <button className={s.editDraftBtn} onClick={onEdit}>Edit theme</button>
      </div>
    </div>
  )
}
