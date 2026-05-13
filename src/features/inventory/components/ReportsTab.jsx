import { useState } from 'react';
import s from '../Inventory.module.css';
import { fmt } from '@/utils/formatters';

const STATUS_CFG = {
  in_stock:    { label: 'In Stock',    bg: '#ECFDF5', color: '#059669' },
  low_stock:   { label: 'Low Stock',   bg: '#FFFBEB', color: '#D97706' },
  out_of_stock:{ label: 'Out of Stock',bg: '#FEF2F2', color: '#DC2626' },
};

export default function ReportsTab({ inventory }) {
  const [reportType, setReportType] = useState('stock_status');

  return (
    <div className={s.tableSection}>
      <div className={s.reportTabs}>
        {[
          { key: 'stock_status', label: 'Stock Status' },
          { key: 'turnover', label: 'Turnover Rate' },
          { key: 'shrinkage', label: 'Shrinkage' },
        ].map(r => (
          <button
            key={r.key}
            className={`${s.reportTab} ${reportType === r.key ? s.reportTabOn : ''}`}
            onClick={() => setReportType(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {reportType === 'stock_status' && (
        <div className={s.table}>
          <div className={s.tHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
            <span>Product</span><span>SKU</span><span>On Hand</span><span>Value</span><span>Status</span>
          </div>
          {inventory.map(i => (
            <div key={i.id} className={s.tRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
              <span style={{ fontWeight: 500 }}>{i.name}</span>
              <span className={s.mono}>{i.sku}</span>
              <span>{i.stock}</span>
              <span>{fmt(i.costPrice * i.stock)}</span>
              <span>
                <span style={{ background: STATUS_CFG[i.status]?.bg, color: STATUS_CFG[i.status]?.color, padding: '3px 10px', borderRadius: 20, fontSize: 11.5, fontWeight: 600 }}>
                  {STATUS_CFG[i.status]?.label}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}

      {reportType === 'turnover' && (
        <div className={s.table}>
          <div className={s.tHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <span>Product</span><span>SKU</span><span>Stock</span><span>Turnover Rate</span>
          </div>
          {[...inventory].sort((a, b) => (b.sold || 0) - (a.sold || 0)).map(i => (
            <div key={i.id} className={s.tRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
              <span style={{ fontWeight: 500 }}>{i.name}</span>
              <span className={s.mono}>{i.sku}</span>
              <span>{i.stock}</span>
              <span style={{ fontWeight: 700, color: 'var(--navy)' }}>
                {i.stock > 0 ? `${((i.sold || 0) / i.stock).toFixed(2)}x` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      {reportType === 'shrinkage' && (
        <div className={s.table}>
          <div className={s.tHead} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
            <span>Product</span><span>SKU</span><span>Units Lost</span><span>Est. Loss Value</span>
          </div>
          {inventory.filter(i => i.shrinkage > 0).map(i => (
            <div key={i.id} className={s.tRow} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
              <span style={{ fontWeight: 500 }}>{i.name}</span>
              <span className={s.mono}>{i.sku}</span>
              <span style={{ color: '#DC2626', fontWeight: 700 }}>{i.shrinkage}</span>
              <span style={{ color: '#DC2626', fontWeight: 700 }}>{fmt(i.shrinkage * i.costPrice)}</span>
            </div>
          ))}
          {inventory.filter(i => i.shrinkage > 0).length === 0 && (
            <div className={s.noRecord}><p>No shrinkage recorded</p></div>
          )}
        </div>
      )}
    </div>
  );
}