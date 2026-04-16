
export const SUPPLIERS = [
  { id: 1, name: 'Lagos Textile Hub',      contact: 'Emeka Obi',   phone: '+234 803 111 2222', email: 'emeka@lagostextile.com',  category: 'Fashion'     },
  { id: 2, name: 'Kano Craft Suppliers',   contact: 'Fatima Musa', phone: '+234 706 333 4444', email: 'fatima@kanocrafts.com',   category: 'Accessories' },
  { id: 3, name: 'Abuja Beauty Wholesale', contact: 'Ngozi Eze',   phone: '+234 812 555 6666', email: 'ngozi@abujabeauty.com',   category: 'Beauty'      },
]

export const SAMPLE_INVENTORY = [
  {
    id: 1, sku: 'AKR-001', name: 'Classic Ankara Dress',
    category: 'Fashion', tags: ['dress','ankara'],
    barcode: '8901234567890', price: 15000, costPrice: 9000,
    stock: 12, reorderPoint: 5, safetyStock: 3,
    variants: ['Red/S','Red/M','Blue/M'],
    supplier: 'Lagos Textile Hub', lastRestocked: '2026-03-15',
    shrinkage: 0, status: 'in_stock',
  },
  {
    id: 2, sku: 'LCB-002', name: 'Leather Crossbody Bag',
    category: 'Accessories', tags: ['bag','leather'],
    barcode: '8901234567891', price: 22000, costPrice: 12000,
    stock: 7, reorderPoint: 4, safetyStock: 2,
    variants: ['Black','Brown'],
    supplier: 'Kano Craft Suppliers', lastRestocked: '2026-03-20',
    shrinkage: 1, status: 'in_stock',
  },
  {
    id: 3, sku: 'SHB-003', name: 'Premium Shea Butter',
    category: 'Beauty', tags: ['skincare','organic'],
    barcode: '8901234567892', price: 4500, costPrice: 2000,
    stock: 0, reorderPoint: 10, safetyStock: 5,
    variants: [],
    supplier: 'Abuja Beauty Wholesale', lastRestocked: '2026-02-28',
    shrinkage: 2, status: 'out_of_stock',
  },
  {
    id: 4, sku: 'KFT-004', name: "Men's Kaftan Set",
    category: 'Fashion', tags: ['kaftan','men'],
    barcode: '8901234567893', price: 28000, costPrice: 16000,
    stock: 4, reorderPoint: 5, safetyStock: 2,
    variants: ['White/L','White/XL','Navy/L'],
    supplier: 'Lagos Textile Hub', lastRestocked: '2026-03-10',
    shrinkage: 0, status: 'low_stock',
  },
  {
    id: 5, sku: 'GFT-005', name: 'Ankara Gift Set Bundle',
    category: 'Fashion', tags: ['bundle','gift'],
    barcode: '8901234567894', price: 35000, costPrice: 20000,
    stock: 8, reorderPoint: 3, safetyStock: 2,
    variants: [], isKit: true,
    kitItems: ['Classic Ankara Dress x1','Leather Crossbody Bag x1'],
    supplier: 'Lagos Textile Hub', lastRestocked: '2026-04-01',
    shrinkage: 0, status: 'in_stock',
  },
]

export const PURCHASE_ORDERS = [
  { id: 'PO-001', supplier: 'Lagos Textile Hub',      items: 3, total: 85000, status: 'received',   date: '2026-03-15', expectedDate: '2026-03-15' },
  { id: 'PO-002', supplier: 'Abuja Beauty Wholesale', items: 2, total: 40000, status: 'pending',    date: '2026-04-05', expectedDate: '2026-04-12' },
  { id: 'PO-003', supplier: 'Kano Craft Suppliers',   items: 1, total: 24000, status: 'in_transit', date: '2026-04-03', expectedDate: '2026-04-10' },
]

export const STOCK_AUDIT = [
  { id: 1, sku: 'AKR-001', name: 'Classic Ankara Dress',   systemQty: 12, physicalQty: 12, variance: 0,  auditDate: '2026-04-01', auditedBy: 'Store Manager' },
  { id: 2, sku: 'LCB-002', name: 'Leather Crossbody Bag',  systemQty: 8,  physicalQty: 7,  variance: -1, auditDate: '2026-04-01', auditedBy: 'Store Manager' },
  { id: 3, sku: 'SHB-003', name: 'Premium Shea Butter',    systemQty: 2,  physicalQty: 0,  variance: -2, auditDate: '2026-04-01', auditedBy: 'Store Manager' },
]

export const ROLES = [
  { role: 'Super Admin',     access: 'Full access — inventory settings, supplier data, system config', color: '#1a1a2e', bg: '#EEF2FF' },
  { role: 'Store Manager',   access: 'Daily counts, receive shipments, run reports',                   color: '#065F46', bg: '#ECFDF5' },
  { role: 'Cashier / Staff', access: 'Scan products, process sales — limited stock adjustments',       color: '#92400E', bg: '#FFFBEB' },
]

export const STATUS_CFG = {
  in_stock:     { label: 'In Stock',     bg: '#ECFDF5', color: '#059669' },
  low_stock:    { label: 'Low Stock',    bg: '#FFFBEB', color: '#D97706' },
  out_of_stock: { label: 'Out of Stock', bg: '#FEF2F2', color: '#DC2626' },
}

export const PO_CFG = {
  received:   { label: 'Received',   bg: '#ECFDF5', color: '#059669' },
  pending:    { label: 'Pending',    bg: '#FFFBEB', color: '#D97706' },
  in_transit: { label: 'In Transit', bg: '#EFF6FF', color: '#2563EB' },
}

export const ITEM_CATEGORIES = ['Fashion','Accessories','Beauty','Electronics','Food','Home','Other']

export const INVENTORY_TABS = [
  { key: 'items',     label: 'Item Master'          },
  { key: 'po',        label: 'Purchase Orders'       },
  { key: 'audit',     label: 'Stock Audit'           },
  { key: 'reports',   label: 'Reports & Analytics'   },
  { key: 'suppliers', label: 'Suppliers'             },
  { key: 'roles',     label: 'User Roles'            },
]
