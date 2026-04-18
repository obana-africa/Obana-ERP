
import { useState, useRef } from 'react'
import s from '../Products.module.css'
import { fmt } from '../../../utils/formatters'
import { SAMPLE_COLLECTIONS, PRODUCT_CATEGORIES } from '../../../data/products'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const STEPS = ['Product Type', 'Details & Images', 'Pricing', 'Inventory']

const RICH_BTNS = ['B','I','U','S','❝','≡','⋮≡','⋮⋮']

/**
 * Props:
 *  onClose — () => void
 *  onAdd   — (data) => void
 */
const AddProductModal = ({ onClose, onAdd }) => {
  const [step,        setStep]        = useState(1)
  const [productType, setProductType] = useState('regular')
  const [images,      setImages]      = useState([])
  const [variants,    setVariants]    = useState([
    { option:'Size',  values:'' },
    { option:'Color', values:'' },
  ])
  const [form, setForm] = useState({
    name:'', shortDesc:'', longDesc:'', collection:'',
    price:'', costPrice:'', discountPrice:'',
    stock:'', unit:'pc', barcode:'', trackQty:true,
  })
  const fileRef = useRef()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImages = files => {
    files.forEach(f => setImages(prev => [...prev, { url: URL.createObjectURL(f), name: f.name }]))
  }

  const profit = form.price && form.costPrice
    ? fmt(parseFloat(form.price || 0) - parseFloat(form.costPrice || 0))
    : null

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${s.modal} ${s.modalWide}`}>
        <div className={s.modalHead}>
          <span className={s.modalTitle}>Add New Product</span>
          <button className={s.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={s.modalBody}>
          {/* Step progress bar */}
          <div className={s.stepBar}>
            {STEPS.map((label, i) => (
              <div key={i} className={`${s.stepItem} ${step===i+1?s.stepActive:''} ${step>i+1?s.stepDone:''}`}>
                <div className={s.stepCircle}>{step > i+1 ? '✓' : i+1}</div>
                <span className={s.stepLabel}>{label}</span>
                {i < STEPS.length-1 && <div className={s.stepLine} />}
              </div>
            ))}
          </div>

          {/* ── Step 1: Product Type ── */}
          {step === 1 && (
            <div className={s.stepContent}>
              <p className={s.stepHint}>Is this a regular product or does it have variations like colours, sizes?</p>
              <div className={s.typeGrid}>
                <button className={`${s.typeCard} ${productType==='regular'?s.typeCardActive:''}`}
                  onClick={() => setProductType('regular')}>
                  <div className={s.typeIcon}>
                    <Ic d={['M3 3h18v18H3z','M3 9h18M9 21V9']} size={28} />
                  </div>
                  <strong>Regular Product</strong>
                  <span>This is a product without variations</span>
                </button>
                <button className={`${s.typeCard} ${productType==='variants'?s.typeCardActive:''}`}
                  onClick={() => setProductType('variants')}>
                  <div className={s.typeIcon}>
                    <Ic d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" size={28} />
                  </div>
                  <strong>Product with Variations</strong>
                  <span>Different colours, sizes, etc.</span>
                </button>
              </div>

              {productType === 'variants' && (
                <div className={s.variantsSection}>
                  <h4 className={s.sectionLabel}>Configure Variants</h4>
                  {variants.map((v, i) => (
                    <div key={i} className={s.variantRow}>
                      <input className={s.input} placeholder="Option name (e.g. Size)"
                        value={v.option}
                        onChange={e => { const nv=[...variants]; nv[i].option=e.target.value; setVariants(nv) }} />
                      <input className={s.input} placeholder="Values comma-separated (e.g. S, M, L, XL)"
                        value={v.values}
                        onChange={e => { const nv=[...variants]; nv[i].values=e.target.value; setVariants(nv) }} />
                      <button className={s.btnIconDanger}
                        onClick={() => setVariants(variants.filter((_,j) => j !== i))}>
                        <Ic d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" size={14} />
                      </button>
                    </div>
                  ))}
                  <button className={s.btnOutlineSmall}
                    onClick={() => setVariants([...variants,{ option:'', values:'' }])}>
                    + Add Variant Option
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Details & Images ── */}
          {step === 2 && (
            <div className={s.stepContent}>
              <div className={s.field}>
                <label className={s.label}>Product Name <span className={s.req}>*</span></label>
                <input className={s.input} placeholder="Enter product name"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>

              <div className={s.field}>
                <label className={s.label}>
                  Product Images
                  <span className={s.labelHint}>Recommended: 930×1163px · Max 5MB</span>
                </label>
                <div className={s.dropzone}
                  onDrop={e => { e.preventDefault(); handleImages(Array.from(e.dataTransfer.files)) }}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => fileRef.current.click()}>
                  {images.length === 0 ? (
                    <>
                      <Ic d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M17 8l-5-5-5 5','M12 3v12']} size={32} stroke="#9CA3AF" />
                      <p>Drag & drop images or click to browse</p>
                      <span>Recommended: 930×1163px · Max 5MB</span>
                    </>
                  ) : (
                    <div className={s.imageGrid}>
                      {images.map((img, i) => (
                        <div key={i} className={s.imageThumb}>
                          <img src={img.url} alt={img.name} />
                          <button className={s.removeImg}
                            onClick={e => { e.stopPropagation(); setImages(images.filter((_,j) => j !== i)) }}>
                            ×
                          </button>
                        </div>
                      ))}
                      <div className={s.addMoreImg}>
                        <Ic d="M12 5v14M5 12h14" size={20} />
                      </div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" multiple accept="image/*" hidden
                  onChange={e => handleImages(Array.from(e.target.files))} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Short Description <span className={s.opt}>(optional)</span></label>
                <input className={s.input} placeholder="Brief product summary"
                  value={form.shortDesc} onChange={e => set('shortDesc', e.target.value)} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Long Description <span className={s.opt}>(optional)</span></label>
                <div className={s.richBar}>
                  {RICH_BTNS.map(b => <button key={b} className={s.richBtn} type="button">{b}</button>)}
                </div>
                <textarea className={s.textarea} placeholder="Detailed product description…"
                  value={form.longDesc} onChange={e => set('longDesc', e.target.value)} />
              </div>

              <div className={s.field}>
                <label className={s.label}>Collection</label>
                <select className={s.input} value={form.collection} onChange={e => set('collection', e.target.value)}>
                  <option value="">Select collection</option>
                  {SAMPLE_COLLECTIONS.map(c => <option key={c.id}>{c.name}</option>)}
                  <option value="__new">+ Create New Collection</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Step 3: Pricing ── */}
          {step === 3 && (
            <div className={s.stepContent}>
              <div className={s.field}>
                <label className={s.label}>Retail Price <span className={s.req}>*</span></label>
                <div className={s.inputPrefix}>
                  <span>₦</span>
                  <input type="number" className={s.input} placeholder="0.00"
                    value={form.price} onChange={e => set('price', e.target.value)} />
                </div>
              </div>
              <div className={s.fieldRow2}>
                <div className={s.field}>
                  <label className={s.label}>Cost Price</label>
                  <div className={s.inputPrefix}>
                    <span>₦</span>
                    <input type="number" className={s.input} placeholder="0.00"
                      value={form.costPrice} onChange={e => set('costPrice', e.target.value)} />
                  </div>
                </div>
                <div className={s.field}>
                  <label className={s.label}>Discounted Price <span className={s.opt}>(optional)</span></label>
                  <div className={s.inputPrefix}>
                    <span>₦</span>
                    <input type="number" className={s.input} placeholder="0.00"
                      value={form.discountPrice} onChange={e => set('discountPrice', e.target.value)} />
                  </div>
                </div>
              </div>
              {profit && (
                <div className={s.profitBadge}>
                  Estimated profit per unit: <strong>{profit}</strong>
                </div>
              )}
            </div>
          )}

          {/* ── Step 4: Inventory ── */}
          {step === 4 && (
            <div className={s.stepContent}>
              <h4 className={s.sectionLabel}>Product Inventory</h4>
              <div className={s.fieldRow2}>
                <div className={s.field}>
                  <label className={s.label}>Stock Quantity <span className={s.req}>*</span></label>
                  <input type="number" className={s.input} placeholder="0"
                    value={form.stock} onChange={e => set('stock', e.target.value)} />
                </div>
                <div className={s.field}>
                  <label className={s.label}>Unit <span className={s.opt}>(optional)</span></label>
                  <input className={s.input} placeholder="pc"
                    value={form.unit} onChange={e => set('unit', e.target.value)} />
                </div>
              </div>
              <div className={s.field}>
                <label className={s.label}>Barcode <span className={s.opt}>(optional)</span></label>
                <input className={s.input} placeholder="Focus here to scan barcode"
                  value={form.barcode} onChange={e => set('barcode', e.target.value)} />
                <span className={s.fieldHint}>Focus here and scan with barcode scanner</span>
              </div>
              <div className={s.field}>
                <div className={s.toggleRow}>
                  <div>
                    <span className={s.label} style={{ display:'block' }}>Track order quantity</span>
                    <span className={s.fieldHint}>Enable quantity tracking for this product</span>
                  </div>
                  <label className={s.toggle}>
                    <input type="checkbox" checked={form.trackQty}
                      onChange={e => set('trackQty', e.target.checked)} />
                    <span className={s.toggleSlider} />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={s.modalFooter}>
          <div className={s.footerLeft}>
            {step > 1 && <button className={s.btnGhost} onClick={() => setStep(step-1)}>← Back</button>}
            <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          </div>
          <div className={s.footerRight}>
            {step < 4
              ? <button className={s.btnPrimary} onClick={() => setStep(step+1)}>Next →</button>
              : <button className={s.btnPrimary} disabled={!form.name || !form.stock}
                  onClick={() => { onAdd(form); onClose() }}>
                  Add Product
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddProductModal
