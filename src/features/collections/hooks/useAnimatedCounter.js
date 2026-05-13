import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(target, { duration = 900, prefix = '', suffix = '' } = {}) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const num = typeof target === 'number'
      ? target
      : parseFloat(String(target).replace(/[^0-9.]/g, ''));

    if (isNaN(num)) {
      setValue(0);
      return;
    }

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * num));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return `${prefix}${value.toLocaleString()}${suffix}`;
}