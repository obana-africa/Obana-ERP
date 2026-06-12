export default function ErrorDisplay({ message, onRetry }) {
  return <div style={{ padding: 40, textAlign: 'center' }}>
    <p>{message}</p>
    {onRetry && <button onClick={onRetry}>Retry</button>}
  </div>;
}