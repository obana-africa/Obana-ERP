import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './Content.module.css'

// ── Icon ──────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

// ── Helpers ───────────────────────────────────────────────
const fmtD = (s) => new Date(s).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
const fmtSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ── Status pill ───────────────────────────────────────────
const StatusPill = ({ status }) => {
  const cfg = {
    published: { bg: '#ECFDF5', color: '#047857', label: 'Published' },
    draft:     { bg: '#F3F4F6', color: '#6B7280', label: 'Draft'     },
    archived:  { bg: '#FEF3C7', color: '#B45309', label: 'Archived'  },
  }[status] || { bg: '#F3F4F6', color: '#6B7280', label: status }
  return (
    <span className={styles.pill} style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  )
}

// ── Seed data ─────────────────────────────────────────────
const SEED_BLOGS = [
  {
    id: 'blog-1', title: 'How to Style Ankara for Any Occasion',
    blog: 'Style Guide', author: 'Tomiwa A.', status: 'published',
    date: '2026-04-01', tags: ['ankara','fashion','styling'],
    featuredImg: null, excerpt: 'Discover the versatility of Ankara fabric and how to rock it from office to evening events.',
    content: '', seoTitle: '', seoDesc: '', commentsEnabled: true, commentCount: 4,
  },
  {
    id: 'blog-2', title: '5 Skincare Routines Using Nigerian Ingredients',
    blog: 'Wellness', author: 'Tomiwa A.', status: 'published',
    date: '2026-03-22', tags: ['skincare','beauty','natural'],
    featuredImg: null, excerpt: 'From shea butter to black soap — build your routine with ingredients grown right here.',
    content: '', seoTitle: '', seoDesc: '', commentsEnabled: true, commentCount: 12,
  },
  {
    id: 'blog-3', title: 'Obana Spring/Summer 2026 Lookbook',
    blog: 'Style Guide', author: 'Tomiwa A.', status: 'draft',
    date: '2026-04-08', tags: ['lookbook','collection','2026'],
    featuredImg: null, excerpt: 'A sneak peek at our upcoming seasonal collection — bold colours, rich textures.',
    content: '', seoTitle: '', seoDesc: '', commentsEnabled: false, commentCount: 0,
  },
]

const SEED_PAGES = [
  { id: 'pg-1',  title: 'About Us',        status: 'published', date: '2025-06-01', content: 'Our story starts with...', seoTitle: '', seoDesc: '' },
  { id: 'pg-2',  title: 'Contact Us',      status: 'published', date: '2025-06-01', content: 'Reach us at...',          seoTitle: '', seoDesc: '' },
  { id: 'pg-3',  title: 'Shipping Policy', status: 'published', date: '2025-08-14', content: 'We ship within...',       seoTitle: '', seoDesc: '' },
  { id: 'pg-4',  title: 'Return Policy',   status: 'published', date: '2025-08-14', content: 'Returns accepted...',     seoTitle: '', seoDesc: '' },
  { id: 'pg-5',  title: 'FAQ',             status: 'draft',     date: '2026-01-10', content: 'Frequently asked...',     seoTitle: '', seoDesc: '' },
  { id: 'pg-6',  title: 'Size Guide',      status: 'published', date: '2026-02-20', content: 'Find your perfect fit...',seoTitle: '', seoDesc: '' },
]

const SEED_MENUS = [
  {
    id: 'menu-1', name: 'Main Menu', handle: 'main-menu',
    items: [
      { id: 'mi-1', label: 'Home',        url: '/',            type: 'url',        children: [] },
      { id: 'mi-2', label: 'Shop',        url: '/collections', type: 'collection', children: [
        { id: 'mi-2a', label: 'All Products', url: '/collections/all',    type: 'collection', children: [] },
        { id: 'mi-2b', label: 'New Arrivals', url: '/collections/new',    type: 'collection', children: [] },
        { id: 'mi-2c', label: 'Sale',         url: '/collections/sale',   type: 'collection', children: [] },
      ]},
      { id: 'mi-3', label: 'Blog',        url: '/blogs/style-guide', type: 'blog', children: [] },
      { id: 'mi-4', label: 'About',       url: '/pages/about-us',    type: 'page', children: [] },
      { id: 'mi-5', label: 'Contact',     url: '/pages/contact-us',  type: 'page', children: [] },
    ],
  },
  {
    id: 'menu-2', name: 'Footer Menu', handle: 'footer-menu',
    items: [
      { id: 'fi-1', label: 'Shipping Policy', url: '/pages/shipping-policy', type: 'page', children: [] },
      { id: 'fi-2', label: 'Return Policy',   url: '/pages/return-policy',   type: 'page', children: [] },
      { id: 'fi-3', label: 'FAQ',             url: '/pages/faq',             type: 'page', children: [] },
      { id: 'fi-4', label: 'Style Guide Blog',url: '/blogs/style-guide',     type: 'blog', children: [] },
    ],
  },
]

