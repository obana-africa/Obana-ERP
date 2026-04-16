export const LOCATIONS = [
  { id: 'loc-1', name: 'Main Store',   city: 'Lagos',         type: 'retail',    active: true  },
  { id: 'loc-2', name: 'POS Outlet',   city: 'Abuja',         type: 'pos',       active: true  },
  { id: 'loc-3', name: 'Warehouse',    city: 'Lagos',         type: 'warehouse', active: true  },
  { id: 'loc-4', name: 'POS Kiosk',    city: 'Kano',          type: 'pos',       active: true  },
  { id: 'loc-5', name: 'Pop-up Store', city: 'Port Harcourt', type: 'retail',    active: false },
]

export const LOCATION_TYPE_CFG = {
  retail:    { label: 'Retail Store', bg: '#EFF6FF', color: '#1D4ED8' },
  pos:       { label: 'POS Terminal', bg: '#F0FDF4', color: '#15803D' },
  warehouse: { label: 'Warehouse',    bg: '#FEF3C7', color: '#B45309' },
}

export const ALL_PRODUCTS = [
  { id: 'p1', sku: 'AKR-001', name: 'Classic Ankara Dress',   price: 15000, category: 'Fashion',     img: null },
  { id: 'p2', sku: 'LCB-002', name: 'Leather Crossbody Bag',  price: 22000, category: 'Accessories', img: null },
  { id: 'p3', sku: 'SHB-003', name: 'Premium Shea Butter',    price: 4500,  category: 'Beauty',      img: null },
  { id: 'p4', sku: 'KFT-004', name: "Men's Kaftan Set",        price: 28000, category: 'Fashion',     img: null },
  { id: 'p5', sku: 'GFT-005', name: 'Ankara Gift Set Bundle', price: 35000, category: 'Fashion',     img: null },
  { id: 'p6', sku: 'NBC-006', name: 'Natural Body Cream',     price: 3800,  category: 'Beauty',      img: null },
]

export const SEED_COLLECTIONS = [
  {
    id: 'col-1', name: 'Summer Collection',
    desc: 'Bright and breezy looks for the season',
    status: 'active', img: null, productIds: ['p1','p2','p5'],
    locationInventory: {
      'loc-1': { p1:24, p2:12, p5:8  },
      'loc-2': { p1:10, p2:5,  p5:3  },
      'loc-3': { p1:60, p2:30, p5:20 },
      'loc-4': { p1:6,  p2:4,  p5:2  },
      'loc-5': { p1:0,  p2:0,  p5:0  },
    },
  },
  {
    id: 'col-2', name: 'Bridal & Aso-Ebi',
    desc: 'Elegant pieces for weddings and celebrations',
    status: 'active', img: null, productIds: ['p1','p4'],
    locationInventory: {
      'loc-1': { p1:18, p4:10 },
      'loc-2': { p1:6,  p4:4  },
      'loc-3': { p1:40, p4:25 },
      'loc-4': { p1:4,  p4:2  },
      'loc-5': { p1:0,  p4:0  },
    },
  },
  {
    id: 'col-3', name: "Men's Essentials",
    desc: 'Core wardrobe pieces for the modern man',
    status: 'draft', img: null, productIds: ['p4'],
    locationInventory: {
      'loc-1': { p4:15 },
      'loc-2': { p4:8  },
      'loc-3': { p4:35 },
      'loc-4': { p4:5  },
      'loc-5': { p4:0  },
    },
  },
  {
    id: 'col-4', name: 'Beauty & Wellness',
    desc: 'Premium skincare and body care products',
    status: 'active', img: null, productIds: ['p3','p6'],
    locationInventory: {
      'loc-1': { p3:30, p6:25 },
      'loc-2': { p3:12, p6:10 },
      'loc-3': { p3:80, p6:60 },
      'loc-4': { p3:8,  p6:6  },
      'loc-5': { p3:0,  p6:0  },
    },
  },
]
