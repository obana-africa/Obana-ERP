// Segments double as URL routes: /customers/segments/:key
// Filter predicates stay co-located with their labels so adding a new segment
// is a one-line change.

export const SEGMENTS = [
  { key: 'all',      label: 'All Customers', filter: () => true                   },
  { key: 'vip',      label: 'VIP',           filter: c => c.tag === 'VIP'         },
  { key: 'regular',  label: 'Regular',       filter: c => c.tag === 'Regular'     },
  { key: 'new',      label: 'New',           filter: c => c.tag === 'New'         },
  { key: 'at-risk',  label: 'At Risk',       filter: c => c.tag === 'At Risk'     },
  { key: 'inactive', label: 'Inactive',      filter: c => c.status === 'inactive' },
]

export const DEFAULT_SEGMENT = 'all'
export const isValidSegment = key => SEGMENTS.some(s => s.key === key)
export const getSegmentByKey = key =>
  SEGMENTS.find(s => s.key === key) || SEGMENTS[0]

export const segmentPath = key =>
  key === DEFAULT_SEGMENT ? '/customers' : `/customers/segments/${key}`

export const SORT_OPTIONS = [
  { value: 'recent', label: 'Sort: Recent'        },
  { value: 'spent',  label: 'Sort: Top Spenders'  },
  { value: 'orders', label: 'Sort: Most Orders'   },
  { value: 'name',   label: 'Sort: Name A–Z'      },
]

export const SORT_FNS = {
  recent: (a, b) => new Date(b.lastOrder) - new Date(a.lastOrder),
  spent:  (a, b) => b.totalSpent  - a.totalSpent,
  orders: (a, b) => b.totalOrders - a.totalOrders,
  name:   (a, b) => a.name.localeCompare(b.name),
}

export const NIGERIAN_STATES = ['Lagos', 'Abuja', 'Rivers', 'Kano', 'Oyo', 'Enugu']

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]
export const DEFAULT_PAGE_SIZE = 25