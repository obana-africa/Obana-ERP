/* ─────────────────────────────────────────────────────────
   Path: src/pages/Content/components/MetaDefModal.jsx
───────────────────────────────────────────────────────── */
import { useState } from 'react'
import styles from '../Content.module.css'
import { FIELD_TYPE_LABELS } from '../../../data/content'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const uid = () => `field-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

/**
 * Props:
 *  onClose — () => void
 *  onSave  — (data) => void
 */
const MetaDefModal = ({ onClose, onSave }) => {
  const [name,      setName]      = useState('')
  const [apiHandle, setApiHandle] = useState('')
  const [fields,    setFields]    = useState([
    { id: uid(), key: '', type: 'single_line_text', required: false },
  ])

  const setField = (id, k, v) =>
    setFields(prev => prev.map(f => f.id === id ? { ...f, [k]: v } : f))

  const addField = () =>
    setFields(prev => [...prev, { id: uid(), key: '', type: 'single_line_text', required: false }])

  const removeField = id =>
    setFields(prev => prev.filter(f => f.id !== id))

  const autoHandle = (n) => {
    setName(n)
    if (!apiHandle)
      setApiHandle(n.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,''))
  }

  const valid = name.trim() && fields.every(f => f.key.trim())

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>New Metaobject Definition</h2>
            <p className={styles.mSub}>Define a reusable structured content type</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          <div className={styles.fRow}>
            <div className={styles.fg}>
              <label>Definition Name <span className={styles.req}>*</span></label>
              <input value={name} onChange={e => autoHandle(e.target.value)}
                placeholder="e.g. Team Members" />
            </div>
            <div className={styles.fg}>
              <label>API Handle <span className={styles.req}>*</span></label>
              <input value={apiHandle} onChange={e => setApiHandle(e.target.value)}
                placeholder="team_member" />
              <span className={styles.fieldHint}>Used in Liquid templates: {'{{metaobjects.team_member}}'}</span>
            </div>
          </div>

          <div className={styles.fg}>
            <label>Fields</label>
            <div className={styles.fieldsList}>
              {fields.map((f, i) => (
                <div key={f.id} className={styles.fieldRow}>
                  <input className={styles.fieldKeyInput}
                    value={f.key} onChange={e => setField(f.id, 'key', e.target.value)}
                    placeholder={`field_${i + 1}`} />
                  <select className={styles.fieldTypeSelect}
                    value={f.type} onChange={e => setField(f.id, 'type', e.target.value)}>
                    {Object.entries(FIELD_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                  <label className={styles.fieldReqToggle}>
                    <input type="checkbox" checked={f.required}
                      onChange={e => setField(f.id, 'required', e.target.checked)} />
                    <span>Required</span>
                  </label>
                  <button className={styles.iconBtnRed}
                    onClick={() => removeField(f.id)} disabled={fields.length === 1}>
                    <Ic d="M18 6L6 18M6 6l12 12" size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button className={styles.addFieldBtn} onClick={addField}>
              <Ic d="M12 5v14M5 12h14" size={12} /> Add Field
            </button>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={!valid}
            onClick={() => {
              onSave({ name, apiHandle, fields: fields.map(({ id, ...f }) => f), entries: [] })
              onClose()
            }}>
            Create Definition
          </button>
        </div>
      </div>
    </div>
  )
}

export default MetaDefModal
