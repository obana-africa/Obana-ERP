import { ICONS } from './icons'

/**
 * Settings navigation. Each entry maps to a route segment and a panel.
 * Adding a panel = adding one entry here + one route in routes.jsx + one panel folder.
 */
export const SETTINGS_NAV = [
  { id: 'general',           label: 'General',             icon: ICONS.home,        path: 'general'           },
  { id: 'plan',              label: 'Plan',                icon: ICONS.star,        path: 'plan'              },
  { id: 'billing',           label: 'Billing',             icon: ICONS.card,        path: 'billing'           },
  { id: 'users',             label: 'Users',               icon: ICONS.users,       path: 'users'             },
  { id: 'payments',          label: 'Payments',            icon: ICONS.card,        path: 'payments'          },
  { id: 'checkout',          label: 'Checkout',            icon: ICONS.cart,        path: 'checkout'          },
  { id: 'customer_accounts', label: 'Customer accounts',   icon: ICONS.userAccount, path: 'customer-accounts' },
  { id: 'shipping',          label: 'Shipping & Delivery', icon: ICONS.truck,       path: 'shipping'          },
  { id: 'taxes',             label: 'Taxes & Duties',      icon: ICONS.doc,         path: 'taxes'             },
  { id: 'locations',         label: 'Locations',           icon: ICONS.pin,         path: 'locations'         },
  { id: 'sales_channels',    label: 'Sales channels',      icon: ICONS.grid,        path: 'sales-channels'    },
  { id: 'notifications',     label: 'Notifications',       icon: ICONS.bell,        path: 'notifications'     },
  { id: 'security',          label: 'Security',            icon: ICONS.shield,      path: 'security'          },
  { id: 'policies',          label: 'Policies',            icon: ICONS.doc,         path: 'policies'          },
]

export const DEFAULT_PANEL = 'general'

export const findNavByPath = (path) => SETTINGS_NAV.find(n => n.path === path)