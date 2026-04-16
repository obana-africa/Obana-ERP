import { ACTIVE_DISCOUNTS } from '../data/discounts'

export const applyDiscount = (code, cartItems, subtotal) => {
  const disc = ACTIVE_DISCOUNTS.find(
    d => d.code === code?.toUpperCase() && d.status === 'active'
  )
  if (!disc) return { error: 'Invalid or inactive discount code' }
  if (disc.minOrder && subtotal < disc.minOrder)
    return { error: `Minimum order of ₦${disc.minOrder.toLocaleString()} required` }
  if (disc.type === 'percentage')
    return { savings: subtotal * (disc.value / 100), code: disc.code, label: `${disc.value}% off`, type: 'percentage', value: disc.value }
  if (disc.type === 'fixed')
    return { savings: disc.value, code: disc.code, label: `₦${disc.value.toLocaleString()} off`, type: 'fixed', value: disc.value }
  if (disc.type === 'bogo')
    return { code: disc.code, label: `Buy ${disc.buyQty} Get ${disc.getQty} Free`, type: 'bogo', buyQty: disc.buyQty, getQty: disc.getQty }
  return { error: 'Code not applicable to this order' }
}

export const getAutoDiscounts = (cartItems, subtotal) => {
  const result = []
  const totalQty = cartItems.reduce((a, i) => a + i.qty, 0)

  const mb = ACTIVE_DISCOUNTS.find(
    d => d.type === 'multibuy' && d.auto &&
    totalQty >= d.multipleOf && totalQty % d.multipleOf === 0
  )
  if (mb) result.push({
    savings: subtotal * (mb.value / 100),
    label: `Multi-buy ×${mb.multipleOf} (${mb.value}% off)`
  })

  const fs = ACTIVE_DISCOUNTS.find(
    d => d.type === 'freeShipping' && d.auto && subtotal >= d.minOrder
  )
  if (fs) result.push({ freeShipping: true, label: 'Free shipping applied' })

  return result
}