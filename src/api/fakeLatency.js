import { API_CONFIG } from './config'
import { ApiError } from './errors'

/**
 * Simulates network latency for the fake API so loading states are visible
 * during dev. Also optionally throws a fake error per `fakeErrorRate` for
 * exercising error UI without taking down a real backend.
 */
export async function fakeNetwork() {
  const { min, max } = API_CONFIG.fakeLatency
  const delay = Math.random() * (max - min) + min
  await new Promise(r => setTimeout(r, delay))

  if (API_CONFIG.fakeErrorRate > 0 && Math.random() < API_CONFIG.fakeErrorRate) {
    throw new ApiError({
      code: 'SERVER_ERROR',
      status: 500,
      message: '[fake] Simulated server error',
    })
  }
}