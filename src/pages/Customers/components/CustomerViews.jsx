import Icon from './Icon'
import { ICONS } from '../constants/icons'
import { CustomerRow, CustomerCard } from './CustomerListItems'
import styles from '../Customers.module.css'

export function EmptyState({ onAdd }) {
  return (
    <div className={styles.noRecord}>
      <Icon d={ICONS.users} size={40} />
      <p>No customers found</p>
      <button type="button" className={styles.btnOutline} onClick={onAdd}>
        <Icon d={ICONS.plus} size={13} /> Add your first customer
      </button>
    </div>
  )
}

export function CustomerList({ customers, selected, onToggleSelect, onToggleAll, onView, onEdit, onDelete, onAdd }) {
  const allSelected = customers.length > 0 && selected.length === customers.length

  return (
    <div className={styles.table}>
      <div className={styles.tableHead}>
        <span>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            aria-label="Select all customers"
          />
        </span>
        <span>Customer</span>
        <span>Contact</span>
        <span>Location</span>
        <span>Orders</span>
        <span>Total Spent</span>
        <span>Segment</span>
        <span>Status</span>
        <span />
      </div>

      {customers.length === 0 ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        customers.map(c => (
          <CustomerRow
            key={c.id}
            customer={c}
            selected={selected.includes(c.id)}
            onToggleSelect={onToggleSelect}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  )
}

export function CustomerGrid({ customers, onView, onEdit, onDelete, onAdd }) {
  return (
    <div className={styles.custGrid}>
      {customers.map(c => (
        <CustomerCard
          key={c.id}
          customer={c}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      <button type="button" className={styles.addCustCard} onClick={onAdd}>
        <Icon d={ICONS.plus} size={24} />
        <span>Add Customer</span>
      </button>
    </div>
  )
}