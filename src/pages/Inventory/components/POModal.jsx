/* ─────────────────────────────────────────────────────────
   Path: src/pages/Inventory/components/POModal.jsx
───────────────────────────────────────────────────────── */
import { useState } from 'react'
import s from '../Inventory.module.css'
import { fmt } from '../../../utils/formatters'
import { SAMPLE_INVENTORY } from '../../../data/inventory'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  suppliers — supplier array for dropdown
 *  onClose   — () => void
 *  onSave    — (data) => void
 */
const POModal = ({ suppliers, onClose, onSave }) => {
  const [form,         setForm]         = useState({ supplier: '', expectedDate: '', notes: '' })
  const [items,        setItems]        = useState([{ name: '', qty: 1, cost: '' }])
  const [openDropdown, setOpenDropdown] = useState(null)

  const set     = (k, v)     => setForm(f => ({ ...f, [k]: v }))
  const setItem = (i, k, v)  => setItems(its => its.map((it, j) => j === i ? { ...it, [k]: v } : it))
  const addItem = ()         => setItems(its => [...its, { name: '', qty: 1, cost: '' }])
  const removeItem = i       => setItems(its => its.filter((_, j) => j !== i))

  const total = items.reduce((a, it) => a + (Number(it.qty) * Number(it.cost) || 0), 0)

  // Product search dropdown per item row
  const getMatches = (query) => SAMPLE_INVENTORY.filter(p =>
    !query ||
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>Create Purchase Order</h2>
            <p className={s.mSub}>Order stock from a supplier</p>
          </div>
          <button className={s.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={s.mBody}>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Supplier <span className={s.req}>*</span></label>
              <select value={form.supplier} onChange={e => set('supplier', e.target.value)}>
                <option value="">Select supplier</option>
                {suppliers.map(sup => <option key={sup.id}>{sup.name}</option>)}
              </select>
            </div>
            <div className={s.fg}>
              <label>Expected Delivery Date</label>
              <input type="date" value={form.expectedDate} onChange={e => set('expectedDate', e.target.value)} />
            </div>
          </div>

          {/* Order items */}
          <div className={s.poItemsEditor}>
            <div className={s.poItemsHeader}>
              <p className={s.secHead} style={{ margin: 0 }}>Order Items</p>
              <button className={s.btnOutlineSm} onClick={addItem}>
                <Ic d="M12 5v14M5 12h14" size={12} /> Add Item
              </button>
            </div>

            {items.map((item, i) => (
              <div key={i} className={s.poItemRow}>

                {/* Product search with autocomplete dropdown */}
                <div className={s.fg} style={{ flex: 2, position: 'relative' }}>
                  <label>Product / SKU</label>
                  <input
                    value={item.name}
                    onChange={e => setItem(i, 'name', e.target.value)}
                    placeholder="Search product name or SKU…"
                    autoComplete="off"
                    onFocus={() => setOpenDropdown(i)}
                    onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
                  />
                  {openDropdown === i && (
                    <div className={s.poDropdown}>
                      {getMatches(item.name).length === 0 ? (
                        <div className={s.poDropdownEmpty}>No products found</div>
                      ) : getMatches(item.name).map(p => (
                        <div key={p.sku} className={s.poDropdownItem}
                          onMouseDown={() => {
                            setItem(i, 'name', p.name)
                            setItem(i, 'cost', p.costPrice)
                            setOpenDropdown(null)
                          }}>
                          <div>
                            <div className={s.poDropdownName}>{p.name}</div>
                            <div className={s.poDropdownSku}>{p.sku}</div>
                          </div>
                          <span className={s.poDropdownPrice}>{fmt(p.costPrice)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={s.fg} style={{ flex: 0.6 }}>
                  <label>Qty</label>
                  <input type="number" min="1" value={item.qty}
                    onChange={e => setItem(i, 'qty', e.target.value)} />
                </div>

                <div className={s.fg} style={{ flex: 1 }}>
                  <label>Unit Cost (₦)</label>
                  <input type="number" value={item.cost}
                    onChange={e => setItem(i, 'cost', e.target.value)} placeholder="0" />
                </div>

                {items.length > 1 && (
                  <button className={s.removeBtn} onClick={() => removeItem(i)}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={13} />
                  </button>
                )}
              </div>
            ))}

            <div className={s.poTotal}>
              <span>Order Total</span>
              <strong>{fmt(total)}</strong>
            </div>
          </div>

          <div className={s.fg}>
            <label>Notes <span className={s.opt}>(optional)</span></label>
            <textarea rows={2} value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Any special instructions..." />
          </div>
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!form.supplier}
            onClick={() => onSave({
              ...form,
              items,
              total,
              id:     `PO-${Date.now()}`,
              status: 'pending',
              date:   new Date().toISOString().split('T')[0],
            })}>
            Create Purchase Order
          </button>
        </div>
      </div>
    </div>
  )
}

export default POModal
