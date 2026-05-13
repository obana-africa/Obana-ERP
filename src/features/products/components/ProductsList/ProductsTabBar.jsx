import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/Icon/Icon';
import s from './ProductsList.module.css';

export default function ProductsTabBar({
  totalProducts,
  inStockCount,
  outOfStockCount,
  lowStockCount,
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
  searchResults = [],
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onAddProduct,
  onImport,
}) {
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const searchWrapRef = useRef(null);
  const navigate = useNavigate();

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSearchDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const tabFilters = [
    { key: 'all', label: `All (${totalProducts})` },
    { key: 'in',  label: `In Stock (${inStockCount})` },
    { key: 'out', label: `Out of Stock (${outOfStockCount})` },
    { key: 'low', label: `Low Stock (${lowStockCount})` },
  ];

  return (
    <div className={s.tabBar}>
      <div className={s.tabsLeft}>
        <div className={s.tabs}>
          {tabFilters.map((f) => (
            <button
              key={f.key}
              className={`${s.tab} ${statusFilter === f.key ? s.tabActive : ''}`}
              onClick={() => onStatusFilterChange(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className={s.tabActions}>
        {/* Search */}
        <div className={s.searchWrap} ref={searchWrapRef}>
          <Icon name="search" size={13} stroke="#9CA3AF" />
          <input
            className={s.searchInput}
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setShowSearchDrop(true);
            }}
            onFocus={() => setShowSearchDrop(true)}
          />
          {search && (
            <button className={s.searchClear} onClick={() => onSearchChange('')}>
              <Icon name="close" size={12} stroke="#9CA3AF" />
            </button>
          )}
          {showSearchDrop && (
            <div className={s.searchDrop}>
              {searchResults.length === 0 ? (
                <div className={s.searchDropEmpty}>No products found</div>
              ) : (
                searchResults.slice(0, 6).map((p) => (
                  <div
                    key={p.id}
                    className={s.searchDropItem}
                    onMouseDown={() => {
                      onSearchChange(p.name);
                      setShowSearchDrop(false);
                    }}
                  >
                    <div className={s.searchDropThumb}>
                      {p.img ? <img src={p.img} alt={p.name} /> : p.name[0]}
                    </div>
                    <div className={s.searchDropInfo}>
                      <div className={s.searchDropName}>{p.name}</div>
                      <div className={s.searchDropMeta}>
                        {p.category} · {p.price != null ? `₦${p.price.toLocaleString()}` : ''}
                      </div>
                    </div>
                    <span
                      className={s.searchDropStock}
                      style={{ color: p.stock === 0 ? '#EF4444' : '#059669' }}
                    >
                      {p.stock === 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Sort */}
        <select
          className={s.sortSel}
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
        >
          <option value="name">Name A–Z</option>
          <option value="price">Price ↓</option>
          <option value="stock">Stock ↓</option>
          <option value="sold">Best Sellers</option>
        </select>

        {/* View toggle */}
        <div className={s.viewToggle}>
          <button
            className={`${s.viewBtn} ${viewMode === 'table' ? s.viewBtnOn : ''}`}
            onClick={() => onViewModeChange('table')}
            title="Table view"
          >
            <Icon name="list" size={13} />
          </button>
          <button
            className={`${s.viewBtn} ${viewMode === 'grid' ? s.viewBtnOn : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Grid view"
          >
            <Icon name="grid" size={13} />
          </button>
        </div>

        <button className={s.btnOutline} onClick={onImport}>
          <Icon name="import" size={13} /> Import
        </button>
        <button className={s.btnPrimary} onClick={onAddProduct}>
          <Icon name="plus" size={13} stroke="#fff" /> Add Product
        </button>
      </div>
    </div>
  );
}