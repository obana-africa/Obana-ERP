
import { useState } from 'react'
import styles from '../Content.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const RichToolbar = () => (
  <div className={styles.richToolbar}>
    {['B','I','U','S','H1','H2','"','≡','⋮≡','🔗','📷'].map(b => (
      <button key={b} className={styles.richBtn} type="button">{b}</button>
    ))}
  </div>
)

/**
 * Props:
 *  page    — existing page (null = create)
 *  onClose — () => void
 *  onSave  — (data) => void
 */
const PageModal = ({ page, onClose, onSave }) => {
  const [form, setForm] = useState({
    title:    page?.title    || '',
    content:  page?.content  || '',
    status:   page?.status   || 'draft',
    seoTitle: page?.seoTitle || '',
    seoDesc:  page?.seoDesc  || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handle = form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalFull}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{page ? 'Edit Page' : 'New Page'}</h2>
            <p className={styles.mSub}>Create standalone pages for your online store</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.blogLayout}>
          {/* Main */}
          <div className={styles.blogMain}>
            <div className={styles.fg}>
              <label>Page Title <span className={styles.req}>*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="e.g. About Us" className={styles.titleInput} />
            </div>

            {form.title && (
              <div className={styles.handlePreview}>
                <Ic d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" size={12} />
                obana.africa/pages/{handle}
              </div>
            )}

            <div className={styles.fg}>
              <label>Content</label>
              <RichToolbar />
              <textarea rows={12} value={form.content}
                onChange={e => set('content', e.target.value)}
                placeholder="Write your page content here…"
                className={styles.contentArea} />
            </div>

            {/* SEO */}
            <div className={styles.seoSection}>
              <div className={styles.seoHead}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />
                SEO & Search Preview
              </div>
              <div className={styles.seoPreview}>
                <div className={styles.seoUrl}>obana.africa/pages/{handle || 'page-title'}</div>
                <div className={styles.seoPageTitle}>{form.seoTitle || form.title || 'Page title'}</div>
                <div className={styles.seoPageDesc}>{form.seoDesc || 'Meta description appears here…'}</div>
              </div>
              <div className={styles.fRow}>
                <div className={styles.fg}>
                  <label>SEO Title</label>
                  <input value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)}
                    placeholder={form.title} />
                </div>
                <div className={styles.fg}>
                  <label>Meta Description</label>
                  <input value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)}
                    placeholder="Brief page description for search engines…" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className={styles.blogSidebar}>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Visibility</div>
              <div className={styles.radioCol}>
                {['published','draft'].map(s => (
                  <label key={s} className={styles.radioLbl}>
                    <input type="radio" name="pageStatus" value={s}
                      checked={form.status === s} onChange={() => set('status', s)} />
                    <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>URL Handle</div>
              <div className={styles.handleBox}>/{handle || 'page-title'}</div>
              <span className={styles.fieldHint}>Auto-generated from title</span>
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnOutline}
              onClick={() => { onSave({ ...form, status: 'draft' }); onClose() }}>
              Save as Draft
            </button>
            <button className={styles.btnPrimary} disabled={!form.title.trim()}
              onClick={() => { onSave({ ...form, status: 'published' }); onClose() }}>
              <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#fff" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageModal
