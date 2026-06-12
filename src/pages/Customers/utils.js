import { AVATAR_COLORS } from '../../data/customers'

// Deterministic avatar color from name — same person always gets the same color.
export const getAvatarColor = name =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length]

export const getInitials = name =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

// Build a deterministic next customer ID. In production this comes from the
// backend; until then we generate locally so the UI stays consistent.
export const nextCustomerId = existing => {
  const max = existing.reduce((m, c) => {
    const n = parseInt(c.id.replace(/\D/g, ''), 10)
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `CUS-${String(max + 1).padStart(3, '0')}`
}

const today = () => new Date().toISOString().split('T')[0]

export const buildNewCustomer = (data, existing) => ({
  ...data,
  id: nextCustomerId(existing),
  totalOrders: 0,
  totalSpent: 0,
  firstOrder: today(),
  lastOrder: today(),
  orders: [],
})