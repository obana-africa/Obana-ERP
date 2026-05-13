/**
 * A tiny SVG sparkline for stat cards.
 *
 * @param {Object} props
 * @param {number[]} props.data  - array of values
 * @param {string}   props.color - stroke / fill colour (hex, rgb, etc.)
 */
export function SparkLine({ data, color = '#2DBD97' }) {
  const width = 80;
  const height = 28;
  const pad = 2; // top/bottom padding

  if (!data || data.length < 2) {
    // Render a flat line if insufficient data
    return (
      <svg width={width} height={height} className="spark">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - pad - ((val - min) / range) * (height - pad * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const fillPath = `0,${height} ${points} ${width},${height}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', width: '100%', overflow: 'visible' }}
    >
      {/* Area fill */}
      <polyline points={fillPath} fill={color} fillOpacity="0.1" stroke="none" />
      {/* Stroke line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  );
}