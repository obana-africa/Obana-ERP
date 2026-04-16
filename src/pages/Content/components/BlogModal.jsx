/* ─────────────────────────────────────────────────────────
   Path: src/pages/Content/components/BlogModal.jsx
───────────────────────────────────────────────────────── */
import { useState, useRef } from 'react'
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

const BlogModal = ({ post, blogs, onClose, onSave }) => {
  const [form, setForm] = useState({
    title:           post?.title           || '',
    blog:            post?.blog            || blogs[0] || 'Style Guide',
    author:          post?.author          || 'Tomiwa A.',
    excerpt:         post?.excerpt         || '',
    content:         post?.content         || '',
    tags:            post?.tags?.join(', ')|| '',
    status:          post?.status          || 'draft',
    commentsEnabled: post?.commentsEnabled ?? true,
    seoTitle:        post?.seoTitle        || '',
    seoDesc:         post?.seoDesc         || '',
  })
  const set     = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const fileRef = useRef()
  const [img, setImg] = useState(post?.featuredImg || null)
  const parseTags = str => str.split(',').map(t => t.trim()).filter(Boolean)

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalFull}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{post ? 'Edit Blog Post' : 'New Blog Post'}</h2>
            <p className={styles.mSub}>Write and publish content for your store blog</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.blogLayout}>
          <div className={styles.blogMain}>
            <div className={styles.fg}>
              <label>Post Title <span className={styles.req}>*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Enter post title…" className={styles.titleInput} />
            </div>
            <div className={styles.fg}>
              <label>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)}
                placeholder="Short summary shown in blog listing…" />
            </div>
            <div className={styles.fg}>
              <label>Content</label>
              <RichToolbar />
              <textarea rows={10} value={form.content} onChange={e => set('content', e.target.value)}
                placeholder="Write your blog post here…" className={styles.contentArea} />
            </div>
            <div className={styles.seoSection}>
              <div className={styles.seoHead}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /> SEO & Search Preview
              </div>
              <div className={styles.seoPreview}>
                <div className={styles.seoUrl}>
                  obana.africa/blogs/{form.blog?.toLowerCase().replace(/\s/g,'-')}/{form.title?.toLowerCase().replace(/\s/g,'-') || 'post-title'}
                </div>
                <div className={styles.seoPageTitle}>{form.seoTitle || form.title || 'Post title'}</div>
                <div className={styles.seoPageDesc}>{form.seoDesc || form.excerpt || 'Post excerpt appears here…'}</div>
              </div>
              <div className={styles.fRow}>
                <div className={styles.fg}>
                  <label>SEO Title</label>
                  <input value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} placeholder={form.title} />
                </div>
                <div className={styles.fg}>
                  <label>Meta Description</label>
                  <input value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} placeholder={form.excerpt} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.blogSidebar}>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Visibility</div>
              <div className={styles.radioCol}>
                {['published','draft'].map(s => (
                  <label key={s} className={styles.radioLbl}>
                    <input type="radio" name="blogStatus" value={s}
                      checked={form.status === s} onChange={() => set('status', s)} />
                    <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Blog</div>
              <select value={form.blog} onChange={e => set('blog', e.target.value)}>
                {blogs.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Author</div>
              <input value={form.author} onChange={e => set('author', e.target.value)} />
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Featured Image</div>
              <div className={styles.imgUploadBox} onClick={() => fileRef.current.click()}>
                {img ? (
                  <div className={styles.imgPreview}>
                    <img src={img} alt="featured" />
                    <button className={styles.imgRemoveBtn} onClick={e => { e.stopPropagation(); setImg(null) }}>
                      <Ic d="M18 6L6 18M6 6l12 12" size={10} />
                    </button>
                  </div>
                ) : (
                  <div className={styles.imgUploadInner}>
                    <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={20} stroke="#9CA3AF" />
                    <span>Upload image</span>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" hidden
                  onChange={e => { const f = e.target.files[0]; if (f) setImg(URL.createObjectURL(f)) }} />
              </div>
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Tags</div>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="fashion, ankara, style" />
              <span className={styles.fieldHint}>Separate tags with commas</span>
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Comments</div>
              <label className={styles.toggleRow}>
                <span>Allow comments</span>
                <div className={`${styles.toggle} ${form.commentsEnabled ? styles.toggleOn : ''}`}
                  onClick={() => set('commentsEnabled', !form.commentsEnabled)}>
                  <div className={styles.toggleThumb} />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnOutline}
              onClick={() => { onSave({ ...form, featuredImg:img, status:'draft', tags:parseTags(form.tags) }); onClose() }}>
              Save as Draft
            </button>
            <button className={styles.btnPrimary} disabled={!form.title.trim()}
              onClick={() => { onSave({ ...form, featuredImg:img, status:'published', tags:parseTags(form.tags) }); onClose() }}>
              <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#fff" /> Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogModal
