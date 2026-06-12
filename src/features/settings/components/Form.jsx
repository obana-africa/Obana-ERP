import styles from './shared.module.css'
import Icon from './Icon'
import { ICONS } from '../constants/icons'

/* ── Section ──────────────────────────────────────────────── */
export function Section({ title, subtitle, badge, action, icon, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <div className={styles.sectionHeadLeft}>
          {icon && (
            <div className={styles.sectionIcon}>
              <Icon d={icon} size={16} stroke="#6B7280" />
            </div>
          )}
          <div>
            <div className={styles.sectionTitleRow}>
              <h2 className={styles.sectionTitle}>{title}</h2>
              {badge && (
                <span className={`${styles.badge} ${styles[`badge_${badge.color || 'gray'}`]}`}>
                  {badge.label}
                </span>
              )}
            </div>
            {subtitle && <p className={styles.sectionSub}>{subtitle}</p>}
          </div>
        </div>
        {action && <div className={styles.sectionAction}>{action}</div>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

/* ── Field ────────────────────────────────────────────────── */
export function Field({ label, hint, children, row, borderBottom = true, required, error }) {
  return (
    <div className={`${styles.field} ${row ? styles.fieldRow : ''} ${!borderBottom ? styles.fieldNoBorder : ''} ${error ? styles.fieldError : ''}`}>
      {label && (
        <div className={styles.fieldLabel}>
          <label>
            {label}
            {required && <span className={styles.req}> *</span>}
          </label>
          {hint && <span className={styles.fieldHint}>{hint}</span>}
        </div>
      )}
      <div className={styles.fieldControl}>
        {children}
        {error && <div className={styles.fieldErrorMsg}>{error}</div>}
      </div>
    </div>
  )
}

/* ── Input ────────────────────────────────────────────────── */
export function Input({
  value, onChange, placeholder, type = 'text', prefix, disabled, error, ...rest
}) {
  return (
    <div className={`${styles.inputWrap} ${prefix ? styles.inputWrapPrefix : ''} ${error ? styles.inputError : ''}`}>
      {prefix && <span className={styles.inputPrefix}>{prefix}</span>}
      <input
        className={styles.input}
        type={type}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        {...rest}
      />
    </div>
  )
}

/* ── Select ───────────────────────────────────────────────── */
export function Select({ value, onChange, options, disabled, width }) {
  return (
    <select
      className={styles.select}
      style={width ? { width } : undefined}
      value={value ?? ''}
      onChange={e => onChange?.(e.target.value)}
      disabled={disabled}
    >
      {options.map(o => {
        const v = typeof o === 'string' ? o : o.value
        const l = typeof o === 'string' ? o : o.label
        return <option key={v} value={v}>{l}</option>
      })}
    </select>
  )
}

/* ── Toggle ───────────────────────────────────────────────── */
export function Toggle({ value, onChange, disabled, label }) {
  const button = (
    <button
      type="button"
      role="switch"
      aria-checked={!!value}
      disabled={disabled}
      className={`${styles.toggle} ${value ? styles.toggleOn : ''} ${disabled ? styles.toggleDisabled : ''}`}
      onClick={() => !disabled && onChange?.(!value)}
    >
      <span className={styles.toggleThumb} />
    </button>
  )

  if (!label) return button

  return (
    <label className={styles.toggleWrap}>
      {button}
      <span className={styles.toggleLabel}>{label}</span>
    </label>
  )
}

/* ── Checkbox ─────────────────────────────────────────────── */
export function Checkbox({ checked, onChange, label, sub, disabled }) {
  return (
    <label className={`${styles.checkLabel} ${disabled ? styles.checkDisabled : ''}`}>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={e => onChange?.(e.target.checked)}
        disabled={disabled}
        className={styles.checkInput}
      />
      <div className={styles.checkContent}>
        <span className={styles.checkText}>{label}</span>
        {sub && <span className={styles.checkSub}>{sub}</span>}
      </div>
    </label>
  )
}

/* ── Radio ────────────────────────────────────────────────── */
export function Radio({ name, value, checked, onChange, label, sub }) {
  return (
    <label className={styles.radioLabel}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={!!checked}
        onChange={() => onChange?.(value)}
        className={styles.radioInput}
      />
      <div className={styles.radioContent}>
        <span className={styles.radioText}>{label}</span>
        {sub && <span className={styles.radioSub}>{sub}</span>}
      </div>
    </label>
  )
}

/* ── Card ─────────────────────────────────────────────────── */
export function Card({ children, onClick, chevron }) {
  return (
    <div
      className={`${styles.card} ${onClick ? styles.cardLink : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e => (e.key === 'Enter' || e.key === ' ') && onClick(e)) : undefined}
    >
      <div className={styles.cardInner}>{children}</div>
      {chevron && <Icon d={ICONS.chevRight} size={16} stroke="#9CA3AF" />}
    </div>
  )
}

/* ── Badge ────────────────────────────────────────────────── */
export function Badge({ color = 'gray', children }) {
  return <span className={`${styles.badge} ${styles[`badge_${color}`]}`}>{children}</span>
}