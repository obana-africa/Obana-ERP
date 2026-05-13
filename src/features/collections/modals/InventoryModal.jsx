import { useState } from 'react';
import s from '../Collections.module.css';
import { fmt } from '@/utils/formatters';
import { LOCATIONS, LOCATION_TYPE_CFG, ALL_PRODUCTS } from '@/data/collections';
import Icon from '@/components/ui/Icon/Icon';

// Keep these local or move to a shared location later
const initials = name => name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
const Pill = ({ label, bg, color, size = 'sm' }) => (
  <span className={`${s.pill} ${size === 'xs' ? s.pillXs : ''}`} style={{ background: bg, color }}>
    {label}
  </span>
);
const LocAvatar = ({ name, active }) => (
  <div className={s.locAvatar} style={{ opacity: active ? 1 : 0.5 }}>
    {initials(name)}
  </div>
);

export default function InventoryModal({ collection, onClose, onSave }) {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0].id);
  const [inventory, setInventory] = useState(
    JSON.parse(JSON.stringify(collection.locationInventory))
  );

  const products = ALL_PRODUCTS.filter(p => collection.productIds.includes(p.id));
  const loc = LOCATIONS.find(l => l.id === activeLocation);
  const locTypeCfg = LOCATION_TYPE_CFG[loc.type];

  const updateQty = (productId, qty) => {
    setInventory(prev => ({
      ...prev,
      [activeLocation]: {
        ...(prev[activeLocation] || {}),
        [productId]: Math.max(0, Number(qty) || 0),
      },
    }));
  };

  const getQty = productId => inventory[activeLocation]?.[productId] ?? 0;
  const totalForLocation = products.reduce((a, p) => a + getQty(p.id), 0);
  const totalAcrossAll = LOCATIONS.reduce((a, loc) =>
    a + products.reduce((b, p) => b + (inventory[loc.id]?.[p.id] || 0), 0), 0
  );

  const copyFrom = fromLocId => {
    setInventory(prev => ({
      ...prev,
      [activeLocation]: { ...(prev[fromLocId] || {}) },
    }));
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modalLg}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>Inventory by Location</h2>
            <p className={s.mSub}>{collection.name} · {products.length} products across {LOCATIONS.filter(l => l.active).length} active locations</p>
          </div>
          <button className={s.mClose} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>

        <div className={s.invLayout}>
          <div className={s.locList}>
            <div className={s.locListHead}>Locations</div>
            {LOCATIONS.map(loc => {
              const locTotal = products.reduce((a, p) => a + (inventory[loc.id]?.[p.id] || 0), 0);
              const isActive = activeLocation === loc.id;
              return (
                <button
                  key={loc.id}
                  className={`${s.locItem} ${isActive ? s.locItemOn : ''} ${!loc.active ? s.locItemInactive : ''}`}
                  onClick={() => setActiveLocation(loc.id)}
                >
                  <LocAvatar name={loc.name} active={loc.active} />
                  <div className={s.locItemInfo}>
                    <div className={s.locItemName}>{loc.name}</div>
                    <div className={s.locItemCity}>{loc.city}</div>
                  </div>
                  <div className={s.locItemRight}>
                    <span className={s.locItemQty}>{locTotal}</span>
                    {!loc.active && <span className={s.locInactiveTag}>Inactive</span>}
                  </div>
                </button>
              );
            })}
            <div className={s.locTotalRow}>
              <span>All locations</span>
              <span className={s.locTotalVal}>{totalAcrossAll}</span>
            </div>
          </div>

          <div className={s.invTable}>
            <div className={s.invTableHead}>
              <div className={s.invLocBadge}>
                <LocAvatar name={loc.name} active={loc.active} />
                <div>
                  <div className={s.invLocName}>{loc.name} — {loc.city}</div>
                  <Pill {...locTypeCfg} size="xs" />
                </div>
                {!loc.active && <span className={s.invInactiveNote}>This location is inactive</span>}
              </div>
              <div className={s.copyFromWrap}>
                <span className={s.copyFromLabel}>Copy from:</span>
                {LOCATIONS.filter(l => l.id !== activeLocation && l.active).map(l => (
                  <button key={l.id} className={s.copyFromBtn} onClick={() => copyFrom(l.id)}>
                    {l.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div className={s.invColHead}>
              <span>Product</span><span>SKU</span><span>Price</span><span>On Hand</span><span>Status</span>
            </div>

            {products.map(p => {
              const qty = getQty(p.id);
              return (
                <div key={p.id} className={s.invRow}>
                  <span className={s.invProdCell}>
                    <div className={s.invProdThumb}>{p.name[0]}</div>
                    <div>
                      <div className={s.invProdName}>{p.name}</div>
                      <div className={s.invProdCat}>{p.category}</div>
                    </div>
                  </span>
                  <span className={s.invSku}>{p.sku}</span>
                  <span className={s.invPrice}>{fmt(p.price)}</span>
                  <span className={s.invQtyCell}>
                    <button className={s.qtyBtn} onClick={() => updateQty(p.id, qty - 1)}>−</button>
                    <input type="number" min={0} value={qty} onChange={e => updateQty(p.id, e.target.value)} className={s.qtyInput} />
                    <button className={s.qtyBtn} onClick={() => updateQty(p.id, qty + 1)}>+</button>
                  </span>
                  <span>
                    <span className={s.invStatus} style={{
                      background: qty === 0 ? '#FEF2F2' : qty <= 5 ? '#FFFBEB' : '#ECFDF5',
                      color: qty === 0 ? '#DC2626' : qty <= 5 ? '#D97706' : '#059669',
                    }}>
                      {qty === 0 ? 'Out of stock' : qty <= 5 ? 'Low stock' : 'In stock'}
                    </span>
                  </span>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className={s.invEmpty}>
                <p>No products in this collection yet.</p>
                <span>Edit the collection to add products first.</span>
              </div>
            )}

            <div className={s.invFootTotal}>
              <span>Total at {loc.name}</span>
              <strong>{totalForLocation} units</strong>
            </div>
          </div>
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <button className={s.btnPrimary} onClick={() => { onSave(inventory); onClose(); }}>Save Inventory</button>
        </div>
      </div>
    </div>
  );
}