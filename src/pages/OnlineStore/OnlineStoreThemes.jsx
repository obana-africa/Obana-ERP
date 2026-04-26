/**
 * OnlineStoreThemes.jsx
 * Shopify-style Themes management page.
 * 
 * Route: /online-store/themes
 * Add to AppRoutes.jsx inside the MainLayout block:
 *   import OnlineStoreThemes from '../pages/OnlineStore/OnlineStoreThemes'
 *   <Route path="/online-store/themes" element={<OnlineStoreThemes />} />
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './OnlineStoreThemes.module.css'

/* ─── Icon helper ─────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ─── Theme data ──────────────────────────────────────────── */
const CURRENT_THEME = {
  id: 'midnight',
  name: 'Midnight Navy',
  version: '1.0.0',
  savedAt: 'Today at 10:38 am',
  thumbnail: null,   // replace with actual screenshot URL
  colors: ['#1a1a2e', '#2DBD97', '#ffffff'],
}

const DRAFT_THEMES = [
  {
    id: 'earth',
    name: 'Earth Tones',
    addedAt: 'Added: Dec 12, 2024',
    version: '1.0.0',
    thumbnail: null,
    colors: ['#78350f', '#d97706', '#fffbf5'],
  },
  {
    id: 'minimal',
    name: 'Clean Minimal',
    addedAt: 'Added: Nov 20, 2024',
    version: '1.0.0',
    thumbnail: null,
    colors: ['#111827', '#6366f1', '#ffffff'],
  },
  {
    id: 'bold',
    name: 'Bold Green',
    addedAt: 'Added: Sep 23, 2024',
    version: '1.0.0',
    thumbnail: null,
    colors: ['#064e3b', '#10b981', '#ffffff'],
  },
]

const FREE_THEMES = [
  {
    id: 'horizon',
    name: 'Horizon',
    by: 'Taja',
    category: 'Fashion',
    thumbnail: null,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #2d3748 100%)',
  },
  {
    id: 'bloom',
    name: 'Bloom',
    by: 'Taja',
    category: 'Beauty',
    thumbnail: null,
    bg: 'linear-gradient(135deg, #701a75 0%, #db2777 100%)',
  },
  {
    id: 'savanna',
    name: 'Savanna',
    by: 'Taja',
    category: 'Lifestyle',
    thumbnail: null,
    bg: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
  },
  {
    id: 'coastal',
    name: 'Coastal',
    by: 'Taja',
    category: 'General',
    thumbnail: null,
    bg: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
  },
  {
    id: 'ritual',
    name: 'Ritual',
    by: 'Taja',
    category: 'Accessories',
    thumbnail: null,
    bg: 'linear-gradient(135deg, #1c1917 0%, #a8a29e 100%)',
  },
]

