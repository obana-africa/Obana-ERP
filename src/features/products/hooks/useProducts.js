import { useState, useEffect, useCallback, useMemo } from 'react';
import * as productService from '../services/productService';

/**
 * Custom hook for product data management
 * 
 * Handles:
 * - Loading states
 * - Error handling
 * - CRUD operations with optimistic updates
 * - Computed statistics
 * 
 * @returns {Object} - { products, loading, error, stats, addProduct, updateProduct, deleteProduct }
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch
  useEffect(() => {
    let cancelled = false;

    productService
      .fetchProducts()
      .then(data => {
        if (!cancelled) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Failed to load products');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  // Add product with optimistic update
  const addProduct = useCallback(async (formData) => {
    // Optimistic add
    const tempId = `temp-${Date.now()}`;
    const optimisticProduct = {
      id: tempId,
      name: formData.name || 'New Product',
      price: parseFloat(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      sold: 0,
      img: formData.images?.[0]?.url || null,
      category: formData.collection || 'General',
      variants: formData.productType === 'variants',
      sku: `SKU-${Date.now()}`,
    };

    setProducts(prev => [optimisticProduct, ...prev]);

    try {
      const realProduct = await productService.createProduct(formData);
      setProducts(prev => prev.map(p => p.id === tempId ? realProduct : p));
      return realProduct;
    } catch (err) {
      // Rollback optimistic update
      setProducts(prev => prev.filter(p => p.id !== tempId));
      throw err;
    }
  }, []);

  // Update product
  const updateProduct = useCallback(async (id, updates) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    try {
      await productService.updateProduct(id, updates);
    } catch (err) {
      // Could implement rollback if needed
      console.error('Update failed:', err);
    }
  }, []);

  // Delete product with confirmation
  const deleteProduct = useCallback(async (id) => {
    const previousProducts = [...products];
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await productService.deleteProduct(id);
    } catch (err) {
      // Rollback on failure
      setProducts(previousProducts);
      throw err;
    }
  }, [products]);

  // Computed statistics
  const stats = useMemo(() => {
    const totalRetail = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalInventory = products.reduce((sum, p) => sum + p.stock, 0);
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    return {
      totalRetail,
      totalInventory,
      totalSold,
      outOfStock,
      lowStock,
      totalProducts: products.length,
    };
  }, [products]);

  return {
    products,
    loading,
    error,
    stats,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}