import { useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/Icon/Icon';
import { ALL_PRODUCTS } from '@/data/collections'; // temporary until service
import s from '../Collections.module.css';

export default function SearchWithSuggestions({
  value,
  onChange,
  collections,
  onSelectCollection,
  onSelectProduct,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg, setShowSugg] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const timerRef = useRef(null);

  const getSuggestions = useCallback((q) => {
    if (!q.trim()) return [];
    const lq = q.toLowerCase();
    const results = [];

    // Collections
    collections
      .filter(c =>
        c.name.toLowerCase().includes(lq) ||
        (c.desc || '').toLowerCase().includes(lq)
      )
      .slice(0, 3)
      .forEach(c => {
        const totalStock = Object.values(c.locationInventory).reduce(
          (a, loc) => a + Object.values(loc).reduce((b, q) => b + q, 0), 0
        );
        results.push({
          type: 'collection',
          label: c.name,
          sub: `${c.productIds.length} products · ${totalStock} units`,
          id: c.id,
          status: c.status,
        });
      });

    // Products (from ALL_PRODUCTS)
    const pSeen = new Set();
    ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(lq) ||
      p.sku.toLowerCase().includes(lq)
    )
      .slice(0, 3)
      .forEach(p => {
        if (!pSeen.has(p.id)) {
          pSeen.add(p.id);
          results.push({
            type: 'product',
            label: p.name,
            sub: `${p.sku} · ₦${Number(p.price).toLocaleString()}`,
            id: p.id,
            category: p.category,
            img: p.img || null,
            stock: p.stock, // if available
          });
        }
      });

    return results.slice(0, 6);
  }, [collections]);

  const recalc = () => {
    if (!wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    setMenuPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
  };

  const handleInput = (e) => {
    const v = e.target.value;
    onChange(v);
    setFocusedIdx(-1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      recalc();
      setSuggestions(getSuggestions(v));
      setShowSugg(true);
    }, 120);
  };

  const handleFocus = () => {
    if (value) { recalc(); setShowSugg(true); }
  };

  const handleKey = (e) => {
    const n = suggestions.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx(i => Math.min(i + 1, n - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx(i => Math.max(i - 1, -1)); }
    else if (e.key === 'Enter' && focusedIdx >= 0) pickItem(suggestions[focusedIdx]);
    else if (e.key === 'Escape') setShowSugg(false);
  };

  const pickItem = (item) => {
    if (item.type === 'collection') onSelectCollection?.(item.id);
    if (item.type === 'product') onSelectProduct?.(item.id);
    onChange(item.label);
    setShowSugg(false);
    setFocusedIdx(-1);
  };

  // Close on outside click
  useEffect(() => {
    const h = e => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSugg(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
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
    <div className={s.searchBox} ref={wrapRef}>
      <span className={s.searchIco}><Icon name="search" size={14} /></span>
      <input
        className={s.searchInput}
        placeholder="Search collections or products…"
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        onKeyDown={handleKey}
        autoComplete="off"
      />
      {value && (
        <button className={s.searchClear} onClick={() => { onChange(''); setShowSugg(false); }}>
          ✕
        </button>
      )}
      {showSugg &&
        createPortal(
          <div className={s.suggBox} style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, width: menuPos.width, zIndex: 99999 }}>
            {suggestions.length === 0 ? (
              <div className={s.suggEmpty}>No results for "{value}"</div>
            ) : (
              suggestions.map((item, i) => (
                <div
                  key={i}
                  className={`${s.suggItem} ${i === focusedIdx ? s.suggItemActive : ''}`}
                  onMouseDown={() => pickItem(item)}
                  onMouseEnter={() => setFocusedIdx(i)}
                >
                  <span className={s.suggIcon}>
                    {item.type === 'collection' ? (
                      <Icon name="collections" size={13} stroke="#6B7280" />
                    ) : (
                      <div className={s.suggThumb}>
                        {item.img ? <img src={item.img} alt="" /> : (item.label?.[0] || 'P')}
                      </div>
                    )}
                  </span>
                  <span className={s.suggContent}>
                    <span className={s.suggLabel}>{highlight(item.label, value)}</span>
                    <span className={s.suggSub}>{item.sub}</span>
                  </span>
                  {item.status && (
                    <span className={s.suggBadge} style={{
                      background: item.status === 'active' ? '#ECFDF5' : '#F3F4F6',
                      color: item.status === 'active' ? '#059669' : '#6B7280',
                    }}>
                      {item.status}
                    </span>
                  )}
                  {item.category && (
                    <span className={s.suggBadge} style={{ background: '#EFF6FF', color: '#2563EB' }}>
                      {item.category}
                    </span>
                  )}
                  {item.type === 'product' && item.stock != null && (
                    <span
                      className={s.suggStock}
                      style={{ color: item.stock === 0 ? '#EF4444' : item.stock <= 5 ? '#D97706' : '#059669' }}
                    >
                      {item.stock === 0 ? 'Out' : `${item.stock} in stock`}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>,
          document.body
        )}
    </div>
  );
}