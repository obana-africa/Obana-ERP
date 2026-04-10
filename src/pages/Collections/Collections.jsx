import { useState, useRef } from 'react'
import styles from './Collections.module.css'

const Ic = ({ children, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const SAMPLE_COLLECTIONS = [
  { id: 1, name: 'Summer Collection', products: 8, img: null, status: 'active', desc: 'Bright and breezy looks for the season' },
  { id: 2, name: 'Bridal & Aso-Ebi', products: 14, img: null, status: 'active', desc: 'Elegant pieces for weddings and celebrations' },
  { id: 3, name: "Men's Essentials", products: 6, img: null, status: 'draft', desc: 'Core wardrobe pieces for the modern man' },
]

function CollectionModal({ collection, onClose, onSave }) {
  const [name, setName] = useState(collection?.name || '')
  const [desc, setDesc] = useState(collection?.desc || '')
  const [status, setStatus] = useState(collection?.status || 'active')
  const [img, setImg] = useState(collection?.img || null)
  const [drag, setDrag] = useState(false)
  const fileRef = useRef()

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{collection ? 'Edit Collection' : 'Create Collection'}</h2>
            <p className={styles.mSub}>Organise your products into collections</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic size={18}><path d="M18 6L6 18M6 6l12 12" /></Ic>
          </button>
        </div>
        <div className={styles.mBody}>
          <div className={styles.fg}>
            <label>Collection Name <span className={styles.req}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Collection" />
          </div>
          <div className={styles.fg}>
            <label>Description <span className={styles.opt}>(optional)</span></label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this collection about?" />
          </div>
          <div className={styles.fg}>
            <label>Collection Image <span className={styles.opt}>(optional)</span></label>
            <div
              className={`${styles.drop} ${drag ? styles.dropOn : ''}`}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false)
                const f = e.dataTransfer.files[0]
                if (f?.type.startsWith('image/')) setImg(URL.createObjectURL(f))
              }}
              onClick={() => fileRef.current.click()}
            >
              {img
                ? <img src={img} alt="" style={{ maxHeight: 130, borderRadius: 8, objectFit: 'cover' }} />
                : <div className={styles.dropInner}>
                    <Ic size={24}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></Ic>
                    <p>Upload a cover image</p>
                    <span>PNG, JPG up to 5MB</span>
                  </div>
              }
              <input ref={fileRef} type="file" accept="image/*" hidden
                onChange={e => { const f = e.target.files[0]; if (f) setImg(URL.createObjectURL(f)) }} />
            </div>
          </div>
          <div className={styles.fg}>
            <label>Status</label>
            <div className={styles.radioRow}>
              {[{ v: 'active', l: 'Active' }, { v: 'draft', l: 'Draft' }].map(s => (
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
          <button className={styles.btnPrimary} disabled={!name.trim()}
            onClick={() => onSave({ name, desc, status, img })}>
            {collection ? 'Save Changes' : 'Create Collection'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Collections() {
  const [collections, setCollections] = useState(SAMPLE_COLLECTIONS)
  const [modal, setModal] = useState(null)
  const [editColl, setEditColl] = useState(null)

  const saveCollection = (data) => {
    if (editColl) {
      setCollections(cs => cs.map(c => c.id === editColl.id ? { ...c, ...data } : c))
    } else {
      setCollections(cs => [...cs, { id: Date.now(), products: 0, ...data }])
    }
    setModal(null)
    setEditColl(null)
  }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <h1 className={styles.pgTitle}>Collections</h1>
        <button className={styles.btnPrimary}
          onClick={() => { setEditColl(null); setModal('collection') }}>
          <Ic size={14}><path d="M12 5v14M5 12h14" /></Ic>
          Create Collection
        </button>
      </header>

      <div className={styles.content}>
        {collections.length === 0 ? (
          <div className={styles.emptyState}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="14" y="22" width="52" height="42" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
              <rect x="22" y="14" width="36" height="42" rx="4" fill="#fff" stroke="#2DBD97" strokeWidth="1.5" />
              <line x1="30" y1="26" x2="50" y2="26" stroke="#2DBD97" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="30" y1="33" x2="50" y2="33" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="58" cy="58" r="14" fill="#2DBD97" />
              <line x1="58" y1="51" x2="58" y2="65" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="51" y1="58" x2="65" y2="58" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            <h3>No collections yet</h3>
            <p>Every collection created will appear here</p>
            <button className={styles.btnPrimary}
              onClick={() => { setEditColl(null); setModal('collection') }}>
              <Ic size={14}><path d="M12 5v14M5 12h14" /></Ic>
              Create Collection
            </button>
          </div>
        ) : (
          <div className={styles.collGrid}>
            {collections.map(c => (
              <div key={c.id} className={styles.collCard}>
                <div className={styles.collImgWrap}>
                  {c.img
                    ? <img src={c.img} alt={c.name} className={styles.collImg} />
                    : <div className={styles.collImgPh}>
                        <Ic size={28}><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" /></Ic>
                      </div>
                  }
                  <span className={styles.collStatus}
                    style={{
                      background: c.status === 'active' ? '#ECFDF5' : '#F3F4F6',
                      color: c.status === 'active' ? '#059669' : '#6B7280'
                    }}>
                    {c.status}
                  </span>
                </div>
                <div className={styles.collInfo}>
                  <div className={styles.collName}>{c.name}</div>
                  <div className={styles.collDesc}>{c.desc}</div>
                  <div className={styles.collMeta}>{c.products} products</div>
                </div>
                <div className={styles.collActs}>
                  <button className={styles.actBtn}
                    onClick={() => { setEditColl(c); setModal('editCollection') }}>
                    <Ic size={12}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></Ic>
                    Edit
                  </button>
                  <button className={styles.actBtn}>
                    <Ic size={12}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M17 8l-5-5-5 5M12 3v12" /></Ic>
                    Upload
                  </button>
                  <button className={styles.actBtnRed}
                    onClick={() => setCollections(cs => cs.filter(x => x.id !== c.id))}>
                    <Ic size={12}><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></Ic>
                  </button>
                </div>
              </div>
            ))}
            <button className={styles.collAddCard}
              onClick={() => { setEditColl(null); setModal('collection') }}>
              <Ic size={22}><path d="M12 5v14M5 12h14" /></Ic>
              <span>Create Collection</span>
            </button>
          </div>
        )}
      </div>

      {(modal === 'collection' || modal === 'editCollection') && (
        <CollectionModal
          collection={modal === 'editCollection' ? editColl : null}
          onClose={() => { setModal(null); setEditColl(null) }}
          onSave={saveCollection}
        />
      )}
    </div>
  )
}