export default function LoadingSpinner({ message }) {
  return <div style={{ padding: 40, textAlign: 'center' }}>{message || 'Loading...'}</div>;
}