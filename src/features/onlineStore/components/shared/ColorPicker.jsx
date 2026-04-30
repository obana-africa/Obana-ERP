import { useState, useRef, useEffect } from 'react';
import s from '../../styles/builder.module.css';

const PRESET_COLORS = {
  primary: ['#1a1a2e', '#0f172a', '#111827', '#1e293b', '#064e3b'],
  accent: ['#2DBD97', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
  background: ['#ffffff', '#f9fafb', '#f8fafc', '#fffbf5', '#f0fdf4'],
  text: ['#111827', '#1f2937', '#374151', '#1c1917', '#1e1b4b']
};

export const ColorPicker = ({ value, onChange, group = 'primary', label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  const presets = PRESET_COLORS[group] || PRESET_COLORS.primary;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }
  }, [isOpen]);

  return (
    <div className={s.colorPicker} ref={ref}>
      {label && <label className={s.label}>{label}</label>}
      <div className={s.colorPickerInput}>
        <button
          className={s.colorSwatch}
          style={{ background: value }}
          onClick={() => setIsOpen(!isOpen)}
          type="button"
        />
        <input
          className={s.colorHex}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      </div>
      
      {isOpen && (
        <div className={s.colorPickerDropdown}>
          <div className={s.presetGrid}>
            {presets.map((color) => (
              <button
                key={color}
                className={`${s.presetSwatch} ${color === value ? s.presetActive : ''}`}
                style={{ background: color }}
                onClick={() => { onChange(color); setIsOpen(false); }}
                type="button"
              />
            ))}
          </div>
          <input
            type="color"
            className={s.nativePicker}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};