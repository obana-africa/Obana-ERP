import { useCallback, useMemo, useState } from 'react'
import { SAMPLE_CUSTOMERS } from '../../../data/customers'
import { buildNewCustomer } from '../utils'
import { getSegmentByKey, SORT_FNS } from '../constants/segments'

/**
 * Single source of truth for the customers page data layer.
 *
 * Replace `useState(SAMPLE_CUSTOMERS)` with your fetch/SWR/React Query call
 * when the API is wired up — the rest of this hook (CRUD shape, derived
 * stats, filtering) stays identical.
 */
export function useCustomers() {
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)

  // ── Mutations ────────────────────────────────────────────────
  const createCustomer = useCallback(data => {
    setCustomers(cs => [...cs, buildNewCustomer(data, cs)])
  }, [])

  const updateCustomer = useCallback((id, data) => {
    setCustomers(cs => cs.map(c => (c.id === id ? { ...c, ...data } : c)))
  }, [])

  const deleteCustomer = useCallback(id => {
    setCustomers(cs => cs.filter(c => c.id !== id))
  }, [])

  const deleteMany = useCallback(ids => {
    const set = new Set(ids)
    setCustomers(cs => cs.filter(c => !set.has(c.id)))
  }, [])

  // ── Lookup ───────────────────────────────────────────────────
  const findById = useCallback(
    id => customers.find(c => c.id === id) || null,
    [customers]
  )

  // ── Aggregate stats (memoized) ───────────────────────────────
  const stats = useMemo(() => {
    const totalRevenue = customers.reduce((a, c) => a + c.totalSpent, 0)
    const totalOrders  = customers.reduce((a, c) => a + c.totalOrders, 0)
    const vipCount     = customers.filter(c => c.tag === 'VIP').length
    const activeCount  = customers.filter(c => c.status === 'active').length
    return {
      totalCustomers: customers.length,
      totalRevenue,
      totalOrders,
      vipCount,
      activeCount,
      avgOrderValue: totalRevenue / Math.max(totalOrders, 1),
    }
  }, [customers])

  return {
    customers,
    findById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    deleteMany,
    stats,
  }
}

/**
 * Derives the visible list from filter/sort/search inputs.
 * Kept separate so the data layer above can stay focused on CRUD.
 */
export function useFilteredCustomers(customers, { segment, search, stateFilter, sortBy }) {
  return useMemo(() => {
    const segFn = getSegmentByKey(segment).filter
    const q = search.trim().toLowerCase()
    const sortFn = SORT_FNS[sortBy] || SORT_FNS.recent

    return customers
      .filter(segFn)
      .filter(c => {
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          c.phone.includes(q) ||
          c.id.toLowerCase().includes(q)

        const matchesState =
          stateFilter === 'all' ||
          c.state.toLowerCase().includes(stateFilter.toLowerCase())

        return matchesSearch && matchesState
      })
      .sort(sortFn)
  }, [customers, segment, search, stateFilter, sortBy])
}

/**
 * Count of customers per segment, for the segment-tab badges.
 * Recomputes only when the customers list changes.
 */
export function useSegmentCounts(customers, segments) {
  return useMemo(
    () => Object.fromEntries(segments.map(s => [s.key, customers.filter(s.filter).length])),
    [customers, segments]
  )
}