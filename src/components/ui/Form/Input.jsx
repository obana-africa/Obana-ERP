import s from './Form.module.css';

const Input = ({ label, required, hint, prefix, error, ...props }) => (
  <div className={s.field}>
    {label && (
      <label className={s.label}>
        {label}
        {required && <span className={s.required}>*</span>}
        {hint && <span className={s.hint}>{hint}</span>}
      </label>
    )}
    {prefix ? (
      <div className={s.inputWithPrefix}>
        <span className={s.prefix}>{prefix}</span>
        <input className={`${s.input} ${error ? s.inputError : ''}`} {...props} />
      </div>
    ) : (
      <input className={`${s.input} ${error ? s.inputError : ''}`} {...props} />
    )}
    {error && <span className={s.errorMsg}>{error}</span>}
  </div>
);

export default Input;