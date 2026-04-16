export const SAMPLE_CUSTOMERS = [
  {
    id:'CUS-001', name:'Adaeze Okonkwo', email:'adaeze@gmail.com', phone:'+234 803 123 4567',
    address:'14 Adeola Odeku, Victoria Island, Lagos', city:'Lagos', state:'Lagos',
    totalOrders:8, totalSpent:186000, lastOrder:'2026-04-01', firstOrder:'2025-06-12',
    status:'active', tag:'VIP', channel:'Website',
    notes:'Prefers express delivery. Allergic to synthetic fabrics.',
    orders:[
      { id:'ORD-1001', date:'2026-04-01', total:52000, status:'completed' },
      { id:'ORD-0994', date:'2026-02-14', total:45000, status:'completed' },
      { id:'ORD-0981', date:'2025-12-25', total:38000, status:'completed' },
    ],
  },
  {
    id:'CUS-002', name:'Emmanuel Bassey', email:'emma.b@yahoo.com', phone:'+234 812 987 6543',
    address:'7 Wuse Zone 4, Abuja', city:'Abuja', state:'FCT',
    totalOrders:3, totalSpent:54000, lastOrder:'2026-04-02', firstOrder:'2025-10-05',
    status:'active', tag:'Regular', channel:'Instagram', notes:'',
    orders:[
      { id:'ORD-1002', date:'2026-04-02', total:18000, status:'pending'   },
      { id:'ORD-0972', date:'2025-12-01', total:24000, status:'completed' },
    ],
  },
  {
    id:'CUS-003', name:'Fatima Kabir', email:'fatimak@hotmail.com', phone:'+234 706 234 5678',
    address:'22 Ahmadu Bello Way, Kano', city:'Kano', state:'Kano',
    totalOrders:5, totalSpent:112000, lastOrder:'2026-04-03', firstOrder:'2025-08-20',
    status:'active', tag:'VIP', channel:'WhatsApp',
    notes:'Bulk buyer. Give 5% discount on orders over ₦50k.',
    orders:[
      { id:'ORD-1003', date:'2026-04-03', total:28000, status:'processing' },
      { id:'ORD-0988', date:'2026-01-15', total:56000, status:'completed'  },
    ],
  },
  {
    id:'CUS-004', name:'Chukwuemeka Ibe', email:'emeka.ibe@gmail.com', phone:'+234 909 876 5432',
    address:'5 Rumuola Road, Port Harcourt', city:'Port Harcourt', state:'Rivers',
    totalOrders:2, totalSpent:46000, lastOrder:'2026-03-30', firstOrder:'2025-11-10',
    status:'active', tag:'New', channel:'Website', notes:'',
    orders:[
      { id:'ORD-1004', date:'2026-03-30', total:24000, status:'completed' },
      { id:'ORD-0977', date:'2025-11-10', total:22000, status:'completed' },
    ],
  },
  {
    id:'CUS-005', name:'Ngozi Eze', email:'ngozi.e@gmail.com', phone:'+234 803 456 7890',
    address:'19 Ogui Road, Enugu', city:'Enugu', state:'Enugu',
    totalOrders:1, totalSpent:22000, lastOrder:'2026-03-28', firstOrder:'2026-03-28',
    status:'inactive', tag:'New', channel:'Website', notes:'',
    orders:[{ id:'ORD-1005', date:'2026-03-28', total:22000, status:'cancelled' }],
  },
  {
    id:'CUS-006', name:'Bola Adesanya', email:'bola.a@outlook.com', phone:'+234 817 654 3210',
    address:'8 Bodija Market, Ibadan', city:'Ibadan', state:'Oyo',
    totalOrders:6, totalSpent:134000, lastOrder:'2026-04-04', firstOrder:'2025-05-01',
    status:'active', tag:'VIP', channel:'Facebook',
    notes:'Wholesale buyer. Monthly reorder.',
    orders:[{ id:'ORD-1006', date:'2026-04-04', total:45000, status:'pending' }],
  },
]

export const TAG_CONFIG = {
  VIP:      { bg:'#FEF3C7', color:'#92400E', border:'#FDE68A' },
  Regular:  { bg:'#EFF6FF', color:'#1E40AF', border:'#BFDBFE' },
  New:      { bg:'#ECFDF5', color:'#065F46', border:'#A7F3D0' },
  'At Risk':{ bg:'#FEF2F2', color:'#991B1B', border:'#FECACA' },
}

export const STATUS_CFG = {
  active:   { bg:'#ECFDF5', color:'#059669' },
  inactive: { bg:'#F3F4F6', color:'#6B7280' },
  blocked:  { bg:'#FEF2F2', color:'#DC2626' },
}

export const ORDER_STATUS_CFG = {
  completed:  { bg:'#ECFDF5', color:'#059669' },
  pending:    { bg:'#FFFBEB', color:'#D97706' },
  processing: { bg:'#EFF6FF', color:'#2563EB' },
  cancelled:  { bg:'#FEF2F2', color:'#DC2626' },
}

export const AVATAR_COLORS = [
  { bg:'#1a1a2e', color:'#E8C547' },
  { bg:'#2DBD97', color:'#fff'    },
  { bg:'#E8C547', color:'#1a1a2e' },
  { bg:'#3B82F6', color:'#fff'    },
  { bg:'#8B5CF6', color:'#fff'    },
  { bg:'#EC4899', color:'#fff'    },
]

export const NIGERIAN_STATES = [
  'Lagos','Abuja (FCT)','Rivers','Kano','Oyo','Delta','Enugu',
  'Kaduna','Anambra','Kwara','Osun','Ondo','Ekiti','Ogun','Edo',
  'Imo','Abia','Akwa Ibom','Bayelsa','Cross River',
]

export const CHANNELS = ['Website','Instagram','WhatsApp','Facebook','Referral','POS','Other']
export const TAGS     = ['VIP','Regular','New','At Risk','Wholesale']
