import { z } from 'zod'

export const locationSchema = z.object({
  name:           z.string().trim().min(2, 'Name is required (min 2 chars)').max(80),
  address:        z.string().trim().min(2, 'Address is required'),
  city:           z.string().trim().min(1, 'City is required').max(60),
  state:          z.string().trim().min(1, 'State is required').max(60),
  country:        z.string().trim().min(1, 'Country is required').max(60),
  zip:            z.string().trim().max(20).or(z.literal('')),
  phone:          z.string().trim().max(40).or(z.literal('')),
  isStorefront:   z.boolean(),
  fulfillsOnline: z.boolean(),
})

export const validateLocation = (data) => {
  const result = locationSchema.safeParse(data)
  if (result.success) return { success: true, data: result.data }
  const errors = {}
  for (const issue of result.error.issues) {
    const key = issue.path.join('.')
    if (!errors[key]) errors[key] = issue.message
  }
  return { success: false, errors }
}
