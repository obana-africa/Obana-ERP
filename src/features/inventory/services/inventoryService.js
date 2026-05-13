import { SAMPLE_INVENTORY, SUPPLIERS, PURCHASE_ORDERS, STOCK_AUDIT, ROLES } from '@/data/inventory';

const delay = (ms = 150) => new Promise(res => setTimeout(res, ms));

// ── Inventory items ────────────────────────────────────────
export async function fetchInventory() {
  await delay(200);
  return [...SAMPLE_INVENTORY];
}

export async function createItem(data) {
  await delay(100);
  return {
    id: Date.now(),
    shrinkage: 0,
    lastRestocked: new Date().toISOString().split('T')[0],
    status: Number(data.stock) === 0 ? 'out_of_stock' : Number(data.stock) <= Number(data.reorderPoint) ? 'low_stock' : 'in_stock',
    ...data,
  };
}

export async function updateItem(id, data) {
  await delay(100);
  return { id, ...data };
}

export async function deleteItem(id) {
  await delay(80);
  return id;
}

// ── Purchase Orders ────────────────────────────────────────
export async function fetchPurchaseOrders() {
  await delay(120);
  return [...PURCHASE_ORDERS];
}

export async function createPurchaseOrder(data) {
  await delay(150);
  return { ...data, id: `PO-${Date.now()}`, status: 'pending', date: new Date().toISOString().split('T')[0] };
}

// ── Audit data ─────────────────────────────────────────────
export async function fetchAuditData() {
  await delay(100);
  return [...STOCK_AUDIT];
}

export async function saveAuditResults(updatedAudit) {
  await delay(120);
  return updatedAudit;
}

// ── Suppliers ──────────────────────────────────────────────
export async function fetchSuppliers() {
  await delay(80);
  return [...SUPPLIERS];
}

// ── Roles ──────────────────────────────────────────────────
export async function fetchRoles() {
  await delay(50);
  return [...ROLES];
}