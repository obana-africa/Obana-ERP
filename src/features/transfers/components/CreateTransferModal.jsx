import { useState } from 'react';
import s from '../Transfers.module.css';
import Icon from '@/components/ui/Icon/Icon';
import { fmt } from '@/utils/formatters';
import { SUPPLIERS, LOCATIONS, TRANSFER_PRODUCTS, TYPE_CFG } from '@/data/transfers';

export default function CreateTransferModal({ onClose, onSave }) {
  const [type,   setType]   = useState('incoming');
  const [origin, setOrigin] = useState('');
  const [dest,   setDest]   = useState('');
  const [eta,    setEta]    = useState('');
  const [ref,    setRef]    = useState('');
  const [notes,  setNotes]  = useState('');
  const [items,  setItems]  = useState([{ sku: '', name: '', exp: 1, cost: '' }]);

  const setItem = (i, key, val) => {
    setItems(its => {
      const next = [...its];
      next[i] = { ...next[i], [key]: val };
      if (key === 'name') {
        const match = TRANSFER_PRODUCTS.find(p => p.name === val);
        if (match) { next[i].sku = match.sku; next[i].cost = match.cost; }
      }
      return next;
    });
  };

  const addItem = () => setItems(its => [...its, { sku: '', name: '', exp: 1, cost: '' }]);
  const removeItem = (i) => setItems(its => its.filter((_, j) => j !== i));

  const total = items.reduce((a, i) => a + (Number(i.exp) * Number(i.cost) || 0), 0);
  const origins = type === 'incoming' ? SUPPLIERS : LOCATIONS;

  const save = status => {
    onSave({
      id: `TRF-2026-${Date.now().toString().slice(-3)}`,
      type, status, origin, dest,
      ref: ref || null,
      notes,
      date: new Date().toISOString().split('T')[0],
      eta: eta || new Date().toISOString().split('T')[0],
      items: items.map(i => ({ ...i, recv: 0 })),
    });
    onClose();
  };

  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.mHead}>
          <div>
            <h2 className={s.mTitle}>Create Transfer</h2>
            <p className={s.mSub}>Move stock between locations or receive from a supplier</p>
          </div>
          <button className={s.mClose} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>

        <div className={s.typeSelectorRow}>
          {Object.entries(TYPE_CFG).map(([key, cfg]) => (
            <button key={key}
              className={`${s.typeBtn} ${type === key ? s.typeBtnOn : ''}`}
              onClick={() => { setType(key); setOrigin(''); }}>
              <Icon d={cfg.icon} size={18} stroke={type === key ? '#fff' : '#6B7280'} />
              {cfg.label}
            </button>
          ))}
        </div>

        <div className={s.mBody}>
          <div className={s.fRow}>
            <div className={s.fg}>
              <label>{type === 'incoming' ? 'Supplier / Origin' : 'Origin Location'} <span className={s.req}>*</span></label>
              <select value={origin} onChange={e => setOrigin(e.target.value)}>
                <option value="">Select origin</option>
                {origins.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className={s.fg}>
              <label>Destination <span className={s.req}>*</span></label>
              <select value={dest} onChange={e => setDest(e.target.value)}>
                <option value="">Select destination</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div className={s.fRow}>
            <div className={s.fg}>
              <label>Expected Arrival</label>
              <input type="date" value={eta} onChange={e => setEta(e.target.value)} />
            </div>
            <div className={s.fg}>
              <label>Reference / PO <span className={s.opt}>(optional)</span></label>
              <input value={ref} onChange={e => setRef(e.target.value)} placeholder="e.g. PO-004" />
            </div>
          </div>

          <div className={s.itemsEditor}>
            <div className={s.itemsEditorHead}>
              <span className={s.itemsEditorTitle}>Transfer Items</span>
              <button className={s.btnAddItem} onClick={addItem}>
                <Icon name="plus" size={12} /> Add Item
              </button>
            </div>

            {items.map((item, i) => (
              <div key={i} className={s.itemEditRow}>
                <div className={s.fg} style={{ flex: 2 }}>
                  {i === 0 && <label>Product</label>}
                  <select value={item.name} onChange={e => setItem(i, 'name', e.target.value)}>
                    <option value="">Select product</option>
                    {TRANSFER_PRODUCTS.map(p => (
                      <option key={p.sku} value={p.name}>{p.name} — {p.sku}</option>
                    ))}
                  </select>
                </div>
                <div className={s.fg} style={{ flex: '0 0 70px' }}>
                  {i === 0 && <label>Qty</label>}
                  <input type="number" min={1} value={item.exp} onChange={e => setItem(i, 'exp', e.target.value)} />
                </div>
                <div className={s.fg} style={{ flex: 1 }}>
                  {i === 0 && <label>Unit Cost (₦)</label>}
                  <input type="number" value={item.cost} onChange={e => setItem(i, 'cost', e.target.value)} placeholder="0" />
                </div>
                {items.length > 1 && (
                  <button className={s.removeItemBtn} onClick={() => removeItem(i)}>
                    <Icon name="close" size={13} stroke="#EF4444" />
                  </button>
                )}
              </div>
            ))}

            <div className={s.itemsEditorTotal}>
              <span>{items.reduce((a, i) => a + Number(i.exp || 0), 0)} units</span>
              <strong>{fmt(total)}</strong>
            </div>
          </div>

          <div className={s.fg}>
            <label>Notes <span className={s.opt}>(optional)</span></label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Any special instructions..." />
          </div>
        </div>

        <div className={s.mFoot}>
          <button className={s.btnGhost} onClick={onClose}>Cancel</button>
          <div className={s.mFootR}>
            <button className={s.btnOutline} onClick={() => save('draft')}>Save as Draft</button>
            <button className={s.btnPrimary} disabled={!origin || !dest} onClick={() => save('pending')}>
              <Icon name="plus" size={13} stroke="#fff" /> Send Transfer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}