import { useState, useEffect, useRef } from 'react';

/**
 * Smoothly animates a counter from 0 to target value
 * 
 * @param {number} target - Final value to count to
 * @param {Object} options
 * @param {number} [options.duration=900] - Animation duration in ms
 * @param {string} [options.prefix=''] - String before the number
 * @param {string} [options.suffix=''] - String after the number
 * @returns {string} - Formatted animated value
 */
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
      const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic

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