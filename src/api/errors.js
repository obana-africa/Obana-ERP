/**
 * Normalized API error. Every API call — fake or real — rejects with this.
 *
 * UI code can rely on a single shape:
 *   try { ... } catch (e) {
 *     if (e instanceof ApiError && e.status === 404) { ... }
 *     toast.error(e.userMessage)
 *   }
 */
export class ApiError extends Error {
  constructor({ status, code, message, fieldErrors, cause }) {
    super(message)
    this.name = 'ApiError'
    this.status = status                  // HTTP status (or null for network)
    this.code = code                      // app-level code, e.g. 'VALIDATION_ERROR'
    this.fieldErrors = fieldErrors || null // { fieldName: 'message' }
    this.cause = cause
  }

  /** Human-readable message safe to show in a toast. */
  get userMessage() {
    if (this.code === 'NETWORK_ERROR')    return 'Network error. Check your connection and try again.'
    if (this.code === 'TIMEOUT')          return 'The request took too long. Please try again.'
    if (this.code === 'UNAUTHORIZED')     return 'Your session has expired. Please sign in again.'
    if (this.code === 'FORBIDDEN')        return "You don't have permission to do that."
    if (this.code === 'NOT_FOUND')        return 'Not found.'
    if (this.code === 'VALIDATION_ERROR') return this.message || 'Please check the highlighted fields.'
    if (this.code === 'CONFLICT')         return this.message || 'That conflicts with existing data.'
    if (this.code === 'SERVER_ERROR')     return 'Something went wrong on our end. Please try again.'
    return this.message || 'An unexpected error occurred.'
  }

  static fromAxios(err) {
    if (err.code === 'ECONNABORTED') {
      return new ApiError({ code: 'TIMEOUT', message: 'Request timed out', cause: err })
    }
    if (!err.response) {
      return new ApiError({ code: 'NETWORK_ERROR', message: 'Network error', cause: err })
    }
    const { status, data } = err.response
    const code =
      status === 401 ? 'UNAUTHORIZED'
      : status === 403 ? 'FORBIDDEN'
      : status === 404 ? 'NOT_FOUND'
      : status === 409 ? 'CONFLICT'
      : status === 422 ? 'VALIDATION_ERROR'
      : status >= 500  ? 'SERVER_ERROR'
      : 'UNKNOWN_ERROR'
    return new ApiError({
      status,
      code,
      message: data?.message || err.message,
      fieldErrors: data?.errors || null,
      cause: err,
    })
  }
}