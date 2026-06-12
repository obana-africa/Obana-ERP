/**
 * OnlineStorePages.jsx
 * Pages management — sub-item of Online Store.
 * Route: /online-store/pages
 *
 * "Add page" → /online-store/pages/new
 * Row click  → /online-store/pages/:id
 */

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './OnlineStorePages.module.css'

/* ── Icon ─────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Seed data (replace with API in production) ───────────────── */
const SEED_PAGES = [
  { id: '1', title: 'Bundles',              visibility: 'visible', content: '',                                                                               updatedAt: new Date('') },
  { id: '2', title: 'Your Privacy Choices', visibility: 'visible', content: '', updatedAt: new Date('') },
  { id: '3', title: 'Bundles',              visibility: 'visible', content: '',                                                                               updatedAt: new Date('') },
  { id: '4', title: 'Mix and Match',        visibility: 'visible', content: '',                                                                               updatedAt: new Date('') },
  { id: '5', title: 'Return Policy',        visibility: 'visible', content: '',  updatedAt: new Date('') },
  { id: '6', title: 'Terms and Conditions', visibility: 'visible', content: '',      updatedAt: new Date('') },
  { id: '7', title: 'Help Center',          visibility: 'visible', content: '', updatedAt: new Date('') },
  { id: '8', title: 'About Us',             visibility: 'visible', content: '', updatedAt: new Date('') },
]

