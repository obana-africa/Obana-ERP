import { fmt } from '@/utils/formatters';
import Icon from '@/components/ui/Icon/Icon';
import s from '../Inventory.module.css';

const STATUS_CFG = {
  in_stock:    { label: 'In Stock',    bg: '#ECFDF5', color: '#059669' },
  low_stock:   { label: 'Low Stock',   bg: '#FFFBEB', color: '#D97706' },
  out_of_stock:{ label: 'Out of Stock',bg: '#FEF2F2', color: '#DC2626' },
};

export default function InventoryTable({ items, onEdit, onDelete }) {
  return (
    <div className={s.table}>
      <div className={s.tHead}>
        <span>Item</span>
        <span>SKU</span>
        <span>Barcode</span>
        <span>Price</span>
        <span>Cost</span>
        <span>Stock</span>
        <span>Reorder Pt</span>
        <span>Supplier</span>
        <span>Status</span>
        <span></span>
      </div>

      {items.map(item => (
        <div
          key={item.id}
          className={`${s.tRow} ${
            item.stock === 0 ? s.tRowDanger : item.stock <= item.reorderPoint ? s.tRowWarn : ''
          }`}
        >
          <span className={s.itemCell}>
            <div className={s.itemThumb}>{item.name[0]}</div>
            <div>
              <div className={s.itemName}>
                {item.name}
                {item.isKit && <span className={s.kitBadge}>Kit</span>}
              </div>
              <div className={s.itemTags}>
                {item.tags?.slice(0, 2).map(t => (
                  <span key={t} className={s.tag}>{t}</span>
                ))}
              </div>
            </div>
          </span>

          <span className={s.mono}>{item.sku}</span>
          <span className={s.mono} style={{ fontSize: 11 }}>{item.barcode || '—'}</span>
          <span>{fmt(item.price)}</span>
          <span style={{ color: 'var(--ink3)' }}>{fmt(item.costPrice)}</span>

          <span>
            <div className={s.stockCell}>
              <span
                className={s.stockNum}
                style={{
                  color:
                    item.stock === 0 ? '#DC2626' :
                    item.stock <= item.reorderPoint ? '#D97706' : '#059669',
                }}
              >
                {item.stock}
              </span>
              <div className={s.stockBar}>
                <div
                  className={s.stockBarFill}
                  style={{
                    width: `${Math.min(100, (item.stock / (item.reorderPoint * 3 || 1)) * 100)}%`,
                    background:
                      item.stock === 0 ? '#EF4444' :
                      item.stock <= item.reorderPoint ? '#F59E0B' : '#2DBD97',
                  }}
                />
              </div>
            </div>
          </span>

          <span style={{ fontSize: 12, color: 'var(--ink3)' }}>
            {item.reorderPoint} / {item.safetyStock}
          </span>
          <span style={{ fontSize: 12 }}>{item.supplier || '—'}</span>

          <span>
            <span
              style={{
                background: STATUS_CFG[item.status]?.bg,
                color: STATUS_CFG[item.status]?.color,
                padding: '3px 10px',
                borderRadius: 20,
                fontSize: '11.5px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              {STATUS_CFG[item.status]?.label}
            </span>
          </span>

          <span className={s.actCell}>
            <button className={s.iconBtn} onClick={() => onEdit(item)}>
              <Icon name="edit" size={13} />
            </button>
            <button className={s.iconBtnRed} onClick={() => onDelete(item.id)}>
              <Icon name="trash" size={13} />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}