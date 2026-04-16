import { useState } from 'react'
import styles from '../Customers.module.css'
import { NIGERIAN_STATES, CHANNELS, TAGS, TAG_CONFIG } from '../../../data/customers'

const Ic = ({ d, size = 16, stroke = 'currentColor', sw = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {[].concat(d).map((p, i) => <path key={i} d={p} />)}
  </svg>
)

/**
 * Props:
 *  customer — existing customer (null = create)
 *  onClose  — () => void
 *  onSave   — (data) => void
 */
const CustomerModal = ({ customer, onClose, onSave }) => {
  const isEdit = !!customer
  const [form, setForm] = useState({
    name:    customer?.name    || '',
    email:   customer?.email   || '',
    phone:   customer?.phone   || '',
    address: customer?.address || '',
    city:    customer?.city    || '',
    state:   customer?.state   || 'Lagos',
    tag:     customer?.tag     || 'New',
    status:  customer?.status  || 'active',
    channel: customer?.channel || 'Website',
    notes:   customer?.notes   || '',
  })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>

        <div className={styles.mHead}>
          <div>
            <h2 className={styles.mTitle}>{isEdit ? 'Edit Customer' : 'Add Customer'}</h2>
            <p className={styles.mSub}>{isEdit ? `Updating ${customer.name}'s profile` : 'Create a new customer record'}</p>
          </div>
          <button className={styles.mClose} onClick={onClose}>
            <Ic d="M18 6L6 18M6 6l12 12" size={18} />
          </button>
        </div>

        <div className={styles.mBody}>

          {/* Personal info */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Personal Information</div>
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>Full Name <span className={styles.req}>*</span></label>
                <input value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="e.g. Adaeze Okonkwo" />
              </div>
              <div className={styles.fg}>
                <label>Phone <span className={styles.req}>*</span></label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+234 800 000 0000" />
              </div>
            </div>
            <div className={styles.fg}>
              <label>Email Address <span className={styles.opt}>(optional)</span></label>
              <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="customer@example.com" />
            </div>
          </div>

          {/* Address */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Shipping Address</div>
            <div className={styles.fg}>
              <label>Street Address</label>
              <input value={form.address} onChange={e => set('address', e.target.value)}
                placeholder="14 Adeola Odeku, Victoria Island" />
            </div>
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>City</label>
                <input value={form.city} onChange={e => set('city', e.target.value)}
                  placeholder="Lagos" />
              </div>
              <div className={styles.fg}>
                <label>State</label>
                <select value={form.state} onChange={e => set('state', e.target.value)}>
                  {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* CRM classification */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>CRM Classification</div>
            <div className={styles.fRow}>
              <div className={styles.fg}>
                <label>Customer Segment</label>
                <select value={form.tag} onChange={e => set('tag', e.target.value)}>
                  {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className={styles.fg}>
                <label>Acquisition Channel</label>
                <select value={form.channel} onChange={e => set('channel', e.target.value)}>
                  {CHANNELS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.fg}>
              <label>Status</label>
              <div className={styles.radioRow}>
                {['active','inactive','blocked'].map(s => (
                  <label key={s} className={styles.radioLbl}>
                    <input type="radio" name="custStatus" value={s}
                      checked={form.status === s} onChange={() => set('status', s)} />
                    <span style={{ textTransform:'capitalize' }}>{s}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className={styles.formSection}>
            <div className={styles.formSectionTitle}>Internal Notes</div>
            <div className={styles.fg}>
              <label>Notes <span className={styles.opt}>(visible only to staff)</span></label>
              <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="Special preferences, discount agreements, delivery instructions…" />
            </div>
          </div>
        </div>

        <div className={styles.mFoot}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <div className={styles.mFootR}>
            <button className={styles.btnPrimary} disabled={!form.name.trim() || !form.phone.trim()}
              onClick={() => { onSave(form); onClose() }}>
              <Ic d="M20 6L9 17l-5-5" size={13} stroke="#fff" />
              {isEdit ? 'Save Changes' : 'Create Customer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerModal
