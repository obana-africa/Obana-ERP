import { useMemo } from 'react';

export function useInventoryFilters(inventory, search, statusFilter, categoryFilter) {
  return useMemo(() => {
    let filtered = [...inventory];
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        (i.barcode && i.barcode.includes(q))
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === categoryFilter);
    }
    return filtered;
  }, [inventory, search, statusFilter, categoryFilter]);
}