// import { useCallback, useMemo, useState } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'

// import styles from './Customers.module.css'
// import { fmt } from '../../utils/formatters'

// import { ICONS } from './constants/icons'
// import { SEGMENTS, DEFAULT_SEGMENT, segmentPath } from './constants/segments'

// import { useCustomers, useFilteredCustomers, useSegmentCounts } from './hooks/useCustomers'
// import { useCustomerFilters } from './hooks/useCustomerFilters'
// import { useBulkSelection, useBulkActions } from './hooks/useBulkActions'
// import { useCustomerExport } from './hooks/useCustomerExport'

// import Icon from './components/Icon'
// import StatCard from './components/StatCard'
// import SegmentTabs from './components/SegmentTabs'
// import CustomerFilters from './components/CustomerFilters'
// import BulkActionsBar from './components/BulkActionsBar'
// import { CustomerList, CustomerGrid } from './components/CustomerViews'

// import CustomerModal from './components/CustomerModal'
// import CustomerDetail from './components/CustomerDetail'

// export default function Customers() {
//   const navigate = useNavigate()
//   const { segment: routeSegment } = useParams()
//   const segment = SEGMENTS.some(s => s.key === routeSegment) ? routeSegment : DEFAULT_SEGMENT

//   // ── Data layer ─────────────────────────────────────────────
//   const {
//     customers,
//     findById,
//     createCustomer,
//     updateCustomer,
//     deleteCustomer,
//     deleteMany,
//     stats,
//   } = useCustomers()

//   // ── Filters (URL-synced) ───────────────────────────────────
//   const filters = useCustomerFilters()
//   const filtered = useFilteredCustomers(customers, { segment, ...filters })
//   const segmentCounts = useSegmentCounts(customers, SEGMENTS)

//   // ── Selection + bulk actions ───────────────────────────────
//   const visibleIds = useMemo(() => filtered.map(c => c.id), [filtered])
//   const selection = useBulkSelection(visibleIds)
//   const bulkActions = useBulkActions({
//     selected: selection.selected,
//     clear: selection.clear,
//     onDelete: deleteMany,
//   })

//   // ── Export ─────────────────────────────────────────────────
//   const exportCsv = useCustomerExport()

//   // ── Modal/detail UI state (local, not URL — they overlay current view) ──
//   const [modal, setModal] = useState(null)               // 'create' | 'edit' | null
//   const [editCustomer, setEditCustomer] = useState(null)
//   const [detailCustomer, setDetailCustomer] = useState(null)

//   const openCreate = useCallback(() => { setEditCustomer(null); setModal('create') }, [])
//   const openEdit   = useCallback(c  => { setEditCustomer(c);    setModal('edit')   }, [])
//   const closeModal = useCallback(() => { setModal(null); setEditCustomer(null) }, [])
//   const openDetail = useCallback(c  => setDetailCustomer(c), [])
//   const closeDetail = useCallback(() => setDetailCustomer(null), [])

//   const handleSave = useCallback(data => {
//     if (editCustomer) {
//       updateCustomer(editCustomer.id, data)
//       if (detailCustomer?.id === editCustomer.id) {
//         setDetailCustomer(p => ({ ...p, ...data }))
//       }
//     } else {
//       createCustomer(data)
//     }
//   }, [editCustomer, detailCustomer, createCustomer, updateCustomer])

//   const handleDelete = useCallback(id => {
//     deleteCustomer(id)
//     if (detailCustomer?.id === id) setDetailCustomer(null)
//   }, [deleteCustomer, detailCustomer])

//   // ── Stat cards (memoized so we only recompute when stats change) ───
//   const statCards = useMemo(() => ([
//     {
//       label: 'Total Customers',
//       value: stats.totalCustomers,
//       accent: '#1b3b5f',
//       icon: ICONS.users,
//       to: segmentPath('all'),
//       trend: { dir: 'up', delta: '+8%' },
//     },
//     {
//       label: 'Total Revenue',
//       value: fmt(stats.totalRevenue),
//       accent: '#22a080',
//       icon: ICONS.naira,
//       trend: { dir: 'up', delta: '+12%' },
//     },
//     {
//       label: 'VIP Customers',
//       value: stats.vipCount,
//       accent: '#b8860b',
//       icon: ICONS.star,
//       to: segmentPath('vip'),
//       trend: { dir: 'up', delta: '+3' },
//     },
//     {
//       label: 'Avg Order Value',
//       value: fmt(Math.round(stats.avgOrderValue)),
//       accent: '#3B82F6',
//       icon: ICONS.cart,
//       trend: { dir: 'flat', delta: '—' },
//     },
//   ]), [stats])

//   return (
//     <div className={styles.page}>
//       {/* ── Topbar ────────────────────────────────────────── */}
//       <header className={styles.topbar}>
//         <div>
//           <h1 className={styles.pgTitle}>Customers</h1>
//           <p className={styles.pgSub}>
//             {stats.totalCustomers.toLocaleString()} total · {stats.activeCount.toLocaleString()} active
//           </p>
//         </div>
//         <div className={styles.topbarR}>
//           <button
//             type="button"
//             className={styles.btnOutline}
//             onClick={() => exportCsv(filtered)}
//             disabled={!filtered.length}
//             title={filtered.length ? 'Download visible customers as CSV' : 'No customers to export'}
//           >
//             <Icon d={ICONS.download} size={13} /> Export CSV
//           </button>
//           <button type="button" className={styles.btnPrimary} onClick={openCreate}>
//             <Icon d={ICONS.plus} size={13} stroke="#fff" /> Add Customer
//           </button>
//         </div>
//       </header>

//       <div className={styles.content}>
//         {/* ── Stats ──────────────────────────────────────── */}
//         <div className={styles.statsRow}>
//           {statCards.map(s => <StatCard key={s.label} {...s} />)}
//         </div>

//         {/* ── Segment tabs ───────────────────────────────── */}
//         <SegmentTabs counts={segmentCounts} activeKey={segment} />

//         {/* ── Filter controls ────────────────────────────── */}
//         <CustomerFilters
//           search={filters.search}            onSearch={filters.setSearch}
//           stateFilter={filters.stateFilter}  onStateFilter={filters.setStateFilter}
//           sortBy={filters.sortBy}            onSort={filters.setSortBy}
//           view={filters.view}                onView={filters.setView}
//         />

//         {/* ── Bulk actions (only when selection exists) ─── */}
//         {selection.selected.length > 0 && (
//           <BulkActionsBar
//             count={selection.selected.length}
//             actions={bulkActions}
//             onClear={selection.clear}
//           />
//         )}

//         {/* ── Count row ──────────────────────────────────── */}
//         <div className={styles.countRow}>
//           <span className={styles.countTxt}>
//             <Icon d={ICONS.refresh} size={13} />
//             Showing {filtered.length} of {customers.length} customers
//           </span>
//           {(filters.search || filters.stateFilter !== 'all' || segment !== DEFAULT_SEGMENT) && (
//             <button
//               type="button"
//               className={styles.linkBtn}
//               onClick={() => {
//                 filters.setSearch('')
//                 filters.setStateFilter('all')
//                 if (segment !== DEFAULT_SEGMENT) navigate(segmentPath(DEFAULT_SEGMENT))
//               }}
//             >
//               Clear filters
//             </button>
//           )}
//         </div>

//         {/* ── Data view ──────────────────────────────────── */}
//         {filters.view === 'list' ? (
//           <CustomerList
//             customers={filtered}
//             selected={selection.selected}
//             onToggleSelect={selection.toggle}
//             onToggleAll={selection.toggleAll}
//             onView={openDetail}
//             onEdit={openEdit}
//             onDelete={handleDelete}
//             onAdd={openCreate}
//           />
//         ) : (
//           <CustomerGrid
//             customers={filtered}
//             onView={openDetail}
//             onEdit={openEdit}
//             onDelete={handleDelete}
//             onAdd={openCreate}
//           />
//         )}
//       </div>

//       {/* ── Modals ──────────────────────────────────────── */}
//       {(modal === 'create' || modal === 'edit') && (
//         <CustomerModal
//           customer={editCustomer}
//           onClose={closeModal}
//           onSave={handleSave}
//         />
//       )}

//       {detailCustomer && (
//         <CustomerDetail
//           customer={findById(detailCustomer.id) || detailCustomer}
//           onClose={closeDetail}
//           onEdit={() => openEdit(detailCustomer)}
//           onDelete={handleDelete}
//         />
//       )}
//     </div>
//   )
// }

import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './Customers.module.css'
import { fmt } from '../../utils/formatters'

import { ICONS } from './constants/icons'
import {
  SEGMENTS, DEFAULT_SEGMENT, isValidSegment, segmentPath,
} from './constants/segments'

import { useCustomersQuery, useCustomerStatsQuery } from './hooks/useCustomersQuery'
import {
  useCreateCustomer, useUpdateCustomer, useDeleteCustomer,
} from './hooks/useCustomerMutations'
import { useCustomerFilters } from './hooks/useCustomerFilters'
import { useBulkSelection, useBulkActions } from './hooks/useBulkActions'
import { useCustomerExport } from './hooks/useCustomerExport'

import { useAuth } from '../../auth/useAuth'
import { useConfirm } from '../../components/common/useConfirm'
import ErrorState from '../../components/common/ErrorState'
import Pagination from '../../components/common/Pagination'

import Icon from './components/Icon'
import StatCard from './components/StatCard'
import SegmentTabs from './components/SegmentTabs'
import CustomerFilters from './components/CustomerFilters'
import BulkActionsBar from './components/BulkActionsBar'
import { CustomerList, CustomerGrid } from './components/CustomerViews'
// import {
  // StatsRowSkeleton, CustomersTableSkeleton, CustomersGridSkeleton,
// } from './components/Skeletons'

import CustomerModal from './components/CustomerModal'
import CustomerDetail from './components/CustomerDetail'

export default function Customers() {
  const navigate = useNavigate()
  const { segment: routeSegment } = useParams()
  const segment = isValidSegment(routeSegment) ? routeSegment : DEFAULT_SEGMENT

  const { hasPermission } = useAuth()
  const [confirm, ConfirmElement] = useConfirm()

  // ── Filters (URL-synced) ──────────────────────────────────
  const filters = useCustomerFilters()

  // ── Server queries ────────────────────────────────────────
  const queryParams = useMemo(
    () => ({ segment, ...filters.apiParams }),
    [segment, filters.apiParams]
  )

  const listQuery  = useCustomersQuery(queryParams)
  const statsQuery = useCustomerStatsQuery()

  const customers     = listQuery.data?.items || []
  const total         = listQuery.data?.total || 0
  const segmentCounts = useMemo(() => deriveSegmentCounts(statsQuery.data), [statsQuery.data])

  // ── Mutations ─────────────────────────────────────────────
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const deleteMutation = useDeleteCustomer()

  // ── Selection + bulk ──────────────────────────────────────
  const visibleIds = useMemo(() => customers.map(c => c.id), [customers])
  const selection = useBulkSelection(visibleIds)
  const bulkActions = useBulkActions({
    selected: selection.selected,
    clear: selection.clear,
    confirmDelete: confirm,
  })

  // ── Export ────────────────────────────────────────────────
  const { exportCsv, isExporting } = useCustomerExport(queryParams)

  // ── Modal/detail UI state ─────────────────────────────────
  const [modal, setModal] = useState(null)               // 'create' | 'edit' | null
  const [editCustomer, setEditCustomer] = useState(null)
  const [detailCustomer, setDetailCustomer] = useState(null)

  const openCreate  = useCallback(() => { setEditCustomer(null); setModal('create') }, [])
  const openEdit    = useCallback(c  => { setEditCustomer(c);    setModal('edit')   }, [])
  const closeModal  = useCallback(() => { setModal(null); setEditCustomer(null) }, [])
  const openDetail  = useCallback(c  => setDetailCustomer(c), [])
  const closeDetail = useCallback(() => setDetailCustomer(null), [])

  const handleSave = useCallback(async data => {
    if (editCustomer) {
      await updateMutation.mutateAsync({ id: editCustomer.id, data })
      if (detailCustomer?.id === editCustomer.id) {
        setDetailCustomer(p => ({ ...p, ...data }))
      }
    } else {
      await createMutation.mutateAsync(data)
    }
    closeModal()
  }, [editCustomer, detailCustomer, createMutation, updateMutation, closeModal])

  const handleDelete = useCallback(async id => {
    if (!hasPermission('customers:delete')) return
    const ok = await confirm({
      title: 'Delete customer?',
      message: 'This action cannot be undone. Order history will be retained.',
      confirmLabel: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    deleteMutation.mutate(id, {
      onSettled: () => {
        if (detailCustomer?.id === id) setDetailCustomer(null)
      },
    })
  }, [hasPermission, confirm, deleteMutation, detailCustomer])

  // ── Permissions for top-level buttons ─────────────────────
  const canCreate = hasPermission('customers:create')
  const canExport = hasPermission('customers:export')

  // ── Stats cards (derived from API response) ───────────────
  const statCards = useMemo(
    () => buildStatCards(statsQuery.data),
    [statsQuery.data]
  )

  // ── Render gates ──────────────────────────────────────────
  const isInitialLoading = listQuery.isLoading
  const isError          = listQuery.isError
  const isRefetching     = listQuery.isFetching && !isInitialLoading

  return (
    <div className={styles.page}>
      {/* ── Topbar ────────────────────────────────────────── */}
      <header className={styles.topbar}>
        <div>
          <h1 className={styles.pgTitle}>Customers</h1>
          <p className={styles.pgSub}>
            {statsQuery.data
              ? `${statsQuery.data.totalCustomers.current.toLocaleString()} total · ${statsQuery.data.activeCount?.toLocaleString() ?? '—'} active`
              : 'Loading…'}
          </p>
        </div>
        <div className={styles.topbarR}>
          <button
            type="button"
            className={styles.btnOutline}
            onClick={exportCsv}
            disabled={!canExport || isExporting || total === 0}
            title={
              !canExport ? "You don't have export permission"
              : total === 0 ? 'No customers to export'
              : 'Download visible customers as CSV'
            }
          >
            <Icon d={ICONS.download} size={13} />
            {isExporting ? 'Exporting…' : 'Export CSV'}
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={openCreate}
            disabled={!canCreate}
          >
            <Icon d={ICONS.plus} size={13} stroke="#fff" /> Add Customer
          </button>
        </div>
      </header>

      <div className={`${styles.content} ${styles.contentInner}`}>
        {isRefetching && <div className={styles.fetchingBar} aria-hidden="true" />}

        {/* ── Stats ──────────────────────────────────────── */}
        {statsQuery.isLoading
          ? <StatsRowSkeleton />
          : statsQuery.isError
            ? <ErrorState
                error={statsQuery.error}
                onRetry={statsQuery.refetch}
                title="Could not load stats"
              />
            : (
              <div className={styles.statsRow}>
                {statCards.map(s => <StatCard key={s.label} {...s} />)}
              </div>
            )
        }

        {/* ── Segment tabs ───────────────────────────────── */}
        <SegmentTabs counts={segmentCounts} activeKey={segment} />

        {/* ── Filter controls ────────────────────────────── */}
        <CustomerFilters
          search={filters.searchInput}        onSearch={filters.setSearchInput}
          stateFilter={filters.stateFilter}    onStateFilter={filters.setStateFilter}
          sortBy={filters.sortBy}              onSort={filters.setSortBy}
          view={filters.view}                  onView={filters.setView}
        />

        {/* ── Bulk actions ───────────────────────────────── */}
        {selection.selected.length > 0 && (
          <BulkActionsBar
            count={selection.selected.length}
            actions={bulkActions}
            onClear={selection.clear}
          />
        )}

        {/* ── Count + clear filters ──────────────────────── */}
        <div className={styles.countRow}>
          <span className={styles.countTxt}>
            <Icon d={ICONS.refresh} size={13} />
            {listQuery.isLoading
              ? 'Loading customers…'
              : `Showing ${customers.length} of ${total.toLocaleString()} customers`}
          </span>
          {(filters.isFiltered || segment !== DEFAULT_SEGMENT) && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => {
                filters.clearAll()
                if (segment !== DEFAULT_SEGMENT) navigate(segmentPath(DEFAULT_SEGMENT))
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Data view (loading / error / data) ─────────── */}
        {isError ? (
          <ErrorState
            error={listQuery.error}
            onRetry={listQuery.refetch}
            title="Could not load customers"
          />
        ) : isInitialLoading ? (
          filters.view === 'list' ? <CustomersTableSkeleton /> : <CustomersGridSkeleton />
        ) : filters.view === 'list' ? (
          <CustomerList
            customers={customers}
            selected={selection.selected}
            onToggleSelect={selection.toggle}
            onToggleAll={selection.toggleAll}
            onView={openDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
            onAdd={openCreate}
          />
        ) : (
          <CustomerGrid
            customers={customers}
            onView={openDetail}
            onEdit={openEdit}
            onDelete={handleDelete}
            onAdd={openCreate}
          />
        )}

        {/* ── Pagination ─────────────────────────────────── */}
        {!isError && !isInitialLoading && (
          <Pagination
            page={filters.page}
            pageSize={filters.pageSize}
            total={total}
            onPageChange={filters.setPage}
          />
        )}
      </div>

      {/* ── Modals ────────────────────────────────────────── */}
      {(modal === 'create' || modal === 'edit') && (
        <CustomerModal
          customer={editCustomer}
          onClose={closeModal}
          onSave={handleSave}
          isSaving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      {detailCustomer && (
        <CustomerDetail
          customer={detailCustomer}
          onClose={closeDetail}
          onEdit={() => openEdit(detailCustomer)}
          onDelete={handleDelete}
        />
      )}

      {/* Confirmation dialogs (rendered once, controlled imperatively) */}
      {ConfirmElement}
    </div>
  )
}

/* ── Helpers ────────────────────────────────────────────────── */

// Stats cards derived from the API response, with trend data and click-throughs.
function buildStatCards(stats) {
  if (!stats) return []
  return [
    {
      label: 'Total Customers',
      value: stats.totalCustomers.current.toLocaleString(),
      accent: '#1b3b5f',
      icon: ICONS.users,
      to: segmentPath('all'),
      trend: { dir: stats.totalCustomers.dir, delta: stats.totalCustomers.delta },
    },
    {
      label: 'Total Revenue',
      value: fmt(stats.totalRevenue.current),
      accent: '#22a080',
      icon: ICONS.naira,
      trend: { dir: stats.totalRevenue.dir, delta: stats.totalRevenue.delta },
    },
    {
      label: 'VIP Customers',
      value: stats.vipCustomers.current.toLocaleString(),
      accent: '#b8860b',
      icon: ICONS.star,
      to: segmentPath('vip'),
      trend: { dir: stats.vipCustomers.dir, delta: stats.vipCustomers.delta },
    },
    {
      label: 'Avg Order Value',
      value: fmt(stats.avgOrderValue.current),
      accent: '#3B82F6',
      icon: ICONS.cart,
      trend: { dir: stats.avgOrderValue.dir, delta: stats.avgOrderValue.delta },
    },
  ]
}

// Segment counts come from the stats endpoint. The API should ideally return
// per-segment counts in `stats.segmentCounts`; otherwise we render zeros.
function deriveSegmentCounts(stats) {
  if (!stats) return Object.fromEntries(SEGMENTS.map(s => [s.key, 0]))
  if (stats.segmentCounts) return stats.segmentCounts
  return Object.fromEntries(SEGMENTS.map(s => [s.key, 0]))
}