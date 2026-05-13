/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {number} stock
 * @property {number} sold
 * @property {string|null} img
 * @property {Array<{url: string, name: string}>} images
 * @property {string} category
 * @property {boolean} variants
 * @property {Array<{option: string, values: string}>} variantOptions
 * @property {string} sku
 * @property {string} barcode
 * @property {string} shortDesc
 * @property {string} longDesc
 * @property {number} costPrice
 * @property {number|null} discountPrice
 * @property {string} unit
 * @property {boolean} trackQty
 * @property {string} createdAt
 */

/**
 * @typedef {Object} ProductFormData
 * @property {string} name
 * @property {string} price
 * @property {string} stock
 * @property {string} costPrice
 * @property {string} discountPrice
 * @property {string} shortDesc
 * @property {string} longDesc
 * @property {string} collection
 * @property {string} unit
 * @property {string} barcode
 * @property {boolean} trackQty
 * @property {'regular'|'variants'} productType
 * @property {Array<{option: string, values: string}>} variants
 * @property {Array<{url: string, name: string}>} images
 */

/**
 * @typedef {Object} ProductStats
 * @property {number} totalRetail
 * @property {number} totalInventory
 * @property {number} totalSold
 * @property {number} outOfStock
 * @property {number} lowStock
 * @property {number} totalProducts
 */

export {};