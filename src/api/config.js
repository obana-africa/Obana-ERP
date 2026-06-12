/**
 * API configuration.
 *
 * The `VITE_USE_FAKE_API` env flag decides whether to use the in-memory fake
 * API client or a real one against `VITE_API_BASE_URL`. Default: fake.
 *
 * To use the real backend, add to your `.env.local`:
 *   VITE_USE_FAKE_API=false
 *   VITE_API_BASE_URL=https://api.yourapp.com
 *
 * To force the fake API in any environment (e.g. for offline demos):
 *   VITE_USE_FAKE_API=true
 */

const env = import.meta.env || {}

export const API_CONFIG = {
  useFakeApi: env.VITE_USE_FAKE_API !== 'false',
  baseUrl:    env.VITE_API_BASE_URL || '',
  timeout:    Number(env.VITE_API_TIMEOUT) || 15000,
  // Simulated latency for the fake API. Lets you see loading states during dev.
  fakeLatency: {
    min: Number(env.VITE_FAKE_LATENCY_MIN) || 250,
    max: Number(env.VITE_FAKE_LATENCY_MAX) || 600,
  },
  // Random fake-failure rate (0–1). Useful for testing error UI. Default off.
  fakeErrorRate: Number(env.VITE_FAKE_ERROR_RATE) || 0,
}

export const isFakeApi = () => API_CONFIG.useFakeApi