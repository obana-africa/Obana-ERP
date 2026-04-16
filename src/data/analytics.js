export const KPI_DATA = {
  'Last 30 days': {
    sessions:       { value: 1209,    change: 28,  up: true  },
    grossSales:     { value: 3910000, change: 29,  up: true  },
    orders:         { value: 94,      change: 18,  up: true  },
    conversionRate: { value: '0.33%', change: 0,   up: null  },
    aov:            { value: 41600,   change: 12,  up: true  },
    cac:            { value: 8200,    change: -5,  up: false },
    turnover:       { value: '2.4x',  change: 8,   up: true  },
    romi:           { value: '3.8x',  change: 14,  up: true  },
  },
  'Last 7 days': {
    sessions:       { value: 342,     change: 11,  up: true  },
    grossSales:     { value: 980000,  change: -4,  up: false },
    orders:         { value: 22,      change: -8,  up: false },
    conversionRate: { value: '0.28%', change: -2,  up: false },
    aov:            { value: 44500,   change: 6,   up: true  },
    cac:            { value: 9100,    change: 3,   up: false },
    turnover:       { value: '0.6x',  change: 2,   up: true  },
    romi:           { value: '2.9x',  change: -6,  up: false },
  },
  'Today': {
    sessions:       { value: 48,      change: 15,  up: true  },
    grossSales:     { value: 132000,  change: 22,  up: true  },
    orders:         { value: 4,       change: 33,  up: true  },
    conversionRate: { value: '0.42%', change: 18,  up: true  },
    aov:            { value: 33000,   change: -4,  up: false },
    cac:            { value: 7600,    change: 8,   up: false },
    turnover:       { value: '0.1x',  change: 5,   up: true  },
    romi:           { value: '4.1x',  change: 20,  up: true  },
  },
}

export const SALES_CHART = {
  'Last 30 days': [120,180,95,210,165,240,190,280,155,320,270,310,195,260,305,175,290,340,220,380,250,295,315,270,340,385,290,420,360,410],
  'Last 7 days':  [180,240,165,310,275,195,260],
  'Today':        [45,82,60,95,110,75,88,120,95,140,105,132],
}

export const CHART_LABELS = {
  'Last 30 days': ['Apr 1','','','Apr 4','','','Apr 7','','','Apr 10','','','Apr 13','','','Apr 16','','','Apr 19','','','Apr 22','','','Apr 25','','','Apr 28','','Apr 30'],
  'Last 7 days':  ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  'Today':        ['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm'],
}

export const TOP_PRODUCTS = [
  { name:'Classic Ankara Dress',   sku:'AKR-001', revenue:1200000, units:80,  margin:40, channel:'Both'   },
  { name:'Leather Crossbody Bag',  sku:'LCB-002', revenue:880000,  units:40,  margin:45, channel:'Online' },
  { name:"Men's Kaftan Set",        sku:'KFT-004', revenue:756000,  units:27,  margin:43, channel:'POS'    },
  { name:'Premium Shea Butter',    sku:'SHB-003', revenue:450000,  units:100, margin:56, channel:'Online' },
  { name:'Ankara Gift Set Bundle', sku:'GFT-005', revenue:420000,  units:12,  margin:43, channel:'Both'   },
]

export const TRAFFIC_SOURCES = [
  { source:'Instagram',     visits:482, pct:40, color:'#E1306C' },
  { source:'Direct / URL',  visits:242, pct:20, color:'#1a1a2e' },
  { source:'WhatsApp',      visits:181, pct:15, color:'#25D366' },
  { source:'Google Search', visits:145, pct:12, color:'#4285F4' },
  { source:'Facebook',      visits:109, pct:9,  color:'#1877F2' },
  { source:'Other',         visits:50,  pct:4,  color:'#9CA3AF' },
]

export const PAYMENT_METHODS_DATA = [
  { method:'Bank Transfer', count:42, pct:45, amount:1755000, color:'#2DBD97' },
  { method:'Card (POS)',    count:28, pct:30, amount:1170000, color:'#1a1a2e' },
  { method:'Cash',          count:14, pct:15, amount:585000,  color:'#E8C547' },
  { method:'Mobile Wallet', count:10, pct:10, amount:390000,  color:'#8B5CF6' },
]

export const STAFF_PERFORMANCE = [
  { name:'Tomiwa A.', role:'Manager',        sales:1800000, orders:42, aov:42857, itemsPerTx:2.8 },
  { name:'Emeka O.',  role:'Sales Associate', sales:1200000, orders:31, aov:38710, itemsPerTx:2.2 },
  { name:'Kemi B.',   role:'Cashier',         sales:910000,  orders:21, aov:43333, itemsPerTx:1.9 },
]

export const CART_ABANDONMENT = [
  { stage:'Visited Store',    count:1209, dropOff:0,  color:'#2DBD97' },
  { stage:'Viewed Product',   count:864,  dropOff:29, color:'#1a1a2e' },
  { stage:'Added to Cart',    count:312,  dropOff:64, color:'#E8C547' },
  { stage:'Reached Checkout', count:148,  dropOff:53, color:'#F59E0B' },
  { stage:'Completed Order',  count:94,   dropOff:36, color:'#EF4444' },
]

export const CUSTOMER_SEGMENTS = [
  { segment:'New Customers',       count:38, revenue:1140000, clv:30000,  color:'#2DBD97', bg:'#ECFDF5' },
  { segment:'Returning Customers', count:41, revenue:1968000, clv:48000,  color:'#1a1a2e', bg:'#EEF2FF' },
  { segment:'VIP (Omnichannel)',   count:15, revenue:802000,  clv:186000, color:'#E8C547', bg:'#FFFBEB' },
]

export const ANALYTICS_TYPES = [
  { type:'Descriptive',  question:'What happened?',    example:'Sales reports, revenue totals, order counts',      color:'#2DBD97', bg:'#ECFDF5', iconPaths:['M18 20V10','M12 20V4','M6 20v-6'] },
  { type:'Diagnostic',   question:'Why did it happen?',example:'High return rates, low conversion on mobile',      color:'#3B82F6', bg:'#EFF6FF', iconPaths:['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z','M12 8h.01M12 12v4'] },
  { type:'Predictive',   question:'What will happen?', example:'Demand forecasting, restock predictions',          color:'#8B5CF6', bg:'#F5F3FF', iconPaths:['M22 12h-4l-3 9L9 3l-3 9H2'] },
  { type:'Prescriptive', question:'What should I do?', example:'Reorder inventory alerts, discount triggers',      color:'#F59E0B', bg:'#FFFBEB', iconPaths:['M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z','m9 12 2 2 4-4'] },
]

export const KPI_DEFINITIONS = [
  { kpi:'AOV',  full:'Average Order Value',            desc:'Average amount spent per transaction across all channels',           formula:'Total Revenue ÷ Number of Orders' },
  { kpi:'CAC',  full:'Customer Acquisition Cost',      desc:'Total marketing spend divided by new customers acquired',            formula:'Marketing Spend ÷ New Customers' },
  { kpi:'CLV',  full:'Customer Lifetime Value',        desc:'Predicted total revenue from a customer over their lifetime',        formula:'AOV × Purchase Frequency × Customer Lifespan', staticValue:48000 },
  { kpi:'ROMI', full:'Return on Marketing Investment', desc:'Profitability of marketing campaigns',                               formula:'(Revenue from Marketing - Cost) ÷ Cost' },
  { kpi:'ITR',  full:'Inventory Turnover Ratio',       desc:'How quickly inventory is sold and replaced',                        formula:'COGS ÷ Average Inventory Value' },
]
