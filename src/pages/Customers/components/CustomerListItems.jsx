import { fmt } from '../../../utils/formatters'
import Icon from './Icon'
import { ICONS } from '../constants/icons'
import { TagPill, StatusPill } from './Pills'
import { getAvatarColor, getInitials } from '../utils'
import styles from '../Customers.module.css'

/* ── List view row ─────────────────────────────────────────── */
export function CustomerRow({ customer: c, selected, onToggleSelect, onView, onEdit, onDelete }) {
  const av = getAvatarColor(c.name)

  return (
    <div className={`${styles.tableRow} ${selected ? styles.rowSel : ''}`}>
      <span>
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(c.id)}
          aria-label={`Select ${c.name}`}
        />
      </span>

      <span className={styles.custCell} onClick={() => onView(c)} role="button" tabIndex={0}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onView(c)}>
        <div className={styles.custAvatar} style={{ background: av.bg, color: av.color }}>
          {getInitials(c.name)}
        </div>
        <div>
          <div className={styles.custName}>{c.name}</div>
          <div className={styles.custId}>{c.id}</div>
        </div>
      </span>

      <span className={styles.contactCell}>
        <div className={styles.contactLine}><Icon d={ICONS.phone} size={11} />{c.phone}</div>
        {c.email && <div className={styles.contactLine}><Icon d={ICONS.mail} size={11} />{c.email}</div>}
      </span>

      <span className={styles.locationCell}>{c.city}, {c.state}</span>

      <span className={styles.ordersCell}>
        <div className={styles.orderCount}>{c.totalOrders}</div>
        <div className={styles.orderLbl}>orders</div>
      </span>

      <span className={styles.spentCell}>{fmt(c.totalSpent)}</span>
      <span><TagPill tag={c.tag} /></span>
      <span><StatusPill status={c.status} /></span>

      <span className={styles.actCell}>
        <button type="button" className={styles.iconActBtn} onClick={() => onView(c)}
          aria-label={`View ${c.name}`}>
          <Icon d={ICONS.eye} size={13} />
        </button>
        <button type="button" className={styles.iconActBtn} onClick={() => onEdit(c)}
          aria-label={`Edit ${c.name}`}>
          <Icon d={ICONS.edit} size={13} />
        </button>
        <button type="button" className={styles.iconActBtnRed} onClick={() => onDelete(c.id)}
          aria-label={`Delete ${c.name}`}>
          <Icon d={ICONS.trash} size={13} />
        </button>
      </span>
    </div>
  )
}

/* ── Grid view card ────────────────────────────────────────── */
export function CustomerCard({ customer: c, onView, onEdit, onDelete }) {
  const av = getAvatarColor(c.name)
  const stop = e => e.stopPropagation()

  return (
    <div className={styles.custCard} onClick={() => onView(c)} role="button" tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onView(c)}>
      <div className={styles.custCardTop}>
        <div className={styles.custAvatarLg} style={{ background: av.bg, color: av.color }}>
          {getInitials(c.name)}
        </div>
        <div className={styles.custCardActions} onClick={stop}>
          <button type="button" className={styles.iconActBtn} onClick={() => onEdit(c)}
            aria-label={`Edit ${c.name}`}>
            <Icon d={ICONS.edit} size={13} />
          </button>
          <button type="button" className={styles.iconActBtnRed} onClick={() => onDelete(c.id)}
            aria-label={`Delete ${c.name}`}>
            <Icon d={ICONS.trash} size={13} />
          </button>
        </div>
      </div>

      <div className={styles.custCardName}>{c.name}</div>
      <div className={styles.custCardSub}>{c.phone}</div>
      {c.email && <div className={styles.custCardSub} style={{ fontSize: 11.5 }}>{c.email}</div>}

      <div className={styles.custCardTags}>
        <TagPill tag={c.tag} />
        <StatusPill status={c.status} />
      </div>

      <div className={styles.custCardStats}>
        <div className={styles.custCardStat}>
          <div className={styles.custCardStatVal}>{c.totalOrders}</div>
          <div className={styles.custCardStatLbl}>Orders</div>
        </div>
        <div className={styles.custCardStatDiv} />
        <div className={styles.custCardStat}>
          <div className={styles.custCardStatVal} style={{ fontSize: 13 }}>{fmt(c.totalSpent)}</div>
          <div className={styles.custCardStatLbl}>Spent</div>
        </div>
        <div className={styles.custCardStatDiv} />
        <div className={styles.custCardStat}>
          <div className={styles.custCardStatVal}>{c.city}</div>
          <div className={styles.custCardStatLbl}>City</div>
        </div>
      </div>
    </div>
  )
}