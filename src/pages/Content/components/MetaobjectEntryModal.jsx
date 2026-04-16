/* ─────────────────────────────────────────────────────────
   Path: src/pages/Content/components/MetaobjectEntryModal.jsx
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

/**
 * Props:
 *  definition — metaobject definition (has .fields[])
 *  entry      — existing entry (null = create)
 *  onClose    — () => void
 *  onSave     — (data) => void
 */
const MetaobjectEntryModal = ({ definition, entry, onClose, onSave }) => {
  const [values, setValues] = useState(() => {
    const init = {}
    definition.fields.forEach(f => { init[f.key] = entry?.[f.key] || '' })
    return init
  })

  const set = (key, val) => setValues(v => ({ ...v, [key]: val }))

  const valid = definition.fields
    .filter(f => f.required)
    .every(f => values[f.key]?.toString().trim())

  const renderField = (field) => {
    const val = values[field.key]
    if (field.type === 'multi_line_text') {
      return (
        <textarea rows={3} value={val} onChange={e => set(field.key, e.target.value)}
          placeholder={`Enter ${field.key.replace(/_/g,' ')}…`} />
      )
    }
    if (field.type === 'boolean') {
      return (
        <label className={styles.toggleRow}>
          <span>{field.key.replace(/_/g,' ')}</span>
          <div className={`${styles.toggle} ${val ? styles.toggleOn : ''}`}
            onClick={() => set(field.key, !val)}>
            <div className={styles.toggleThumb} />
          </div>
        </label>
      )
    }
    if (field.type === 'file_reference') {
      return (
        <div className={styles.fileRefBox}>
          <Ic d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" size={18} stroke="#9CA3AF" />
          <span>Click to upload file</span>
        </div>
      )
    }
    return (
      <input
        type={field.type === 'url' ? 'url' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
        value={val}
        onChange={e => set(field.key, e.target.value)}
        placeholder={`Enter ${field.key.replace(/_/g,' ')}…`}
      />
    )
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{entry ? 'Edit Entry' : 'New Entry'}</h2>
            <p className={styles.mSub}>{definition.name} · {definition.apiHandle}</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          {definition.fields.map(field => (
            <div key={field.key} className={styles.fg}>
              <label>
                {field.key.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}
                {field.required && <span className={styles.req}> *</span>}
                <span className={styles.fieldTypeTag}>{FIELD_TYPE_LABELS[field.type] || field.type}</span>
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <button className={styles.btnPrimary} disabled={!valid}
            onClick={() => { onSave(values); onClose() }}>
            {entry ? 'Save Changes' : 'Create Entry'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MetaobjectEntryModal
