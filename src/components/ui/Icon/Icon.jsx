import { memo } from 'react';
import { icons } from './icons';

/**
 * Centralized icon component - single source of truth for all SVG icons
 * 
 * @param {Object} props
 * @param {keyof icons} props.name - Icon identifier from the icons dictionary
 * @param {number} [props.size=16] - Width and height in pixels
 * @param {string} [props.stroke='currentColor'] - Stroke color
 * @param {number} [props.sw=1.8] - Stroke width
 * @param {string} [props.fill='none'] - Fill color
 * @param {string} [props.className] - Additional CSS classes
 * @param {Object} [props.style] - Additional inline styles
 */
const Icon = memo(({ 
  name, 
  size = 16, 
  stroke = 'currentColor', 
  sw = 1.8, 
  fill = 'none',
  className = '',
  style = {},
  ...props 
}) => {
  const pathData = icons[name];
  
  if (!pathData) {
    console.warn(`Icon "${name}" not found in icon library`);
    return null;
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
      {...props}
    >
      {[].concat(pathData).map((path, index) => (
        <path key={index} d={path} />
      ))}
    </svg>
  );
});

Icon.displayName = 'Icon';

export default Icon;