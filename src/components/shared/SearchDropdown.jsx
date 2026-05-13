import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Generic search dropdown. Renders suggestions via portal.
 *
 * Props:
 *  value       – current input value
 *  onChange    – (value) => void
 *  onSelect    – (item) => void
 *  items       – array of suggestions
 *  renderItem  – (item, index, focusedIdx, highlightFn, value) => ReactNode
 *  placeholder – string
 */
export default function SearchDropdown({
  value,
  onChange,
  onSelect,
  items = [],
  renderItem,
  placeholder = 'Search…',
  className = '',
}) {
  const [show, setShow] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const timerRef = useRef(null);

  const recalc = useCallback(() => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setMenuPos({
      top: r.bottom + window.scrollY + 4,
      left: r.left + window.scrollX,
      width: r.width,
    });
  }, []);

  const handleInput = (e) => {
    const v = e.target.value;
    onChange(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      recalc();
      setShow(true);
    }, 120);
  };

  const handleFocus = () => {
    if (value) { recalc(); setShow(true); }
  };

  const handleKeyDown = (e) => {
    const n = items.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, n - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && focusedIdx >= 0) {
      onSelect(items[focusedIdx]);
      setShow(false);
    }
    else if (e.key === 'Escape') setShow(false);
  };

  const handleItemClick = (item) => {
    onSelect(item);
    setShow(false);
    setFocusedIdx(-1);
  };

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShow(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const highlight = (text, query) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark style={{ background: '#E6F7F2', color: '#22a080', padding: 0, borderRadius: 2 }}>
          {text.slice(idx, idx + query.length)}
        </mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={wrapRef}>
      <input
        className={className}
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
      />
      {show &&
        createPortal(
          <div style={{
            position: 'fixed',
            top: menuPos.top,
            left: menuPos.left,
            width: menuPos.width,
            zIndex: 99999,
            background: '#fff',
            border: '1.5px solid #E5E7EB',
            borderRadius: 12,
            boxShadow: '0 12px 40px rgba(0,0,0,0.13)',
            overflow: 'hidden',
          }}>
            {items.length === 0 ? (
              <div style={{ padding: '14px 16px', fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
                No results
              </div>
            ) : (
              items.map((item, i) => renderItem(item, i, focusedIdx, highlight, value, () => handleItemClick(item)))
            )}
          </div>,
          document.body
        )}
    </div>
  );
}