import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Content.module.css'
import { fmtD } from '../../utils/formatters'
import { SEED_BLOGS, SEED_PAGES, SEED_MENUS, SEED_FILES, SEED_METAOBJECTS, FIELD_TYPE_LABELS, FILE_TYPE_ICON } from '../../data/content'
import BlogModal            from './components/BlogModal'
import PageModal            from './components/PageModal'
import MenuModal            from './components/MenuModal'
import MetaDefModal         from './components/MetaDefModal'
import MetaobjectEntryModal from './components/MetaobjectEntryModal'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const fmtSize = bytes => {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const StatusPill = ({ status }) => {
  const cfg = {
    published: { bg:'#ECFDF5', color:'#047857', label:'Published' },
    draft:     { bg:'#F3F4F6', color:'#6B7280', label:'Draft'     },
    archived:  { bg:'#FEF3C7', color:'#B45309', label:'Archived'  },
  }[status] || { bg:'#F3F4F6', color:'#6B7280', label:status }
  return <span className={styles.pill} style={{ background:cfg.bg, color:cfg.color }}>{cfg.label}</span>
}

const BtnPrimary = ({ onClick, children, disabled }) => (
  <button className={styles.btnPrimary} onClick={onClick} disabled={disabled}>{children}</button>
)

const TABS = [
  { key:'blog-posts', label:'Blog Posts' },
  { key:'pages', label:'Pages' },
  { key:'menus', label:'Menus' },
  { key:'files', label:'Files' },
  { key:'metaobjects', label:'Metaobjects' },
]

const BLOGS_LIST = ['Style Guide','Wellness','News & Updates']

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

  const [blogs, setBlogs] = useState(SEED_BLOGS)
  const [pages, setPages] = useState(SEED_PAGES)
  const [menus, setMenus] = useState(SEED_MENUS)
  const [files, setFiles] = useState(SEED_FILES)
  const [metaobjects, setMetaobjects] = useState(SEED_METAOBJECTS)

  const [modal, setModal] = useState(null)
  const [editTarget, setEditTarget] = useState(null)
  const [entryTarget, setEntryTarget] = useState(null)
  const [activeMetaDef, setActiveMetaDef] = useState(SEED_METAOBJECTS[0]?.id)

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const activeDef = metaobjects.find(m => m.id === activeMetaDef)

  // ── CRUD ─────────────────────────────────────────────
  const saveBlog  = data => editTarget
    ? setBlogs(bs => bs.map(b => b.id === editTarget.id ? { ...b, ...data } : b))
    : setBlogs(bs => [...bs, { ...data, id:`blog-${Date.now()}`, date:new Date().toISOString().split('T')[0], commentCount:0 }])

  const deleteBlog = id => setBlogs(bs => bs.filter(b => b.id !== id))

  const savePage  = data => editTarget
    ? setPages(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...data } : p))
    : setPages(ps => [...ps, { ...data, id:`pg-${Date.now()}`, date:new Date().toISOString().split('T')[0] }])

  const deletePage = id => setPages(ps => ps.filter(p => p.id !== id))

  const saveMenu  = data => editTarget
    ? setMenus(ms => ms.map(m => m.id === editTarget.id ? { ...m, ...data } : m))
    : setMenus(ms => [...ms, { ...data, id:`menu-${Date.now()}` }])

  const deleteMenu = id => setMenus(ms => ms.filter(m => m.id !== id))
  const deleteFile = id => setFiles(fs => fs.filter(f => f.id !== id))

  const saveMetaDef = data =>
    setMetaobjects(ms => [...ms, { ...data, id:`mo-def-${Date.now()}` }])

  const deleteMetaDef = id => setMetaobjects(ms => ms.filter(m => m.id !== id))

  const saveEntry = data => setMetaobjects(ms => ms.map(m => {
    if (m.id !== activeMetaDef) return m
    if (entryTarget) return { ...m, entries:m.entries.map(e => e.id === entryTarget.id ? { ...e, ...data } : e) }
    return { ...m, entries:[...m.entries, { ...data, id:`e-${Date.now()}` }] }
  }))

  const deleteEntry = entryId => setMetaobjects(ms => ms.map(m =>
    m.id === activeMetaDef ? { ...m, entries:m.entries.filter(e => e.id !== entryId) } : m
  ))

  // ── Filtered ──────────────────────────────────────────
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

  const ActionBar = ({ placeholder, onCreate, createLabel }) => (
    <div className={styles.actionBar}>
      <div className={styles.searchBox}>
        <span className={styles.searchIco}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /></span>
        <input className={styles.searchInput} placeholder={placeholder}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <option value="all">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {onCreate && (
        <BtnPrimary onClick={onCreate}>
          <Ic d="M12 5v14M5 12h14" size={13} /> {createLabel}
        </BtnPrimary>
      )}
    </div>
  )

  const ICON_EDIT = 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
  const ICON_DEL  = 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Content</h1>
      </header>

      <div className={styles.content}>

        {/* ── BLOG POSTS ── */}
        {activeTab === 'blog-posts' && (<>
          <ActionBar placeholder="Search posts…" createLabel="New Blog Post"
            onCreate={() => { setEditTarget(null); setModal('blog') }} />
          <div className={styles.tableWrap}>
            <div className={styles.tHead} style={{ gridTemplateColumns:'2.5fr 1fr 1fr 1fr 0.6fr 0.5fr' }}>
              <span>Title</span><span>Blog</span><span>Author</span><span>Date</span><span>Status</span><span/>
            </div>
            {filteredBlogs.length === 0 ? (
              <div className={styles.emptyState}>
                <Ic d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5m-1.414-9.414a2 2 0 1 1 2.828 2.828L11.828 15H9v-2.828l8.586-8.586z" size={32} stroke="#9CA3AF" />
                <p>No blog posts found</p>
                <BtnPrimary onClick={() => { setEditTarget(null); setModal('blog') }}>Write your first post</BtnPrimary>
              </div>
            ) : filteredBlogs.map(b => (
              <div key={b.id} className={styles.tRow} style={{ gridTemplateColumns:'2.5fr 1fr 1fr 1fr 0.6fr 0.5fr' }}>
                <span className={styles.postCell}>
                  <div className={styles.postTitle}>{b.title}</div>
                  <div className={styles.postExcerpt}>{b.excerpt}</div>
                  {b.tags?.length > 0 && (
                    <div className={styles.tagRow}>
                      {b.tags.slice(0,3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  )}
                </span>
                <span className={styles.blogName}>{b.blog}</span>
                <span>{b.author}</span>
                <span className={styles.dateCell}>{fmtD(b.date)}</span>
                <span><StatusPill status={b.status} /></span>
                <span className={styles.actCell}>
                  <button className={styles.iconBtn} onClick={() => { setEditTarget(b); setModal('blog') }}><Ic d={ICON_EDIT} size={13} /></button>
                  <button className={styles.iconBtnRed} onClick={() => deleteBlog(b.id)}><Ic d={ICON_DEL} size={13} /></button>
                </span>
              </div>
            ))}
          </div>
        </>)}

        {/* ── PAGES ── */}
        {activeTab === 'pages' && (<>
          <ActionBar placeholder="Search pages…" createLabel="Add Page"
            onCreate={() => { setEditTarget(null); setModal('page') }} />
          <div className={styles.tableWrap}>
            <div className={styles.tHead} style={{ gridTemplateColumns:'2fr 1fr 1fr 0.5fr' }}>
              <span>Title</span><span>Date</span><span>Status</span><span/>
            </div>
            {filteredPages.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No pages found</p>
                <BtnPrimary onClick={() => { setEditTarget(null); setModal('page') }}>Create page</BtnPrimary>
              </div>
            ) : filteredPages.map(p => (
              <div key={p.id} className={styles.tRow} style={{ gridTemplateColumns:'2fr 1fr 1fr 0.5fr' }}>
                <span className={styles.postTitle}>{p.title}</span>
                <span className={styles.dateCell}>{fmtD(p.date)}</span>
                <span><StatusPill status={p.status} /></span>
                <span className={styles.actCell}>
                  <button className={styles.iconBtn} onClick={() => { setEditTarget(p); setModal('page') }}><Ic d={ICON_EDIT} size={13} /></button>
                  <button className={styles.iconBtnRed} onClick={() => deletePage(p.id)}><Ic d={ICON_DEL} size={13} /></button>
                </span>
              </div>
            ))}
          </div>
        </>)}

        {/* ── MENUS ── */}
        {activeTab === 'menus' && (<>
          <div className={styles.actionBar}>
            <span className={styles.actionBarTitle}>{menus.length} menus</span>
            <BtnPrimary onClick={() => { setEditTarget(null); setModal('menu') }}>
              <Ic d="M12 5v14M5 12h14" size={13} /> Create Menu
            </BtnPrimary>
          </div>
          <div className={styles.menusGrid}>
            {menus.map(m => (
              <div key={m.id} className={styles.menuCard}>
                <div className={styles.menuCardHead}>
                  <div>
                    <div className={styles.menuCardName}>{m.name}</div>
                    <div className={styles.menuCardHandle}>Handle: {m.handle}</div>
                  </div>
                  <div className={styles.actCell}>
                    <button className={styles.iconBtn} onClick={() => { setEditTarget(m); setModal('menu') }}><Ic d={ICON_EDIT} size={13} /></button>
                    <button className={styles.iconBtnRed} onClick={() => deleteMenu(m.id)}><Ic d={ICON_DEL} size={13} /></button>
                  </div>
                </div>
                <div className={styles.menuItemsPreview}>
                  {m.items.map(item => (
                    <div key={item.id} className={styles.menuPreviewItem}>
                      <span className={styles.menuPreviewDot} />
                      <span className={styles.menuPreviewLabel}>{item.label}</span>
                      <span className={styles.menuPreviewUrl}>{item.url}</span>
                      {item.children?.length > 0 && <span className={styles.menuChildBadge}>{item.children.length} sub</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className={styles.addMenuCard} onClick={() => { setEditTarget(null); setModal('menu') }}>
              <Ic d="M12 5v14M5 12h14" size={22} /><span>Create Menu</span>
            </button>
          </div>
        </>)}

        {/* ── FILES ── */}
        {activeTab === 'files' && (<>
          <div className={styles.actionBar}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /></span>
              <input className={styles.searchInput} placeholder="Search files…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className={styles.btnPrimary} onClick={() => fileUploadRef.current?.click()}>
              <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={13}  /> Upload Files
            </button>
          </div>
          <div className={styles.filesGrid}>
            {filteredFiles.map(file => (
              <div key={file.id} className={styles.fileCard}>
                <div className={styles.filePreview}>
                  {file.type === 'image'
                    ? <div className={styles.fileImgPh}><Ic d={FILE_TYPE_ICON.image} size={28} stroke="#9CA3AF" /></div>
                    : <div className={styles.fileDocPh} style={{ background:file.type==='pdf'?'#FEF2F2':'#EFF6FF' }}>
                        <Ic d={FILE_TYPE_ICON[file.type]||FILE_TYPE_ICON.pdf} size={28} stroke={file.type==='pdf'?'#EF4444':'#3B82F6'} />
                      </div>
                  }
                </div>
                <div className={styles.fileInfo}>
                  <div className={styles.fileName}>{file.name}</div>
                  <div className={styles.fileMeta}>{fmtSize(file.size)} · {fmtD(file.date)}</div>
                </div>
                <div className={styles.fileActions}>
                  <button className={styles.iconBtn} title="Copy URL">
                    <Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} />
                  </button>
                  <button className={styles.iconBtnRed} onClick={() => deleteFile(file.id)}>
                    <Ic d={ICON_DEL} size={13} />
                  </button>
                </div>
              </div>
            ))}
            <div className={styles.fileUploadCard} onClick={() => fileUploadRef.current?.click()}>
              <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={24} stroke="#9CA3AF" />
              <span>Upload Files</span>
              <span className={styles.fileUploadHint}>Images, videos, PDFs up to 20MB</span>
            </div>
          </div>
          <input ref={fileUploadRef} type="file" multiple hidden
            onChange={e => Array.from(e.target.files).forEach(f =>
              setFiles(fs => [...fs, {
                id:`f-${Date.now()}`, name:f.name,
                type:f.type.startsWith('image')?'image':f.type.includes('pdf')?'pdf':'video',
                size:f.size, url:URL.createObjectURL(f),
                date:new Date().toISOString().split('T')[0], alt:'',
              }])
            )}
          />
        </>)}

        {/* ── METAOBJECTS ── */}
        {activeTab === 'metaobjects' && (
          <div className={styles.metaLayout}>
            <div className={styles.metaDefList}>
              <div className={styles.metaDefListHead}>Definitions</div>
              {metaobjects.map(mo => (
                <div key={mo.id}
                  className={`${styles.metaDefItem} ${activeMetaDef===mo.id?styles.metaDefItemOn:''}`}
                  onClick={() => setActiveMetaDef(mo.id)}>
                  <div>
                    <div className={styles.metaDefName}>{mo.name}</div>
                    <div className={styles.metaDefHandle}>{mo.apiHandle}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className={styles.metaEntryCount}>{mo.entries.length}</span>
                    <button className={styles.iconBtnSm} onClick={e => { e.stopPropagation(); deleteMetaDef(mo.id) }}>
                      <Ic d={ICON_DEL} size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button className={styles.addMetaDefBtn} onClick={() => setModal('metaDef')}>
                <Ic d="M12 5v14M5 12h14" size={13} /> New Definition
              </button>
            </div>

            {activeDef && (
              <div className={styles.metaEntries}>
                <div className={styles.metaEntriesHead}>
                  <div>
                    <div className={styles.metaEntriesTitle}>{activeDef.name}</div>
                    <div className={styles.metaEntriesHandle}>api: {activeDef.apiHandle}</div>
                  </div>
                  <BtnPrimary onClick={() => { setEntryTarget(null); setModal('metaEntry') }}>
                    <Ic d="M12 5v14M5 12h14" size={13}  /> Add Entry
                  </BtnPrimary>
                </div>
                <div className={styles.fieldSchema}>
                  {activeDef.fields.map(f => (
                    <span key={f.key} className={styles.fieldSchemaPill}>
                      {f.key}: <em>{FIELD_TYPE_LABELS[f.type]||f.type}</em>
                      {f.required && <span className={styles.fieldReq}>*</span>}
                    </span>
                  ))}
                </div>
                {activeDef.entries.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={32}  />
                    <p>No entries yet</p>
                    <BtnPrimary onClick={() => { setEntryTarget(null); setModal('metaEntry') }}>Add first entry</BtnPrimary>
                  </div>
                ) : (
                  <div className={styles.tableWrap}>
                    <div className={styles.tHead} style={{ gridTemplateColumns:`repeat(${Math.min(activeDef.fields.length,3)},1fr) 0.5fr` }}>
                      {activeDef.fields.slice(0,3).map(f => <span key={f.key}>{f.key.replace(/_/g,' ')}</span>)}
                      <span/>
                    </div>
                    {activeDef.entries.map(entry => (
                      <div key={entry.id} className={styles.tRow} style={{ gridTemplateColumns:`repeat(${Math.min(activeDef.fields.length,3)},1fr) 0.5fr` }}>
                        {activeDef.fields.slice(0,3).map(f => (
                          <span key={f.key} className={styles.metaCellVal}>
                            {entry[f.key]||<span className={styles.metaEmpty}>—</span>}
                          </span>
                        ))}
                        <span className={styles.actCell}>
                          <button className={styles.iconBtn} onClick={() => { setEntryTarget(entry); setModal('metaEntry') }}><Ic d={ICON_EDIT} size={13} /></button>
                          <button className={styles.iconBtnRed} onClick={() => deleteEntry(entry.id)}><Ic d={ICON_DEL} size={13} /></button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {modal==='blog'      && <BlogModal post={editTarget} blogs={BLOGS_LIST} onClose={() => { setModal(null); setEditTarget(null) }} onSave={saveBlog} />}
      {modal==='page'      && <PageModal page={editTarget} onClose={() => { setModal(null); setEditTarget(null) }} onSave={savePage} />}
      {modal==='menu'      && <MenuModal menu={editTarget} onClose={() => { setModal(null); setEditTarget(null) }} onSave={saveMenu} />}
      {modal==='metaDef'   && <MetaDefModal onClose={() => setModal(null)} onSave={saveMetaDef} />}
      {modal==='metaEntry' && activeDef && <MetaobjectEntryModal definition={activeDef} entry={entryTarget} onClose={() => { setModal(null); setEntryTarget(null) }} onSave={saveEntry} />}
    </div>
  )
}
