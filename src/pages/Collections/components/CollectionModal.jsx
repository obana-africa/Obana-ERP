import { useState, useRef } from 'react'
import styles from '../Collections.module.css'
import { fmt } from '../../../utils/formatters'
import { ALL_PRODUCTS } from '../../../data/collections'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  collection  — existing collection object (null = create mode)
 *  onClose     — () => void
 *  onSave      — (data) => void
 */
const CollectionModal = ({ collection, onClose, onSave }) => {
  const [name,   setName]   = useState(collection?.name   || '')
  const [desc,   setDesc]   = useState(collection?.desc   || '')
  const [status, setStatus] = useState(collection?.status || 'active')
  const [img,    setImg]    = useState(collection?.img    || null)
  const [drag,   setDrag]   = useState(false)
  const [selectedProducts, setSelectedProducts] = useState(collection?.productIds || [])
  const fileRef = useRef()

  const toggleProduct = (id) =>
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>
              {collection ? 'Edit Collection' : 'Create Collection'}
            </h2>
            <p className={styles.mSub}>Organise your products into themed collections</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>

          <div className={styles.fg}>
            <label>Collection Name <span className={styles.req}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Summer Collection" />
          </div>

          <div className={styles.fg}>
            <label>Description <span className={styles.opt}>(optional)</span></label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)}
              placeholder="What is this collection about?" />
          </div>

          {/* Image upload */}
          <div className={styles.fg}>
            <label>Cover Image <span className={styles.opt}>(optional)</span></label>
            <div
              className={`${styles.drop} ${drag ? styles.dropOn : ''}`}
              onDragOver={e  => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false)
                const f = e.dataTransfer.files[0]
                if (f?.type.startsWith('image/')) setImg(URL.createObjectURL(f))
              }}
              onClick={() => fileRef.current.click()}
            >
              {img ? (
                <div className={styles.dropImgPreview}>
                  <img src={img} alt="cover" />
                  <button className={styles.dropImgRemove}
                    onClick={e => { e.stopPropagation(); setImg(null) }}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={10} />
                  </button>
                </div>
              ) : (
                <div className={styles.dropInner}>
                  <Ic d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
                    size={24} stroke="#9CA3AF" />
                  <p>Upload cover image</p>
                  <span>PNG, JPG up to 5MB</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden
                onChange={e => {
                  const f = e.target.files[0]
                  if (f) setImg(URL.createObjectURL(f))
                }} />
            </div>
          </div>

          {/* Product picker */}
          <div className={styles.fg}>
            <label>Products in this collection</label>
            <div className={styles.productPicker}>
              {ALL_PRODUCTS.map(p => (
                <label
                  key={p.id}
                  className={`${styles.productPickItem} ${selectedProducts.includes(p.id) ? styles.productPickItemOn : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className={styles.productPickChk}
                  />
                  <div className={styles.productPickThumb}>{p.name[0]}</div>
                  <div className={styles.productPickInfo}>
                    <div className={styles.productPickName}>{p.name}</div>
                    <div className={styles.productPickMeta}>{p.sku} · {fmt(p.price)}</div>
                  </div>
                  {selectedProducts.includes(p.id) && (
                    <Ic d="M20 6L9 17l-5-5" size={14} stroke="#2DBD97" />
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className={styles.fg}>
            <label>Status</label>
            <div className={styles.radioRow}>
              {[{ v:'active', l:'Active' }, { v:'draft', l:'Draft' }].map(s => (
                <label key={s.v} className={styles.radioLbl}>
                  <input type="radio" name="colStatus" value={s.v}
                    checked={status === s.v} onChange={() => setStatus(s.v)} />
                  <span>{s.l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button
            className={styles.btnPrimary}
            disabled={!name.trim()}
            onClick={() => onSave({ name, desc, status, img, productIds: selectedProducts })}
          >
            {collection ? 'Save Changes' : 'Create Collection'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CollectionModal
