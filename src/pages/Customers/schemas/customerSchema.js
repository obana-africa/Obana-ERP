import { z } from 'zod'

/**
 * Validation schema for create/update customer payloads.
 * Used both by the form (inline field errors) and by the API client (defense
 * in depth in case a caller bypasses the form).
 *
 * Keep this schema in sync with the backend's expected shape. When you
 * connect a real backend, the server is still the source of truth — this
 * just shields the user from obvious mistakes before round-tripping.
 */

const NIGERIAN_PHONE = /^(\+234|0)[789]\d{9}$/

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name must be at most 80 characters'),

  email: z
    .string()
    .trim()
    .email('Enter a valid email')
    .max(120)
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .regex(NIGERIAN_PHONE, 'Enter a valid Nigerian phone (e.g. 08012345678 or +2348012345678)'),

  city:  z.string().trim().min(2, 'City is required').max(60),
  state: z.string().trim().min(2, 'State is required').max(60),

  tag:    z.enum(['VIP', 'Regular', 'New', 'At Risk']),
  status: z.enum(['active', 'inactive']),

  notes: z.string().max(1000).optional().or(z.literal('')),
})

export const customerCreateSchema = customerSchema
export const customerUpdateSchema = customerSchema.partial()

/**
 * Convert Zod errors to a flat `{ field: 'message' }` object.
 */
export function zodErrorsToFieldMap(zodError) {
  const out = {}
  for (const issue of zodError.issues) {
    const key = issue.path.join('.') || '_root'
    if (!out[key]) out[key] = issue.message
  }
  return out
}

/**
 * Validate and return either `{ success: true, data }` or
 * `{ success: false, errors }`. Never throws.
 */
export function validateCustomer(input, { partial = false } = {}) {
  const schema = partial ? customerUpdateSchema : customerCreateSchema
  const result = schema.safeParse(input)
  if (result.success) return { success: true, data: result.data }
  return { success: false, errors: zodErrorsToFieldMap(result.error) }
}