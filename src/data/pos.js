

export const LOCATIONS = [
  { id:'loc-1', name:'Main Store', city:'Lagos' },
  { id:'loc-2', name:'POS Outlet', city:'Abuja' },
  { id:'loc-3', name:'POS Kiosk',  city:'Kano'  },
]

export const COLLECTIONS = ['All','Fashion','Beauty','Accessories','Sale','New Arrivals']

export const CATALOG = [
  {
    id:'p1', name:'Classic Ankara Dress', category:'Fashion',
    collection:'Spring/Summer', badge:'Bestseller',
    basePrice:15000, compareAt:18500,
    img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=70',
    variants:[
      { sku:'AKR-001-RED-S',  size:'S',  color:'Red',   style:'Regular', stock:{'loc-1':8, 'loc-2':3,'loc-3':2} },
      { sku:'AKR-001-RED-M',  size:'M',  color:'Red',   style:'Regular', stock:{'loc-1':12,'loc-2':5,'loc-3':3} },
      { sku:'AKR-001-RED-L',  size:'L',  color:'Red',   style:'Regular', stock:{'loc-1':6, 'loc-2':2,'loc-3':1} },
      { sku:'AKR-001-BLK-S',  size:'S',  color:'Black', style:'Slim',    stock:{'loc-1':4, 'loc-2':2,'loc-3':0} },
      { sku:'AKR-001-BLK-M',  size:'M',  color:'Black', style:'Slim',    stock:{'loc-1':10,'loc-2':4,'loc-3':2} },
      { sku:'AKR-001-BLK-L',  size:'L',  color:'Black', style:'Slim',    stock:{'loc-1':7, 'loc-2':3,'loc-3':1} },
      { sku:'AKR-001-WHT-M',  size:'M',  color:'White', style:'Regular', stock:{'loc-1':5, 'loc-2':0,'loc-3':0} },
      { sku:'AKR-001-WHT-L',  size:'L',  color:'White', style:'Regular', stock:{'loc-1':3, 'loc-2':1,'loc-3':0} },
    ],
    sizes:['S','M','L'], colors:['Red','Black','White'], styles:['Regular','Slim'],
  },
  {
    id:'p2', name:"Men's Kaftan Set", category:'Fashion',
    collection:'Fall/Winter', badge:null,
    basePrice:28000, compareAt:null,
    img:'https://images.unsplash.com/photo-1594938298603-c8148c4b1d7a?w=300&q=70',
    variants:[
      { sku:'KFT-004-WHT-S',  size:'S',  color:'White',  style:'Regular', stock:{'loc-1':5,'loc-2':2,'loc-3':1} },
      { sku:'KFT-004-WHT-M',  size:'M',  color:'White',  style:'Regular', stock:{'loc-1':8,'loc-2':3,'loc-3':2} },
      { sku:'KFT-004-WHT-L',  size:'L',  color:'White',  style:'Regular', stock:{'loc-1':6,'loc-2':2,'loc-3':1} },
      { sku:'KFT-004-BLU-M',  size:'M',  color:'Navy',   style:'Regular', stock:{'loc-1':4,'loc-2':1,'loc-3':0} },
      { sku:'KFT-004-BLU-L',  size:'L',  color:'Navy',   style:'Regular', stock:{'loc-1':6,'loc-2':2,'loc-3':1} },
      { sku:'KFT-004-GRN-L',  size:'L',  color:'Forest', style:'Slim',    stock:{'loc-1':3,'loc-2':1,'loc-3':0} },
      { sku:'KFT-004-GRN-XL', size:'XL', color:'Forest', style:'Slim',    stock:{'loc-1':5,'loc-2':0,'loc-3':0} },
    ],
    sizes:['S','M','L','XL'], colors:['White','Navy','Forest'], styles:['Regular','Slim'],
  },
  {
    id:'p3', name:'Leather Crossbody Bag', category:'Accessories',
    collection:'All Season', badge:'New',
    basePrice:22000, compareAt:null,
    img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=70',
    variants:[
      { sku:'LCB-002-TAN-OS', size:'One Size', color:'Tan',   style:'Regular', stock:{'loc-1':7,'loc-2':3,'loc-3':2} },
      { sku:'LCB-002-BLK-OS', size:'One Size', color:'Black', style:'Regular', stock:{'loc-1':5,'loc-2':2,'loc-3':1} },
      { sku:'LCB-002-BRN-OS', size:'One Size', color:'Brown', style:'Regular', stock:{'loc-1':4,'loc-2':1,'loc-3':0} },
    ],
    sizes:['One Size'], colors:['Tan','Black','Brown'], styles:['Regular'],
  },
  {
    id:'p4', name:'Premium Shea Butter', category:'Beauty',
    collection:'All Season', badge:'Sale',
    basePrice:4500, compareAt:5800,
    img:'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=300&q=70',
    variants:[
      { sku:'SHB-003-100ML', size:'100ml', color:'Natural', style:'Regular', stock:{'loc-1':30,'loc-2':15,'loc-3':10} },
      { sku:'SHB-003-200ML', size:'200ml', color:'Natural', style:'Regular', stock:{'loc-1':20,'loc-2':8, 'loc-3':6 } },
      { sku:'SHB-003-500ML', size:'500ml', color:'Natural', style:'Regular', stock:{'loc-1':12,'loc-2':4, 'loc-3':2 } },
    ],
    sizes:['100ml','200ml','500ml'], colors:['Natural'], styles:['Regular'],
  },
  {
    id:'p5', name:'Natural Body Cream', category:'Beauty',
    collection:'All Season', badge:null,
    basePrice:3800, compareAt:null,
    img:'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&q=70',
    variants:[
      { sku:'NBC-006-150ML', size:'150ml', color:'Cream', style:'Regular', stock:{'loc-1':25,'loc-2':10,'loc-3':8} },
      { sku:'NBC-006-300ML', size:'300ml', color:'Cream', style:'Regular', stock:{'loc-1':15,'loc-2':6, 'loc-3':4} },
    ],
    sizes:['150ml','300ml'], colors:['Cream'], styles:['Regular'],
  },
  {
    id:'p6', name:'Ankara Gift Set Bundle', category:'Fashion',
    collection:'Spring/Summer', badge:'Limited',
    basePrice:35000, compareAt:42000,
    img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&q=70',
    variants:[
      { sku:'GFT-005-RED-SM', size:'S/M',  color:'Red',   style:'Regular', stock:{'loc-1':4,'loc-2':2,'loc-3':1} },
      { sku:'GFT-005-BLK-SM', size:'S/M',  color:'Black', style:'Regular', stock:{'loc-1':3,'loc-2':1,'loc-3':0} },
      { sku:'GFT-005-RED-LX', size:'L/XL', color:'Red',   style:'Regular', stock:{'loc-1':3,'loc-2':1,'loc-3':0} },
    ],
    sizes:['S/M','L/XL'], colors:['Red','Black'], styles:['Regular'],
  },
]

