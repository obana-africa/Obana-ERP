import axios from 'axios'
import { API_CONFIG } from './config'
import { ApiError } from './errors'

/**
 * Axios instance for all real API calls. Centralized so:
 *   - Base URL and timeout come from env
 *   - Auth tokens are attached automatically
 *   - All errors are normalized to ApiError
 *   - 401 responses can trigger a global sign-out
 *
 * When `useAuth` exposes a real token getter, replace the placeholder below.
 */

export const httpClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: API_CONFIG.timeout,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: attach auth token ───────────────────────────────
httpClient.interceptors.request.use(config => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Response: normalize errors ───────────────────────────────
httpClient.interceptors.response.use(
  response => response,
  error => {
    const apiError = ApiError.fromAxios(error)
    if (apiError.code === 'UNAUTHORIZED') onUnauthorized()
    return Promise.reject(apiError)
  }
)

// ── Auth hooks (replace with your real auth wiring) ──────────
let _tokenGetter = () => null
let _onUnauthorized = () => {
  // Default: redirect to login. Replace via configureAuth().
  if (typeof window !== 'undefined') window.location.href = '/login'
}
const getAuthToken     = () => _tokenGetter()
const onUnauthorized   = () => _onUnauthorized()

/**
 * Call once at app startup to wire the HTTP client into your auth system.
 *
 *   configureAuth({
 *     getToken: () => authStore.token,
 *     onUnauthorized: () => authStore.signOut(),
 *   })
 */
export function configureAuth({ getToken, onUnauthorized }) {
  if (typeof getToken === 'function') _tokenGetter = getToken
  if (typeof onUnauthorized === 'function') _onUnauthorized = onUnauthorized
}