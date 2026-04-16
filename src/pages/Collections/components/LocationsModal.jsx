import { useState } from 'react'
import styles from '../Collections.module.css'
import { LOCATIONS, LOCATION_TYPE_CFG } from '../../../data/collections'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()

const LocAvatar = ({ name, active }) => (
  <div className={styles.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
)

/**
 * Props:
 *  onClose — () => void
 */
const LocationsModal = ({ onClose }) => {
  const [locations, setLocations] = useState(LOCATIONS)
  const [adding,    setAdding]    = useState(false)
  const [newName,   setNewName]   = useState('')
  const [newCity,   setNewCity]   = useState('')
  const [newType,   setNewType]   = useState('retail')

  const toggle = id =>
    setLocations(ls => ls.map(l => l.id === id ? { ...l, active: !l.active } : l))

  const addLocation = () => {
    if (!newName || !newCity) return
    setLocations(ls => [
      ...ls,
      {
        id:     `loc-${Date.now()}`,
        name:   newName,
        city:   newCity,
        type:   newType,
        active: true,
      },
    ])
    setAdding(false)
    setNewName('')
    setNewCity('')
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: 520 }}>

        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>Manage Locations</h2>
            <p className={styles.mSub}>Control which locations carry inventory</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>
          {locations.map(loc => (
            <div key={loc.id} className={styles.locManageRow}>
              <LocAvatar name={loc.name} active={loc.active} />
              <div className={styles.locManageInfo}>
                <div className={styles.locManageName}>{loc.name}</div>
                <div className={styles.locManageCity}>
                  {loc.city} ·{' '}
                  <span style={{ marginLeft: 4, color: LOCATION_TYPE_CFG[loc.type]?.color }}>
                    {LOCATION_TYPE_CFG[loc.type]?.label}
                  </span>
                </div>
              </div>
              <div
                className={`${styles.toggle} ${loc.active ? styles.toggleOn : ''}`}
                onClick={() => toggle(loc.id)}
              >
                <div className={styles.toggleThumb} />
              </div>
            </div>
          ))}

          {adding && (
            <div className={styles.addLocForm}>
              <div className={styles.fRow}>
                <div className={styles.fg}>
                  <label>Location Name</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)}
                    placeholder="e.g. New Branch" />
                </div>
                <div className={styles.fg}>
                  <label>City</label>
                  <input value={newCity} onChange={e => setNewCity(e.target.value)}
                    placeholder="e.g. Ibadan" />
                </div>
              </div>
              <div className={styles.fg}>
                <label>Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)}>
                  <option value="retail">Retail Store</option>
                  <option value="pos">POS Terminal</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:4 }}>
                <button className={styles.btnPrimary} disabled={!newName || !newCity} onClick={addLocation}>
                  Add Location
                </button>
                <button className={styles.btnGhost} onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          )}

          {!adding && (
            <button className={styles.addLocBtn} onClick={() => setAdding(true)}>
              <Ic d="M12 5v14M5 12h14" size={14} /> Add New Location
            </button>
          )}
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Close</button>
          <button className={styles.btnPrimary} onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default LocationsModal
