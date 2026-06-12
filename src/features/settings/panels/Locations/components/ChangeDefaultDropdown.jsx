import { useEffect, useRef, useState } from 'react'
import Icon from '../../../components/Icon'
import { ICONS } from '../../../constants/icons'
import { fullAddress } from '../utils'
import styles from '../Locations.module.css'

/**
 * "Change default" dropdown — opens a menu of active non-default locations.
 * Closes on outside click or Escape.
 */
export default function ChangeDefaultDropdown({ locations, onSelect, loading }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.changeWrap} ref={ref}>
      <button
        type="button"
        className={styles.changeBtn}
        onClick={() => setOpen(o => !o)}
        disabled={loading}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {loading ? 'Updating…' : 'Change'}
        <Icon
          d={ICONS.chevDown}
          size={12}
          style={{
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </button>
      {open && (
        <div className={styles.changeDropdown} role="listbox">
          {locations.length === 0 ? (
            <div className={styles.changeDdEmpty}>No other active locations</div>
          ) : (
            locations.map(loc => (
              <button
                key={loc.id}
                type="button"
                role="option"
                className={styles.changeDdItem}
                onClick={() => { onSelect(loc.id); setOpen(false) }}
              >
                <Icon d={ICONS.pin} size={13} stroke="#6B7280" />
                <div>
                  <div className={styles.changeDdName}>{loc.name}</div>
                  <div className={styles.changeDdAddr}>{fullAddress(loc)}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}