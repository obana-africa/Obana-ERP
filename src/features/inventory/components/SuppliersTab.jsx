import s from '../Inventory.module.css';
import Icon from '@/components/ui/Icon/Icon';

export default function SuppliersTab({ suppliers }) {
  return (
    <div className={s.tableSection}>
      <div className={s.supplierGrid}>
        {suppliers.map(sup => (
          <div key={sup.id} className={s.supplierCard}>
            <div className={s.supAvatar}>
              {sup.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className={s.supInfo}>
              <div className={s.supName}>{sup.name}</div>
              <div className={s.supDetail}>
                <Icon name="user" size={12} /> {sup.contact}
              </div>
              <div className={s.supDetail}>
                <Icon name="phone" size={12} /> {sup.phone}
              </div>
              <div className={s.supDetail}>
                <Icon name="email" size={12} /> {sup.email}
              </div>
              <span className={s.supCat}>{sup.category}</span>
            </div>
          </div>
        ))}
        <button className={s.supAddCard}>
          <Icon name="plus" size={22} />
          <span>Add Supplier</span>
        </button>
      </div>
    </div>
  );
}