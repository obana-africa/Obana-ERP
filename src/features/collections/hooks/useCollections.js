import { useState, useEffect, useCallback } from 'react';
import * as service from '../services/collectionService';

export function useCollections() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    service.fetchCollections()
      .then(setCollections)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addCollection = useCallback(async (data) => {
    const newColl = await service.createCollection(data);
    setCollections(prev => [...prev, newColl]);
    return newColl;
  }, []);

  const updateCollection = useCallback(async (id, data) => {
    await service.updateCollection(id, data);
    setCollections(prev => prev.map(c => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteCollection = useCallback(async (id) => {
    await service.deleteCollection(id);
    setCollections(prev => prev.filter(c => c.id !== id));
  }, []);

  const saveInventory = useCallback(async (collectionId, inventory) => {
    await service.saveInventory(collectionId, inventory);
    setCollections(prev => prev.map(c =>
      c.id === collectionId ? { ...c, locationInventory: inventory } : c
    ));
  }, []);

  return {
    collections,
    loading,
    error,
    addCollection,
    updateCollection,
    deleteCollection,
    saveInventory,
  };
}