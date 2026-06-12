/**
 * OnlineStorePageEditor.jsx
 * Add / Edit a single page.
 * Route: /online-store/pages/new
 *        /online-store/pages/:id
 *
 * "Save" → POST/PATCH /api/pages  (stub — replace with real API)
 * "← Pages" → /online-store/pages
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './OnlineStorePageEditor.module.css'

/* ── Icon ─────────────────────────────────────────────────────── */
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.7, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/* ── Seed (mirrors OnlineStorePages seed — replace with API) ─── */
const SEED_PAGES = {
  '1': { title: 'Bundles',              visibility: 'visible', content: '', template: 'page', metaTitle: '', metaDesc: '' },
  '2': { title: 'Your Privacy Choices', visibility: 'visible', content: '<p></p>', template: 'page', metaTitle: '', metaDesc: '' },
  '5': { title: 'Return Policy',        visibility: 'visible', content: '<p></p>', template: 'page', metaTitle: '', metaDesc: '' },
  '6': { title: 'Terms and Conditions', visibility: 'visible', content: '<p></p>', template: 'page', metaTitle: '', metaDesc: '' },
  '7': { title: 'Help Center',          visibility: 'visible', content: '<p></p>', template: 'page', metaTitle: '', metaDesc: '' },
  '8': { title: 'About Us',             visibility: 'visible', content: '<p></p>', template: 'page', metaTitle: '', metaDesc: '' },
}

const TEMPLATES = ['Default page', 'Contact', 'Landing page', 'FAQ', 'Policy']

