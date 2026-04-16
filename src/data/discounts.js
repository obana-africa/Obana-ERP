
export const DISC_TYPES = {
  percentage:   { label: 'Percentage',       color: '#2DBD97', bg: '#ECFDF5', icon: 'M19 5L5 19M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM15 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0' },
  fixed:        { label: 'Fixed Amount',     color: '#3B82F6', bg: '#EFF6FF', icon: 'M2 8h20M2 16h20M6 4v16M18 4v16' },
  bogo:         { label: 'Buy X Get Y',      color: '#8B5CF6', bg: '#F5F3FF', icon: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0' },
  multibuy:     { label: 'Multi-Buy (×3)',   color: '#F59E0B', bg: '#FFFBEB', icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' },
  rrp:          { label: 'RRP / Price Lock', color: '#EF4444', bg: '#FEF2F2', icon: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  tiered:       { label: 'Tiered Pricing',  color: '#1a1a2e', bg: '#EEF2FF', icon: 'M18 20V10M12 20V4M6 20v-6' },
  bundle:       { label: 'Bundle Deal',     color: '#059669', bg: '#ECFDF5', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z' },
  flash:        { label: 'Flash Sale',      color: '#DC2626', bg: '#FEF2F2', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  loyalty:      { label: 'Loyalty / VIP',   color: '#D97706', bg: '#FFFBEB', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  freeShipping: { label: 'Free Shipping',   color: '#0891B2', bg: '#ECFEFF', icon: 'M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3M9 17h6a2 2 0 0 0 2-2V9M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 17a2 2 0 1 1 4 0 2 2 0 0 1-4 0z' },
}

export const STATUS_CFG = {
  active:    { label: 'Active',    bg: '#ECFDF5', color: '#047857' },
  scheduled: { label: 'Scheduled', bg: '#EFF6FF', color: '#1D4ED8' },
  expired:   { label: 'Expired',   bg: '#FEF2F2', color: '#B91C1C' },
  draft:     { label: 'Draft',     bg: '#F3F4F6', color: '#6B7280' },
  paused:    { label: 'Paused',    bg: '#FFFBEB', color: '#B45309' },
}

export const APPLIES_TO    = ['All products','Specific products','Specific collections','Specific categories']
export const CUSTOMER_SEGS = ['All customers','VIP customers','New customers','Returning customers','Wholesale buyers']
export const DISC_CHANNELS = ['All channels','Online Store','Point of Sale','WhatsApp','Instagram']

export const SEED_DISCOUNTS = [
  {
    id:'disc-001', code:'SUMMER25', name:'Summer 25% Off',
    type:'percentage', value:25, appliesTo:'All products',
    minOrder:10000, maxUses:500, usedCount:142,
    customerSegment:'All customers', channel:'All channels',
    startDate:'2026-04-01', endDate:'2026-04-30',
    status:'active', stackable:false, onePerCustomer:true,
    description:'Summer seasonal discount for all products',
    conditions:[], tiers:[],
  },
  {
    id:'disc-002', code:'VIPFLAT5K', name:'VIP ₦5,000 Off',
    type:'fixed', value:5000, appliesTo:'All products',
    minOrder:30000, maxUses:100, usedCount:38,
    customerSegment:'VIP customers', channel:'All channels',
    startDate:'2026-04-01', endDate:'2026-06-30',
    status:'active', stackable:false, onePerCustomer:false,
    description:'Flat ₦5,000 off for VIP customers on orders above ₦30,000',
    conditions:[], tiers:[],
  },
  {
    id:'disc-003', code:'BUY2GET1', name:'Buy 2 Get 1 Free',
    type:'bogo', value:100, buyQty:2, getQty:1,
    appliesTo:'Specific collections', minOrder:0, maxUses:200, usedCount:67,
    customerSegment:'All customers', channel:'All channels',
    startDate:'2026-04-10', endDate:'2026-04-20',
    status:'active', stackable:false, onePerCustomer:false,
    description:'Buy any 2 items, get the 3rd free from same collection',
    conditions:[], tiers:[],
  },
  {
    id:'disc-004', code:'TRIPLE10', name:'Buy 3 Save 10%',
    type:'multibuy', value:10, multipleOf:3,
    appliesTo:'All products', minOrder:0, maxUses:0, usedCount:23,
    customerSegment:'All customers', channel:'Point of Sale',
    startDate:'2026-04-01', endDate:'2026-12-31',
    status:'active', stackable:true, onePerCustomer:false,
    description:'Buy in multiples of 3, get 10% off the entire batch',
    conditions:[], tiers:[],
  },
  {
    id:'disc-005', code:'RRP-LOCK', name:'RRP Price Control',
    type:'rrp', rrpPrice:15000, appliesTo:'Specific products',
    minOrder:0, maxUses:0, usedCount:0,
    customerSegment:'Wholesale buyers', channel:'Point of Sale',
    startDate:'2026-01-01', endDate:'2026-12-31',
    status:'active', stackable:false, onePerCustomer:false,
    description:'Recommended Retail Price lock — prevents selling below ₦15,000',
    conditions:[], tiers:[],
  },
  {
    id:'disc-006', code:'TIER-VOL', name:'Volume Tiered Pricing',
    type:'tiered', appliesTo:'All products',
    minOrder:0, maxUses:0, usedCount:89,
    customerSegment:'All customers', channel:'All channels',
    startDate:'2026-01-01', endDate:'2026-12-31',
    status:'active', stackable:false, onePerCustomer:false,
    description:'Automatic tiered discounts based on order value',
    conditions:[],
    tiers:[
      { minQty:1,  maxQty:4,  discount:0,  label:'Standard'        },
      { minQty:5,  maxQty:9,  discount:5,  label:'Bulk (5–9)'      },
      { minQty:10, maxQty:24, discount:10, label:'Wholesale (10–24)'},
      { minQty:25, maxQty:99, discount:15, label:'Trade (25+)'      },
    ],
  },
  {
    id:'disc-007', code:'FLASH48', name:'48-Hour Flash Sale',
    type:'flash', value:30, appliesTo:'Specific collections',
    minOrder:0, maxUses:1000, usedCount:412,
    customerSegment:'All customers', channel:'Online Store',
    startDate:'2026-04-15', endDate:'2026-04-17',
    status:'scheduled', stackable:false, onePerCustomer:true,
    description:'30% flash sale — Bridal collection only, 48 hours',
    conditions:[], tiers:[],
  },
  {
    id:'disc-008', code:'FREESHIP', name:'Free Shipping Over ₦20k',
    type:'freeShipping', value:0, appliesTo:'All products',
    minOrder:20000, maxUses:0, usedCount:203,
    customerSegment:'All customers', channel:'Online Store',
    startDate:'2026-01-01', endDate:'2026-12-31',
    status:'active', stackable:true, onePerCustomer:false,
    description:'Automatic free shipping on all online orders above ₦20,000',
    conditions:[], tiers:[],
  },
]

export const ACTIVE_DISCOUNTS = [
  { code:'SUMMER25',  type:'percentage', value:25,   minOrder:10000, status:'active' },
  { code:'VIPFLAT5K', type:'fixed',      value:5000, minOrder:30000, status:'active' },
  { code:'FREESHIP',  type:'freeShipping', value:0,  minOrder:20000, status:'active', auto:true },
  { code:'TRIPLE10',  type:'multibuy',   value:10,   multipleOf:3,   status:'active', auto:true },
]

export const POS_DISCOUNTS = [
  { code:'STAFF10',   type:'percentage', value:10,   label:'Staff 10% off',    minOrder:0 },
  { code:'SUMMER25',  type:'percentage', value:25,   label:'Summer 25% off',   minOrder:10000 },
  { code:'VIPFLAT5K', type:'fixed',      value:5000, label:'VIP ₦5,000 off',   minOrder:30000 },
  { code:'CLEAR50',   type:'percentage', value:50,   label:'Clearance 50% off',minOrder:0 },
  { code:'BUY2GET1',  type:'bogo',       buyQty:2,   getQty:1, label:'Buy 2 Get 1 Free', minOrder:0 },
]