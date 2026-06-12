// DELETE all local Ic components from each file
// CREATE one shared: src/components/shared/Icon.jsx

// KEEP THIS ONE VERSION:
export const Icon = ({ name, size = 16, ...props }) => {
  const paths = ICON_PATHS[name];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
};