const TOOLBAR_GROUPS = [
  [
    { cmd: 'bold',          icon: 'M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6zM6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z', label: 'Bold' },
    { cmd: 'italic',        icon: 'M19 4h-9M14 20H5M15 4L9 20',                                                    label: 'Italic' },
    { cmd: 'underline',     icon: 'M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16',                                 label: 'Underline' },
  ],
  [
    { cmd: 'justifyLeft',   icon: 'M3 6h18M3 12h12M3 18h15',  label: 'Align left'   },
    { cmd: 'justifyCenter', icon: 'M3 6h18M6 12h12M4 18h16',  label: 'Align center' },
    { cmd: 'justifyRight',  icon: 'M3 6h18M9 12h12M6 18h15',  label: 'Align right'  },
  ],
  [
    { cmd: 'insertOrderedList',   icon: 'M9 6h11M9 12h11M9 18h11M4 6h1v4M4 10H3M3 16h2a1 1 0 1 0 0-2H3a1 1 0 1 1 0-2h2', label: 'Ordered list'   },
    { cmd: 'insertUnorderedList', icon: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',                               label: 'Unordered list' },
  ],
]

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function OnlineStorePageEditor() {
  const navigate   = useNavigate()
  const { id }     = useParams()
  const isNew      = !id || id === 'new'
  const editorRef  = useRef(null)

  const [title,      setTitle]      = useState('')
  const [content,    setContent]    = useState('')
  const [visibility, setVisibility] = useState('hidden')
  const [template,   setTemplate]   = useState('Default page')
  const [metaTitle,  setMetaTitle]  = useState('')
  const [metaDesc,   setMetaDesc]   = useState('')
  const [metaOpen,   setMetaOpen]   = useState(false)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [toast,      setToast]      = useState(null)
  const [isDirty,    setIsDirty]    = useState(false)

  /* ── Load existing page ── */
  useEffect(() => {
    if (!isNew && SEED_PAGES[id]) {
      const p = SEED_PAGES[id]
      setTitle(p.title)
      setContent(p.content)
      setVisibility(p.visibility)
      setTemplate(p.template === 'page' ? 'Default page' : p.template)
      setMetaTitle(p.metaTitle || '')
      setMetaDesc(p.metaDesc || '')
      if (editorRef.current) editorRef.current.innerHTML = p.content
    }
  }, [id, isNew])

  /* ── Dirty tracking ── */
  useEffect(() => { setIsDirty(true) }, [title, content, visibility, template, metaTitle, metaDesc])
  useEffect(() => { setIsDirty(false) }, [])

  /* ── Rich text exec ── */
  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value)
    editorRef.current?.focus()
    setContent(editorRef.current?.innerHTML || '')
    setIsDirty(true)
  }

  /* ── Save ── */
  const save = useCallback(async () => {
    if (!title.trim()) {
      setToast({ msg: 'Page title is required', type: 'error' })
      setTimeout(() => setToast(null), 3000)
      return
    }
    setSaving(true)
    try {
      const payload = {
        id:         isNew ? `page-${Date.now()}` : id,
        title:      title.trim(),
        content:    editorRef.current?.innerHTML || content,
        visibility,
        template,
        metaTitle:  metaTitle.trim(),
        metaDesc:   metaDesc.trim(),
        updatedAt:  new Date().toISOString(),
      }
      // TODO: Replace with real API call:
      // const res = await fetch(`/api/pages${isNew ? '' : `/${id}`}`, {
      //   method: isNew ? 'POST' : 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })
      // if (!res.ok) throw new Error('Save failed')
      await new Promise(r => setTimeout(r, 600)) // simulate latency
      console.log('Saved page:', payload)
      setSaved(true)
      setIsDirty(false)
      setToast({ msg: isNew ? 'Page created' : 'Page saved', type: 'success' })
      setTimeout(() => { setToast(null); setSaved(false) }, 2500)
      if (isNew) navigate('/online-store/pages', { replace: true })
    } catch (err) {
      setToast({ msg: 'Failed to save page. Please try again.', type: 'error' })
      setTimeout(() => setToast(null), 3000)
    } finally { setSaving(false) }
  }, [title, content, visibility, template, metaTitle, metaDesc, isNew, id, navigate])

  /* ── Keyboard shortcut ── */
  useEffect(() => {
    const fn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [save])

  const charCount = (editorRef.current?.innerText || '').length

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

      {/* ── Page header ── */}
      <div className={s.pageHeader}>
        <div className={s.breadcrumb}>
          <button className={s.breadcrumbBack} onClick={() => navigate('/online-store/pages')}>
            <Ic d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
              size={16} stroke="var(--color-primary)" />
          </button>
          <Ic d="M9 18l6-6-6-6" size={14} stroke="#9CA3AF" />
          <h1 className={s.pageTitle}>{isNew ? 'Add page' : (title || 'Edit page')}</h1>
        </div>

        <div className={s.pageHeaderRight}>
          {isDirty && !saving && (
            <span className={s.dirtyBadge}>● Unsaved</span>
          )}
          <button className={s.saveBtn} onClick={save} disabled={saving}>
            {saving ? (
              <><span className={s.spinner} /> Saving…</>
            ) : saved ? (
              <><Ic d="M20 6L9 17l-5-5" size={13} stroke="#fff" /> Saved</>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className={s.layout}>

        {/* ── LEFT: main content ── */}
        <div className={s.main}>

          {/* Title */}
          <div className={s.card}>
            <label className={s.cardLabel}>Title</label>
            <input
              className={s.titleInput}
              placeholder="e.g., about us, sizing chart, FAQ"
              value={title}
              onChange={e => { setTitle(e.target.value); setIsDirty(true) }}
              autoFocus={isNew}
            />
          </div>

          {/* Content editor */}
          <div className={s.card}>
            <label className={s.cardLabel}>Content</label>

            {/* Rich text toolbar */}
            <div className={s.toolbar}>
              {/* Format select */}
              <select className={s.formatSelect}
                onChange={e => { exec('formatBlock', e.target.value); e.target.value = 'p' }}>
                <option value="p">Paragraph</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
                <option value="blockquote">Quote</option>
                <option value="pre">Code</option>
              </select>

              <div className={s.toolbarDivider} />

              {TOOLBAR_GROUPS.map((group, gi) => (
                <div key={gi} className={s.toolbarGroup}>
                  {group.map(btn => (
                    <button key={btn.cmd} className={s.toolbarBtn}
                      title={btn.label} onMouseDown={e => { e.preventDefault(); exec(btn.cmd) }}>
                      <Ic d={btn.icon} size={14} sw={1.8} />
                    </button>
                  ))}
                  {gi < TOOLBAR_GROUPS.length - 1 && <div className={s.toolbarDivider} />}
                </div>
              ))}

              <div className={s.toolbarDivider} />

              {/* Link */}
              <button className={s.toolbarBtn} title="Insert link"
                onMouseDown={e => {
                  e.preventDefault()
                  const url = prompt('Enter URL:')
                  if (url) exec('createLink', url)
                }}>
                <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                  size={14} />
              </button>

              {/* Image */}
              <button className={s.toolbarBtn} title="Insert image"
                onMouseDown={e => {
                  e.preventDefault()
                  const src = prompt('Enter image URL:')
                  if (src) exec('insertImage', src)
                }}>
                <Ic d="M21 15a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 15"
                  size={14} />
              </button>

              {/* Table */}
              <button className={s.toolbarBtn} title="Insert table"
                onMouseDown={e => {
                  e.preventDefault()
                  exec('insertHTML', '<table border="1" style="border-collapse:collapse;width:100%"><tr><td style="padding:8px">Cell</td><td style="padding:8px">Cell</td></tr><tr><td style="padding:8px">Cell</td><td style="padding:8px">Cell</td></tr></table><p></p>')
                }}>
                <Ic d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" size={14} />
              </button>

              <div style={{ flex: 1 }} />

              {/* Source toggle */}
              <button className={s.toolbarBtnCode} title="View source"
                onMouseDown={e => {
                  e.preventDefault()
                  if (editorRef.current) {
                    const isCode = editorRef.current.getAttribute('data-source') === '1'
                    if (isCode) {
                      editorRef.current.innerHTML = editorRef.current.innerText
                      editorRef.current.contentEditable = 'true'
                      editorRef.current.removeAttribute('data-source')
                    } else {
                      editorRef.current.innerText = editorRef.current.innerHTML
                      editorRef.current.contentEditable = 'true'
                      editorRef.current.setAttribute('data-source', '1')
                    }
                  }
                }}>
                <Ic d="M10 20l4-16M17 8l4 4-4 4M7 16l-4-4 4-4" size={14} />
              </button>
            </div>

            {/* Editable area */}
            <div
              ref={editorRef}
              className={s.editor}
              contentEditable
              suppressContentEditableWarning
              onInput={() => { setContent(editorRef.current?.innerHTML || ''); setIsDirty(true) }}
              data-placeholder="Start writing your page content…"
            />

            <div className={s.editorFooter}>
              <span className={s.charCount}>{charCount} characters</span>
            </div>
          </div>

          {/* Search engine listing */}
          <div className={s.card}>
            <div className={s.seoHeader}>
              <div>
                <p className={s.seoTitle}>Search engine listing</p>
                <p className={s.seoBrief}>
                  {metaTitle || metaDesc
                    ? 'Preview of how this page may appear in search results.'
                    : 'Add a title and description to see how this page might appear in a search engine listing'}
                </p>
              </div>
              <button className={s.seoEditBtn} onClick={() => setMetaOpen(o => !o)}>
                <Ic d={metaOpen
                  ? 'M20 6L9 17l-5-5'
                  : 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'}
                  size={15} stroke="var(--color-primary)" />
              </button>
            </div>

            {/* SEO preview snippet */}
            {(metaTitle || metaDesc) && (
              <div className={s.seoPreview}>
                <p className={s.seoPreviewUrl}>yourstore.com/{title.toLowerCase().replace(/\s+/g, '-') || 'page'}</p>
                <p className={s.seoPreviewTitle}>{metaTitle || title}</p>
                {metaDesc && <p className={s.seoPreviewDesc}>{metaDesc}</p>}
              </div>
            )}

            {metaOpen && (
              <div className={s.seoFields}>
                <div className={s.seoField}>
                  <label className={s.seoFieldLabel}>Page title</label>
                  <input className={s.seoInput} value={metaTitle}
                    onChange={e => { setMetaTitle(e.target.value); setIsDirty(true) }}
                    placeholder={`${title || 'Page title'} | Your Store`}
                    maxLength={70} />
                  <p className={s.seoHint}>{metaTitle.length}/70 characters</p>
                </div>
                <div className={s.seoField}>
                  <label className={s.seoFieldLabel}>Meta description</label>
                  <textarea className={s.seoTextarea} value={metaDesc} rows={3}
                    onChange={e => { setMetaDesc(e.target.value); setIsDirty(true) }}
                    placeholder="Describe your page for search engines…"
                    maxLength={160} />
                  <p className={s.seoHint}>{metaDesc.length}/160 characters</p>
                </div>
                <div className={s.seoField}>
                  <label className={s.seoFieldLabel}>URL handle</label>
                  <div className={s.seoUrlWrap}>
                    <span className={s.seoUrlPrefix}>yourstore.com/pages/</span>
                    <input className={s.seoUrlInput}
                      value={title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
                      readOnly />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: sidebar ── */}
        <aside className={s.sidebar}>

          {/* Visibility */}
          <div className={s.sideCard}>
            <div className={s.sideCardHead}>
              <span className={s.sideCardTitle}>Visibility</span>
              <button className={s.sideCardAction} title="Help">
                <Ic d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
                  size={15} stroke="#9CA3AF" />
              </button>
            </div>

            <div className={s.radioGroup}>
              {['visible', 'hidden'].map(opt => (
                <label key={opt} className={`${s.radioLabel} ${visibility === opt ? s.radioLabelOn : ''}`}>
                  <div className={`${s.radioCircle} ${visibility === opt ? s.radioCircleOn : ''}`}>
                    {visibility === opt && <div className={s.radioInner} />}
                  </div>
                  <span className={s.radioText}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                  <input type="radio" name="visibility" value={opt} checked={visibility === opt}
                    onChange={() => { setVisibility(opt); setIsDirty(true) }}
                    className={s.radioHidden} />
                </label>
              ))}
            </div>
          </div>

          {/* Template */}
          <div className={s.sideCard}>
            <div className={s.sideCardHead}>
              <span className={s.sideCardTitle}>Template</span>
              <button className={s.sideCardAction} title="Manage templates">
                <Ic d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  size={15} stroke="#9CA3AF" />
              </button>
            </div>

            <div className={s.selectWrap}>
              <select className={s.sideSelect} value={template}
                onChange={e => { setTemplate(e.target.value); setIsDirty(true) }}>
                {TEMPLATES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <Ic d="M6 9l6 6 6-6" size={14} stroke="#6B7280" className={s.selectChev} />
            </div>
          </div>

          {/* Delete (edit mode only) */}
          {!isNew && (
            <div className={s.sideCard}>
              <button className={s.deletePageBtn}
                onClick={() => {
                  if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
                    navigate('/online-store/pages')
                  }
                }}>
                <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  size={14} stroke="var(--color-error)" />
                Delete page
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* ── Save footer bar ── */}
      <div className={s.saveBar}>
        <button className={s.saveCancelBtn} onClick={() => navigate('/online-store/pages')}>
          Discard
        </button>
        <button className={s.saveBarBtn} onClick={save} disabled={saving}>
          {saving ? <><span className={s.spinner} /> Saving…</> : 'Save'}
        </button>
      </div>
    </div>
  )
}
