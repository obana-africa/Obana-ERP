import { useState, useEffect, useCallback } from 'react';
import * as service from '../services/inventoryService';

export function useInventory() {
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      service.fetchInventory(),
      service.fetchSuppliers(),
      service.fetchPurchaseOrders(),
      service.fetchAuditData(),
    ])
      .then(([inv, sup, po, aud]) => {
        setInventory(inv);
        setSuppliers(sup);
        setPurchaseOrders(po);
        setAuditData(aud);
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const addItem = useCallback(async (data) => {
    const newItem = await service.createItem(data);
    setInventory(prev => [...prev, newItem]);
  }, []);

  const updateItem = useCallback(async (id, data) => {
    await service.updateItem(id, data);
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
  }, []);

  const deleteItem = useCallback(async (id) => {
    await service.deleteItem(id);
    setInventory(prev => prev.filter(i => i.id !== id));
  }, []);

  const addPurchaseOrder = useCallback(async (data) => {
    const newPO = await service.createPurchaseOrder(data);
    setPurchaseOrders(prev => [...prev, newPO]);
  }, []);

  const updateAudit = useCallback(async (updated) => {
    await service.saveAuditResults(updated);
    setAuditData(updated);
  }, []);

  return {
    inventory, suppliers, purchaseOrders, auditData, loading, error,
    addItem, updateItem, deleteItem, addPurchaseOrder, updateAudit,
  };
}