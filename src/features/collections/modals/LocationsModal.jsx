import { useState } from 'react';
import s from '../Collections.module.css';
import { LOCATIONS, LOCATION_TYPE_CFG } from '@/data/collections';
import Icon from '@/components/ui/Icon/Icon';

const initials = name => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
const LocAvatar = ({ name, active }) => (
  <div className={s.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
);

export default function LocationsModal({ onClose }) {
  const [locations, setLocations] = useState(LOCATIONS);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newType, setNewType] = useState('retail');

  const toggle = id =>
    setLocations(ls => ls.map(l => l.id === id ? { ...l, active: !l.active } : l));

  const addLocation = () => {
    if (!newName || !newCity) return;
    setLocations(ls => [...ls, {
      id: `loc-${Date.now()}`,
      name: newName,
      city: newCity,
      type: newType,
      active: true,
    }]);
    setAdding(false);
    setNewName('');
    setNewCity('');
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal} style={{ maxWidth: 520 }}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>Manage Locations</h2>
            <p className={s.mSub}>Control which locations carry inventory</p>
          </div>
          <button className={s.mClose} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>

        <div className={s.mBody}>
          {locations.map(loc => (
            <div key={loc.id} className={s.locManageRow}>
              <LocAvatar name={loc.name} active={loc.active} />
              <div className={s.locManageInfo}>
                <div className={s.locManageName}>{loc.name}</div>
                <div className={s.locManageCity}>
                  {loc.city} · <span style={{ marginLeft: 4, color: LOCATION_TYPE_CFG[loc.type]?.color }}>
                    {LOCATION_TYPE_CFG[loc.type]?.label}
                  </span>
                </div>
              </div>
              <div className={`${s.toggle} ${loc.active ? s.toggleOn : ''}`} onClick={() => toggle(loc.id)}>
                <div className={s.toggleThumb} />
              </div>
            </div>
          ))}

          {adding && (
            <div className={s.addLocForm}>
              <div className={s.fRow}>
                <div className={s.fg}>
                  <label>Location Name</label>
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. New Branch" />
                </div>
                <div className={s.fg}>
                  <label>City</label>
                  <input value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="e.g. Ibadan" />
                </div>
              </div>
              <div className={s.fg}>
                <label>Type</label>
                <select value={newType} onChange={e => setNewType(e.target.value)}>
                  <option value="retail">Retail Store</option>
                  <option value="pos">POS Terminal</option>
                  <option value="warehouse">Warehouse</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:8, marginTop:4 }}>
                <button className={s.btnPrimary} disabled={!newName || !newCity} onClick={addLocation}>Add Location</button>
                <button className={s.btnGhost} onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          )}

          {!adding && (
            <button className={s.addLocBtn} onClick={() => setAdding(true)}>
              <Icon name="plus" size={14} /> Add New Location
            </button>
          )}
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Close</button>
          <button className={s.btnPrimary} onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}