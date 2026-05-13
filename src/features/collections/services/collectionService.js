import { SEED_COLLECTIONS, LOCATIONS, ALL_PRODUCTS } from '@/data/collections';

// Simulate async
const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

// ── Collections ──────────────────────────────────────────────
export async function fetchCollections() {
  await delay(200);
  return [...SEED_COLLECTIONS];
}

export async function createCollection(data) {
  await delay(150);
  const newCollection = {
    id: `col-${Date.now()}`,
    name: data.name || 'Untitled',
    desc: data.desc || '',
    status: data.status || 'active',
    img: data.img || null,
    productIds: data.productIds || [],
    locationInventory: Object.fromEntries(
      LOCATIONS.map(l => [
        l.id,
        Object.fromEntries((data.productIds || []).map(pid => [pid, 0]))
      ])
    ),
  };
  return newCollection;
}

export async function updateCollection(id, data) {
  await delay(100);
  return { id, ...data };
}

export async function deleteCollection(id) {
  await delay(100);
  return id;
}

// ── Inventory ────────────────────────────────────────────────
export async function saveInventory(collectionId, inventory) {
  await delay(100);
  return { collectionId, inventory };
}

// ── Locations ────────────────────────────────────────────────
export async function fetchLocations() {
  await delay(100);
  return [...LOCATIONS];
}

export async function updateLocation(id, data) {
  await delay(80);
  return { id, ...data };
}

export async function createLocation(data) {
  await delay(80);
  return {
    id: `loc-${Date.now()}`,
    name: data.name,
    city: data.city,
    type: data.type || 'retail',
    active: true,
  };
}

// ── Products for picker ──────────────────────────────────────
export async function fetchAllProducts() {
  await delay(120);
  return [...ALL_PRODUCTS];
}