/* ─── Theme thumbnail placeholder ────────────────────────── */
function ThumbPlaceholder({ colors = [], label }) {
  const [bg1, bg2, bg3] = [...colors, '#E5E7EB', '#F9FAFB', '#fff']
  return (
    <div className={styles.thumbPlaceholder} style={{ background: bg1 }}>
      <div className={styles.thumbNav} style={{ background: bg1 }}>
        <div className={styles.thumbNavDot} style={{ background: bg3 }} />
        <div className={styles.thumbNavLine} style={{ background: `${bg3}66` }} />
        <div className={styles.thumbNavLine} style={{ background: `${bg3}44`, width: '30%' }} />
      </div>
      <div className={styles.thumbHero} style={{ background: bg2 }}>
        <div className={styles.thumbHeroText} style={{ background: bg3 }} />
        <div className={styles.thumbHeroSub} style={{ background: `${bg3}88` }} />
        <div className={styles.thumbHeroBtn} style={{ background: bg2 === '#ffffff' ? bg1 : bg2 }} />
      </div>
      <div className={styles.thumbGrid}>
        {[1,2,3].map(i => (
          <div key={i} className={styles.thumbCard} style={{ background: bg3, border: `1px solid ${bg2}33` }}>
            <div className={styles.thumbCardImg} style={{ background: bg2 === '#ffffff' ? '#E5E7EB' : bg2 }} />
            <div className={styles.thumbCardLine} style={{ background: `${bg1}44` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────── */
export default function OnlineStoreThemes() {
  const navigate = useNavigate()
  const [draftMenuOpen, setDraftMenuOpen] = useState(null)
  const [publishConfirm, setPublishConfirm] = useState(null)
  const [showThemeStore, setShowThemeStore] = useState(false)

  const handlePublish = (theme) => {
    setPublishConfirm(theme)
  }

  const confirmPublish = () => {
    // TODO: call your API to set the published theme
    setPublishConfirm(null)
    setDraftMenuOpen(null)
  }

  return (
    <div className={styles.page}>

      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>
            <span className={styles.pageTitleIcon}>🏪</span>
            Online Store
          </h1>
        </div>
        <button
          className={styles.viewStoreBtn}
          onClick={() => window.open('/store-preview', '_blank')}
        >
          <Ic d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2 2h6M15 3h6v6M10 14L21 3" size={14} />
          View store
        </button>
      </div>

      {/* ── Performance bar (like Shopify) ── */}
      <div className={styles.perfBar}>
        <div className={styles.perfItem}>
          <span className={styles.perfLabel}>30 days</span>
        </div>
        <div className={styles.perfDivider} />
        <div className={styles.perfItem}>
          <span className={styles.perfValue}>LCP</span>
          <span className={styles.perfNum}>2,096ms</span>
          <span className={`${styles.perfBadge} ${styles.perfGood}`}>● Good</span>
        </div>
        <div className={styles.perfDivider} />
        <div className={styles.perfItem}>
          <span className={styles.perfValue}>INP</span>
          <span className={styles.perfNum}>96ms</span>
          <span className={`${styles.perfBadge} ${styles.perfGood}`}>● Good</span>
        </div>
        <div className={styles.perfDivider} />
        <div className={styles.perfItem}>
          <span className={styles.perfValue}>Layout Shift</span>
          <span className={styles.perfNum}>0 —</span>
        </div>
      </div>

      {/* ── Current theme ── */}
      <div className={styles.section}>
        <div className={styles.currentThemeCard}>
          {/* Thumbnail */}
          <div className={styles.currentThumb}>
            <ThumbPlaceholder colors={CURRENT_THEME.colors} label={CURRENT_THEME.name} />
            <div className={styles.currentThumbSide}>
              <ThumbPlaceholder colors={CURRENT_THEME.colors} label="" />
            </div>
          </div>

          {/* Info + actions */}
          <div className={styles.currentInfo}>
            <div className={styles.currentMeta}>
              <div className={styles.currentBadge}>Current theme</div>
              <h2 className={styles.currentName}>{CURRENT_THEME.name}</h2>
              <p className={styles.currentSaved}>Last saved: {CURRENT_THEME.savedAt}</p>
              <p className={styles.currentVersion}>Version {CURRENT_THEME.version}
                <button className={styles.versionChev}>
                  <Ic d="M6 9l6 6 6-6" size={12} />
                </button>
              </p>
            </div>
            <div className={styles.currentActions}>
              <button
                className={styles.editThemeBtn}
                onClick={() => navigate('/online-store')}
              >
                Customize
              </button>
              <button className={styles.moreBtn}>
                <Ic d="M12 5h.01M12 12h.01M12 19h.01" size={16} sw={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Draft themes ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Draft themes</h2>
            <p className={styles.sectionSub}>
              These themes are only visible to you. Publishing a theme from your library will switch it to your current theme.
            </p>
          </div>
        </div>

        <div className={styles.draftList}>
          {DRAFT_THEMES.map(theme => (
            <div key={theme.id} className={styles.draftCard}>
              <div className={styles.draftThumb}>
                <ThumbPlaceholder colors={theme.colors} label={theme.name} />
              </div>
              <div className={styles.draftInfo}>
                <p className={styles.draftName}>{theme.name}</p>
                <p className={styles.draftMeta}>{theme.addedAt}</p>
                <p className={styles.draftVersion}>
                  <span className={styles.draftVersionDot} />
                  Version {theme.version} available
                  <Ic d="M6 9l6 6 6-6" size={11} stroke="#6B7280" />
                </p>
              </div>
              <div className={styles.draftActions}>
                <button
                  className={styles.draftMoreBtn}
                  onClick={() => setDraftMenuOpen(draftMenuOpen === theme.id ? null : theme.id)}
                >
                  <Ic d="M12 5h.01M12 12h.01M12 19h.01" size={16} sw={2.5} />
                </button>
                <button
                  className={styles.publishBtn}
                  onClick={() => handlePublish(theme)}
                >
                  Publish
                </button>
                <button
                  className={styles.editDraftBtn}
                  onClick={() => navigate('/online-store')}
                >
                  Customize
                </button>

                {/* Dropdown menu */}
                {draftMenuOpen === theme.id && (
                  <div className={styles.draftDropdown}>
                    <button className={styles.draftDropItem} onClick={() => navigate('/online-store')}>
                      <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" size={13} />
                      Customize
                    </button>
                    <button className={styles.draftDropItem}>
                      <Ic d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" size={13} />
                      Preview
                    </button>
                    <button className={styles.draftDropItem}>
                      <Ic d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" size={13} />
                      Duplicate
                    </button>
                    <div className={styles.draftDropDivider} />
                    <button className={`${styles.draftDropItem} ${styles.draftDropDanger}`}>
                      <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" size={13} stroke="#EF4444" />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Theme store ── */}
      <div className={styles.section}>
        <div className={styles.themeStoreHeader}>
          <div>
            <p className={styles.themeStoreLabel}>
              <span className={styles.themeStoreLabelIcon}>🎨</span>
              Popular free themes
            </p>
            <p className={styles.themeStoreSub}>
              Made with core features you can easily customize — no coding needed.
            </p>
          </div>
        </div>

        <div className={styles.freeThemeGrid}>
          {FREE_THEMES.map(theme => (
            <div key={theme.id} className={styles.freeThemeCard}>
              <div
                className={styles.freeThemeThumb}
                style={{ background: theme.bg }}
              >
                <div className={styles.freeThemePreview}>
                  <div className={styles.freeThemeBar} />
                  <div className={styles.freeThemeHero} />
                  <div className={styles.freeThemeGrid2}>
                    <div className={styles.freeThemeProduct} />
                    <div className={styles.freeThemeProduct} />
                  </div>
                </div>
              </div>
              <div className={styles.freeThemeInfo}>
                <div>
                  <p className={styles.freeThemeName}>{theme.name}</p>
                  <p className={styles.freeThemeBy}>by {theme.by}</p>
                </div>
                <button
                  className={styles.addThemeBtn}
                  onClick={() => {
                    // TODO: add to draft themes
                    alert(`"${theme.name}" added to draft themes`)
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
          {/* Explore more */}
          <div className={styles.exploreCard}>
            <p className={styles.exploreTitle}>Explore more themes</p>
            <p className={styles.exploreSub}>Browse professionally designed free and paid themes</p>
            <button className={styles.exploreBtn}>
              <Ic d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2 2h6M15 3h6v6M10 14L21 3" size={13} />
              Visit Theme Store
            </button>
          </div>
        </div>
      </div>

      {/* ── Publish confirm modal ── */}
      {publishConfirm && (
        <div className={styles.modalBackdrop} onClick={() => setPublishConfirm(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Publish "{publishConfirm.name}"?</h3>
            <p className={styles.modalBody}>
              This will replace your current theme ("{CURRENT_THEME.name}") and become visible to your store visitors immediately.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setPublishConfirm(null)}>
                Cancel
              </button>
              <button className={styles.modalConfirm} onClick={confirmPublish}>
                Publish theme
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
