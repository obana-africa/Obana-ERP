
import { useState } from 'react'
import styles from '../Transfers.module.css'
import { fmt, fmtD } from '../../../utils/formatters'
import { STATUS_CFG, TYPE_CFG, TRANSFER_STEPS, STEP_INDEX } from '../../../data/transfers'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const Pill = ({ label, bg, color }) => (
  <span className={styles.pill} style={{ background: bg, color }}>{label}</span>
)

/**
 * Props:
 *  transfer  — full transfer object
 *  onClose   — () => void
 *  onReceive — (id, recvQtys) => void
 */
const TransferDetailModal = ({ transfer, onClose, onReceive }) => {
  const [recv, setRecv] = useState(
    Object.fromEntries(transfer.items.map(i => [i.sku, i.recv]))
  )

  const canEdit = ['pending', 'in_transit', 'partial'].includes(transfer.status)
  const total   = transfer.items.reduce((a, i) => a + i.exp * i.cost, 0)
  const stepIdx = STEP_INDEX[transfer.status] ?? 0

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        {/* Header */}
        <div className={styles.mHead}>
          <div>
            <div className={styles.mTitleRow}>
              <span className={styles.mTitle}>{transfer.id}</span>
              <Pill {...TYPE_CFG[transfer.type]} />
              <Pill {...STATUS_CFG[transfer.status]} />
            </div>
            <p className={styles.mSub}>
              {transfer.origin}
              <span className={styles.arrow}> → </span>
              {transfer.dest}
              {transfer.ref && <span className={styles.mRef}> · {transfer.ref}</span>}
            </p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={16} />
          </button>
        </div>

        {/* Progress timeline */}
        <div className={styles.timeline}>
          {TRANSFER_STEPS.map((step, i) => (
            <div key={step} className={styles.timelineItem}
              style={{ flex: i < TRANSFER_STEPS.length - 1 ? 1 : 0 }}>
              <div className={styles.timelineStep}>
                <div className={styles.timelineDot}
                  style={{ background: i < stepIdx ? '#2DBD97' : i === stepIdx ? '#1a1a2e' : '#E5E7EB' }} />
                <span className={styles.timelineLabel}
                  style={{ color: i <= stepIdx ? '#1a1a2e' : '#9CA3AF', fontWeight: i === stepIdx ? 700 : 400 }}>
                  {step}
                </span>
              </div>
              {i < TRANSFER_STEPS.length - 1 && (
                <div className={styles.timelineLine}
                  style={{ background: i < stepIdx ? '#2DBD97' : '#E5E7EB' }} />
              )}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className={styles.mBody}>

          {/* Info cards */}
          <div className={styles.infoCards}>
            {[
              { label: 'Created',     value: fmtD(transfer.date) },
              { label: 'Expected',    value: fmtD(transfer.eta)  },
              { label: 'Total Value', value: fmt(total)           },
            ].map(card => (
              <div key={card.label} className={styles.infoCard}>
                <div className={styles.infoCardLabel}>{card.label}</div>
                <div className={styles.infoCardValue}>{card.value}</div>
              </div>
            ))}
          </div>

          {/* Items table */}
          <div className={styles.itemsTable}>
            <div className={styles.itemsHead}>
              <span>Product</span>
              <span>SKU</span>
              <span>Expected</span>
              <span>Received</span>
              <span>Variance</span>
              <span>Subtotal</span>
            </div>

            {transfer.items.map(item => {
              const r = recv[item.sku] ?? 0
              const v = r - item.exp
              return (
                <div key={item.sku} className={styles.itemRow}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemSku}>{item.sku}</span>
                  <span>{item.exp}</span>
                  <span>
                    {canEdit ? (
                      <input
                        type="number" min={0} max={item.exp}
                        className={styles.recvInput}
                        value={r}
                        onChange={e => setRecv(prev => ({ ...prev, [item.sku]: Number(e.target.value) }))}
                      />
                    ) : (
                      <span style={{ fontWeight: 700, color: r >= item.exp ? '#047857' : '#B45309' }}>{r}</span>
                    )}
                  </span>
                  <span className={styles.variance}
                    style={{ color: v < 0 ? '#EF4444' : v > 0 ? '#2DBD97' : '#9CA3AF' }}>
                    {v === 0 ? '—' : `${v > 0 ? '+' : ''}${v}`}
                  </span>
                  <span className={styles.itemSubtotal}>{fmt(item.exp * item.cost)}</span>
                </div>
              )
            })}

            <div className={styles.itemsTotal}>
              <span className={styles.itemsTotalLabel}>
                {transfer.items.reduce((a, i) => a + i.exp, 0)} units total
              </span>
              <span className={styles.itemsTotalValue}>{fmt(total)}</span>
            </div>
          </div>

          {transfer.notes && (
            <div className={styles.notesBox}>
              <strong>Note: </strong>{transfer.notes}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Close</button>
          {canEdit && (
            <button className={styles.btnPrimary}
              onClick={() => { onReceive(transfer.id, recv); onClose() }}>
              <Ic d="M20 6L9 17l-5-5" size={13} stroke="#fff" />
              Mark as Received
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TransferDetailModal
