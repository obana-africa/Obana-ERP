/* ─────────────────────────────────────────────────────────
   Path: src/pages/Inventory/components/ItemModal.jsx
───────────────────────────────────────────────────────── */
import { useState } from 'react'
import s from '../Inventory.module.css'
import { fmt } from '../../../utils/formatters'
import { ITEM_CATEGORIES } from '../../../data/inventory'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  item      — existing item (null = create mode)
 *  suppliers — supplier array for dropdown
 *  onClose   — () => void
 *  onSave    — (data) => void
 */
const ItemModal = ({ item, suppliers, onClose, onSave }) => {
  const [form, setForm] = useState({
    name:         item?.name              || '',
    sku:          item?.sku               || '',
    category:     item?.category          || '',
    tags:         item?.tags?.join(', ')  || '',
    barcode:      item?.barcode           || '',
    price:        item?.price             || '',
    costPrice:    item?.costPrice         || '',
    stock:        item?.stock             || '',
    reorderPoint: item?.reorderPoint      || '',
    safetyStock:  item?.safetyStock       || '',
    supplier:     item?.supplier          || '',
    variants:     item?.variants?.join(', ') || '',
    isKit:        item?.isKit             || false,
    kitItems:     item?.kitItems?.join('\n') || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const margin = form.price && form.costPrice
    ? Math.round(((form.price - form.costPrice) / form.price) * 100)
    : null

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>{item ? 'Edit Item' : 'Add Inventory Item'}</h2>
            <p className={s.mSub}>Fill in item master data</p>
          </div>
          <button className={s.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={s.mBody}>

          {/* Identity */}
          <p className={s.secHead}>Item Identity</p>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Product Name <span className={s.req}>*</span></label>
              <input value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="e.g. Classic Ankara Dress" />
            </div>
            <div className={s.fg}>
              <label>SKU <span className={s.req}>*</span></label>
              <input value={form.sku} onChange={e => set('sku', e.target.value)}
                placeholder="e.g. AKR-001" />
            </div>
          </div>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {ITEM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className={s.fg}>
              <label>Tags <span className={s.opt}>(comma separated)</span></label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)}
                placeholder="e.g. dress, ankara, women" />
            </div>
          </div>
          <div className={s.fg}>
            <label>Barcode / UPC</label>
            <input value={form.barcode} onChange={e => set('barcode', e.target.value)}
              placeholder="Scan or enter barcode" />
            <span className={s.hint}>Focus here and scan with barcode scanner</span>
          </div>
          <div className={s.fg}>
            <label>Variants <span className={s.opt}>(comma separated)</span></label>
            <input value={form.variants} onChange={e => set('variants', e.target.value)}
              placeholder="e.g. Red/S, Red/M, Blue/M" />
          </div>

          {/* Pricing */}
          <p className={s.secHead} style={{ marginTop: '1rem' }}>Pricing</p>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Retail Price <span className={s.req}>*</span></label>
              <div className={s.inputPre}><span>₦</span>
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className={s.fg}>
              <label>Cost Price</label>
              <div className={s.inputPre}><span>₦</span>
                <input type="number" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>
          {margin !== null && (
            <div className={s.profitBadge}>
              Margin: <strong>{margin}%</strong>&nbsp;— Profit per unit: {fmt(Number(form.price) - Number(form.costPrice))}
            </div>
          )}

          {/* Stock Levels */}
          <p className={s.secHead} style={{ marginTop: '1rem' }}>Stock Levels</p>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Quantity on Hand <span className={s.req}>*</span></label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
            </div>
            <div className={s.fg}>
              <label>Reorder Point</label>
              <input type="number" value={form.reorderPoint} onChange={e => set('reorderPoint', e.target.value)} placeholder="e.g. 5" />
              <span className={s.hint}>Alert triggers when stock falls to this level</span>
            </div>
          </div>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Safety Stock</label>
              <input type="number" value={form.safetyStock} onChange={e => set('safetyStock', e.target.value)} placeholder="e.g. 2" />
              <span className={s.hint}>Buffer for sync latency between channels</span>
            </div>
            <div className={s.fg}>
              <label>Supplier</label>
              <select value={form.supplier} onChange={e => set('supplier', e.target.value)}>
                <option value="">Select supplier</option>
                {suppliers.map(sup => <option key={sup.id}>{sup.name}</option>)}
              </select>
            </div>
          </div>

          {/* Kit toggle */}
          <div className={s.kitToggle}>
            <label className={s.toggleRow}>
              <div>
                <span className={s.toggleLbl}>Bundle / Kit Item</span>
                <span className={s.hint}>This item is made up of multiple individual products</span>
              </div>
              <div className={`${s.toggle} ${form.isKit ? s.toggleOn : ''}`}
                onClick={() => set('isKit', !form.isKit)}>
                <div className={s.toggleThumb} />
              </div>
            </label>
          </div>

          {form.isKit && (
            <div className={s.fg}>
              <label>Kit Components <span className={s.opt}>(one per line)</span></label>
              <textarea rows={3} value={form.kitItems}
                onChange={e => set('kitItems', e.target.value)}
                placeholder={'Classic Ankara Dress x1\nLeather Crossbody Bag x1'} />
              <span className={s.hint}>Each component will be deducted from individual stock when this kit is sold</span>
            </div>
          )}
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!form.name || !form.sku}
            onClick={() => onSave({
              ...form,
              price:        Number(form.price),
              costPrice:    Number(form.costPrice),
              stock:        Number(form.stock),
              reorderPoint: Number(form.reorderPoint),
              safetyStock:  Number(form.safetyStock),
              tags:         form.tags.split(',').map(t => t.trim()).filter(Boolean),
              variants:     form.variants.split(',').map(v => v.trim()).filter(Boolean),
              kitItems:     form.kitItems.split('\n').map(k => k.trim()).filter(Boolean),
            })}>
            {item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ItemModal
