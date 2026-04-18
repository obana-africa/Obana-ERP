
export const SAMPLE_ORDERS = [
  {
    id:'ORD-1001', customer:'Adaeze Okonkwo', email:'adaeze@gmail.com', phone:'+234 803 123 4567',
    items:[{ name:'Classic Ankara Dress', qty:2, price:15000 },{ name:'Leather Crossbody Bag', qty:1, price:22000 }],
    total:52000, status:'completed', payment:'paid', shipping:'delivered',
    date:'2026-04-01', channel:'Website', address:'14 Adeola Odeku, VI, Lagos',
  },
  {
    id:'ORD-1002', customer:'Emmanuel Bassey', email:'emma.b@yahoo.com', phone:'+234 812 987 6543',
    items:[{ name:'Premium Shea Butter', qty:4, price:4500 }],
    total:18000, status:'pending', payment:'unpaid', shipping:'processing',
    date:'2026-04-02', channel:'Instagram', address:'7 Wuse Zone 4, Abuja',
  },
  {
    id:'ORD-1003', customer:'Fatima Kabir', email:'fatimak@hotmail.com', phone:'+234 706 234 5678',
    items:[{ name:"Men's Kaftan Set", qty:1, price:28000 }],
    total:28000, status:'processing', payment:'paid', shipping:'shipped',
    date:'2026-04-03', channel:'WhatsApp', address:'22 Ahmadu Bello Way, Kano',
  },
  {
    id:'ORD-1004', customer:'Chukwuemeka Ibe', email:'emeka.ibe@gmail.com', phone:'+234 909 876 5432',
    items:[{ name:'Classic Ankara Dress', qty:1, price:15000 },{ name:'Premium Shea Butter', qty:2, price:4500 }],
    total:24000, status:'completed', payment:'paid', shipping:'delivered',
    date:'2026-03-30', channel:'Website', address:'5 Rumuola Road, Port Harcourt',
  },
  {
    id:'ORD-1005', customer:'Ngozi Eze', email:'ngozi.e@gmail.com', phone:'+234 803 456 7890',
    items:[{ name:'Leather Crossbody Bag', qty:1, price:22000 }],
    total:22000, status:'cancelled', payment:'refunded', shipping:'cancelled',
    date:'2026-03-28', channel:'Website', address:'19 Ogui Road, Enugu',
  },
  {
    id:'ORD-1006', customer:'Bola Adesanya', email:'bola.a@outlook.com', phone:'+234 817 654 3210',
    items:[{ name:'Classic Ankara Dress', qty:3, price:15000 }],
    total:45000, status:'pending', payment:'partial', shipping:'pending',
    date:'2026-04-04', channel:'Facebook', address:'8 Bodija Market, Ibadan',
  },
]

export const SAMPLE_CUSTOMERS = [
  { id:'CUST-001', name:'Adaeze Okonkwo',   email:'adaeze@gmail.com',      phone:'+234 803 123 4567', address:'14 Adeola Odeku, VI, Lagos'       },
  { id:'CUST-002', name:'Emmanuel Bassey',  email:'emma.b@yahoo.com',       phone:'+234 812 987 6543', address:'7 Wuse Zone 4, Abuja'             },
  { id:'CUST-003', name:'Fatima Kabir',     email:'fatimak@hotmail.com',    phone:'+234 706 234 5678', address:'22 Ahmadu Bello Way, Kano'        },
  { id:'CUST-004', name:'Chukwuemeka Ibe',  email:'emeka.ibe@gmail.com',    phone:'+234 909 876 5432', address:'5 Rumuola Road, Port Harcourt'    },
]

export const SAMPLE_PRODUCTS = [
  { id:'PROD-001', name:'Classic Ankara Dress',  price:15000, stock:5  },
  { id:'PROD-002', name:'Leather Crossbody Bag', price:22000, stock:3  },
  { id:'PROD-003', name:'Premium Shea Butter',   price:4500,  stock:12 },
  { id:'PROD-004', name:"Men's Kaftan Set",       price:28000, stock:2  },
]

