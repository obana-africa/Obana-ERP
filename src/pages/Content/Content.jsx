import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Content.module.css'
import { fmtD } from '../../utils/formatters'
import {
  SEED_BLOGS, SEED_PAGES, SEED_MENUS, SEED_FILES,
  SEED_METAOBJECTS, FIELD_TYPE_LABELS, FILE_TYPE_ICON,
} from '../../data/content'
import BlogModal            from './components/BlogModal'
import PageModal            from './components/PageModal'
import MenuModal            from './components/MenuModal'
import MetaDefModal         from './components/MetaDefModal'
import MetaobjectEntryModal from './components/MetaobjectEntryModal'

/* ── Icon ──────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Helpers ───────────────────────────────────────────────────── */
const fmtSize = bytes => {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const StatusPill = ({ status }) => {
  const cfg = {
    published: { bg: '#ECFDF5', color: '#047857', label: 'Published' },
    draft:     { bg: '#F3F4F6', color: '#6B7280', label: 'Draft'     },
    archived:  { bg: '#FEF3C7', color: '#B45309', label: 'Archived'  },
  }[status] || { bg: '#F3F4F6', color: '#6B7280', label: status }
  return <span className={styles.pill} style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
}

/* ── Stat card with sparkline ──────────────────────────────────── */
function StatCard({ label, value, color, spark, icon, delay }) {
  const w = 80, h = 24
  const min = Math.min(...spark), max = Math.max(...spark)
  const pts = spark.map((v, i) => {
    const x = (i / (spark.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * (h - 3) - 1
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={styles.statCard} style={{ animationDelay: delay }}>
      <div className={styles.statTop}>
        <div className={styles.statIconWrap} style={{ background: `${color}18` }}>
          <Ic d={icon} size={14} stroke={color} />
        </div>
      </div>
      <div className={styles.statBody}>
        <p className={styles.statLabel}>{label}</p>
        <p className={styles.statValue} style={{ color }}>{value}</p>
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={styles.spark}>
        <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.1" stroke="none" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
      </svg>
    </div>
  )
}

/* ── Tabs ──────────────────────────────────────────────────────── */
const TABS = [
  { key: 'blog-posts',  label: 'Blog Posts',   icon: 'M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
  { key: 'pages',       label: 'Pages',         icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' },
  { key: 'menus',       label: 'Menus',         icon: 'M3 12h18M3 6h18M3 18h18' },
  { key: 'files',       label: 'Files',         icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' },
  { key: 'metaobjects', label: 'Metaobjects',   icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
]

const BLOGS_LIST = ['Style Guide', 'Wellness', 'News & Updates']

const ICON_EDIT = 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
const ICON_DEL  = ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2']
const ICON_COPY = 'M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2'

export default function Content() {
  const location      = useLocation()
  const fileUploadRef = useRef()

  const [activeTab, setActiveTab] = useState(() => {
    const match = TABS.find(t => location.pathname.includes(t.key))
    return match?.key || 'blog-posts'
  })

  useEffect(() => {
    const match = TABS.find(t => location.pathname.includes(t.key))
    if (match) setActiveTab(match.key)
  }, [location.pathname])

  const [blogs,       setBlogs]       = useState(SEED_BLOGS)
  const [pages,       setPages]       = useState(SEED_PAGES)
  const [menus,       setMenus]       = useState(SEED_MENUS)
  const [files,       setFiles]       = useState(SEED_FILES)
  const [metaobjects, setMetaobjects] = useState(SEED_METAOBJECTS)
  const [modal,       setModal]       = useState(null)
  const [editTarget,  setEditTarget]  = useState(null)
  const [entryTarget, setEntryTarget] = useState(null)
  const [activeMetaDef, setActiveMetaDef] = useState(SEED_METAOBJECTS[0]?.id)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [visible,      setVisible]      = useState(false)
  const [copied,       setCopied]       = useState(null)

  useEffect(() => { setTimeout(() => setVisible(true), 50) }, [])

  const activeDef = metaobjects.find(m => m.id === activeMetaDef)

  /* ── CRUD ──────────────────────────────────────────────────── */
  const saveBlog  = data => editTarget
    ? setBlogs(bs => bs.map(b => b.id === editTarget.id ? { ...b, ...data } : b))
    : setBlogs(bs => [...bs, { ...data, id: `blog-${Date.now()}`, date: new Date().toISOString().split('T')[0], commentCount: 0 }])

  const deleteBlog = id => window.confirm('Delete this post?') && setBlogs(bs => bs.filter(b => b.id !== id))

  const savePage  = data => editTarget
    ? setPages(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...data } : p))
    : setPages(ps => [...ps, { ...data, id: `pg-${Date.now()}`, date: new Date().toISOString().split('T')[0] }])

  const deletePage = id => window.confirm('Delete this page?') && setPages(ps => ps.filter(p => p.id !== id))

  const saveMenu  = data => editTarget
    ? setMenus(ms => ms.map(m => m.id === editTarget.id ? { ...m, ...data } : m))
    : setMenus(ms => [...ms, { ...data, id: `menu-${Date.now()}` }])

  const deleteMenu = id => window.confirm('Delete this menu?') && setMenus(ms => ms.filter(m => m.id !== id))
  const deleteFile = id => setFiles(fs => fs.filter(f => f.id !== id))

  const saveMetaDef = data =>
    setMetaobjects(ms => [...ms, { ...data, id: `mo-def-${Date.now()}` }])

  const deleteMetaDef = id =>
    window.confirm('Delete this definition and all its entries?') &&
    setMetaobjects(ms => ms.filter(m => m.id !== id))

  const saveEntry = data => setMetaobjects(ms => ms.map(m => {
    if (m.id !== activeMetaDef) return m
    if (entryTarget) return { ...m, entries: m.entries.map(e => e.id === entryTarget.id ? { ...e, ...data } : e) }
    return { ...m, entries: [...m.entries, { ...data, id: `e-${Date.now()}` }] }
  }))

  const deleteEntry = id => setMetaobjects(ms => ms.map(m =>
    m.id === activeMetaDef ? { ...m, entries: m.entries.filter(e => e.id !== id) } : m
  ))

  const copyUrl = (url, id) => {
    navigator.clipboard?.writeText(url)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  /* ── Filtered ──────────────────────────────────────────────── */
  const filteredBlogs = blogs.filter(b => {
    const q   = search.toLowerCase()
    const ms  = b.title.toLowerCase().includes(q) || b.blog.toLowerCase().includes(q)
    const mst = filterStatus === 'all' || b.status === filterStatus
    return ms && mst
  })
  const filteredPages = pages.filter(p => {
    const ms  = p.title.toLowerCase().includes(search.toLowerCase())
    const mst = filterStatus === 'all' || p.status === filterStatus
    return ms && mst
  })
  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  /* ── Stat spark data ───────────────────────────────────────── */
  const blogSpark  = [3,5,4,7,6,9,8,11,9,12,10,blogs.length]
  const pageSpark  = [1,2,2,3,3,4,3,5,4,5,4,pages.length]
  const fileSpark  = [2,4,3,6,5,7,6,8,7,9,8,files.length]
  const menuSpark  = [1,1,2,2,2,3,3,3,3,3,3,menus.length]

  /* ── Action bar ────────────────────────────────────────────── */
  const ActionBar = ({ placeholder, onCreate, createLabel, showFilter = true }) => (
    <div className={styles.actionBar}>
      <div className={styles.searchBox}>
        <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
        <input className={styles.searchInput} placeholder={placeholder}
          value={search} onChange={e => setSearch(e.target.value)} />
        {search && (
          <button className={styles.searchClear} onClick={() => setSearch('')}>
            <Ic d="M18 6L6 18M6 6l12 12" size={12} stroke="#9CA3AF" />
          </button>
        )}
      </div>
      {showFilter && (
        <div className={styles.filterTabs}>
          {['all', 'published', 'draft'].map(f => (
            <button key={f}
              className={`${styles.filterTab} ${filterStatus === f ? styles.filterTabOn : ''}`}
              onClick={() => setFilterStatus(f)}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      )}
      {onCreate && (
        <button className={styles.btnPrimary} onClick={onCreate}>
          <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> {createLabel}
        </button>
      )}
    </div>
  )

  return (
    <div className={`${styles.page} ${visible ? styles.pageVisible : ''}`}>

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <h1 className={styles.pgTitle}>Content</h1>
          <span className={styles.topbarSub}>Manage your store's content</span>
        </div>
      </header>

      {/* ── Stats row ──────────────────────────────────────────── */}
      <div className={styles.statsRow}>
        <StatCard label="Blog Posts" value={blogs.length} color="#1b3b5f"
          spark={blogSpark} icon={TABS[0].icon} delay="0ms" />
        <StatCard label="Pages" value={pages.length} color="#2DBD97"
          spark={pageSpark} icon={TABS[1].icon} delay="60ms" />
        <StatCard label="Files" value={files.length} color="#E8C547"
          spark={fileSpark} icon={TABS[3].icon} delay="120ms" />
        <StatCard label="Menus" value={menus.length} color="#8B5CF6"
          spark={menuSpark} icon={TABS[2].icon} delay="180ms" />
      </div>

      {/* ── Tab nav ────────────────────────────────────────────── */}
      <div className={styles.tabNav}>
        {TABS.map(t => (
          <button key={t.key}
            className={`${styles.tabBtn} ${activeTab === t.key ? styles.tabBtnOn : ''}`}
            onClick={() => { setActiveTab(t.key); setSearch(''); setFilterStatus('all') }}>
            <Ic d={t.icon} size={14} stroke={activeTab === t.key ? '#1b3b5f' : '#9CA3AF'} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Content area ───────────────────────────────────────── */}
      <div className={styles.content}>

        {/* ── BLOG POSTS ─────────────────────────────────────── */}
        {activeTab === 'blog-posts' && (
          <div className={styles.tabContent}>
            <ActionBar placeholder="Search posts…" createLabel="New Post"
              onCreate={() => { setEditTarget(null); setModal('blog') }} />

            {filteredBlogs.length === 0 ? (
              <div className={styles.emptyState}>
                <span style={{ fontSize: 44 }}>✍️</span>
                <p className={styles.emptyTitle}>No blog posts yet</p>
                <p className={styles.emptySub}>{search ? `No posts matching "${search}"` : 'Start writing content for your store'}</p>
                <button className={styles.btnPrimary}
                  onClick={() => { setEditTarget(null); setModal('blog') }}>
                  <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Write first post
                </button>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <div className={styles.tHead} style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr 80px' }}>
                  <span>Title</span><span>Blog</span><span>Author</span><span>Date</span><span>Status</span><span />
                </div>
                {filteredBlogs.map((b, i) => (
                  <div key={b.id} className={styles.tRow}
                    style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.8fr 80px', animationDelay: `${i * 30}ms` }}>
                    <span className={styles.postCell}>
                      <div className={styles.postTitle}>{b.title}</div>
                      <div className={styles.postExcerpt}>{b.excerpt}</div>
                      {b.tags?.length > 0 && (
                        <div className={styles.tagRow}>
                          {b.tags.slice(0, 3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                        </div>
                      )}
                    </span>
                    <span className={styles.blogName}>{b.blog}</span>
                    <span className={styles.authorCell}>{b.author}</span>
                    <span className={styles.dateCell}>{fmtD(b.date)}</span>
                    <span><StatusPill status={b.status} /></span>
                    <span className={styles.actCell}>
                      <button className={styles.iconBtn} title="Edit"
                        onClick={() => { setEditTarget(b); setModal('blog') }}>
                        <Ic d={ICON_EDIT} size={13} />
                      </button>
                      <button className={styles.iconBtnRed} title="Delete"
                        onClick={() => deleteBlog(b.id)}>
                        <Ic d={ICON_DEL} size={13} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PAGES ──────────────────────────────────────────── */}
        {activeTab === 'pages' && (
          <div className={styles.tabContent}>
            <ActionBar placeholder="Search pages…" createLabel="Add Page"
              onCreate={() => { setEditTarget(null); setModal('page') }} />

            {filteredPages.length === 0 ? (
              <div className={styles.emptyState}>
                <span style={{ fontSize: 44 }}>📄</span>
                <p className={styles.emptyTitle}>No pages yet</p>
                <p className={styles.emptySub}>{search ? `No pages matching "${search}"` : 'Create standalone pages like About Us or Contact'}</p>
                <button className={styles.btnPrimary}
                  onClick={() => { setEditTarget(null); setModal('page') }}>
                  <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Create page
                </button>
              </div>
            ) : (
              <div className={styles.tableWrap}>
                <div className={styles.tHead} style={{ gridTemplateColumns: '2fr 1.5fr 1fr 80px' }}>
                  <span>Title</span><span>URL Handle</span><span>Status</span><span />
                </div>
                {filteredPages.map((p, i) => (
                  <div key={p.id} className={styles.tRow}
                    style={{ gridTemplateColumns: '2fr 1.5fr 1fr 80px', animationDelay: `${i * 30}ms` }}>
                    <span className={styles.postTitle}>{p.title}</span>
                    <span className={styles.handleCell}>
                      /pages/{p.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                    </span>
                    <span><StatusPill status={p.status} /></span>
                    <span className={styles.actCell}>
                      <button className={styles.iconBtn} title="Edit"
                        onClick={() => { setEditTarget(p); setModal('page') }}>
                        <Ic d={ICON_EDIT} size={13} />
                      </button>
                      <button className={styles.iconBtnRed} title="Delete"
                        onClick={() => deletePage(p.id)}>
                        <Ic d={ICON_DEL} size={13} />
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MENUS ──────────────────────────────────────────── */}
        {activeTab === 'menus' && (
          <div className={styles.tabContent}>
            <div className={styles.actionBar}>
              <span className={styles.actionBarCount}>{menus.length} menu{menus.length !== 1 ? 's' : ''}</span>
              <button className={styles.btnPrimary}
                onClick={() => { setEditTarget(null); setModal('menu') }}>
                <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Create Menu
              </button>
            </div>

            <div className={styles.menusGrid}>
              {menus.map((m, i) => (
                <div key={m.id} className={styles.menuCard}
                  style={{ animationDelay: `${i * 50}ms` }}>
                  <div className={styles.menuCardHead}>
                    <div>
                      <div className={styles.menuCardName}>{m.name}</div>
                      <div className={styles.menuCardHandle}>/{m.handle}</div>
                    </div>
                    <div className={styles.actCell}>
                      <button className={styles.iconBtn} title="Edit"
                        onClick={() => { setEditTarget(m); setModal('menu') }}>
                        <Ic d={ICON_EDIT} size={13} />
                      </button>
                      <button className={styles.iconBtnRed} title="Delete"
                        onClick={() => deleteMenu(m.id)}>
                        <Ic d={ICON_DEL} size={13} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.menuItemsPreview}>
                    {m.items.slice(0, 5).map(item => (
                      <div key={item.id} className={styles.menuItemChip}>
                        <Ic d="M9 18l6-6-6-6" size={10} stroke="#9CA3AF" />
                        {item.label}
                      </div>
                    ))}
                    {m.items.length > 5 && (
                      <span className={styles.moreItems}>+{m.items.length - 5} more</span>
                    )}
                    {m.items.length === 0 && (
                      <span className={styles.noItems}>No items yet</span>
                    )}
                  </div>
                  <div className={styles.menuCardFoot}>
                    <span className={styles.menuItemCount}>{m.items.length} items</span>
                  </div>
                </div>
              ))}

              <button className={styles.addMenuCard}
                onClick={() => { setEditTarget(null); setModal('menu') }}>
                <Ic d="M12 5v14M5 12h14" size={22} stroke="#9CA3AF" />
                <span>Create Menu</span>
              </button>
            </div>
          </div>
        )}

        {/* ── FILES ──────────────────────────────────────────── */}
        {activeTab === 'files' && (
          <div className={styles.tabContent}>
            <div className={styles.actionBar}>
              <div className={styles.searchBox}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} stroke="#9CA3AF" />
                <input className={styles.searchInput} placeholder="Search files…"
                  value={search} onChange={e => setSearch(e.target.value)} />
                {search && (
                  <button className={styles.searchClear} onClick={() => setSearch('')}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={12} stroke="#9CA3AF" />
                  </button>
                )}
              </div>
              <button className={styles.btnPrimary}
                onClick={() => fileUploadRef.current?.click()}>
                <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={13} stroke="#fff" />
                Upload Files
              </button>
            </div>

            <div className={styles.filesGrid}>
              {filteredFiles.map((file, i) => (
                <div key={file.id} className={styles.fileCard}
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <div className={styles.filePreview}>
                    {file.type === 'image'
                      ? <div className={styles.fileImgPh}>
                          <Ic d={FILE_TYPE_ICON.image} size={28} stroke="#9CA3AF" />
                        </div>
                      : <div className={styles.fileDocPh}
                          style={{ background: file.type === 'pdf' ? '#FEF2F2' : '#EFF6FF' }}>
                          <Ic d={FILE_TYPE_ICON[file.type] || FILE_TYPE_ICON.pdf} size={28}
                            stroke={file.type === 'pdf' ? '#EF4444' : '#3B82F6'} />
                        </div>
                    }
                    <span className={styles.fileTypeBadge}>{file.type.toUpperCase()}</span>
                  </div>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileMeta}>{fmtSize(file.size)} · {fmtD(file.date)}</div>
                  </div>
                  <div className={styles.fileActions}>
                    <button
                      className={`${styles.iconBtn} ${copied === file.id ? styles.iconBtnCopied : ''}`}
                      title={copied === file.id ? 'Copied!' : 'Copy URL'}
                      onClick={() => copyUrl(file.url || '#', file.id)}>
                      <Ic d={copied === file.id
                        ? 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3'
                        : ICON_COPY} size={13}
                        stroke={copied === file.id ? '#2DBD97' : 'currentColor'} />
                    </button>
                    <button className={styles.iconBtnRed} title="Delete"
                      onClick={() => deleteFile(file.id)}>
                      <Ic d={ICON_DEL} size={13} />
                    </button>
                  </div>
                </div>
              ))}

              <div className={styles.fileUploadCard}
                onClick={() => fileUploadRef.current?.click()}>
                <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={24} stroke="#9CA3AF" />
                <span>Upload Files</span>
                <span className={styles.fileUploadHint}>Images, videos, PDFs up to 20MB</span>
              </div>
            </div>

            <input ref={fileUploadRef} type="file" multiple hidden
              onChange={e => Array.from(e.target.files).forEach(f =>
                setFiles(fs => [...fs, {
                  id: `f-${Date.now()}-${Math.random()}`, name: f.name,
                  type: f.type.startsWith('image') ? 'image' : f.type.includes('pdf') ? 'pdf' : 'video',
                  size: f.size, url: URL.createObjectURL(f),
                  date: new Date().toISOString().split('T')[0], alt: '',
                }])
              )}
            />
          </div>
        )}

        {/* ── METAOBJECTS ────────────────────────────────────── */}
        {activeTab === 'metaobjects' && (
          <div className={styles.metaLayout}>

            {/* Definitions sidebar */}
            <div className={styles.metaDefList}>
              <div className={styles.metaDefListHead}>
                <span>Definitions</span>
                <span className={styles.metaDefCount}>{metaobjects.length}</span>
              </div>
              {metaobjects.map(mo => (
                <div key={mo.id}
                  className={`${styles.metaDefItem} ${activeMetaDef === mo.id ? styles.metaDefItemOn : ''}`}
                  onClick={() => setActiveMetaDef(mo.id)}>
                  <div className={styles.metaDefIcon}>
                    <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={12}
                      stroke={activeMetaDef === mo.id ? '#2DBD97' : '#9CA3AF'} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.metaDefName}>{mo.name}</div>
                    <div className={styles.metaDefHandle}>{mo.apiHandle}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className={styles.metaEntryCount}>{mo.entries.length}</span>
                    <button className={styles.iconBtnSm}
                      onClick={e => { e.stopPropagation(); deleteMetaDef(mo.id) }}>
                      <Ic d={ICON_DEL} size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button className={styles.addMetaDefBtn} onClick={() => setModal('metaDef')}>
                <Ic d="M12 5v14M5 12h14" size={13} /> New Definition
              </button>
            </div>

            {/* Entries panel */}
            {activeDef ? (
              <div className={styles.metaEntries}>
                <div className={styles.metaEntriesHead}>
                  <div>
                    <div className={styles.metaEntriesTitle}>{activeDef.name}</div>
                    <div className={styles.metaEntriesHandle}>api: {activeDef.apiHandle}</div>
                  </div>
                  <button className={styles.btnPrimary}
                    onClick={() => { setEntryTarget(null); setModal('metaEntry') }}>
                    <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Add Entry
                  </button>
                </div>

                <div className={styles.fieldSchema}>
                  {activeDef.fields.map(f => (
                    <span key={f.key} className={styles.fieldSchemaPill}>
                      {f.key}: <em>{FIELD_TYPE_LABELS[f.type] || f.type}</em>
                      {f.required && <span className={styles.fieldReq}>*</span>}
                    </span>
                  ))}
                </div>

                {activeDef.entries.length === 0 ? (
                  <div className={styles.emptyState}>
                    <span style={{ fontSize: 44 }}>🗂️</span>
                    <p className={styles.emptyTitle}>No entries yet</p>
                    <p className={styles.emptySub}>Add your first {activeDef.name} entry</p>
                    <button className={styles.btnPrimary}
                      onClick={() => { setEntryTarget(null); setModal('metaEntry') }}>
                      <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Add first entry
                    </button>
                  </div>
                ) : (
                  <div className={styles.tableWrap}>
                    <div className={styles.tHead}
                      style={{ gridTemplateColumns: `repeat(${Math.min(activeDef.fields.length, 3)}, 1fr) 80px` }}>
                      {activeDef.fields.slice(0, 3).map(f => (
                        <span key={f.key}>{f.key.replace(/_/g, ' ')}</span>
                      ))}
                      <span />
                    </div>
                    {activeDef.entries.map((entry, i) => (
                      <div key={entry.id} className={styles.tRow}
                        style={{ gridTemplateColumns: `repeat(${Math.min(activeDef.fields.length, 3)}, 1fr) 80px`, animationDelay: `${i * 30}ms` }}>
                        {activeDef.fields.slice(0, 3).map(f => (
                          <span key={f.key} className={styles.metaCellVal}>
                            {entry[f.key] || <span className={styles.metaEmpty}>—</span>}
                          </span>
                        ))}
                        <span className={styles.actCell}>
                          <button className={styles.iconBtn} title="Edit"
                            onClick={() => { setEntryTarget(entry); setModal('metaEntry') }}>
                            <Ic d={ICON_EDIT} size={13} />
                          </button>
                          <button className={styles.iconBtnRed} title="Delete"
                            onClick={() => deleteEntry(entry.id)}>
                            <Ic d={ICON_DEL} size={13} />
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.metaEntries}>
                <div className={styles.emptyState}>
                  <span style={{ fontSize: 44 }}>🧩</span>
                  <p className={styles.emptyTitle}>No definitions yet</p>
                  <p className={styles.emptySub}>Create a metaobject definition to get started</p>
                  <button className={styles.btnPrimary} onClick={() => setModal('metaDef')}>
                    <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> New Definition
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      {modal === 'blog'      && <BlogModal post={editTarget} blogs={BLOGS_LIST} onClose={() => { setModal(null); setEditTarget(null) }} onSave={saveBlog} />}
      {modal === 'page'      && <PageModal page={editTarget} onClose={() => { setModal(null); setEditTarget(null) }} onSave={savePage} />}
      {modal === 'menu'      && <MenuModal menu={editTarget} onClose={() => { setModal(null); setEditTarget(null) }} onSave={saveMenu} />}
      {modal === 'metaDef'   && <MetaDefModal onClose={() => setModal(null)} onSave={saveMetaDef} />}
      {modal === 'metaEntry' && activeDef && (
        <MetaobjectEntryModal
          definition={activeDef} entry={entryTarget}
          onClose={() => { setModal(null); setEntryTarget(null) }}
          onSave={saveEntry}
        />
      )}
    </div>
  )
}
