import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/Icon/Icon';
import SearchWithSuggestions from './SearchWithSuggestions';
import s from '../Collections.module.css';

export default function TabBar({
  activeTab,
  onTabChange,
  collections,
  totalCollections,
  search,
  onSearchChange,
  onSortChange,
  sortBy,
  onStatusFilterChange,
  statusFilter,
  onSelectCollection,
  onSelectProduct,
}) {
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setShowSearchDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={s.tabBar}>
      <div className={s.tabs}>
        <button
          className={`${s.tab} ${activeTab === 'collections' ? s.tabOn : ''}`}
          onClick={() => onTabChange('collections')}
        >
          Collections
          <span className={`${s.tabBadge} ${activeTab === 'collections' ? s.tabBadgeOn : ''}`}>
            {totalCollections}
          </span>
        </button>
        <button
          className={`${s.tab} ${activeTab === 'locations' ? s.tabOn : ''}`}
          onClick={() => onTabChange('locations')}
        >
          Locations Overview
        </button>
      </div>

      <div className={s.tabActions}>
        {activeTab === 'collections' && (
          <select className={s.filterSel} value={sortBy} onChange={e => onSortChange(e.target.value)}>
            <option value="name">Sort: Name</option>
            <option value="products">Sort: Products</option>
            <option value="stock">Sort: Stock</option>
          </select>
        )}
        <select className={s.filterSel} value={statusFilter} onChange={e => onStatusFilterChange(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
        <SearchWithSuggestions
          value={search}
          onChange={onSearchChange}
          collections={collections}
          onSelectCollection={onSelectCollection}
          onSelectProduct={onSelectProduct}
        />
      </div>
    </div>
  );
}