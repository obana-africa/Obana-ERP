import { useMemo } from 'react';

export function useTransferFilters(transfers, search, typeFilter, statusFilter) {
  return useMemo(() => {
    let filtered = transfers.filter(tr => {
      const q = search.toLowerCase();
      const matchSearch =
        tr.id.toLowerCase().includes(q) ||
        tr.origin.toLowerCase().includes(q) ||
        tr.dest.toLowerCase().includes(q) ||
        tr.ref?.toLowerCase().includes(q);
      const matchType = typeFilter === 'all' || tr.type === typeFilter;
      const matchStatus = statusFilter === 'all' || tr.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
    return filtered;
  }, [transfers, search, typeFilter, statusFilter]);
}