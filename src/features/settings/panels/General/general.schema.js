import { z } from 'zod'

export const generalSchema = z.object({
  storeName:    z.string().trim().min(1, 'Store name is required').max(80),
  storeEmail:   z.string().trim().email('Enter a valid email').or(z.literal('')),
  phone:        z.string().trim().max(40).or(z.literal('')),
  address:      z.string().trim().max(120).or(z.literal('')),
  city:         z.string().trim().max(60).or(z.literal('')),
  state:        z.string().trim().max(60).or(z.literal('')),
  country:      z.string().trim().max(60).or(z.literal('')),
  zip:          z.string().trim().max(20).or(z.literal('')),
  currency:     z.enum(['NGN', 'USD', 'GBP', 'EUR', 'GHS', 'KES']),
  unitSystem:   z.enum(['metric', 'imperial']),
  weightUnit:   z.enum(['kg', 'g', 'lb', 'oz']),
  timezone:     z.string(),
  orderPrefix:  z.string().max(10),
  orderSuffix:  z.string().max(10),
  autoFulfill:  z.enum(['all', 'gift', 'none']),
  autoArchive:  z.boolean(),
})