/* ── Helpers ───────────────────────────────────────────────────── */
function fmtDate(date) {
  const now   = new Date()
  const diff  = (now - date) / 1000
  if (diff < 60)   return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  const sameYear = date.getFullYear() === now.getFullYear()
  const day   = date.getDate()
  const month = date.toLocaleString('en-GB', { month: 'short' })
  const time  = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
  if (sameYear && (now - date) < 86400 * 365 * 1000) {
    return `${day} ${month} at ${time}`
  }
  return `${day} ${month} ${date.getFullYear()}`
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function OnlineStorePages() {
  const navigate = useNavigate()

  const [pages,    setPages]    = useState(SEED_PAGES)
  const [selected, setSelected] = useState(new Set())
  const [sortDir,  setSortDir]  = useState('asc')   // 'asc' | 'desc'
  const [filter,   setFilter]   = useState('all')    // 'all' | 'visible' | 'hidden'
  const [search,   setSearch]   = useState('')
  const [toast,    setToast]    = useState(null)
  const [delModal, setDelModal] = useState(false)

  /* ── Derived list ── */
  const visible = useMemo(() => {
    let list = [...pages]
    if (filter !== 'all') list = list.filter(p => p.visibility === filter)
    if (search.trim())    list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    list.sort((a, b) => sortDir === 'asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title))
    return list
  }, [pages, filter, search, sortDir])

  /* ── Selection ── */
  const allChecked = visible.length > 0 && visible.every(p => selected.has(p.id))
  const someChecked = visible.some(p => selected.has(p.id))

  const toggleAll = () => {
    if (allChecked) setSelected(new Set())
    else setSelected(new Set(visible.map(p => p.id)))
  }

  const toggleOne = (id) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  /* ── Bulk delete ── */
  const confirmDelete = () => {
    setPages(prev => prev.filter(p => !selected.has(p.id)))
    showToast(`${selected.size} page${selected.size > 1 ? 's' : ''} deleted`)
    setSelected(new Set())
    setDelModal(false)
  }

  /* ── Toast ── */
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* ── Visibility toggle ── */
  const toggleVisibility = (id, e) => {
    e.stopPropagation()
    setPages(prev => prev.map(p =>
      p.id === id
        ? { ...p, visibility: p.visibility === 'visible' ? 'hidden' : 'visible' }
        : p
    ))
  }

  return (
    <div className={s.page}>

      {/* Toast */}
      {toast && (
        <div className={`${s.toast} ${toast.type === 'error' ? s.toastError : s.toastSuccess}`}>
          <Ic d={toast.type === 'error'
            ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
            : 'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'}
            size={15} stroke={toast.type === 'error' ? 'var(--color-error)' : 'var(--color-success)'} />
          {toast.msg}
        </div>
      )}

      {/* Delete confirm modal */}
      {delModal && (
        <div className={s.modalBackdrop} onClick={() => setDelModal(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()}>
            <h3 className={s.modalTitle}>Delete {selected.size} page{selected.size > 1 ? 's' : ''}?</h3>
            <p className={s.modalBody}>This action cannot be undone. The selected pages will be permanently removed.</p>
            <div className={s.modalActions}>
              <button className={s.modalCancel} onClick={() => setDelModal(false)}>Cancel</button>
              <button className={s.modalConfirm} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page header ── */}
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>
          <Ic d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
            size={20} stroke="var(--color-primary)" />
          Pages
        </h1>
        <div className={s.pageHeaderRight}>
          <button className={s.moreActionsBtn}>
            More actions
            <Ic d="M6 9l6 6 6-6" size={14} />
          </button>
          <button className={s.addPageBtn} onClick={() => navigate('/online-store/pages/new')}>
            Add page
          </button>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className={s.tableCard}>

        {/* Filter tabs + toolbar */}
        <div className={s.toolbar}>
          <div className={s.filterTabs}>
            {['all', 'visible', 'hidden'].map(f => (
              <button key={f}
                className={`${s.filterTab} ${filter === f ? s.filterTabOn : ''}`}
                onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                <span className={s.filterCount}>
                  {f === 'all' ? pages.length : pages.filter(p => p.visibility === f).length}
                </span>
              </button>
            ))}
            <button className={s.filterTabAdd} title="Add filter">
              <Ic d="M12 5v14M5 12h14" size={14} />
            </button>
          </div>

          <div className={s.toolbarRight}>
            {/* Search */}
            <div className={s.searchWrap}>
              <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" size={14} stroke="#9CA3AF" />
              <input
                className={s.searchInput}
                placeholder="Search pages…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className={s.searchClear} onClick={() => setSearch('')}>
                  <Ic d="M18 6L6 18M6 6l12 12" size={12} />
                </button>
              )}
            </div>
            {/* Filter icon */}
            <button className={s.toolIconBtn} title="Filter">
              <Ic d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2.586a1 1 0 0 1-.293.707l-6.414 6.414a1 1 0 0 0-.293.707V17l-4 4v-6.586a1 1 0 0 0-.293-.707L3.293 7.293A1 1 0 0 1 3 6.586V4z"
                size={15} />
            </button>
            {/* Sort icon */}
            <button className={s.toolIconBtn} title="Sort" onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
              <Ic d="M3 4h13M3 8h9M3 12h5m10 0l-4-4m0 8l4-4" size={15} />
            </button>
            {/* Refresh */}
            <button className={s.toolIconBtn} title="Refresh">
              <Ic d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15"
                size={15} />
            </button>
          </div>
        </div>

        {/* Bulk action bar */}
        {someChecked && (
          <div className={s.bulkBar}>
            <span className={s.bulkCount}>{selected.size} selected</span>
            <button className={s.bulkBtn} onClick={() => {
              setPages(prev => prev.map(p =>
                selected.has(p.id) ? { ...p, visibility: 'visible' } : p
              ))
              showToast(`${selected.size} page${selected.size > 1 ? 's' : ''} set to visible`)
            }}>
              Set as visible
            </button>
            <button className={s.bulkBtn} onClick={() => {
              setPages(prev => prev.map(p =>
                selected.has(p.id) ? { ...p, visibility: 'hidden' } : p
              ))
              showToast(`${selected.size} page${selected.size > 1 ? 's' : ''} hidden`)
            }}>
              Hide
            </button>
            <button className={`${s.bulkBtn} ${s.bulkBtnDanger}`} onClick={() => setDelModal(true)}>
              Delete
            </button>
          </div>
        )}

        {/* Table */}
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.thCheck}>
                <input type="checkbox" className={s.checkbox}
                  checked={allChecked} ref={el => el && (el.indeterminate = someChecked && !allChecked)}
                  onChange={toggleAll} />
              </th>
              <th className={s.thTitle}>
                <button className={s.sortBtn} onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
                  Title
                  <Ic d={sortDir === 'asc' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} size={12} stroke="#6B7280" />
                </button>
              </th>
              <th className={s.thVis}>Visibility</th>
              <th className={s.thContent}>Content</th>
              <th className={s.thDate}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className={s.emptyRow}>
                  <div className={s.empty}>
                    <Ic d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
                      size={36} stroke="#D1D5DB" />
                    <p className={s.emptyTitle}>No pages found</p>
                    <p className={s.emptySub}>
                      {search ? `No results for "${search}"` : 'Create your first page to get started.'}
                    </p>
                    {!search && (
                      <button className={s.emptyBtn} onClick={() => navigate('/online-store/pages/new')}>
                        Add page
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              visible.map(page => (
                <tr key={page.id}
                  className={`${s.row} ${selected.has(page.id) ? s.rowSelected : ''}`}
                  onClick={() => navigate(`/online-store/pages/${page.id}`)}>
                  <td className={s.tdCheck} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className={s.checkbox}
                      checked={selected.has(page.id)}
                      onChange={() => toggleOne(page.id)} />
                  </td>
                  <td className={s.tdTitle}>
                    <span className={s.titleLink}>{page.title}</span>
                  </td>
                  <td className={s.tdVis} onClick={e => e.stopPropagation()}>
                    <button
                      className={`${s.visBadge} ${page.visibility === 'visible' ? s.visBadgeVisible : s.visBadgeHidden}`}
                      onClick={e => toggleVisibility(page.id, e)}
                      title="Click to toggle visibility">
                      {page.visibility === 'visible' ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className={s.tdContent}>
                    <span className={s.contentSnippet}>{page.content || '—'}</span>
                  </td>
                  <td className={s.tdDate}>{fmtDate(page.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className={s.tableFooter}>
          <a href="#pages" className={s.learnLink} onClick={e => e.preventDefault()}>
            Learn more about pages
          </a>
        </div>
      </div>
    </div>
  )
}
