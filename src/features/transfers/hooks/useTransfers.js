import { useState, useEffect, useCallback } from 'react';
import * as service from '../services/transfersService';

export function useTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    service.fetchTransfers()
      .then(setTransfers)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addTransfer = useCallback(async (data) => {
    const newTransfer = await service.createTransfer(data);
    setTransfers(prev => [newTransfer, ...prev]);
  }, []);

  const receiveTransfer = useCallback(async (id, recvQtys) => {
    // Optimistic update
    setTransfers(prev =>
      prev.map(tr => {
        if (tr.id !== id) return tr;
        const items = tr.items.map(i => ({ ...i, recv: recvQtys[i.sku] ?? i.recv }));
        const all = items.every(i => i.recv >= i.exp);
        const any = items.some(i => i.recv > 0);
        return {
          ...tr,
          items,
          status: all ? 'received' : any ? 'partial' : tr.status,
        };
      })
    );
    await service.receiveTransfer(id, recvQtys);
  }, []);

  return { transfers, loading, error, addTransfer, receiveTransfer };
}