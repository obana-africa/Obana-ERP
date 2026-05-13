import Icon from '@/components/ui/Icon/Icon';
import s from '../Transfers.module.css';

export default function EmptyState({ 
  search, 
  hasFilters, 
  onClear, 
  onCreate 
}) {
  return (
    <div className={s.emptyState}>
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
        <rect x="10" y="20" width="52" height="38" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5"/>
        <path d="M22 39h28M36 27v24" stroke="#2DBD97" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="54" cy="54" r="12" fill="#2DBD97"/>
        <path d="M49 54h10M54 49v10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <h3>No transfers found</h3>
      <p>
        {search 
          ? `No results for "${search}"` 
          : 'Create your first transfer to move stock between locations'
        }
      </p>
      {hasFilters && !search && (
        <button className={s.btnOutline} onClick={onClear}>
          Clear filters
        </button>
      )}
      {!search && !hasFilters && (
        <button className={s.btnPrimary} onClick={onCreate}>
          <Icon name="plus" size={13} stroke="#fff" /> Create Transfer
        </button>
      )}
    </div>
  );
}