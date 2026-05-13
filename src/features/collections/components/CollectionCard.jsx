import { useState } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import { LOCATIONS } from '@/data/collections';
import { ALL_PRODUCTS } from '@/data/collections';
import s from '../Collections.module.css';

export default function CollectionCard({ collection, onEdit, onDelete, onManageInventory, onViewProducts, style }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const totalStock = Object.values(collection.locationInventory)
    .reduce((a, loc) => a + Object.values(loc).reduce((b, v) => b + v, 0), 0);

  const lowStockCount = (() => {
    let count = 0;
    ALL_PRODUCTS.filter(p => collection.productIds.includes(p.id)).forEach(p => {
      LOCATIONS.filter(l => l.active).forEach(l => {
        const q = collection.locationInventory[l.id]?.[p.id] ?? 0;
        if (q > 0 && q <= 5) count++;
      });
    });
    return count;
  })();

  return (
    <div className={s.collCard} style={style}>
      <div className={s.collImgWrap}>
        {collection.img ? (
          <img src={collection.img} alt={collection.name} className={s.collImg} />
        ) : (
          <div className={s.collImgPh}>
            <Icon name="collections" size={28} stroke="#9CA3AF" />
          </div>
        )}
        <span className={s.collStatusBadge} style={{
          background: collection.status === 'active' ? '#ECFDF5' : '#F3F4F6',
          color: collection.status === 'active' ? '#059669' : '#6B7280',
        }}>
          {collection.status}
        </span>
        {lowStockCount > 0 && (
          <span className={s.collLowBadge}>
            <Icon name="warning" size={11} stroke="#D97706" />
            {lowStockCount} low
          </span>
        )}
      </div>

      <div className={s.collInfo}>
        <div className={s.collName}>{collection.name}</div>
        {collection.desc && <div className={s.collDesc}>{collection.desc}</div>}
        <div className={s.collMeta}>
          <span className={s.collMetaItem}>
            <Icon name="product" size={12} />
            {collection.productIds.length} products
          </span>
          <span className={s.collMetaItem}>
            <Icon name="box" size={12} />
            {totalStock} units
          </span>
        </div>
        <div className={s.locStockRow}>
          {LOCATIONS.filter(l => l.active).slice(0, 4).map(loc => {
            const locStock = Object.values(collection.locationInventory[loc.id] || {}).reduce((a, b) => a + b, 0);
            return (
              <div key={loc.id} className={s.locStockItem} title={`${loc.name}: ${locStock} units`}>
                <div className={s.locStockDot} style={{ background: locStock > 0 ? '#2DBD97' : '#E5E7EB' }} />
                <span className={s.locStockName}>{loc.name.split(' ')[0]}</span>
                <span className={s.locStockQty}>{locStock}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={s.collActions}>
        {confirmDelete ? (
          <>
            <span className={s.confirmTxt}>Delete?</span>
            <button className={s.actBtnRed} onClick={() => onDelete(collection.id)}>Yes</button>
            <button className={s.actBtn} onClick={() => setConfirmDelete(false)}>No</button>
          </>
        ) : (
          <>
            <button className={s.actBtnPrimary} onClick={() => onManageInventory(collection)}>
              <Icon name="box" size={12} /> Inventory
            </button>
            <button className={s.actBtn} onClick={() => onViewProducts(collection)}>
              <Icon name="product" size={12} /> Products
            </button>
            <button className={s.actBtn} onClick={() => onEdit(collection)}>
              <Icon name="edit" size={12} />
            </button>
            <button className={s.actBtnRed} onClick={() => setConfirmDelete(true)}>
              <Icon name="trash" size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}