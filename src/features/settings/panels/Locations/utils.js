export const MAX_LOCATIONS = 10

export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos',
  'Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara',
]

export const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Other']

export const fullAddress = (loc) =>
  [loc.address, loc.city, loc.state, loc.country].filter(Boolean).join(', ')

export const initials = (name) =>
  (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

export const BLANK_LOCATION = {
  name: '',
  address: '',
  city: '',
  state: '',
  country: 'Nigeria',
  zip: '',
  phone: '',
  isStorefront: true,
  fulfillsOnline: true,
}

export const FILTER_TABS = [
  { key: 'all',      label: 'All' },
  { key: 'active',   label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
  { key: 'pos_pro',  label: 'POS Pro' },
  { key: 'pos_lite', label: 'POS Lite' },
]

export const matchFilter = (loc, filter) => {
  switch (filter) {
    case 'active':   return loc.isActive
    case 'inactive': return !loc.isActive
    case 'pos_pro':  return loc.posSubscription === 'POS Pro'
    case 'pos_lite': return loc.posSubscription === 'POS Lite'
    default:         return true
  }
}

export const sortLocations = (list, sortBy) => {
  const copy = [...list]
  switch (sortBy) {
    case 'name':    return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'status':  return copy.sort((a, b) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0))
    case 'default': return copy.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0))
    default:        return copy
  }
}