export const POS_DISCOUNTS = [
  { code:'STAFF10',   type:'percentage', value:10,   label:'Staff 10% off',     minOrder:0     },
  { code:'SUMMER25',  type:'percentage', value:25,   label:'Summer 25% off',    minOrder:10000 },
  { code:'VIPFLAT5K', type:'fixed',      value:5000, label:'VIP ₦5,000 off',    minOrder:30000 },
  { code:'CLEAR50',   type:'percentage', value:50,   label:'Clearance 50% off', minOrder:0     },
  { code:'BUY2GET1',  type:'bogo', buyQty:2, getQty:1, label:'Buy 2 Get 1 Free', minOrder:0    },
]

export const CRM_CUSTOMERS = [
  { id:'c1', name:'Adaeze Okonkwo', phone:'08031234567', email:'adaeze@gmail.com', tier:'VIP',     totalSpend:420000, orders:14, points:2100 },
  { id:'c2', name:'Emeka Eze',      phone:'07054321098', email:'emeka@yahoo.com',  tier:'Regular', totalSpend:85000,  orders:4,  points:425  },
  { id:'c3', name:'Kemi Adeyemi',   phone:'09012345678', email:'kemi@hotmail.com', tier:'VIP',     totalSpend:650000, orders:22, points:3250 },
  { id:'c4', name:'Tunde Bello',    phone:'08098765432', email:'tunde@gmail.com',  tier:'New',     totalSpend:12000,  orders:1,  points:60   },
]

export const TAX_RATE = 0.075

export const COLOR_MAP = {
  Red:'#DC2626', Black:'#1C1C1C', White:'#F9FAFB', Navy:'#1E3A8A',
  Forest:'#166534', Tan:'#D97706', Brown:'#92400E', Cream:'#FEF3C7',
  Natural:'#D4A574',
}
