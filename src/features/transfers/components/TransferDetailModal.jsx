import { useState } from 'react';
import s from '../Transfers.module.css';
import Icon from '@/components/ui/Icon/Icon';
import { fmt, fmtD } from '@/utils/formatters';
import { STATUS_CFG, TYPE_CFG, TRANSFER_STEPS, STEP_INDEX } from '@/data/transfers';

const Pill = ({ label, bg, color }) => (
  <span className={s.pill} style={{ background: bg, color }}>{label}</span>
);

export default function TransferDetailModal({ transfer, onClose, onReceive }) {
  const [recv, setRecv] = useState(
    Object.fromEntries(transfer.items.map(i => [i.sku, i.recv]))
  );
  const canEdit = ['pending', 'in_transit', 'partial'].includes(transfer.status);
  const total = transfer.items.reduce((a, i) => a + i.exp * i.cost, 0);
  const stepIdx = STEP_INDEX[transfer.status] ?? 0;

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div>
            <div className={s.mTitleRow}>
              <span className={s.mTitle}>{transfer.id}</span>
              <Pill {...TYPE_CFG[transfer.type]} />
              <Pill {...STATUS_CFG[transfer.status]} />
            </div>
            <p className={s.mSub}>
              {transfer.origin} <span className={s.arrow}>→</span> {transfer.dest}
              {transfer.ref && <span className={s.mRef}> · {transfer.ref}</span>}
            </p>
          </div>
          <button className={s.mClose} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>

        <div className={s.timeline}>
          {TRANSFER_STEPS.map((step, i) => (
            <div key={step} className={s.timelineItem} style={{ flex: i < TRANSFER_STEPS.length - 1 ? 1 : 0 }}>
              <div className={s.timelineStep}>
                <div className={s.timelineDot} style={{
                  background: i < stepIdx ? '#2DBD97' : i === stepIdx ? '#1a1a2e' : '#E5E7EB'
                }} />
                <span className={s.timelineLabel} style={{
                  color: i <= stepIdx ? '#1a1a2e' : '#9CA3AF',
                  fontWeight: i === stepIdx ? 700 : 400
                }}>
                  {step}
                </span>
              </div>
              {i < TRANSFER_STEPS.length - 1 && (
                <div className={s.timelineLine} style={{ background: i < stepIdx ? '#2DBD97' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        <div className={s.mBody}>
          <div className={s.infoCards}>
            {[
              { label: 'Created', value: fmtD(transfer.date) },
              { label: 'Expected', value: fmtD(transfer.eta) },
              { label: 'Total Value', value: fmt(total) },
            ].map(card => (
              <div key={card.label} className={s.infoCard}>
                <div className={s.infoCardLabel}>{card.label}</div>
                <div className={s.infoCardValue}>{card.value}</div>
              </div>
            ))}
          </div>

          <div className={s.itemsTable}>
            <div className={s.itemsHead}>
              <span>Product</span><span>SKU</span><span>Expected</span><span>Received</span><span>Variance</span><span>Subtotal</span>
            </div>
            {transfer.items.map(item => {
              const r = recv[item.sku] ?? 0;
              const v = r - item.exp;
              return (
                <div key={item.sku} className={s.itemRow}>
                  <span className={s.itemName}>{item.name}</span>
                  <span className={s.itemSku}>{item.sku}</span>
                  <span>{item.exp}</span>
                  <span>
                    {canEdit ? (
                      <input type="number" min={0} max={item.exp} className={s.recvInput}
                        value={r} onChange={e => setRecv(prev => ({ ...prev, [item.sku]: Number(e.target.value) }))}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: r >= item.exp ? '#047857' : '#B45309' }}>{r}</span>
                    )}
                  </span>
                  <span className={s.variance} style={{ color: v < 0 ? '#EF4444' : v > 0 ? '#2DBD97' : '#9CA3AF' }}>
                    {v === 0 ? '—' : `${v > 0 ? '+' : ''}${v}`}
                  </span>
                  <span className={s.itemSubtotal}>{fmt(item.exp * item.cost)}</span>
                </div>
              );
            })}
            <div className={s.itemsTotal}>
              <span className={s.itemsTotalLabel}>{transfer.items.reduce((a,i) => a + i.exp, 0)} units total</span>
              <span className={s.itemsTotalValue}>{fmt(total)}</span>
            </div>
          </div>

          {transfer.notes && (
            <div className={s.notesBox}><strong>Note: </strong>{transfer.notes}</div>
          )}
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Close</button>
          {canEdit && (
            <button className={s.btnPrimary} onClick={() => { onReceive(transfer.id, recv); onClose(); }}>
              <Icon name="check" size={13} stroke="#fff" /> Mark as Received
            </button>
          )}
        </div>
      </div>
    </div>
  );
}