const SEED_FILES = [
  { id: 'f-1', name: 'hero-banner.jpg',       type: 'image', size: 248000,  url: '#', date: '2026-03-01', alt: 'Hero banner image' },
  { id: 'f-2', name: 'ankara-dress-front.jpg',type: 'image', size: 183000,  url: '#', date: '2026-03-15', alt: 'Classic Ankara Dress' },
  { id: 'f-3', name: 'lookbook-spring.pdf',   type: 'pdf',   size: 1400000, url: '#', date: '2026-04-01', alt: '' },
  { id: 'f-4', name: 'size-guide.png',        type: 'image', size: 92000,   url: '#', date: '2026-02-20', alt: 'Size chart' },
  { id: 'f-5', name: 'brand-video.mp4',       type: 'video', size: 8200000, url: '#', date: '2026-03-28', alt: '' },
  { id: 'f-6', name: 'shea-butter-product.jpg',type:'image', size: 157000,  url: '#', date: '2026-03-10', alt: 'Premium Shea Butter' },
]

const SEED_METAOBJECTS = [
  {
    id: 'mo-def-1', name: 'Team Members', apiHandle: 'team_member',
    fields: [
      { key: 'name',  type: 'single_line_text', required: true  },
      { key: 'role',  type: 'single_line_text', required: true  },
      { key: 'bio',   type: 'multi_line_text',  required: false },
      { key: 'photo', type: 'file_reference',   required: false },
    ],
    entries: [
      { id: 'e-1', name: 'Tomiwa Aleminu', role: 'Founder & CEO',       bio: 'Passionate about African fashion.', photo: null },
      { id: 'e-2', name: 'Kemi Oladele',   role: 'Head of Merchandise', bio: 'Expert in sourcing quality fabrics.', photo: null },
    ],
  },
  {
    id: 'mo-def-2', name: 'FAQs', apiHandle: 'faq',
    fields: [
      { key: 'question', type: 'single_line_text', required: true  },
      { key: 'answer',   type: 'multi_line_text',  required: true  },
      { key: 'category', type: 'single_line_text', required: false },
    ],
    entries: [
      { id: 'e-3', question: 'How long does delivery take?', answer: 'Lagos: 1–2 days. Other states: 3–5 days.', category: 'Shipping' },
      { id: 'e-4', question: 'Can I return my order?',        answer: 'Yes, within 7 days of delivery.',          category: 'Returns' },
      { id: 'e-5', question: 'Do you offer custom orders?',   answer: 'Yes! Contact us via WhatsApp.',            category: 'Orders'  },
    ],
  },
  {
    id: 'mo-def-3', name: 'Brand Stories', apiHandle: 'brand_story',
    fields: [
      { key: 'headline', type: 'single_line_text', required: true  },
      { key: 'body',     type: 'multi_line_text',  required: true  },
      { key: 'image',    type: 'file_reference',   required: false },
      { key: 'cta_text', type: 'single_line_text', required: false },
      { key: 'cta_link', type: 'url',              required: false },
    ],
    entries: [
      { id: 'e-6', headline: 'Made in Nigeria, Worn Everywhere', body: 'Our fabrics celebrate the rich textile heritage...', image: null, cta_text: 'Shop Now', cta_link: '/collections' },
    ],
  },
]

const FIELD_TYPE_LABELS = {
  single_line_text: 'Single line text',
  multi_line_text:  'Multi-line text',
  file_reference:   'File / Image',
  url:              'URL',
  number:           'Number',
  boolean:          'True / False',
  date:             'Date',
  color:            'Color',
}

// ── Reusable buttons ──────────────────────────────────────
const BtnPrimary = ({ children, onClick, disabled }) => (
  <button className={styles.btnPrimary} onClick={onClick} disabled={disabled}>{children}</button>
)
const BtnOutline = ({ children, onClick }) => (
  <button className={styles.btnOutline} onClick={onClick}>{children}</button>
)
const BtnGhost = ({ children, onClick }) => (
  <button className={styles.btnGhost} onClick={onClick}>{children}</button>
)

// ── Rich text toolbar ─────────────────────────────────────
const RichToolbar = () => (
  <div className={styles.richToolbar}>
    {['B','I','U','S','H1','H2','"','≡','⋮≡','🔗','📷'].map(b => (
      <button key={b} className={styles.richBtn} type="button">{b}</button>
    ))}
  </div>
)

