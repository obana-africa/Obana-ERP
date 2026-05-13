import { useState, useRef } from 'react';
import s from '../Collections.module.css';
import { fmt } from '@/utils/formatters';
import { ALL_PRODUCTS } from '@/data/collections';
import Icon from '@/components/ui/Icon/Icon';

export default function CollectionModal({ collection, onClose, onSave }) {
  const [name, setName] = useState(collection?.name || '');
  const [desc, setDesc] = useState(collection?.desc || '');
  const [status, setStatus] = useState(collection?.status || 'active');
  const [img, setImg] = useState(collection?.img || null);
  const [drag, setDrag] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(collection?.productIds || []);
  const fileRef = useRef();

  const toggleProduct = (id) =>
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>{collection ? 'Edit Collection' : 'Create Collection'}</h2>
            <p className={s.mSub}>Organise your products into themed collections</p>
          </div>
          <button className={s.mClose} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>

        <div className={s.mBody}>
          <div className={s.fg}>
            <label>Collection Name <span className={s.req}>*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Summer Collection" />
          </div>

          <div className={s.fg}>
            <label>Description <span className={s.opt}>(optional)</span></label>
            <textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} placeholder="What is this collection about?" />
          </div>

          <div className={s.fg}>
            <label>Cover Image <span className={s.opt}>(optional)</span></label>
            <div
              className={`${s.drop} ${drag ? s.dropOn : ''}`}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault(); setDrag(false);
                const f = e.dataTransfer.files[0];
                if (f?.type.startsWith('image/')) setImg(URL.createObjectURL(f));
              }}
              onClick={() => fileRef.current.click()}
            >
              {img ? (
                <div className={s.dropImgPreview}>
                  <img src={img} alt="cover" />
                  <button className={s.dropImgRemove} onClick={e => { e.stopPropagation(); setImg(null); }}>
                    <Icon name="close" size={10} />
                  </button>
                </div>
              ) : (
                <div className={s.dropInner}>
                  <Icon name="img" size={24} stroke="#9CA3AF" />
                  <p>Upload cover image</p>
                  <span>PNG, JPG up to 5MB</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => {
                const f = e.target.files[0];
                if (f) setImg(URL.createObjectURL(f));
              }} />
            </div>
          </div>

          <div className={s.fg}>
            <label>Products in this collection</label>
            <div className={s.productPicker}>
              {ALL_PRODUCTS.map(p => (
                <label
                  key={p.id}
                  className={`${s.productPickItem} ${selectedProducts.includes(p.id) ? s.productPickItemOn : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p.id)}
                    onChange={() => toggleProduct(p.id)}
                    className={s.productPickChk}
                  />
                  <div className={s.productPickThumb}>{p.name[0]}</div>
                  <div className={s.productPickInfo}>
                    <div className={s.productPickName}>{p.name}</div>
                    <div className={s.productPickMeta}>{p.sku} · {fmt(p.price)}</div>
                  </div>
                  {selectedProducts.includes(p.id) && <Icon name="check" size={14} stroke="#2DBD97" />}
                </label>
              ))}
            </div>
          </div>

          <div className={s.fg}>
            <label>Status</label>
            <div className={s.radioRow}>
              {[{ v:'active', l:'Active' }, { v:'draft', l:'Draft' }].map(opt => (
                <label key={opt.v} className={s.radioLbl}>
                  <input type="radio" name="colStatus" value={opt.v} checked={status === opt.v} onChange={() => setStatus(opt.v)} />
                  <span>{opt.l}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!name.trim()} onClick={() => onSave({ name, desc, status, img, productIds: selectedProducts })}>
            {collection ? 'Save Changes' : 'Create Collection'}
          </button>
        </div>
      </div>
    </div>
  );
}