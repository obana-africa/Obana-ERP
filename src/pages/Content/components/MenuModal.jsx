/* ─────────────────────────────────────────────────────────
   Path: src/pages/Content/components/MenuModal.jsx
───────────────────────────────────────────────────────── */
import { useState } from 'react'
import styles from '../Content.module.css'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const uid = () => `mi-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

const ITEM_TYPES = ['url','page','collection','blog','product']

/**
 * Props:
 *  menu    — existing menu (null = create)
 *  onClose — () => void
 *  onSave  — (data) => void
 */
const MenuModal = ({ menu, onClose, onSave }) => {
  const [name,  setName]  = useState(menu?.name   || '')
  const [items, setItems] = useState(menu?.items   || [])
  const [adding, setAdding] = useState(false)
  const [newItem, setNewItem] = useState({ label:'', url:'', type:'url' })

  const handle = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')

  const addItem = () => {
    if (!newItem.label || !newItem.url) return
    setItems(prev => [...prev, { ...newItem, id: uid(), children: [] }])
    setNewItem({ label:'', url:'', type:'url' })
    setAdding(false)
  }

  const removeItem = id => setItems(prev => prev.filter(i => i.id !== id))

  const moveItem = (id, dir) => {
    setItems(prev => {
      const idx  = prev.findIndex(i => i.id === id)
      const next = [...prev]
      const swap = dir === 'up' ? idx - 1 : idx + 1
      if (swap < 0 || swap >= next.length) return prev
      ;[next[idx], next[swap]] = [next[swap], next[idx]]
      return next
    })
  }

  const TYPE_COLOR = {
    url: '#6B7280', page: '#1D4ED8', collection: '#059669',
    blog: '#7C3AED', product: '#D97706',
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{menu ? 'Edit Menu' : 'Create Menu'}</h2>
            <p className={styles.mSub}>Build navigation menus for your online store</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Menu Name <span className={styles.req}>*</span></label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Main Menu" />
            </div>
            <div className={styles.fg}>
              <label>Handle</label>
              <div className={styles.handleBox}>{handle || 'menu-handle'}</div>
              <span className={styles.fieldHint}>Used in theme templates</span>
            </div>
          </div>

          <div className={styles.fg}>
            <label>Menu Items</label>
            <div className={styles.menuItemsList}>
              {items.length === 0 && (
                <div className={styles.menuEmpty}>No items yet — add one below</div>
              )}
              {items.map((item, idx) => (
                <div key={item.id} className={styles.menuItem}>
                  <div className={styles.menuItemLeft}>
                    <span className={styles.menuItemType}
                      style={{ background: TYPE_COLOR[item.type] + '18', color: TYPE_COLOR[item.type] }}>
                      {item.type}
                    </span>
                    <div>
                      <div className={styles.menuItemLabel}>{item.label}</div>
                      <div className={styles.menuItemUrl}>{item.url}</div>
                    </div>
                    {item.children?.length > 0 && (
                      <span className={styles.childCount}>{item.children.length} sub-items</span>
                    )}
                  </div>
                  <div className={styles.menuItemActions}>
                    <button className={styles.iconBtnSm} onClick={() => moveItem(item.id, 'up')} disabled={idx === 0}>↑</button>
                    <button className={styles.iconBtnSm} onClick={() => moveItem(item.id, 'down')} disabled={idx === items.length - 1}>↓</button>
                    <button className={styles.iconBtnRed} onClick={() => removeItem(item.id)}>
                      <Ic d="M18 6L6 18M6 6l12 12" size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {adding ? (
              <div className={styles.addItemForm}>
                <div className={styles.fRow}>
                  <div className={styles.fg}>
                    <label>Label</label>
                    <input value={newItem.label}
                      onChange={e => setNewItem(p => ({ ...p, label: e.target.value }))}
                      placeholder="Link text" autoFocus />
                  </div>
                  <div className={styles.fg}>
                    <label>Type</label>
                    <select value={newItem.type}
                      onChange={e => setNewItem(p => ({ ...p, type: e.target.value }))}>
                      {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className={styles.fg}>
                  <label>URL / Handle</label>
                  <input value={newItem.url}
                    onChange={e => setNewItem(p => ({ ...p, url: e.target.value }))}
                    placeholder="/collections/all" />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button className={styles.btnPrimary} onClick={addItem}
                    disabled={!newItem.label || !newItem.url}>
                    Add Item
                  </button>
                  <button className={styles.btnGhost} onClick={() => setAdding(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className={styles.addItemBtn} onClick={() => setAdding(true)}>
                <Ic d="M12 5v14M5 12h14" size={13} /> Add Menu Item
              </button>
            )}
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={!name.trim()}
            onClick={() => { onSave({ name, handle, items }); onClose() }}>
            Save Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default MenuModal
