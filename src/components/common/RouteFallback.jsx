export default function RouteFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: '#7A8699',
      fontFamily: 'DM Sans, sans-serif',
      fontSize: 13,
    }}>
      <span style={{
        width: 18,
        height: 18,
        border: '2px solid #E8ECF1',
        borderTopColor: '#1b3b5f',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
        marginRight: 10,
      }} />
      Loading…
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}