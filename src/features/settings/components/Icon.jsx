/**
 * Icon primitive shared across the Settings module.
 *
 * Accepts either a single path string or an array of path strings.
 * Replaces the 7 duplicate `Ic` components from the original files.
 */
export default function Icon({
  d,
  size = 16,
  stroke = 'currentColor',
  sw = 1.6,
  fill = 'none',
  style,
  ...rest
}) {
  const paths = Array.isArray(d) ? d : [d]
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
      style={{ flexShrink: 0, ...style }}
      aria-hidden="true"
      {...rest}
    >
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}