export const ABANDONED = [
  {
    id:'ABN-001', customer:'Tunde Adeyemi', email:'tunde.a@gmail.com', phone:'+234 802 111 2222',
    items:[{ name:'Classic Ankara Dress', qty:2, price:15000 }],
    cartValue:30000, abandonedAt:'2026-04-03 14:22', stage:'Checkout', reminder:0,
  },
  {
    id:'ABN-002', customer:'Kemi Oladele', email:'kemi.ol@yahoo.com', phone:'+234 706 333 4444',
    items:[{ name:"Men's Kaftan Set", qty:1, price:28000 },{ name:'Leather Crossbody Bag', qty:1, price:22000 }],
    cartValue:50000, abandonedAt:'2026-04-02 09:15', stage:'Payment', reminder:1,
  },
  {
    id:'ABN-003', customer:'Uche Nwosu', email:'uche.n@gmail.com', phone:'+234 813 555 6666',
    items:[{ name:'Premium Shea Butter', qty:6, price:4500 }],
    cartValue:27000, abandonedAt:'2026-04-01 18:45', stage:'Cart', reminder:2,
  },
]

export const REVIEWS = [
  { id:1, customer:'Adaeze Okonkwo',   orderId:'ORD-1001', product:'Classic Ankara Dress',  rating:5, comment:'Absolutely love this dress! The fabric quality is exceptional and the fit is perfect. Will definitely order again.',          date:'2026-04-02', status:'published' },
  { id:2, customer:'Chukwuemeka Ibe',  orderId:'ORD-1004', product:'Premium Shea Butter',   rating:4, comment:'Great product, very moisturising. Packaging could be better but the quality is top notch.',                               date:'2026-03-31', status:'published' },
  { id:3, customer:'Fatima Kabir',     orderId:'ORD-1003', product:"Men's Kaftan Set",       rating:5, comment:"Bought this for my husband and he absolutely loves it. The embroidery work is stunning.",                                  date:'2026-04-04', status:'pending'   },
  { id:4, customer:'Anonymous',        orderId:'ORD-1002', product:'Leather Crossbody Bag', rating:2, comment:'The colour was slightly different from the photos online. Disappointed with the delivery time as well.',                  date:'2026-03-29', status:'flagged'   },
]

export const STATUS_CONFIG = {
  completed:  { label:'Completed',  bg:'#ECFDF5', color:'#059669' },
  pending:    { label:'Pending',    bg:'#FFFBEB', color:'#D97706' },
  processing: { label:'Processing', bg:'#EFF6FF', color:'#2563EB' },
  cancelled:  { label:'Cancelled',  bg:'#FEF2F2', color:'#DC2626' },
}

export const PAYMENT_CONFIG = {
  paid:     { label:'Paid',     bg:'#ECFDF5', color:'#059669' },
  unpaid:   { label:'Unpaid',   bg:'#FEF2F2', color:'#DC2626' },
  partial:  { label:'Partial',  bg:'#FFFBEB', color:'#D97706' },
  refunded: { label:'Refunded', bg:'#F5F3FF', color:'#7C3AED' },
}

export const SHIP_CONFIG = {
  delivered:  { label:'Delivered',  bg:'#ECFDF5', color:'#059669' },
  shipped:    { label:'Shipped',    bg:'#EFF6FF', color:'#2563EB' },
  processing: { label:'Processing', bg:'#FFFBEB', color:'#D97706' },
  pending:    { label:'Pending',    bg:'#F3F4F6', color:'#6B7280' },
  cancelled:  { label:'Cancelled',  bg:'#FEF2F2', color:'#DC2626' },
}

export const SALES_CHANNELS = ['Website','Instagram','WhatsApp','Facebook','In-store','Phone']
