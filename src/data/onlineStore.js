

export const STORE_PRODUCTS = [
  {
    id:'p1', sku:'AKR-001', name:'Classic Ankara Dress',
    price:15000, compareAt:18500, badge:'Bestseller',
    category:'Fashion', subCategory:'Dresses',
    rating:4.8, reviews:124, stock:24,
    colors:['#E8532A','#2D5BE3','#1C1C1C'],
    sizes:['XS','S','M','L','XL'],
    tags:['ankara','dress','fashion','african'],
    img:'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    imgs:['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80','https://images.unsplash.com/photo-1566206091558-7f218b696731?w=600&q=80'],
    description:'A beautifully crafted Ankara dress celebrating rich West African textile traditions. Made from 100% premium cotton Ankara fabric.',
    weight:0.4, location:'Main Store — Lagos',
  },
  {
    id:'p2', sku:'LCB-002', name:'Leather Crossbody Bag',
    price:22000, compareAt:null, badge:'New',
    category:'Accessories', subCategory:'Bags',
    rating:4.9, reviews:89, stock:7,
    colors:['#8B6F47','#1C1C1C','#C4A882'],
    sizes:['One Size'],
    tags:['leather','bag','accessories'],
    img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    imgs:['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'],
    description:'Premium full-grain leather crossbody bag. Handcrafted with attention to detail, featuring brass hardware and suede lining.',
    weight:0.6, location:'Main Store — Lagos',
  },
  {
    id:'p3', sku:'SHB-003', name:'Premium Shea Butter Set',
    price:4500, compareAt:5800, badge:'Sale',
    category:'Beauty', subCategory:'Skincare',
    rating:4.7, reviews:312, stock:80,
    colors:['#F5E6C8'],
    sizes:['100ml','200ml','500ml'],
    tags:['shea','beauty','skincare','natural'],
    img:'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80',
    imgs:['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=600&q=80'],
    description:'Pure unrefined shea butter sourced from Northern Nigeria. Rich in vitamins A, E & F for deep moisturisation.',
    weight:0.3, location:'Main Store — Lagos',
  },
  {
    id:'p4', sku:'KFT-004', name:"Men's Kaftan Set",
    price:28000, compareAt:null, badge:null,
    category:'Fashion', subCategory:'Menswear',
    rating:4.6, reviews:67, stock:15,
    colors:['#F0EDE8','#1C3A5E','#2D5016'],
    sizes:['S','M','L','XL','XXL'],
    tags:['kaftan','menswear','fashion','traditional'],
    img:'https://images.unsplash.com/photo-1594938298603-c8148c4b1d7a?w=600&q=80',
    imgs:['https://images.unsplash.com/photo-1594938298603-c8148c4b1d7a?w=600&q=80'],
    description:'Elegant traditional kaftan set made from handwoven fabric. Perfect for weddings, ceremonies and special occasions.',
    weight:0.8, location:'Main Store — Lagos',
  },
  {
    id:'p5', sku:'GFT-005', name:'Ankara Gift Set Bundle',
    price:35000, compareAt:42000, badge:'Limited',
    category:'Fashion', subCategory:'Gift Sets',
    rating:5.0, reviews:45, stock:8,
    colors:['#E8532A','#2D5BE3'],
    sizes:['S/M','L/XL'],
    tags:['gift','ankara','bundle','limited'],
    img:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80',
    imgs:['https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80'],
    description:'Curated gift set featuring our best-selling Ankara pieces. Perfect for weddings, birthdays and celebrations.',
    weight:1.2, location:'Main Store — Lagos',
  },
  {
    id:'p6', sku:'NBC-006', name:'Natural Body Cream',
    price:3800, compareAt:null, badge:null,
    category:'Beauty', subCategory:'Body Care',
    rating:4.5, reviews:203, stock:60,
    colors:['#FFF8F0'],
    sizes:['150ml','300ml'],
    tags:['cream','beauty','natural','body'],
    img:'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80',
    imgs:['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600&q=80'],
    description:'Luxurious body cream with shea butter, coconut oil and African botanicals. Absorbs quickly and leaves skin glowing.',
    weight:0.3, location:'Main Store — Lagos',
  },
]

export const STORE_BLOG_POSTS = [
  { id:'b1', title:'How to Style Ankara for Any Occasion',           blog:'Style Guide', date:'2026-04-01', img:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', excerpt:'Discover the versatility of Ankara fabric and how to rock it from office to evening events.' },
  { id:'b2', title:'5 Skincare Routines Using Nigerian Ingredients',  blog:'Wellness',    date:'2026-03-22', img:'https://images.unsplash.com/photo-1560472355-536de3962603?w=400&q=80', excerpt:'From shea butter to black soap — build your routine with ingredients grown right here.' },
  { id:'b3', title:'Celebrating Nigerian Textile Heritage',           blog:'Style Guide', date:'2026-03-10', img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80', excerpt:'A deep dive into the rich history and craft of Aso-oke, Ankara, and Adire fabrics.' },
]

export const SHIPPING_RATES = [
  { id:'standard', name:'Standard Delivery', desc:'3–5 business days', price:1500, days:'3-5' },
  { id:'express',  name:'Express Delivery',  desc:'1–2 business days', price:3000, days:'1-2' },
  { id:'pickup',   name:'Store Pickup',       desc:'Ready in 2 hours',  price:0,    days:'0'   },
]

export const NIGERIAN_STATES = [
  'Lagos','Abuja','Rivers','Kano','Oyo','Delta','Enugu',
  'Kaduna','Anambra','Kwara','Osun','Ondo','Ekiti','Ogun','Edo',
]

export const STORE_CATEGORIES = ['All','Fashion','Beauty','Accessories']
export const SORT_OPTS = ['Featured','Price: Low to High','Price: High to Low','Best Rated','Most Reviewed','New Arrivals']

export const TRUST_BADGES = [
  { icon:'🚚', title:'Fast Nationwide Shipping', desc:'Lagos same-day · Other states 3–5 days' },
  { icon:'🔒', title:'100% Secure Payments',     desc:'Paystack, Flutterwave, Bank Transfer'   },
  { icon:'↩️', title:'7-Day Easy Returns',       desc:'No questions asked return policy'        },
  { icon:'🇳🇬', title:'Made in Nigeria',          desc:'Supporting local artisans & craftspeople'},
]

export const PAY_METHODS = [
  { id:'card',        label:'Debit / Credit Card', icon:'💳' },
  { id:'transfer',    label:'Bank Transfer',        icon:'🏦' },
  { id:'paystack',    label:'Paystack',             icon:'🟢' },
  { id:'flutterwave', label:'Flutterwave',          icon:'🦋' },
  { id:'pos',         label:'POS on Delivery',      icon:'📟' },
  { id:'cash',        label:'Cash on Delivery',     icon:'💵' },
]
