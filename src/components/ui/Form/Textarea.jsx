import s from './Form.module.css';

export default function Textarea({ className = '', ...props }) {
  return <textarea className={`${s.textarea} ${className}`} {...props} />;
}