// ── Blog Post Modal ───────────────────────────────────────
function BlogModal({ post, blogs, onClose, onSave }) {
  const [form, setForm] = useState({
    title:          post?.title          || '',
    blog:           post?.blog           || blogs[0] || 'Style Guide',
    author:         post?.author         || 'Tomiwa A.',
    excerpt:        post?.excerpt        || '',
    content:        post?.content        || '',
    tags:           post?.tags?.join(', ') || '',
    status:         post?.status         || 'draft',
    commentsEnabled:post?.commentsEnabled ?? true,
    seoTitle:       post?.seoTitle       || '',
    seoDesc:        post?.seoDesc        || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const fileRef = useRef()
  const [img, setImg] = useState(post?.featuredImg || null)

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
          {/* Main content */}
          <div className={styles.blogMain}>
            <div className={styles.fg}>
              <label>Post Title <span className={styles.req}>*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter post title…" className={styles.titleInput} />
            </div>
            <div className={styles.fg}>
              <label>Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short summary shown in blog listing…" />
            </div>
            <div className={styles.fg}>
              <label>Content</label>
              <RichToolbar />
              <textarea rows={10} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Write your blog post here…" className={styles.contentArea} />
            </div>

            {/* SEO section */}
            <div className={styles.seoSection}>
              <div className={styles.seoHead}>
                <Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />
                SEO & Search Preview
              </div>
              <div className={styles.seoPreview}>
                <div className={styles.seoUrl}>obana.africa/blogs/{form.blog?.toLowerCase().replace(/\s/g,'-')}/{form.title?.toLowerCase().replace(/\s/g,'-') || 'post-title'}</div>
                <div className={styles.seoPageTitle}>{form.seoTitle || form.title || 'Post title'}</div>
                <div className={styles.seoPageDesc}>{form.seoDesc || form.excerpt || 'Post excerpt appears here…'}</div>
              </div>
              <div className={styles.fRow}>
                <div className={styles.fg}><label>SEO Title</label><input value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} placeholder={form.title} /></div>
                <div className={styles.fg}><label>Meta Description</label><input value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} placeholder={form.excerpt} /></div>
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
                    <input type="radio" name="blogStatus" value={s} checked={form.status === s} onChange={() => set('status', s)} />
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
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => { const f = e.target.files[0]; if (f) setImg(URL.createObjectURL(f)) }} />
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
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <div className={styles.mFootR}>
            <BtnOutline onClick={() => { onSave({ ...form, featuredImg: img, status: 'draft', tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }); onClose() }}>
              Save as Draft
            </BtnOutline>
            <BtnPrimary disabled={!form.title.trim()} onClick={() => { onSave({ ...form, featuredImg: img, status: 'published', tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }); onClose() }}>
              <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#fff" />
              Publish
            </BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page Modal ────────────────────────────────────────────
