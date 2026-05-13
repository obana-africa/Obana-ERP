import Icon from '@/components/ui/Icon/Icon';
import s from '../Collections.module.css';

export default function EmptyState({ search, onClearSearch, onCreate }) {
  return (
    <div className={s.emptyState}>
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="14" y="22" width="52" height="42" rx="5" fill="#E6F7F2" stroke="#2DBD97" strokeWidth="1.5" />
        <rect x="22" y="14" width="36" height="42" rx="4" fill="#fff" stroke="#2DBD97" strokeWidth="1.5" />
        <circle cx="58" cy="58" r="14" fill="#2DBD97" />
        <line x1="58" y1="51" x2="58" y2="65" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="51" y1="58" x2="65" y2="58" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <h3>No collections found</h3>
      <p>{search ? `No results for "${search}"` : 'Create your first collection to organise products by theme or season'}</p>
      {search ? (
        <button className={s.btnOutline} onClick={onClearSearch}>Clear search</button>
      ) : (
        <button className={s.btnPrimary} onClick={onCreate}>
          <Icon name="plus" size={14} stroke="#fff" /> Create Collection
        </button>
      )}
    </div>
  );
}