import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'DM Sans, sans-serif',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'Fraunces, serif',
        fontSize: 72,
        fontWeight: 700,
        color: '#1b3b5f',
        letterSpacing: '-0.04em',
        lineHeight: 1,
      }}>
        404
      </div>
      <h1 style={{ fontSize: 20, color: '#0F1B2D', margin: '12px 0 6px' }}>
        Page not found
      </h1>
      <p style={{ fontSize: 14, color: '#7A8699', maxWidth: 380, marginBottom: 24 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/dashboard" style={{
        padding: '0.55rem 1.2rem',
        background: '#1b3b5f',
        color: '#fff',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 13,
        fontWeight: 600,
      }}>
        Back to Dashboard
      </Link>
    </div>
  )
}