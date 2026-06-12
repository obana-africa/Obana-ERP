/**
 * Customers API client.
 *
 * ⚠️  This is the ONLY file that changes when you connect a real backend.
 *
 * Both `fake` and `real` implementations export the same async functions
 * with identical signatures and response shapes, so every consumer (hooks,
 * components) is agnostic to which one is active.
 */

import { isFakeApi } from './config'
import { httpClient } from './client'
import { ApiError } from './errors'
import { fakeNetwork } from './fakeLatency'
// import { SAMPLE_CUSTOMERS } from '../../data/customers'

/* ────────────────────────────────────────────────────────────
   SHARED TYPES (documented as JSDoc — convert to .ts later)
   ────────────────────────────────────────────────────────────
   ListParams: {
     segment?: string,
     search?:  string,
     state?:   string,
     sort?:    'recent' | 'spent' | 'orders' | 'name',
     page?:    number,  // 1-indexed
     pageSize?: number,
   }

   ListResponse: {
     items:    Customer[],
     total:    number,
     page:     number,
     pageSize: number,
   }

   StatsResponse: {
     totalCustomers: { current, previous, delta, dir },
     totalRevenue:   { current, previous, delta, dir },
     vipCustomers:   { current, previous, delta, dir },
     avgOrderValue:  { current, previous, delta, dir },
     spark?: { revenue: number[], customers: number[] },
   }
   ──────────────────────────────────────────────────────────── */

const DEFAULT_PAGE_SIZE = 25

// ════════════════════════════════════════════════════════════
//  FAKE IMPLEMENTATION
//  In-memory store, simulated latency, server-shaped responses
// ════════════════════════════════════════════════════════════

let _store = [...SAMPLE_CUSTOMERS]

const SEGMENT_FILTERS = {
  all:        () => true,
  vip:        c => c.tag === 'VIP',
  regular:    c => c.tag === 'Regular',
  new:        c => c.tag === 'New',
  'at-risk':  c => c.tag === 'At Risk',
  inactive:   c => c.status === 'inactive',
}

const SORT_FNS = {
  recent: (a, b) => new Date(b.lastOrder) - new Date(a.lastOrder),
  spent:  (a, b) => b.totalSpent  - a.totalSpent,
  orders: (a, b) => b.totalOrders - a.totalOrders,
  name:   (a, b) => a.name.localeCompare(b.name),
}

const today = () => new Date().toISOString().split('T')[0]

