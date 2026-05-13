import s from './Form.module.css'; // reuse Form.module.css or create a new one

export default function Select({ label, options = [], className = '', ...props }) {
  return (
    <div className={s.field}>
      {label && <label className={s.label}>{label}</label>}
      <select className={`${s.input} ${className}`} {...props}>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}