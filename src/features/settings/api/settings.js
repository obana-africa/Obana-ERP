/**
 * Settings API client.
 *
 * One file holds the fake AND real implementations of every settings
 * resource. The `VITE_USE_FAKE_API` env flag (from src/api/config) decides
 * which one is exported — so every consumer (hook, panel) is agnostic.
 *
 * ⚠️ When you connect the real backend, only the `realSettings` block and
 * the endpoint paths inside it change. Nothing else.
 *
 * Each resource follows the same contract:
 *   - get()           → returns the saved settings document
 *   - save(payload)   → persists and returns the saved document
 *
 * Resources that are collections (locations, users, sales channels) also expose:
 *   - list(), create(), update(id, ...), remove(id), and resource-specific actions
 */

import { isFakeApi } from '../../../api/config'
import { httpClient } from '../../../api/client'
import { ApiError } from '../../../api/errors'
import { fakeNetwork } from '../../../api/fakeLatency'

/* ════════════════════════════════════════════════════════════
   SEED DATA — only used by the fake implementation
   ════════════════════════════════════════════════════════════ */

const SEED = {
  general: {
    storeName: 'My Store',
    storeEmail: 'mystore@email.com',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    country: 'Nigeria',
    zip: '',
    currency: 'NGN',
    unitSystem: 'metric',
    weightUnit: 'kg',
    timezone: 'Africa/Lagos',
    orderPrefix: '#',
    orderSuffix: '',
    autoFulfill: 'none',
    autoArchive: true,
  },

  notifications: {
    newOrder: true, orderFulfilled: true, orderCancelled: true,
    lowStock: true, newCustomer: false, paymentFailed: true,
    refundRequested: true, reviewPosted: false,
    emailNewOrder: true, smsNewOrder: false,
    emailMarketing: true,
  },

  locations: [
    {
      id: 'loc-1',
      name: 'LEKKI OUTLET',
      address: '7 Oriwu Street',
      city: 'Lekki',
      state: 'Lagos',
      country: 'Nigeria',
      zip: '106104',
      phone: '+234 801 234 5678',
      posSubscription: 'POS Lite',
      isActive: true,
      isDefault: false,
      isStorefront: true,
      fulfillsOnline: true,
      createdAt: '2024-01-15',
    },
    {
      id: 'loc-2',
      name: 'OPEBI OUTLET',
      address: '7b Opebi Road',
      city: 'Opebi',
      state: 'Lagos',
      country: 'Nigeria',
      zip: '101233',
      phone: '+234 802 345 6789',
      posSubscription: 'POS Lite',
      isActive: true,
      isDefault: true,
      isStorefront: true,
      fulfillsOnline: true,
      createdAt: '2024-02-10',
    },
  ],
}

/* ════════════════════════════════════════════════════════════
   FAKE IMPLEMENTATION
   Mutable in-memory store + simulated latency
   ════════════════════════════════════════════════════════════ */

let _store = {
  general:       { ...SEED.general },
  notifications: { ...SEED.notifications },
  locations:     [...SEED.locations],
  // Plan/Billing/Users/Payments/Checkout/etc. seeds added in Phase 2
}

// Helper for simple "get one document, save one document" resources.
const makeDocResource = (key) => ({
  async get() {
    await fakeNetwork()
    return { ..._store[key] }
  },
  async save(payload) {
    await fakeNetwork()
    _store[key] = { ..._store[key], ...payload }
    return { ..._store[key] }
  },
})

const fakeSettings = {
  general:       makeDocResource('general'),
  notifications: makeDocResource('notifications'),

  // Locations is a collection — full CRUD
  locations: {
    async list() {
      await fakeNetwork()
      return [..._store.locations]
    },

    async getById(id) {
      await fakeNetwork()
      const found = _store.locations.find(l => l.id === id)
      if (!found) throw new ApiError({ status: 404, code: 'NOT_FOUND', message: `Location ${id} not found` })
      return { ...found }
    },

    async create(data) {
      await fakeNetwork()
      const created = {
        ...data,
        id: `loc-${Date.now()}`,
        isActive: true,
        isDefault: false,
        posSubscription: data.posSubscription || 'POS Lite',
        createdAt: new Date().toISOString().split('T')[0],
      }
      _store.locations = [..._store.locations, created]
      return created
    },

    async update(id, data) {
      await fakeNetwork()
      const idx = _store.locations.findIndex(l => l.id === id)
      if (idx === -1) throw new ApiError({ status: 404, code: 'NOT_FOUND', message: `Location ${id} not found` })
      const updated = { ..._store.locations[idx], ...data, id }
      _store.locations = [
        ..._store.locations.slice(0, idx),
        updated,
        ..._store.locations.slice(idx + 1),
      ]
      return updated
    },

    async remove(id) {
      await fakeNetwork()
      _store.locations = _store.locations.filter(l => l.id !== id)
      return { id }
    },

    async setDefault(id) {
      await fakeNetwork()
      _store.locations = _store.locations.map(l => ({ ...l, isDefault: l.id === id }))
      return _store.locations.find(l => l.id === id)
    },

    async toggleActive(id) {
      await fakeNetwork()
      const idx = _store.locations.findIndex(l => l.id === id)
      if (idx === -1) throw new ApiError({ status: 404, code: 'NOT_FOUND', message: `Location ${id} not found` })
      const updated = { ..._store.locations[idx], isActive: !_store.locations[idx].isActive }
      _store.locations = [
        ..._store.locations.slice(0, idx),
        updated,
        ..._store.locations.slice(idx + 1),
      ]
      return updated
    },
  },
}

/* ════════════════════════════════════════════════════════════
   REAL IMPLEMENTATION
   Endpoint paths are placeholders — adjust to your backend.
   ════════════════════════════════════════════════════════════ */

// Helper for simple document resources
const makeRealDocResource = (path) => ({
  async get() {
    const { data } = await httpClient.get(path)
    return data
  },
  async save(payload) {
    const { data } = await httpClient.put(path, payload)
    return data
  },
})

const realSettings = {
  general:       makeRealDocResource('/settings/general'),
  notifications: makeRealDocResource('/settings/notifications'),

  locations: {
    async list() {
      const { data } = await httpClient.get('/settings/locations')
      return data
    },
    async getById(id) {
      const { data } = await httpClient.get(`/settings/locations/${id}`)
      return data
    },
    async create(body) {
      const { data } = await httpClient.post('/settings/locations', body)
      return data
    },
    async update(id, body) {
      const { data } = await httpClient.patch(`/settings/locations/${id}`, body)
      return data
    },
    async remove(id) {
      await httpClient.delete(`/settings/locations/${id}`)
      return { id }
    },
    async setDefault(id) {
      const { data } = await httpClient.patch(`/settings/locations/${id}/set-default`)
      return data
    },
    async toggleActive(id) {
      const { data } = await httpClient.patch(`/settings/locations/${id}/toggle-active`)
      return data
    },
  },
}

/* ════════════════════════════════════════════════════════════
   EXPORT — single facade
   ════════════════════════════════════════════════════════════ */

export const settingsApi = isFakeApi() ? fakeSettings : realSettings

// Dev/test escape hatch — reset the in-memory store
export const __dangerouslyResetFakeStore = () => {
  _store = {
    general:       { ...SEED.general },
    notifications: { ...SEED.notifications },
    locations:     [...SEED.locations],
  }
}