import { toast as sonner } from 'sonner'
import { ApiError } from '../api/errors'

/**
 * Thin wrapper over sonner so the rest of the app doesn't import sonner
 * directly. Lets us swap notification libraries later by editing one file.
 *
 * Mount the <Toaster /> from sonner once near the root of your app:
 *
 *   import { Toaster } from 'sonner'
 *   <Toaster position="top-right" richColors closeButton />
 */
export const toast = {
  success: (message, options) => sonner.success(message, options),

  error: (messageOrError, options) => {
    const msg = messageOrError instanceof Error
      ? (messageOrError instanceof ApiError ? messageOrError.userMessage : messageOrError.message)
      : messageOrError
    return sonner.error(msg, options)
  },

  info:    (message, options) => sonner.info(message, options),
  warning: (message, options) => sonner.warning(message, options),
  loading: (message, options) => sonner.loading(message, options),

  promise: (promise, msgs, options) => sonner.promise(promise, msgs, options),

  dismiss: id => sonner.dismiss(id),
}