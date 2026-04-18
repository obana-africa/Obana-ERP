
import { useState, useRef } from 'react'
import s from '../Products.module.css'
import { IMPORT_PLATFORMS } from '../../../data/products'

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
 */
const ImportModal = ({ onClose }) => {
  const [selected, setSelected] = useState(null)
  const [file,     setFile]     = useState(null)
  const fileRef = useRef()

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHead}>
          <span className={s.modalTitle}>Import Products</span>
          <button className={s.modalClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={s.modalBody}>
          <p className={s.importHint}>Choose a platform to import your products from</p>
          <div className={s.platformGrid}>
            {IMPORT_PLATFORMS.map(p => (
              <button key={p.name}
                className={`${s.platformCard} ${selected===p.name?s.platformActive:''}`}
                onClick={() => setSelected(p.name)}>
                <span className={s.platformEmoji}>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {selected === 'CSV File' && (
            <div className={s.csvZone} onClick={() => fileRef.current.click()}>
              <Ic d={['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M17 8l-5-5-5 5','M12 3v12']} size={24} stroke="#9CA3AF" />
              <p>{file ? file.name : 'Click to upload CSV file'}</p>
              <input ref={fileRef} type="file" accept=".csv" hidden
                onChange={e => setFile(e.target.files[0])} />
            </div>
          )}

          {selected && selected !== 'CSV File' && (
            <div className={s.importInfo}>
              <Ic d={['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','M12 8h.01','M12 12v4']} size={15} />
              You'll be redirected to connect your {selected} account and select products to import.
            </div>
          )}
        </div>

        <div className={s.modalFooter}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} disabled={!selected}>
            {selected === 'CSV File' ? 'Upload & Import' : `Connect ${selected || '…'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImportModal
