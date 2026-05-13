import { useMemo } from 'react';

export function useCollectionFilters(collections, search, statusFilter, sortBy) {
  return useMemo(() => {
    let result = collections.filter(c => {
      const q = search.toLowerCase();
      const match = c.name.toLowerCase().includes(q) || (c.desc || '').toLowerCase().includes(q);
      const statusMatch = statusFilter === 'all' || c.status === statusFilter;
      return match && statusMatch;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'products': return b.productIds.length - a.productIds.length;
        case 'stock': {
          const stock = col =>
            Object.values(col.locationInventory)
              .reduce((x, loc) => x + Object.values(loc).reduce((y, v) => y + v, 0), 0);
          return stock(b) - stock(a);
        }
        default: return 0;
      }
    });

    return result;
  }, [collections, search, statusFilter, sortBy]);
}