import Icon from './Icon'
import { ICONS } from '../constants/icons'
import { NIGERIAN_STATES, SORT_OPTIONS } from '../constants/segments'
import styles from '../Customers.module.css'

export default function CustomerFilters({
  search, onSearch,
  stateFilter, onStateFilter,
  sortBy, onSort,
  view, onView,
}) {
  return (
    <div className={styles.controls}>
      <div className={styles.controlsL}>
        <div className={styles.searchBox}>
          <span className={styles.searchIco}><Icon d={ICONS.search} size={14} /></span>
          <input
            type="search"
            placeholder="Search by name, phone, email…"
            value={search}
            onChange={e => onSearch(e.target.value)}
            aria-label="Search customers"
          />
        </div>
        <select
          className={styles.filterSel}
          value={stateFilter}
          onChange={e => onStateFilter(e.target.value)}
          aria-label="Filter by state"
        >
          <option value="all">All States</option>
          {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className={styles.controlsR}>
        <select
          className={styles.filterSel}
          value={sortBy}
          onChange={e => onSort(e.target.value)}
          aria-label="Sort customers"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <div className={styles.viewToggle} role="group" aria-label="View mode">
          <button
            type="button"
            className={`${styles.vBtn} ${view === 'list' ? styles.vBtnOn : ''}`}
            onClick={() => onView('list')}
            aria-pressed={view === 'list'}
            aria-label="List view"
          >
            <Icon d={ICONS.list} size={14} />
          </button>
          <button
            type="button"
            className={`${styles.vBtn} ${view === 'grid' ? styles.vBtnOn : ''}`}
            onClick={() => onView('grid')}
            aria-pressed={view === 'grid'}
            aria-label="Grid view"
          >
            <Icon d={ICONS.grid} size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}