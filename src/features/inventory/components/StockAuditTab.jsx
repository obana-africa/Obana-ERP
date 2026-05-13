import { useState } from 'react';
import s from '../Inventory.module.css';
import Icon from '@/components/ui/Icon/Icon';

export default function StockAuditTab({ auditData, onUpdate }) {
  const [data, setData] = useState(auditData);

  const handleChange = (id, physicalQty) => {
    setData(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, physicalQty: Number(physicalQty), variance: Number(physicalQty) - a.systemQty }
          : a
      )
    );
  };

  return (
    <div className={s.tableSection}>
      <div className={s.auditInfo}>
        <Icon name="warning" size={15} />
        <span>Reconcile physical stock counts with system data. Variances are flagged automatically.</span>
      </div>
      <div className={s.table}>
        <div className={s.tHead} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.8fr' }}>
          <span>Item</span><span>SKU</span><span>System Qty</span>
          <span>Physical Qty</span><span>Variance</span><span>Audited By</span><span>Date</span>
        </div>
        {data.map(a => (
          <div key={a.id} className={s.tRow} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 0.8fr' }}>
            <span style={{ fontWeight: 500 }}>{a.name}</span>
            <span className={s.mono}>{a.sku}</span>
            <span>{a.systemQty}</span>
            <span>
              <input
                type="number"
                className={s.auditInput}
                value={a.physicalQty}
                onChange={e => handleChange(a.id, e.target.value)}
              />
            </span>
            <span style={{ fontWeight: 700, color: a.variance < 0 ? '#DC2626' : a.variance > 0 ? '#059669' : 'var(--ink3)' }}>
              {a.variance > 0 ? '+' : ''}{a.variance}
            </span>
            <span style={{ fontSize: 12 }}>{a.auditedBy}</span>
            <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{new Date(a.auditDate).toLocaleDateString('en-NG', { dateStyle: 'medium' })}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
        <button className={s.btnPrimary} onClick={() => onUpdate(data)}>Save Audit Results</button>
      </div>
    </div>
  );
}