import { fmt, fmtD } from '@/utils/formatters';
import Icon from '@/components/ui/Icon/Icon';
import { TYPE_CFG, STATUS_CFG } from '@/data/transfers';
import s from '../Transfers.module.css';

const Pill = ({ label, bg, color }) => (
  <span className={s.pill} style={{ background: bg, color }}>{label}</span>
);

export default function TransfersTable({ transfers, onSelect }) {
  return (
    <div className={s.table}>
      <div className={s.tHead}>
        <span>Transfer ID</span>
        <span>Type</span>
        <span>Origin</span>
        <span>Destination</span>
        <span>Units</span>
        <span>Value</span>
        <span>Created</span>
        <span>Status</span>
        <span />
      </div>
      {transfers.map(tr => {
        const totalVal = tr.items.reduce((a,i) => a + i.exp * i.cost, 0);
        const totalUnits = tr.items.reduce((a,i) => a + i.exp, 0);
        return (
          <div key={tr.id} className={s.tRow} onClick={() => onSelect(tr)}>
            <span className={s.transferId}>{tr.id}</span>
            <span><Pill {...TYPE_CFG[tr.type]} /></span>
            <span className={s.locationCell}>{tr.origin}</span>
            <span className={s.locationCell}>{tr.dest}</span>
            <span className={s.unitsCell}>{totalUnits}</span>
            <span className={s.valueCell}>{fmt(totalVal)}</span>
            <span className={s.dateCell}>{fmtD(tr.date)}</span>
            <span><Pill {...STATUS_CFG[tr.status]} /></span>
            <span className={s.actCell} onClick={e => e.stopPropagation()}>
              <button className={s.viewBtn} onClick={() => onSelect(tr)}>
                <Icon name="eye" size={13} />
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}