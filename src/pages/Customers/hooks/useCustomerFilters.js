import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DEFAULT_PAGE_SIZE } from '../constants/segments'

/**
 * URL-synced filter / sort / pagination state.
 *
 * The text input is locally controlled and *debounced* before being committed
 * to the URL (and thus the query). This avoids one request per keystroke.
 *
 * - `searchInput` / `setSearchInput`  → bind to the <input>
 * - `search`                          → the committed value used in queries
 *
 * Changing any filter resets page → 1 (so you don't end up on page 5 of a
 * filtered set with only 2 pages).
 */
export function useCustomerFilters({ debounceMs = 300 } = {}) {
  const [params, setParams] = useSearchParams()

  const search      = params.get('q')        || ''
  const stateFilter = params.get('state')    || 'all'
  const sortBy     = params.get('sort')      || 'recent'
  const view       = params.get('view')      || 'list'
  const page       = Math.max(1, parseInt(params.get('page'), 10) || 1)
  const pageSize   = parseInt(params.get('pageSize'), 10) || DEFAULT_PAGE_SIZE

  // Debounced search input
  const [searchInput, setSearchInput] = useState(search)
  useEffect(() => { setSearchInput(search) }, [search])
  useEffect(() => {
    if (searchInput === search) return
    const t = setTimeout(() => commit('q', searchInput, '', { resetPage: true }), debounceMs)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // Generic param updater
  const commit = useCallback(
    (key, value, defaultValue, { resetPage = false } = {}) => {
      setParams(
        prev => {
          const next = new URLSearchParams(prev)
          if (!value || value === defaultValue) next.delete(key)
          else next.set(key, value)
          if (resetPage) next.delete('page')
          return next
        },
        { replace: true }
      )
    },
    [setParams]
  )

  const setStateFilter = useCallback(v => commit('state',    v, 'all',     { resetPage: true }), [commit])
  const setSortBy      = useCallback(v => commit('sort',     v, 'recent',  { resetPage: true }), [commit])
  const setView        = useCallback(v => commit('view',     v, 'list'                          ), [commit])
  const setPage        = useCallback(v => commit('page',     String(v), '1'                     ), [commit])
  const setPageSize    = useCallback(v => commit('pageSize', String(v), String(DEFAULT_PAGE_SIZE), { resetPage: true }), [commit])

  const clearAll = useCallback(() => {
    setParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('q'); next.delete('state'); next.delete('sort'); next.delete('page')
      return next
    }, { replace: true })
  }, [setParams])

  // The "committed" filter object — what gets sent to the API.
  const apiParams = useMemo(
    () => ({ search, state: stateFilter, sort: sortBy, page, pageSize }),
    [search, stateFilter, sortBy, page, pageSize]
  )

  const isFiltered = !!search || stateFilter !== 'all'

  return {
    // Committed values
    search, stateFilter, sortBy, view, page, pageSize,
    // Local input (for the search box)
    searchInput, setSearchInput,
    // Setters
    setStateFilter, setSortBy, setView, setPage, setPageSize, clearAll,
    // Bundled for query hooks
    apiParams,
    // Helpers
    isFiltered,
  }
}