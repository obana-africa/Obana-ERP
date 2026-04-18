
import { useState } from 'react'
import styles from '../Transfers.module.css'
import { fmt } from '../../../utils/formatters'
import { SUPPLIERS, LOCATIONS, TRANSFER_PRODUCTS, TYPE_CFG } from '../../../data/transfers'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  onClose — () => void
 *  onSave  — (transferData) => void
 */
const CreateTransferModal = ({ onClose, onSave }) => {
  const [type,   setType]   = useState('incoming')
  const [origin, setOrigin] = useState('')
  const [dest,   setDest]   = useState('')
  const [eta,    setEta]    = useState('')
  const [ref,    setRef]    = useState('')
  const [notes,  setNotes]  = useState('')
  const [items,  setItems]  = useState([{ sku: '', name: '', exp: 1, cost: '' }])

  const setItem = (i, key, val) => {
    setItems(its => {
      const next = [...its]
      next[i] = { ...next[i], [key]: val }
      // Auto-fill SKU and cost when product name is selected
      if (key === 'name') {
        const match = TRANSFER_PRODUCTS.find(p => p.name === val)
        if (match) { next[i].sku = match.sku; next[i].cost = match.cost }
      }
      return next
    })
  }

  const addItem    = ()  => setItems(its => [...its, { sku: '', name: '', exp: 1, cost: '' }])
  const removeItem = (i) => setItems(its => its.filter((_, j) => j !== i))

  const total   = items.reduce((a, i) => a + (Number(i.exp) * Number(i.cost) || 0), 0)
  const origins = type === 'incoming' ? SUPPLIERS : LOCATIONS

  const save = status => {
    onSave({
      id:     `TRF-2026-${String(Date.now()).slice(-3)}`,
      type, status, origin, dest,
      ref:    ref || null,
      notes,
      date:   new Date().toISOString().split('T')[0],
      eta:    eta || new Date().toISOString().split('T')[0],
      items:  items.map(i => ({ ...i, recv: 0 })),
    })
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Create Transfer</h2>
            <p className={styles.mSub}>Move stock between locations or receive from a supplier</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        {/* Transfer type selector */}
        <div className={styles.typeSelectorRow}>
          {Object.entries(TYPE_CFG).map(([key, cfg]) => (
            <button key={key}
              className={`${styles.typeBtn} ${type === key ? styles.typeBtnOn : ''}`}
              onClick={() => { setType(key); setOrigin('') }}>
              <Ic d={cfg.icon} size={18} stroke={type === key ? '#fff' : '#6B7280'} />
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className={styles.mBody}>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>
                {type === 'incoming' ? 'Supplier / Origin' : 'Origin Location'}
                <span className={styles.req}> *</span>
              </label>
              <select value={origin} onChange={e => setOrigin(e.target.value)}>
                <option value="">Select origin</option>
                {origins.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={styles.fg}>
              <label>Destination <span className={styles.req}>*</span></label>
              <select value={dest} onChange={e => setDest(e.target.value)}>
                <option value="">Select destination</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Expected Arrival</label>
              <input type="date" value={eta} onChange={e => setEta(e.target.value)} />
            </div>
            <div className={styles.fg}>
              <label>Reference / PO <span className={styles.opt}>(optional)</span></label>
              <input value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. PO-004" />
            </div>
          </div>

          {/* Items editor */}
          <div className={styles.itemsEditor}>
            <div className={styles.itemsEditorHead}>
              <span className={styles.itemsEditorTitle}>Transfer Items</span>
              <button className={styles.btnAddItem} onClick={addItem}>
                <Ic d="M12 5v14M5 12h14" size={12} /> Add Item
              </button>
            </div>

            {items.map((item, i) => (
              <div key={i} className={styles.itemEditRow}>
                <div className={styles.fg} style={{ flex: 2 }}>
                  {i === 0 && <label>Product</label>}
                  <select value={item.name} onChange={e => setItem(i, 'name', e.target.value)}>
                    <option value="">Select product</option>
                    {TRANSFER_PRODUCTS.map(p => (
                      <option key={p.sku} value={p.name}>{p.name} — {p.sku}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.fg} style={{ flex: '0 0 70px' }}>
                  {i === 0 && <label>Qty</label>}
                  <input type="number" min={1} value={item.exp}
                    onChange={e => setItem(i, 'exp', e.target.value)} />
                </div>
                <div className={styles.fg} style={{ flex: 1 }}>
                  {i === 0 && <label>Unit Cost (₦)</label>}
                  <input type="number" value={item.cost}
                    onChange={e => setItem(i, 'cost', e.target.value)} placeholder="0" />
                </div>
                {items.length > 1 && (
                  <button className={styles.removeItemBtn} onClick={() => removeItem(i)}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={13} stroke="#EF4444" />
                  </button>
                )}
              </div>
            ))}

            <div className={styles.itemsEditorTotal}>
              <span>{items.reduce((a, i) => a + Number(i.exp || 0), 0)} units</span>
              <strong>{fmt(total)}</strong>
            </div>
          </div>

          <div className={styles.fg}>
            <label>Notes <span className={styles.opt}>(optional)</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Any special instructions or context for this transfer…" />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnOutline} onClick={() => save('draft')}>
              Save as Draft
            </button>
            <button className={styles.btnPrimary}
              disabled={!origin || !dest}
              onClick={() => save('pending')}>
              <Ic d="M5 12h14M12 5l7 7-7 7" size={13} stroke="#fff" />
              Send Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTransferModal
