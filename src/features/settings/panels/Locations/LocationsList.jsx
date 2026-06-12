import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocations, useToggleLocationActive, useSetDefaultLocation, useDeleteLocation } from '../../hooks/useLocations'
import { useConfirm } from '../../../../components/common/useConfirm'
import { Section, Badge } from '../../components/Form'
import PanelSkeleton from '../../components/PanelSkeleton'
import PanelError from '../../components/PanelError'
import Icon from '../../components/Icon'
import { ICONS } from '../../constants/icons'
import { MAX_LOCATIONS, FILTER_TABS, fullAddress, initials, matchFilter, sortLocations } from './utils'
import ChangeDefaultDropdown from './components/ChangeDefaultDropdown'
import styles from './Locations.module.css'

/**
 * Locations list view — table + filters + actions.
 * Navigates to /settings/locations/new and /settings/locations/:id/edit
 * for sub-views (handled by the parent panel).
 */
export default function LocationsList() {
  const navigate = useNavigate()
  const [confirm, ConfirmElement] = useConfirm()

  const { data: locations = [], isLoading, isError, error, refetch } = useLocations()
  const toggleActive = useToggleLocationActive()
  const setDefault = useSetDefaultLocation()
  const deleteLocation = useDeleteLocation()

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const displayed = useMemo(() => {
    const q = search.toLowerCase()
    const filtered = locations.filter(l => {
      const matchesSearch = !q ||
        l.name.toLowerCase().includes(q) ||
        fullAddress(l).toLowerCase().includes(q)
      return matchesSearch && matchFilter(l, filter)
    })
    return sortLocations(filtered, sortBy)
  }, [locations, search, filter, sortBy])

  const activeCount = locations.filter(l => l.isActive).length
  const defaultLoc = locations.find(l => l.isDefault)
  const atMax = activeCount >= MAX_LOCATIONS

  if (isLoading) return <PanelSkeleton sections={3} />
  if (isError) return <PanelError error={error} onRetry={refetch} title="Could not load locations" />

  const cycleSort = () => {
    const order = ['name', 'status', 'default']
    setSortBy(s => order[(order.indexOf(s) + 1) % order.length])
  }

  const handleDelete = async (loc) => {
    const ok = await confirm({
      title: 'Delete location?',
      message: `"${loc.name}" will be permanently deleted. This action cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
    })
    if (!ok) return
    deleteLocation.mutate(loc.id)
  }

  return (
    <div>
      {ConfirmElement}

      {/* ── All locations ──────────────────────────────────── */}
      <Section
        title="All locations"
        subtitle={`Using ${activeCount} of ${MAX_LOCATIONS} active locations available on your plan`}
        action={
          <button
            type="button"
            className={styles.primaryBtn}
            disabled={atMax}
            onClick={() => navigate('/settings/locations/new')}
            title={atMax ? `Max ${MAX_LOCATIONS} locations reached` : undefined}
          >
            <Icon d={ICONS.plus} size={13} stroke="#fff" />
            Add location
          </button>
        }
      >
        {/* Filter + search */}
        <div className={styles.tableBar}>
          <div className={styles.filterTabs}>
            {FILTER_TABS.map(t => (
              <button
                key={t.key}
                type="button"
                className={`${styles.filterTab} ${filter === t.key ? styles.filterTabOn : ''}`}
                onClick={() => setFilter(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className={styles.tableActions}>
            <div className={styles.searchBox}>
              <Icon d={ICONS.search} size={13} stroke="#9CA3AF" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder="Search locations…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className={styles.searchClear} onClick={() => setSearch('')}>
                  <Icon d={ICONS.close} size={11} />
                </button>
              )}
            </div>
            <button type="button" className={styles.iconBtn} onClick={cycleSort} title={`Sort by: ${sortBy}`}>
              <Icon d={ICONS.sort} size={14} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Location</span>
            <span>POS Subscription</span>
            <span>Status</span>
            <span />
          </div>

          {displayed.length === 0 ? (
            <div className={styles.emptyTable}>
              <Icon d={ICONS.pin} size={32} stroke="#D1D5DB" sw={1.2} />
              <p>No locations found</p>
              {search && (
                <button type="button" className={styles.outlineBtn} onClick={() => setSearch('')}>
                  Clear search
                </button>
              )}
            </div>
          ) : (
            displayed.map(loc => (
              <div key={loc.id} className={styles.tableRow}>
                <span className={styles.locCell}>
                  <div className={styles.locAvatar}>{initials(loc.name)}</div>
                  <div className={styles.locCellInfo}>
                    <button
                      type="button"
                      className={styles.locName}
                      onClick={() => navigate(`/settings/locations/${loc.id}/edit`)}
                    >
                      {loc.name}
                      {loc.isDefault && <Badge color="navy">Default</Badge>}
                    </button>
                    <span className={styles.locAddress}>{fullAddress(loc)}</span>
                  </div>
                </span>
                <span className={styles.posCell}>{loc.posSubscription}</span>
                <span>
                  <Badge color={loc.isActive ? 'green' : 'red'}>
                    {loc.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </span>
                <span className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.rowActionBtn}
                    title="Edit location"
                    onClick={() => navigate(`/settings/locations/${loc.id}/edit`)}
                  >
                    <Icon d={ICONS.edit} size={13} />
                  </button>
                  <button
                    type="button"
                    className={styles.rowActionBtn}
                    title={loc.isActive ? 'Deactivate' : 'Activate'}
                    onClick={() => toggleActive.mutate(loc.id)}
                    disabled={toggleActive.isPending}
                  >
                    <Icon d={loc.isActive ? ICONS.toggleOff : ICONS.toggleOn} size={13} />
                  </button>
                  {!loc.isDefault && (
                    <button
                      type="button"
                      className={`${styles.rowActionBtn} ${styles.rowActionBtnRed}`}
                      title="Delete location"
                      onClick={() => handleDelete(loc)}
                    >
                      <Icon d={ICONS.trash} size={13} />
                    </button>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </Section>

      {/* ── Default location ──────────────────────────────── */}
      <Section
        title="Default location"
        subtitle="This location is used by apps when no other location is specified"
      >
        {defaultLoc ? (
          <div className={styles.defaultLocRow}>
            <div className={styles.defaultLocIcon}>
              <Icon d={ICONS.pin} size={16} stroke="#6B7280" />
            </div>
            <div className={styles.defaultLocInfo}>
              <div className={styles.defaultLocName}>{defaultLoc.name}</div>
              <div className={styles.defaultLocAddr}>
                {[defaultLoc.address, defaultLoc.zip, defaultLoc.city, defaultLoc.state, defaultLoc.country]
                  .filter(Boolean).join(', ')}
              </div>
            </div>
            <ChangeDefaultDropdown
              locations={locations.filter(l => l.isActive && !l.isDefault)}
              onSelect={id => setDefault.mutate(id)}
              loading={setDefault.isPending}
            />
          </div>
        ) : (
          <div className={styles.noDefault}>No active locations available.</div>
        )}
      </Section>

      {/* ── POS subscriptions ─────────────────────────────── */}
      <Section
        title="Point of Sale subscriptions"
        subtitle="For each location, use the POS features included in your plan or upgrade to POS Pro to fit your retail needs."
      >
        <div className={styles.posRow}>
          <div className={styles.posIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="6" fill="#1b3b5f" />
              <path d="M7 10h14M7 14h10M7 18h6" stroke="#2DBD97" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className={styles.posInfo}>
            <div className={styles.posName}>Point of Sale</div>
            <div className={styles.posSub}>
              {locations.filter(l => l.posSubscription === 'POS Pro').length} POS Pro ·{' '}
              {locations.filter(l => l.posSubscription === 'POS Lite').length} POS Lite
            </div>
          </div>
          <button
            type="button"
            className={styles.outlineBtn}
            onClick={() => navigate('/apps/pos/subscriptions')}
          >
            Manage Subscriptions
          </button>
        </div>
      </Section>

      {/* ── Plan limit notice ─────────────────────────────── */}
      {atMax && (
        <div className={styles.limitBanner}>
          <Icon d={ICONS.info} size={15} stroke="#B45309" />
          <span>
            You've reached the maximum of <strong>{MAX_LOCATIONS} locations</strong> on your current plan.{' '}
            <button type="button" className={styles.bannerLink} onClick={() => navigate('/settings/plan')}>
              Upgrade your plan
            </button>{' '}
            to add more.
          </span>
        </div>
      )}
    </div>
  )
}