/* ─────────────────────────────────────────────────────────
   Path: src/pages/POS/components/PaymentModal.jsx
───────────────────────────────────────────────────────── */
import { useState } from 'react'
import styles from '../POS.module.css'
import { fmt } from '../../../utils/formatters'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

const METHODS = [
  { id:'cash',     label:'Cash',          icon:'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { id:'card',     label:'Card (POS)',    icon:'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3z' },
  { id:'mobile',   label:'Mobile Money', icon:'M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z' },
  { id:'transfer', label:'Bank Transfer', icon:'M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
]

/**
 * Props:
 *  total      — number (total to charge)
 *  onComplete — (payInfo) => void
 *  onClose    — () => void
 */
const PaymentModal = ({ total, onComplete, onClose }) => {
  const [method,     setMethod]  = useState('cash')
  const [split,      setSplit]   = useState(false)
  const [cash,       setCash]    = useState('')
  const [card,       setCard]    = useState('')
  const [mobile,     setMobile]  = useState('')
  const [processing, setProc]    = useState(false)

  const cashAmt    = Number(cash)   || 0
  const cardAmt    = Number(card)   || 0
  const mobileAmt  = Number(mobile) || 0
  const splitTotal = cashAmt + cardAmt + mobileAmt
  const cashChange = method === 'cash' ? Math.max(0, Number(cash) - total) : 0
  const splitChange = split ? Math.max(0, splitTotal - total) : 0

  const canPay = split
    ? splitTotal >= total
    : method === 'cash' ? Number(cash) >= total : true

  const process = () => {
    setProc(true)
    setTimeout(() => {
      onComplete({
        method: split ? 'Split' : method,
        cashTendered: method === 'cash' ? Number(cash) : 0,
        change: split ? splitChange : cashChange,
        splitDetail: split ? { cash: cashAmt, card: cardAmt, mobile: mobileAmt } : null,
      })
    }, 1000)
  }

  return (
    <div className={styles.pmOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.pmModal}>
        <div className={styles.pmHead}>
          <h2 className={styles.pmTitle}>Collect Payment</h2>
          <div className={styles.pmTotal}>{fmt(total)}</div>
        </div>

        <div className={styles.pmBody}>
          {/* Split toggle */}
          <div className={styles.pmSplitToggle}>
            <label className={styles.pmSplitLbl}>
              <div className={`${styles.toggle} ${split?styles.toggleOn:''}`} onClick={() => setSplit(s => !s)}>
                <div className={styles.toggleThumb} />
              </div>
              Split payment
            </label>
          </div>

          {!split ? (
            <>
              <div className={styles.pmMethods}>
                {METHODS.map(m => (
                  <button key={m.id}
                    className={`${styles.pmMethod} ${method===m.id?styles.pmMethodOn:''}`}
                    onClick={() => setMethod(m.id)}>
                    <Ic d={m.icon} size={20} stroke={method===m.id?'#2DBD97':'#6B7280'} />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {method === 'cash' && (
                <div className={styles.pmCashSection}>
                  <div className={styles.pmFg}>
                    <label>Cash Tendered</label>
                    <div className={styles.pmCashInput}>
                      <span>₦</span>
                      <input type="number" value={cash} onChange={e => setCash(e.target.value)}
                        placeholder="0" autoFocus />
                    </div>
                  </div>
                  <div className={styles.pmQuickCash}>
                    {[total, Math.ceil(total/1000)*1000, Math.ceil(total/5000)*5000, Math.ceil(total/10000)*10000]
                      .filter((v,i,a) => a.indexOf(v) === i).slice(0,4)
                      .map(v => (
                        <button key={v} className={styles.pmQuickBtn} onClick={() => setCash(String(v))}>
                          {fmt(v)}
                        </button>
                      ))}
                  </div>
                  {cashChange > 0 && (
                    <div className={styles.pmChange}>Change: <strong>{fmt(cashChange)}</strong></div>
                  )}
                </div>
              )}

              {method === 'mobile' && (
                <div className={styles.pmFg}>
                  <label>Mobile Wallet Reference</label>
                  <input placeholder="e.g. Opay / Kuda / Palmpay ref" />
                </div>
              )}

              {method === 'transfer' && (
                <div className={styles.pmTransfer}>
                  <p className={styles.pmTransferTitle}>Transfer to:</p>
                  <div className={styles.pmTransferRow}><span>Account Name</span><strong>Obana Africa Ltd</strong></div>
                  <div className={styles.pmTransferRow}><span>Bank</span><strong>Access Bank</strong></div>
                  <div className={styles.pmTransferRow}><span>Account No.</span><strong>0123456789</strong></div>
                  <div className={styles.pmTransferRow}><span>Amount</span><strong style={{ color:'#2DBD97' }}>{fmt(total)}</strong></div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.pmSplitGrid}>
              {[['Cash',cash,setCash],['Card',card,setCard],['Mobile',mobile,setMobile]].map(([lbl,val,setter]) => (
                <div key={lbl} className={styles.pmFg}>
                  <label>{lbl} (₦)</label>
                  <input type="number" value={val} onChange={e => setter(e.target.value)} placeholder="0" />
                </div>
              ))}
              <div className={`${styles.pmSplitStatus} ${splitTotal>=total?styles.pmSplitOk:styles.pmSplitShort}`}>
                {splitTotal >= total
                  ? `✓ Covered · Change: ${fmt(splitChange)}`
                  : `Remaining: ${fmt(total - splitTotal)}`}
              </div>
            </div>
          )}
        </div>

        <div className={styles.pmFoot}>
          <button className={styles.pmCancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.pmChargeBtn} disabled={!canPay || processing} onClick={process}>
            {processing
              ? <span className={styles.pmProcessing}>Processing…</span>
              : <><Ic d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" size={16} stroke="#fff" /> Charge {fmt(total)}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
