/**
 * Product API Service
 * 
 * Currently uses mock data, but designed to be swapped with real API calls.
 * All functions return Promises to simulate async operations.
 * 
 * To connect to backend:
 *   1. Replace mock imports with axios/fetch calls
 *   2. Map request/response shapes to match Product type
 *   3. Add error handling / retry logic
 */

import { SAMPLE_PRODUCTS, SAMPLE_COLLECTIONS } from '@/data/products';

// Simulate network delay
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all products
 * @returns {Promise<Array>} - Array of product objects
 * 
 * Backend: GET /api/products
 */
export async function fetchProducts() {
  await delay(300);
  // TODO: Replace with actual API call
  // const response = await axios.get('/api/products');
  // return response.data;
  return [...SAMPLE_PRODUCTS];
}

/**
 * Fetch a single product by ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 * 
 * Backend: GET /api/products/:id
 */
export async function fetchProductById(id) {
  await delay(150);
  const product = SAMPLE_PRODUCTS.find(p => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  return { ...product };
}

/**
 * Create a new product
 * @param {Object} productData
 * @returns {Promise<Object>} - Created product with server-generated fields
 * 
 * Backend: POST /api/products
 */
export async function createProduct(productData) {
  await delay(200);
  const newProduct = {
    id: Date.now(),
    name: productData.name || 'Untitled Product',
    price: parseFloat(productData.price) || 0,
    stock: parseInt(productData.stock) || 0,
    costPrice: parseFloat(productData.costPrice) || 0,
    discountPrice: parseFloat(productData.discountPrice) || null,
    sold: 0,
    img: productData.images?.[0]?.url || null,
    images: productData.images || [],
    category: productData.collection || 'General',
    collection: productData.collection || 'General',
    variants: productData.productType === 'variants',
    variantOptions: productData.variants || [],
    sku: `SKU-${Date.now()}`,
    barcode: productData.barcode || '',
    shortDesc: productData.shortDesc || '',
    longDesc: productData.longDesc || '',
    unit: productData.unit || 'pc',
    trackQty: productData.trackQty ?? true,
    createdAt: new Date().toISOString(),
  };
  
  // TODO: Replace with API call
  // const response = await axios.post('/api/products', productData);
  // return response.data;
  
  return newProduct;
}

/**
 * Update an existing product
 * @param {string|number} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 * 
 * Backend: PUT /api/products/:id
 */
export async function updateProduct(id, updates) {
  await delay(200);
  // TODO: const response = await axios.put(`/api/products/${id}`, updates);
  return { id, ...updates };
}

/**
 * Delete a product
 * @param {string|number} id
 * @returns {Promise<string|number>} - Deleted product ID
 * 
 * Backend: DELETE /api/products/:id
 */
export async function deleteProduct(id) {
  await delay(150);
  // TODO: await axios.delete(`/api/products/${id}`);
  return id;
}

/**
 * Fetch available collections
 * @returns {Promise<Array>}
 * 
 * Backend: GET /api/collections
 */
export async function fetchCollections() {
  await delay(100);
  return [...SAMPLE_COLLECTIONS];
}

/**
 * Import products from a platform
 * @param {string} platform - Platform name
 * @param {File} [file] - CSV file (for CSV imports)
 * @returns {Promise<Object>}
 * 
 * Backend: POST /api/products/import
 */
export async function importProducts(platform, file) {
  await delay(500);
  // TODO: FormData upload
  // const formData = new FormData();
  // formData.append('platform', platform);
  // if (file) formData.append('file', file);
  // return axios.post('/api/products/import', formData);
  return { imported: 0, message: 'Import not yet connected to backend' };
}