function PageModal({ page, onClose, onSave }) {
  const [form, setForm] = useState({
    title:    page?.title    || '',
    content:  page?.content  || '',
    status:   page?.status   || 'draft',
    seoTitle: page?.seoTitle || '',
    seoDesc:  page?.seoDesc  || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalFull}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{page ? 'Edit Page' : 'Add Page'}</h2>
            <p className={styles.mSub}>Create a static page for your online store</p>
          </div>
          <button className={styles.mClose} onClick={onClose}><Ic d="M18 6L6 18M6 6l12 12" size={18} /></button>
        </div>

        <div className={styles.blogLayout}>
          <div className={styles.blogMain}>
            <div className={styles.fg}>
              <label>Page Title <span className={styles.req}>*</span></label>
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. About Us" className={styles.titleInput} />
            </div>
            <div className={styles.fg}>
              <label>Content</label>
              <RichToolbar />
              <textarea rows={12} value={form.content} onChange={e => set('content', e.target.value)} placeholder="Write your page content here…" className={styles.contentArea} />
            </div>
            <div className={styles.seoSection}>
              <div className={styles.seoHead}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} />SEO & Search Preview</div>
              <div className={styles.seoPreview}>
                <div className={styles.seoUrl}>obana.africa/pages/{form.title?.toLowerCase().replace(/\s/g,'-') || 'page-title'}</div>
                <div className={styles.seoPageTitle}>{form.seoTitle || form.title || 'Page title'}</div>
                <div className={styles.seoPageDesc}>{form.seoDesc || 'Page description appears here…'}</div>
              </div>
              <div className={styles.fRow}>
                <div className={styles.fg}><label>SEO Title</label><input value={form.seoTitle} onChange={e => set('seoTitle', e.target.value)} /></div>
                <div className={styles.fg}><label>Meta Description</label><input value={form.seoDesc} onChange={e => set('seoDesc', e.target.value)} /></div>
              </div>
            </div>
          </div>
          <div className={styles.blogSidebar}>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>Visibility</div>
              <div className={styles.radioCol}>
                {['published','draft'].map(s => (
                  <label key={s} className={styles.radioLbl}>
                    <input type="radio" name="pageStatus" value={s} checked={form.status === s} onChange={() => set('status', s)} />
                    <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className={styles.sideSection}>
              <div className={styles.sideSectionTitle}>URL Handle</div>
              <div className={styles.handlePreview}>
                /pages/<strong>{form.title?.toLowerCase().replace(/\s+/g,'-') || '…'}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <div className={styles.mFootR}>
            <BtnOutline onClick={() => { onSave({ ...form, status: 'draft' }); onClose() }}>Save Draft</BtnOutline>
            <BtnPrimary disabled={!form.title.trim()} onClick={() => { onSave({ ...form, status: 'published' }); onClose() }}>
              <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#fff" /> Save & Publish
            </BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Menu Modal ────────────────────────────────────────────
function MenuModal({ menu, onClose, onSave }) {
  const [name,  setName]  = useState(menu?.name  || '')
  const [items, setItems] = useState(menu?.items || [])

  const addItem = () => setItems(its => [...its, { id: `mi-${Date.now()}`, label: '', url: '', type: 'url', children: [] }])
  const removeItem = (id) => setItems(its => its.filter(i => i.id !== id))
  const setItem = (id, k, v) => setItems(its => its.map(i => i.id === id ? { ...i, [k]: v } : i))

  const LINK_TYPES = ['url','collection','page','blog','product']

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{menu ? 'Edit Menu' : 'Create Menu'}</h2>
            <p className={styles.mSub}>Build the navigation structure for your storefront</p>
          </div>
          <button className={styles.mClose} onClick={onClose}><Ic d="M18 6L6 18M6 6l12 12" size={18} /></button>
        </div>
        <div className={styles.mBody}>
          <div className={styles.fg}>
            <label>Menu Name <span className={styles.req}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Main Menu" />
          </div>
          <div className={styles.fg}>
            <label>Menu handle</label>
            <div className={styles.handlePreview}>{name?.toLowerCase().replace(/\s+/g,'-') || '…'}</div>
          </div>

          <div className={styles.menuItemsSection}>
            <div className={styles.menuItemsHead}>
              <span className={styles.menuItemsTitle}>Menu Items</span>
              <button className={styles.btnAddItem} onClick={addItem}>
                <Ic d="M12 5v14M5 12h14" size={12} /> Add Item
              </button>
            </div>

            {items.length === 0 && (
              <div className={styles.menuEmpty}>No items yet. Add a link to get started.</div>
            )}

            {items.map(item => (
              <div key={item.id} className={styles.menuItem}>
                <div className={styles.menuItemDrag}>⠿</div>
                <div className={styles.menuItemFields}>
                  <div className={styles.fRow}>
                    <div className={styles.fg} style={{ marginBottom: 0 }}>
                      <label>Label</label>
                      <input value={item.label} onChange={e => setItem(item.id, 'label', e.target.value)} placeholder="Link text" />
                    </div>
                    <div className={styles.fg} style={{ marginBottom: 0 }}>
                      <label>Type</label>
                      <select value={item.type} onChange={e => setItem(item.id, 'type', e.target.value)}>
                        {LINK_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles.fg} style={{ marginBottom: 0, marginTop: 6 }}>
                    <label>URL / Path</label>
                    <input value={item.url} onChange={e => setItem(item.id, 'url', e.target.value)} placeholder="/collections/all" />
                  </div>
                  {item.children?.length > 0 && (
                    <div className={styles.childItems}>
                      {item.children.map(child => (
                        <div key={child.id} className={styles.childItem}>
                          <span className={styles.childArrow}>↳</span>
                          <span>{child.label}</span>
                          <span className={styles.childUrl}>{child.url}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className={styles.menuItemRemove} onClick={() => removeItem(item.id)}>
                  <Ic d="M18 6L6 18M6 6l12 12" size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.mFoot}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary disabled={!name.trim()} onClick={() => { onSave({ name, items }); onClose() }}>
            Save Menu
          </BtnPrimary>
        </div>
      </div>
    </div>
  )
}

// ── Metaobject Modal ──────────────────────────────────────
function MetaobjectEntryModal({ definition, entry, onClose, onSave }) {
  const [values, setValues] = useState(
    Object.fromEntries(definition.fields.map(f => [f.key, entry?.[f.key] || '']))
  )
  const setVal = (k, v) => setValues(prev => ({ ...prev, [k]: v }))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{entry ? 'Edit Entry' : 'Add Entry'}</h2>
            <p className={styles.mSub}>{definition.name}</p>
          </div>
          <button className={styles.mClose} onClick={onClose}><Ic d="M18 6L6 18M6 6l12 12" size={18} /></button>
        </div>
        <div className={styles.mBody}>
          {definition.fields.map(field => (
            <div key={field.key} className={styles.fg}>
              <label>
                {field.key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                {field.required && <span className={styles.req}> *</span>}
                <span className={styles.fieldTypeBadge}>{FIELD_TYPE_LABELS[field.type] || field.type}</span>
              </label>
              {field.type === 'multi_line_text' ? (
                <textarea rows={3} value={values[field.key]} onChange={e => setVal(field.key, e.target.value)} placeholder={`Enter ${field.key}…`} />
              ) : field.type === 'boolean' ? (
                <div className={styles.radioRow}>
                  <label className={styles.radioLbl}><input type="radio" checked={values[field.key] === 'true'} onChange={() => setVal(field.key, 'true')} /><span>Yes</span></label>
                  <label className={styles.radioLbl}><input type="radio" checked={values[field.key] === 'false'} onChange={() => setVal(field.key, 'false')} /><span>No</span></label>
                </div>
              ) : field.type === 'file_reference' ? (
                <div className={styles.fileRefBox}>
                  <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={18} stroke="#9CA3AF" />
                  <span>Click to upload image or file</span>
                </div>
              ) : (
                <input type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : field.type === 'color' ? 'color' : 'text'}
                  value={values[field.key]} onChange={e => setVal(field.key, e.target.value)} placeholder={`Enter ${field.key}…`} />
              )}
            </div>
          ))}
        </div>
        <div className={styles.mFoot}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary onClick={() => { onSave({ ...values, id: entry?.id || `e-${Date.now()}` }); onClose() }}>
            {entry ? 'Save Changes' : 'Add Entry'}
          </BtnPrimary>
        </div>
      </div>
    </div>
  )
}

// ── Metaobject Definition Modal ───────────────────────────
function MetaDefModal({ onClose, onSave }) {
  const [name,   setName]   = useState('')
  const [handle, setHandle] = useState('')
  const [fields, setFields] = useState([{ key: '', type: 'single_line_text', required: false }])

  const setField = (i, k, v) => setFields(fs => fs.map((f, j) => j === i ? { ...f, [k]: v } : f))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Create Metaobject</h2>
            <p className={styles.mSub}>Define a custom structured content type</p>
          </div>
          <button className={styles.mClose} onClick={onClose}><Ic d="M18 6L6 18M6 6l12 12" size={18} /></button>
        </div>
        <div className={styles.mBody}>
          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Name <span className={styles.req}>*</span></label>
              <input value={name} onChange={e => { setName(e.target.value); setHandle(e.target.value.toLowerCase().replace(/\s+/g,'_')) }} placeholder="e.g. Team Members" />
            </div>
            <div className={styles.fg}>
              <label>API Handle</label>
              <input value={handle} onChange={e => setHandle(e.target.value)} placeholder="team_members" />
              <span className={styles.fieldHint}>Used in storefront API calls</span>
            </div>
          </div>

          <div className={styles.fieldsSection}>
            <div className={styles.fieldsSectionHead}>
              <span className={styles.menuItemsTitle}>Fields</span>
              <button className={styles.btnAddItem} onClick={() => setFields(fs => [...fs, { key: '', type: 'single_line_text', required: false }])}>
                <Ic d="M12 5v14M5 12h14" size={12} /> Add Field
              </button>
            </div>
            {fields.map((field, i) => (
              <div key={i} className={styles.fieldDefRow}>
                <div className={styles.fg} style={{ flex: 2, marginBottom: 0 }}>
                  <label>Field Key</label>
                  <input value={field.key} onChange={e => setField(i,'key',e.target.value)} placeholder="e.g. bio" />
                </div>
                <div className={styles.fg} style={{ flex: 2, marginBottom: 0 }}>
                  <label>Type</label>
                  <select value={field.type} onChange={e => setField(i,'type',e.target.value)}>
                    {Object.entries(FIELD_TYPE_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div className={styles.fg} style={{ flex: 1, marginBottom: 0 }}>
                  <label>Required</label>
                  <select value={field.required ? 'yes' : 'no'} onChange={e => setField(i,'required',e.target.value === 'yes')}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {fields.length > 1 && (
                  <button className={styles.fieldRemoveBtn} onClick={() => setFields(fs => fs.filter((_,j) => j !== i))}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.mFoot}>
          <BtnGhost onClick={onClose}>Cancel</BtnGhost>
          <BtnPrimary disabled={!name.trim()} onClick={() => { onSave({ name, apiHandle: handle, fields, entries: [] }); onClose() }}>
            Create Metaobject
          </BtnPrimary>
        </div>
      </div>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Content() {
  const location = useLocation()
  const getTabFromPath = (pathname) => {
  if (pathname.includes('menus'))       return 'menus'
  if (pathname.includes('files'))       return 'files'
  if (pathname.includes('metaobjects')) return 'metaobjects'
  return 'blog-posts'
  }
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname))
  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname))
  }, [location.pathname])
  const [blogPosts,    setBlogPosts]    = useState(SEED_BLOGS)
  const [pages,        setPages]        = useState(SEED_PAGES)
  const [menus,        setMenus]        = useState(SEED_MENUS)
  const [files,        setFiles]        = useState(SEED_FILES)
  const [metaobjects,  setMetaobjects]  = useState(SEED_METAOBJECTS)
  const [modal,        setModal]        = useState(null)
  const [editTarget,   setEditTarget]   = useState(null)
  const [activeMetaDef,setActiveMetaDef]= useState(SEED_METAOBJECTS[0]?.id)
  const [entryTarget,  setEntryTarget]  = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [fileFilter,   setFileFilter]   = useState('all')
  const fileUploadRef = useRef()

  const BLOGS_LIST = [...new Set(blogPosts.map(p => p.blog))]
  const activeDef  = metaobjects.find(m => m.id === activeMetaDef)

  const filteredPosts = blogPosts.filter(p => {
    const q = search.toLowerCase()
    const ms = p.title.toLowerCase().includes(q) || p.blog.toLowerCase().includes(q)
    const mst = filterStatus === 'all' || p.status === filterStatus
    return ms && mst
  })

  const filteredPages = pages.filter(p => {
    const ms = p.title.toLowerCase().includes(search.toLowerCase())
    const mst = filterStatus === 'all' || p.status === filterStatus
    return ms && mst
  })

  const filteredFiles = files.filter(f => {
    const ms = f.name.toLowerCase().includes(search.toLowerCase())
    const mt = fileFilter === 'all' || f.type === fileFilter
    return ms && mt
  })

  const saveBlog  = (data) => {
    if (editTarget) setBlogPosts(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...data } : p))
    else setBlogPosts(ps => [...ps, { id: `blog-${Date.now()}`, date: new Date().toISOString().split('T')[0], commentCount: 0, ...data }])
    setModal(null); setEditTarget(null)
  }

  const savePage = (data) => {
    if (editTarget) setPages(ps => ps.map(p => p.id === editTarget.id ? { ...p, ...data } : p))
    else setPages(ps => [...ps, { id: `pg-${Date.now()}`, date: new Date().toISOString().split('T')[0], ...data }])
    setModal(null); setEditTarget(null)
  }

  const saveMenu = (data) => {
    const handle = data.name.toLowerCase().replace(/\s+/g,'-')
    if (editTarget) setMenus(ms => ms.map(m => m.id === editTarget.id ? { ...m, ...data, handle } : m))
    else setMenus(ms => [...ms, { id: `menu-${Date.now()}`, handle, ...data }])
    setModal(null); setEditTarget(null)
  }

  const saveMetaDef = (data) => {
    const newDef = { id: `mo-def-${Date.now()}`, ...data }
    setMetaobjects(ms => [...ms, newDef])
    setActiveMetaDef(newDef.id)
    setModal(null)
  }

  const saveEntry = (data) => {
    setMetaobjects(ms => ms.map(m => {
      if (m.id !== activeMetaDef) return m
      if (entryTarget) return { ...m, entries: m.entries.map(e => e.id === entryTarget.id ? data : e) }
      return { ...m, entries: [...m.entries, data] }
    }))
    setModal(null); setEntryTarget(null)
  }

  const deletePost    = (id) => setBlogPosts(ps => ps.filter(p => p.id !== id))
  const deletePage    = (id) => setPages(ps => ps.filter(p => p.id !== id))
  const deleteMenu    = (id) => setMenus(ms => ms.filter(m => m.id !== id))
  const deleteFile    = (id) => setFiles(fs => fs.filter(f => f.id !== id))
  const deleteEntry   = (entryId) => setMetaobjects(ms => ms.map(m => m.id === activeMetaDef ? { ...m, entries: m.entries.filter(e => e.id !== entryId) } : m))
  const deleteMetaDef = (id) => { setMetaobjects(ms => ms.filter(m => m.id !== id)); if (activeMetaDef === id) setActiveMetaDef(metaobjects.find(m => m.id !== id)?.id) }

  const FILE_TYPE_ICON = {
    image: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
    pdf:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    video: 'M15 10l4.553-2.369A1 1 0 0 1 21 8.5v7a1 1 0 0 1-1.447.882L15 14v-4zM3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z',
  }

  return (
    <div className={styles.page}>

      {/* Topbar */}
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Content</h1>
        <div className={styles.topbarR}>
          {activeTab === 'blog-posts'  && <BtnPrimary onClick={() => { setEditTarget(null); setModal('blog') }}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />New Blog Post</BtnPrimary>}
          {activeTab === 'pages'       && <BtnPrimary onClick={() => { setEditTarget(null); setModal('page') }}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />Add Page</BtnPrimary>}
          {activeTab === 'menus'       && <BtnPrimary onClick={() => { setEditTarget(null); setModal('menu') }}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />Create Menu</BtnPrimary>}
          {activeTab === 'files'       && <BtnPrimary onClick={() => fileUploadRef.current?.click()}><Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={14} stroke="#fff" />Upload Files</BtnPrimary>}
          {activeTab === 'metaobjects' && <BtnPrimary onClick={() => setModal('metaDef')}><Ic d="M12 5v14M5 12h14" size={14} stroke="#fff" />Add Definition</BtnPrimary>}
        </div>
      </header>

      <div className={styles.content}>

        {/* Controls */}
        {activeTab !== 'metaobjects' && activeTab !== 'menus' && (
          <div className={styles.controls}>
            <div className={styles.searchBox}>
              <span className={styles.searchIco}><Ic d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0" size={14} /></span>
              <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTab.replace('-',' ')}…`} />
            </div>
            <div className={styles.controlsR}>
              {(activeTab === 'blog-posts' || activeTab === 'pages') && (
                <select className={styles.filterSel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              )}
              {activeTab === 'files' && (
                <select className={styles.filterSel} value={fileFilter} onChange={e => setFileFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="pdf">PDFs</option>
                </select>
              )}
            </div>
          </div>
        )}

        {/* ── BLOG POSTS ── */}
        {activeTab === 'blog-posts' && (
          <div className={styles.tableWrap}>
            <div className={styles.tHead} style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.7fr 0.5fr' }}>
              <span>Title</span><span>Blog</span><span>Author</span><span>Date</span><span>Status</span><span></span>
            </div>
            {filteredPosts.length === 0 ? (
              <div className={styles.emptyState}>
                <Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={32} stroke="#9CA3AF" />
                <p>No blog posts found</p>
                <BtnPrimary onClick={() => { setEditTarget(null); setModal('blog') }}>Write your first post</BtnPrimary>
              </div>
            ) : filteredPosts.map(post => (
              <div key={post.id} className={styles.tRow} style={{ gridTemplateColumns: '2.5fr 1fr 1fr 1fr 0.7fr 0.5fr' }}>
                <span className={styles.postTitleCell}>
                  <div className={styles.postTitle}>{post.title}</div>
                  <div className={styles.postExcerpt}>{post.excerpt}</div>
                  {post.tags?.length > 0 && (
                    <div className={styles.postTags}>
                      {post.tags.slice(0,3).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                    </div>
                  )}
                </span>
                <span className={styles.metaCell}>{post.blog}</span>
                <span className={styles.metaCell}>{post.author}</span>
                <span className={styles.metaCell}>{fmtD(post.date)}</span>
                <span><StatusPill status={post.status} /></span>
                <span className={styles.actCell}>
                  <button className={styles.iconBtn} onClick={() => { setEditTarget(post); setModal('blog') }}><Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} /></button>
                  <button className={styles.iconBtnRed} onClick={() => deletePost(post.id)}><Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} /></button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── PAGES ── */}
        {activeTab === 'pages' && (
          <div className={styles.tableWrap}>
            <div className={styles.tHead} style={{ gridTemplateColumns: '2fr 1fr 0.8fr 0.5fr' }}>
              <span>Title</span><span>Last Modified</span><span>Status</span><span></span>
            </div>
            {filteredPages.map(pg => (
              <div key={pg.id} className={styles.tRow} style={{ gridTemplateColumns: '2fr 1fr 0.8fr 0.5fr' }}>
                <span className={styles.pageTitle}>{pg.title}</span>
                <span className={styles.metaCell}>{fmtD(pg.date)}</span>
                <span><StatusPill status={pg.status} /></span>
                <span className={styles.actCell}>
                  <button className={styles.iconBtn} onClick={() => { setEditTarget(pg); setModal('page') }}><Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} /></button>
                  <button className={styles.iconBtnRed} onClick={() => deletePage(pg.id)}><Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" size={13} /></button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── MENUS ── */}
        {activeTab === 'menus' && (
          <div className={styles.menusGrid}>
            {menus.map(menu => (
              <div key={menu.id} className={styles.menuCard}>
                <div className={styles.menuCardHead}>
                  <div>
                    <div className={styles.menuCardName}>{menu.name}</div>
                    <div className={styles.menuCardHandle}>/{menu.handle}</div>
                  </div>
                  <div className={styles.actCell}>
                    <button className={styles.iconBtn} onClick={() => { setEditTarget(menu); setModal('menu') }}><Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} /></button>
                    <button className={styles.iconBtnRed} onClick={() => deleteMenu(menu.id)}><Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} /></button>
                  </div>
                </div>
                <div className={styles.menuItemsList}>
                  {menu.items.map(item => (
                    <div key={item.id} className={styles.menuItemPreview}>
                      <span className={styles.menuItemLabel}>{item.label}</span>
                      <span className={styles.menuItemUrl}>{item.url}</span>
                      {item.children?.length > 0 && (
                        <span className={styles.menuChildCount}>{item.children.length} sub-items</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className={styles.addMenuCard} onClick={() => { setEditTarget(null); setModal('menu') }}>
              <Ic d="M12 5v14M5 12h14" size={22} />
              <span>Create Menu</span>
            </button>
          </div>
        )}

        {/* ── FILES ── */}
        {activeTab === 'files' && (
          <>
            <div className={styles.filesGrid}>
              {filteredFiles.map(file => (
                <div key={file.id} className={styles.fileCard}>
                  <div className={styles.filePreview}>
                    {file.type === 'image' ? (
                      <div className={styles.fileImgPh}>
                        <Ic d={FILE_TYPE_ICON.image} size={28} stroke="#9CA3AF" />
                      </div>
                    ) : (
                      <div className={styles.fileDocPh} style={{ background: file.type === 'pdf' ? '#FEF2F2' : '#EFF6FF' }}>
                        <Ic d={FILE_TYPE_ICON[file.type] || FILE_TYPE_ICON.pdf} size={28} stroke={file.type === 'pdf' ? '#EF4444' : '#3B82F6'} />
                      </div>
                    )}
                  </div>
                  <div className={styles.fileInfo}>
                    <div className={styles.fileName}>{file.name}</div>
                    <div className={styles.fileMeta}>{fmtSize(file.size)} · {fmtD(file.date)}</div>
                  </div>
                  <div className={styles.fileActions}>
                    <button className={styles.iconBtn} title="Copy URL"><Ic d="M8 10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2v-8zM4 14a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2" size={13} /></button>
                    <button className={styles.iconBtnRed} onClick={() => deleteFile(file.id)}><Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} /></button>
                  </div>
                </div>
              ))}
              <div className={styles.fileUploadCard} onClick={() => fileUploadRef.current?.click()}>
                <Ic d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" size={24} stroke="#9CA3AF" />
                <span>Upload Files</span>
                <span className={styles.fileUploadHint}>Images, videos, PDFs up to 20MB</span>
              </div>
            </div>
            <input ref={fileUploadRef} type="file" multiple hidden onChange={e => {
              Array.from(e.target.files).forEach(f => {
                setFiles(fs => [...fs, { id: `f-${Date.now()}`, name: f.name, type: f.type.startsWith('image') ? 'image' : f.type.includes('pdf') ? 'pdf' : 'video', size: f.size, url: URL.createObjectURL(f), date: new Date().toISOString().split('T')[0], alt: '' }])
              })
            }} />
          </>
        )}

        {/* ── METAOBJECTS ── */}
        {activeTab === 'metaobjects' && (
          <div className={styles.metaLayout}>

            {/* Definition list (left) */}
            <div className={styles.metaDefList}>
              <div className={styles.metaDefListHead}>Definitions</div>
              {metaobjects.map(mo => (
                <div key={mo.id} className={`${styles.metaDefItem} ${activeMetaDef === mo.id ? styles.metaDefItemOn : ''}`} onClick={() => setActiveMetaDef(mo.id)}>
                  <div>
                    <div className={styles.metaDefName}>{mo.name}</div>
                    <div className={styles.metaDefHandle}>{mo.apiHandle}</div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span className={styles.metaEntryCount}>{mo.entries.length}</span>
                    <button className={styles.iconBtnSm} onClick={e => { e.stopPropagation(); deleteMetaDef(mo.id) }}>
                      <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={12} />
                    </button>
                  </div>
                </div>
              ))}
              <button className={styles.addMetaDefBtn} onClick={() => setModal('metaDef')}>
                <Ic d="M12 5v14M5 12h14" size={13} /> New Definition
              </button>
            </div>

            {/* Entries (right) */}
            {activeDef && (
              <div className={styles.metaEntries}>
                <div className={styles.metaEntriesHead}>
                  <div>
                    <div className={styles.metaEntriesTitle}>{activeDef.name}</div>
                    <div className={styles.metaEntriesHandle}>api: {activeDef.apiHandle}</div>
                  </div>
                  <BtnPrimary onClick={() => { setEntryTarget(null); setModal('metaEntry') }}>
                    <Ic d="M12 5v14M5 12h14" size={13} stroke="#fff" /> Add Entry
                  </BtnPrimary>
                </div>

                {/* Field schema */}
                <div className={styles.fieldSchema}>
                  {activeDef.fields.map(f => (
                    <span key={f.key} className={styles.fieldSchemaPill}>
                      {f.key}: <em>{FIELD_TYPE_LABELS[f.type] || f.type}</em>
                      {f.required && <span className={styles.fieldReq}>*</span>}
                    </span>
                  ))}
                </div>

                {/* Entries table */}
                {activeDef.entries.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={32} stroke="#9CA3AF" />
                    <p>No entries yet</p>
                    <BtnPrimary onClick={() => { setEntryTarget(null); setModal('metaEntry') }}>Add first entry</BtnPrimary>
                  </div>
                ) : (
                  <div className={styles.tableWrap}>
                    <div className={styles.tHead} style={{ gridTemplateColumns: `repeat(${Math.min(activeDef.fields.length, 3)}, 1fr) 0.5fr` }}>
                      {activeDef.fields.slice(0,3).map(f => <span key={f.key}>{f.key.replace(/_/g,' ')}</span>)}
                      <span></span>
                    </div>
                    {activeDef.entries.map(entry => (
                      <div key={entry.id} className={styles.tRow} style={{ gridTemplateColumns: `repeat(${Math.min(activeDef.fields.length, 3)}, 1fr) 0.5fr` }}>
                        {activeDef.fields.slice(0,3).map(f => (
                          <span key={f.key} className={styles.metaCellVal}>
                            {entry[f.key] || <span className={styles.metaEmpty}>—</span>}
                          </span>
                        ))}
                        <span className={styles.actCell}>
                          <button className={styles.iconBtn} onClick={() => { setEntryTarget(entry); setModal('metaEntry') }}><Ic d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" size={13} /></button>
                          <button className={styles.iconBtnRed} onClick={() => deleteEntry(entry.id)}><Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={13} /></button>
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

      {/* Modals */}
      {modal === 'blog'      && <BlogModal post={editTarget} blogs={BLOGS_LIST.length ? BLOGS_LIST : ['Style Guide','Wellness','News']} onClose={() => { setModal(null); setEditTarget(null) }} onSave={saveBlog} />}
      {modal === 'page'      && <PageModal page={editTarget} onClose={() => { setModal(null); setEditTarget(null) }} onSave={savePage} />}
      {modal === 'menu'      && <MenuModal menu={editTarget} onClose={() => { setModal(null); setEditTarget(null) }} onSave={saveMenu} />}
      {modal === 'metaDef'   && <MetaDefModal onClose={() => setModal(null)} onSave={saveMetaDef} />}
      {modal === 'metaEntry' && activeDef && <MetaobjectEntryModal definition={activeDef} entry={entryTarget} onClose={() => { setModal(null); setEntryTarget(null) }} onSave={saveEntry} />}
    </div>
  )
}
