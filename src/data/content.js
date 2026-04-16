export const SEED_BLOGS = [
  {
    id: 'blog-1', title: 'How to Style Ankara for Any Occasion',
    blog: 'Style Guide', author: 'Tomiwa A.', status: 'published',
    date: '2026-04-01', tags: ['ankara','fashion','styling'],
    featuredImg: null, excerpt: 'Discover the versatility of Ankara fabric and how to rock it from office to evening events.',
    content: '', seoTitle: '', seoDesc: '', commentsEnabled: true, commentCount: 4,
  },
  {
    id: 'blog-2', title: '5 Skincare Routines Using Nigerian Ingredients',
    blog: 'Wellness', author: 'Tomiwa A.', status: 'published',
    date: '2026-03-22', tags: ['skincare','beauty','natural'],
    featuredImg: null, excerpt: 'From shea butter to black soap — build your routine with ingredients grown right here.',
    content: '', seoTitle: '', seoDesc: '', commentsEnabled: true, commentCount: 12,
  },
  {
    id: 'blog-3', title: 'Obana Spring/Summer 2026 Lookbook',
    blog: 'Style Guide', author: 'Tomiwa A.', status: 'draft',
    date: '2026-04-08', tags: ['lookbook','collection','2026'],
    featuredImg: null, excerpt: 'A sneak peek at our upcoming seasonal collection — bold colours, rich textures.',
    content: '', seoTitle: '', seoDesc: '', commentsEnabled: false, commentCount: 0,
  },
]

export const SEED_PAGES = [
  { id:'pg-1', title:'About Us',        status:'published', date:'2025-06-01', content:'Our story starts with...', seoTitle:'', seoDesc:'' },
  { id:'pg-2', title:'Contact Us',      status:'published', date:'2025-06-01', content:'Reach us at...',          seoTitle:'', seoDesc:'' },
  { id:'pg-3', title:'Shipping Policy', status:'published', date:'2025-08-14', content:'We ship within...',       seoTitle:'', seoDesc:'' },
  { id:'pg-4', title:'Return Policy',   status:'published', date:'2025-08-14', content:'Returns accepted...',     seoTitle:'', seoDesc:'' },
  { id:'pg-5', title:'FAQ',             status:'draft',     date:'2026-01-10', content:'Frequently asked...',     seoTitle:'', seoDesc:'' },
  { id:'pg-6', title:'Size Guide',      status:'published', date:'2026-02-20', content:'Find your perfect fit...', seoTitle:'', seoDesc:'' },
]

export const SEED_MENUS = [
  {
    id: 'menu-1', name: 'Main Menu', handle: 'main-menu',
    items: [
      { id:'mi-1', label:'Home',    url:'/',            type:'url',        children:[] },
      { id:'mi-2', label:'Shop',    url:'/collections', type:'collection', children:[
        { id:'mi-2a', label:'All Products', url:'/collections/all',  type:'collection', children:[] },
        { id:'mi-2b', label:'New Arrivals', url:'/collections/new',  type:'collection', children:[] },
        { id:'mi-2c', label:'Sale',         url:'/collections/sale', type:'collection', children:[] },
      ]},
      { id:'mi-3', label:'Blog',    url:'/blogs/style-guide', type:'blog', children:[] },
      { id:'mi-4', label:'About',   url:'/pages/about-us',    type:'page', children:[] },
      { id:'mi-5', label:'Contact', url:'/pages/contact-us',  type:'page', children:[] },
    ],
  },
  {
    id: 'menu-2', name: 'Footer Menu', handle: 'footer-menu',
    items: [
      { id:'fi-1', label:'Shipping Policy', url:'/pages/shipping-policy', type:'page', children:[] },
      { id:'fi-2', label:'Return Policy',   url:'/pages/return-policy',   type:'page', children:[] },
      { id:'fi-3', label:'FAQ',             url:'/pages/faq',             type:'page', children:[] },
      { id:'fi-4', label:'Style Guide Blog',url:'/blogs/style-guide',     type:'blog', children:[] },
    ],
  },
]

export const SEED_FILES = [
  { id:'f-1', name:'hero-banner.jpg',        type:'image', size:248000,  url:'#', date:'2026-03-01', alt:'Hero banner image'    },
  { id:'f-2', name:'ankara-dress-front.jpg', type:'image', size:183000,  url:'#', date:'2026-03-15', alt:'Classic Ankara Dress' },
  { id:'f-3', name:'lookbook-spring.pdf',    type:'pdf',   size:1400000, url:'#', date:'2026-04-01', alt:''                     },
  { id:'f-4', name:'size-guide.png',         type:'image', size:92000,   url:'#', date:'2026-02-20', alt:'Size chart'           },
  { id:'f-5', name:'brand-video.mp4',        type:'video', size:8200000, url:'#', date:'2026-03-28', alt:''                     },
  { id:'f-6', name:'shea-butter-product.jpg',type:'image', size:157000,  url:'#', date:'2026-03-10', alt:'Premium Shea Butter'  },
]

export const SEED_METAOBJECTS = [
  {
    id: 'mo-def-1', name: 'Team Members', apiHandle: 'team_member',
    fields: [
      { key:'name',  type:'single_line_text', required:true  },
      { key:'role',  type:'single_line_text', required:true  },
      { key:'bio',   type:'multi_line_text',  required:false },
      { key:'photo', type:'file_reference',   required:false },
    ],
    entries: [
      { id:'e-1', name:'Tomiwa Aleminu', role:'Founder & CEO',       bio:'Passionate about African fashion.',      photo:null },
      { id:'e-2', name:'Kemi Oladele',   role:'Head of Merchandise', bio:'Expert in sourcing quality fabrics.',    photo:null },
    ],
  },
  {
    id: 'mo-def-2', name: 'FAQs', apiHandle: 'faq',
    fields: [
      { key:'question', type:'single_line_text', required:true  },
      { key:'answer',   type:'multi_line_text',  required:true  },
      { key:'category', type:'single_line_text', required:false },
    ],
    entries: [
      { id:'e-3', question:'How long does delivery take?', answer:'Lagos: 1–2 days. Other states: 3–5 days.', category:'Shipping' },
      { id:'e-4', question:'Can I return my order?',       answer:'Yes, within 7 days of delivery.',          category:'Returns'  },
      { id:'e-5', question:'Do you offer custom orders?',  answer:'Yes! Contact us via WhatsApp.',             category:'Orders'   },
    ],
  },
  {
    id: 'mo-def-3', name: 'Brand Stories', apiHandle: 'brand_story',
    fields: [
      { key:'headline', type:'single_line_text', required:true  },
      { key:'body',     type:'multi_line_text',  required:true  },
      { key:'image',    type:'file_reference',   required:false },
      { key:'cta_text', type:'single_line_text', required:false },
      { key:'cta_link', type:'url',              required:false },
    ],
    entries: [
      { id:'e-6', headline:'Made in Nigeria, Worn Everywhere', body:'Our fabrics celebrate the rich textile heritage...', image:null, cta_text:'Shop Now', cta_link:'/collections' },
    ],
  },
]

export const FIELD_TYPE_LABELS = {
  single_line_text: 'Single line text',
  multi_line_text:  'Multi-line text',
  file_reference:   'File / Image',
  url:              'URL',
  number:           'Number',
  boolean:          'True / False',
  date:             'Date',
  color:            'Color',
}

export const FILE_TYPE_ICON = {
  image: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z',
  pdf:   'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  video: 'M15 10l4.553-2.369A1 1 0 0 1 21 8.5v7a1 1 0 0 1-1.447.882L15 14v-4zM3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z',
}
