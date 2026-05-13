import s from '../Inventory.module.css';
import { fmt } from '@/utils/formatters';
import Icon from '@/components/ui/Icon/Icon';

const PO_CFG = {
  received:   { label: 'Received',   bg: '#ECFDF5', color: '#059669' },
  pending:    { label: 'Pending',    bg: '#FFFBEB', color: '#D97706' },
  in_transit: { label: 'In Transit', bg: '#EFF6FF', color: '#2563EB' },
};

export default function PurchasOrdersTab({ purchaseOrders, onNewPO }) {
  return (
    <div className={s.tableSection}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className={s.btnPrimary} onClick={onNewPO}>
          <Icon name="plus" size={13} /> New Purchase Order
        </button>
      </div>
      <div className={s.table}>
        <div className={s.tHead} style={{ gridTemplateColumns: '1fr 1.5fr 0.7fr 1fr 1fr 1fr 0.6fr' }}>
          <span>PO Number</span><span>Supplier</span><span>Items</span>
          <span>Total</span><span>Order Date</span><span>Expected</span><span>Status</span>
        </div>
        {purchaseOrders.map(po => (
          <div key={po.id} className={s.tRow} style={{ gridTemplateColumns: '1fr 1.5fr 0.7fr 1fr 1fr 1fr 0.6fr' }}>
            <span className={s.mono} style={{ fontWeight: 600, color: 'var(--navy)' }}>{po.id}</span>
            <span>{po.supplier}</span>
            <span>{po.items}</span>
            <span style={{ fontWeight: 700 }}>{fmt(po.total)}</span>
            <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{new Date(po.date).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
            <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{new Date(po.expectedDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
            <span>
              <span style={{ background: PO_CFG[po.status]?.bg, color: PO_CFG[po.status]?.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
                {PO_CFG[po.status]?.label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}