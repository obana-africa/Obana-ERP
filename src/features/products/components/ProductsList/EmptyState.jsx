import Icon from '@/components/ui/Icon/Icon';
import s from './ProductsList.module.css';

export default function EmptyState({ type = 'empty', onAdd, onImport, searchTerm = '', onReset }) {
  if (type === 'no-results') {
    return (
      <div className={s.emptyState}>
        <span style={{ fontSize: 40 }}>🔍</span>
        <p style={{ color: '#6B7280', marginTop: 8 }}>
          No products match{searchTerm ? ` "${searchTerm}"` : ' this filter'}
        </p>
        {onReset && (
          <button className={s.btnOutline} style={{ marginTop: 12 }} onClick={onReset}>
            Reset filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={s.emptyState}>
      <div className={s.emptyIllo}>
        <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
          <rect x="10" y="22" width="70" height="52" rx="7" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
          <rect x="19" y="33" width="24" height="24" rx="4" fill="#A7F3D0" />
          <path d="M27 45h8M31 41v8" stroke="#2DBD97" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="50" y="33" width="22" height="5" rx="2.5" fill="#A7F3D0" />
          <rect x="50" y="42" width="16" height="4" rx="2" fill="#D1FAE5" />
          <rect x="50" y="50" width="20" height="4" rx="2" fill="#D1FAE5" />
        </svg>
      </div>
      <h3>Add your first product</h3>
      <p>Choose how you want to add products to your store</p>
      <div className={s.emptyActions}>
        <button className={s.btnOutline} onClick={onImport}>
          <Icon name="import" size={14} /> Import Products
        </button>
        <button className={s.btnPrimary} onClick={onAdd}>
          <Icon name="plus" size={14} stroke="#fff" /> Add New Product
        </button>
      </div>
    </div>
  );
}