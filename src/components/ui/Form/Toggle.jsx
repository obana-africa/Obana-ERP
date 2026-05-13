import s from './Form.module.css';

const Toggle = ({ label, description, checked, onChange }) => (
  <div className={s.toggleRow}>
    <div>
      {label && <span className={s.label}>{label}</span>}
      {description && <span className={s.fieldHint}>{description}</span>}
    </div>
    <label className={s.toggle}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={s.toggleSlider} />
    </label>
  </div>
);

export default Toggle;