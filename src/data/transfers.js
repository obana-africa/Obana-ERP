
export const SUPPLIERS = [
  'Lagos Textile Hub',
  'Kano Craft Suppliers',
  'Abuja Beauty Wholesale',
  'PH Fabrics Ltd',
]

export const LOCATIONS = [
  'Main Store — Lagos',
  'POS Outlet — Abuja',
  'Warehouse — Lagos',
  'POS Kiosk — Kano',
]

export const TRANSFER_PRODUCTS = [
  { sku: 'AKR-001', name: 'Classic Ankara Dress',   cost: 9000  },
  { sku: 'LCB-002', name: 'Leather Crossbody Bag',  cost: 12000 },
  { sku: 'SHB-003', name: 'Premium Shea Butter',    cost: 2000  },
  { sku: 'KFT-004', name: "Men's Kaftan Set",         cost: 16000 },
  { sku: 'GFT-005', name: 'Ankara Gift Set Bundle',  cost: 20000 },
]

export const SEED_TRANSFERS = [
  {
    id: 'TRF-2026-001', type: 'incoming', status: 'received',
    origin: 'Lagos Textile Hub', dest: 'Main Store — Lagos',
    date: '2026-03-15', eta: '2026-03-15', ref: 'PO-001',
    items: [
      { sku: 'AKR-001', name: 'Classic Ankara Dress', exp: 20, recv: 20, cost: 9000  },
      { sku: 'KFT-004', name: "Men's Kaftan Set",       exp: 10, recv: 10, cost: 16000 },
    ],
    notes: 'Monthly restock from main supplier.',
  },
  {
    id: 'TRF-2026-002', type: 'incoming', status: 'in_transit',
    origin: 'Abuja Beauty Wholesale', dest: 'Main Store — Lagos',
    date: '2026-04-05', eta: '2026-04-12', ref: 'PO-002',
    items: [
      { sku: 'SHB-003', name: 'Premium Shea Butter', exp: 50, recv: 0, cost: 2000 },
    ],
    notes: '',
  },
  {
    id: 'TRF-2026-003', type: 'outgoing', status: 'pending',
    origin: 'Main Store — Lagos', dest: 'POS Outlet — Abuja',
    date: '2026-04-06', eta: '2026-04-08', ref: null,
    items: [
      { sku: 'AKR-001', name: 'Classic Ankara Dress',  exp: 5, recv: 0, cost: 9000  },
      { sku: 'LCB-002', name: 'Leather Crossbody Bag', exp: 3, recv: 0, cost: 12000 },
    ],
    notes: 'Pop-up weekend stock.',
  },
  {
    id: 'TRF-2026-004', type: 'incoming', status: 'partial',
    origin: 'Kano Craft Suppliers', dest: 'Main Store — Lagos',
    date: '2026-04-03', eta: '2026-04-10', ref: 'PO-003',
    items: [
      { sku: 'LCB-002', name: 'Leather Crossbody Bag', exp: 15, recv: 8, cost: 12000 },
    ],
    notes: 'Remaining 7 units arriving next week.',
  },
  {
    id: 'TRF-2026-005', type: 'return', status: 'pending',
    origin: 'Main Store — Lagos', dest: 'Lagos Textile Hub',
    date: '2026-04-08', eta: '2026-04-10', ref: null,
    items: [
      { sku: 'KFT-004', name: "Men's Kaftan Set", exp: 2, recv: 0, cost: 16000 },
    ],
    notes: 'Damaged units — supplier agreed to replacement.',
  },
]

export const STATUS_CFG = {
  draft:      { label: 'Draft',      bg: '#F3F4F6', color: '#6B7280' },
  pending:    { label: 'Pending',    bg: '#FFFBEB', color: '#B45309' },
  in_transit: { label: 'In Transit', bg: '#EFF6FF', color: '#1D4ED8' },
  received:   { label: 'Received',   bg: '#ECFDF5', color: '#047857' },
  partial:    { label: 'Partial',    bg: '#FFF7ED', color: '#C2410C' },
  cancelled:  { label: 'Cancelled',  bg: '#FEF2F2', color: '#B91C1C' },
}

export const TYPE_CFG = {
  incoming: {
    label: 'Incoming', bg: '#ECFDF5', color: '#047857',
    icon: 'M8 17l4 4 4-4M12 12v9M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29',
  },
  outgoing: {
    label: 'Outgoing', bg: '#FEF2F2', color: '#B91C1C',
    icon: 'M16 7h5v5M21 7l-9 9-4-4-6 6',
  },
  return: {
    label: 'Return', bg: '#F5F3FF', color: '#6D28D9',
    icon: 'M1 4v6h6M3.51 15a9 9 0 1 0 .49-3.96',
  },
}

export const TRANSFER_STEPS = ['Created', 'Approved', 'In Transit', 'Received']

export const STEP_INDEX = {
  draft: 0, pending: 1, in_transit: 2,
  received: 3, partial: 2, cancelled: 0,
}
