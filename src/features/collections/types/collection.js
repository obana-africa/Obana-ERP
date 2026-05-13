// @ts-check
/**
 * @typedef {Object} Collection
 * @property {string} id
 * @property {string} name
 * @property {string} desc
 * @property {'active'|'draft'} status
 * @property {string|null} img
 * @property {string[]} productIds
 * @property {Record<string, Record<string, number>>} locationInventory
 */

/**
 * @typedef {Object} Location
 * @property {string} id
 * @property {string} name
 * @property {string} city
 * @property {string} type
 * @property {boolean} active
 */

export {};