const nextId = () => {
  const max = _store.reduce((m, c) => {
    const n = parseInt(c.id.replace(/\D/g, ''), 10)
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `CUS-${String(max + 1).padStart(3, '0')}`
}

const fakeCustomers = {
  async list({ segment = 'all', search = '', state = 'all', sort = 'recent',
              page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) {
    await fakeNetwork()

    const segFn  = SEGMENT_FILTERS[segment] || SEGMENT_FILTERS.all
    const sortFn = SORT_FNS[sort] || SORT_FNS.recent
    const q = search.trim().toLowerCase()

    const filtered = _store
      .filter(segFn)
      .filter(c => {
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q)
        const matchesState = state === 'all' ||
          c.state.toLowerCase().includes(state.toLowerCase())
        return matchesSearch && matchesState
      })
      .sort(sortFn)

    const total = filtered.length
    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return { items, total, page, pageSize }
  },

  async getById(id) {
    await fakeNetwork()
    const found = _store.find(c => c.id === id)
    if (!found) {
      throw new ApiError({ status: 404, code: 'NOT_FOUND', message: `Customer ${id} not found` })
    }
    return found
  },

  async create(data) {
    await fakeNetwork()
    const created = {
      ...data,
      id: nextId(),
      totalOrders: 0,
      totalSpent: 0,
      firstOrder: today(),
      lastOrder: today(),
      orders: [],
    }
    _store = [..._store, created]
    return created
  },

  async update(id, data) {
    await fakeNetwork()
    const idx = _store.findIndex(c => c.id === id)
    if (idx === -1) {
      throw new ApiError({ status: 404, code: 'NOT_FOUND', message: `Customer ${id} not found` })
    }
    const updated = { ..._store[idx], ...data, id }
    _store = [..._store.slice(0, idx), updated, ..._store.slice(idx + 1)]
    return updated
  },

  async delete(id) {
    await fakeNetwork()
    const exists = _store.some(c => c.id === id)
    if (!exists) {
      throw new ApiError({ status: 404, code: 'NOT_FOUND', message: `Customer ${id} not found` })
    }
    _store = _store.filter(c => c.id !== id)
    return { id }
  },

  async bulkDelete(ids) {
    await fakeNetwork()
    const set = new Set(ids)
    _store = _store.filter(c => !set.has(c.id))
    return { deleted: ids.length }
  },

  async bulkUpdateTag(ids, tag) {
    await fakeNetwork()
    const set = new Set(ids)
    _store = _store.map(c => (set.has(c.id) ? { ...c, tag } : c))
    return { updated: ids.length }
  },

  async stats() {
    await fakeNetwork()
    const cs = _store

    const totalCustomers = cs.length
    const totalRevenue   = cs.reduce((a, c) => a + c.totalSpent,  0)
    const totalOrders    = cs.reduce((a, c) => a + c.totalOrders, 0)
    const vipCustomers   = cs.filter(c => c.tag === 'VIP').length
    const avgOrderValue  = Math.round(totalRevenue / Math.max(totalOrders, 1))

    // Synthesized "previous period" so trend deltas exist for the UI to render.
    const synth = current => {
      const previous = Math.round(current * (0.85 + Math.random() * 0.2))
      const diff = current - previous
      const pct = previous === 0 ? 0 : (diff / previous) * 100
      return {
        current,
        previous,
        delta: pct === 0 ? '—' : `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%`,
        dir: pct > 0.5 ? 'up' : pct < -0.5 ? 'down' : 'flat',
      }
    }

    return {
      totalCustomers: synth(totalCustomers),
      totalRevenue:   synth(totalRevenue),
      vipCustomers:   synth(vipCustomers),
      avgOrderValue:  synth(avgOrderValue),
      activeCount:    cs.filter(c => c.status === 'active').length,
      segmentCounts: {
        all:        cs.length,
        vip:        cs.filter(c => c.tag === 'VIP').length,
        regular:    cs.filter(c => c.tag === 'Regular').length,
        new:        cs.filter(c => c.tag === 'New').length,
        'at-risk':  cs.filter(c => c.tag === 'At Risk').length,
        inactive:   cs.filter(c => c.status === 'inactive').length,
      },
    }
  },

  async exportCsv({ segment, search, state, sort } = {}) {
    // For the fake API, request all matching records (page size large enough
    // to cover the dataset), then build the CSV in the browser.
    const { items } = await this.list({ segment, search, state, sort, page: 1, pageSize: 10_000 })
    return { rows: items }
  },
}

// ════════════════════════════════════════════════════════════
//  REAL IMPLEMENTATION
//  Talks to the actual backend via httpClient.
//  Endpoint paths are placeholders — adjust to your API.
// ════════════════════════════════════════════════════════════

const realCustomers = {
  async list(params = {}) {
    const { data } = await httpClient.get('/customers', { params })
    return data
  },

  async getById(id) {
    const { data } = await httpClient.get(`/customers/${id}`)
    return data
  },

  async create(body) {
    const { data } = await httpClient.post('/customers', body)
    return data
  },

  async update(id, body) {
    const { data } = await httpClient.patch(`/customers/${id}`, body)
    return data
  },

  async delete(id) {
    await httpClient.delete(`/customers/${id}`)
    return { id }
  },

  async bulkDelete(ids) {
    const { data } = await httpClient.post('/customers/bulk-delete', { ids })
    return data
  },

  async bulkUpdateTag(ids, tag) {
    const { data } = await httpClient.post('/customers/bulk-tag', { ids, tag })
    return data
  },

  async stats() {
    const { data } = await httpClient.get('/customers/stats')
    return data
  },

  async exportCsv(params = {}) {
    // Backend should return a presigned URL or job id; here we assume URL.
    const { data } = await httpClient.post('/customers/export', params)
    return data
  },
}

// ════════════════════════════════════════════════════════════
//  EXPORT — single facade
// ════════════════════════════════════════════════════════════

export const customersApi = isFakeApi() ? fakeCustomers : realCustomers

// Re-export for tests/dev tools that may want to reset the in-memory store
export const __dangerouslyResetFakeStore = () => {
  _store = [...SAMPLE_CUSTOMERS]
}