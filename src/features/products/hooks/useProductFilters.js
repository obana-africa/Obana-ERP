import { useMemo } from 'react';

/**
 * Custom hook for filtering and sorting products
 * 
 * @param {Array} products - Full product list
 * @param {string} search - Search query
 * @param {'all'|'in'|'out'|'low'} statusFilter - Stock status filter
 * @param {'name'|'price'|'stock'|'sold'} sortBy - Sort criteria
 * @returns {Array} - Filtered and sorted products
 */
export function useProductFilters(products, search, statusFilter, sortBy) {
  return useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query)
      );
    }

    // Status filter
    switch (statusFilter) {
      case 'in':
        filtered = filtered.filter(p => p.stock > 10);
        break;
      case 'out':
        filtered = filtered.filter(p => p.stock === 0);
        break;
      case 'low':
        filtered = filtered.filter(p => p.stock > 0 && p.stock <= 10);
        break;
      default: // 'all' - no filter
        break;
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'stock':
          return b.stock - a.stock;
        case 'sold':
          return b.sold - a.sold;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, search, statusFilter, sortBy]);
}