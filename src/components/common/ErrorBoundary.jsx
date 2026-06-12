import { Component } from 'react'

/**
 * Catches render-time errors and shows a fallback UI instead of crashing
 * the whole app. Wrap each routed page in one of these.
 *
 *   <ErrorBoundary fallback={MyFallback}>
 *     <CustomersPage />
 *   </ErrorBoundary>
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Hook this up to your error reporter (Sentry, etc.)
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info)
    } else {
      // eslint-disable-next-line no-console
      console.error('[ErrorBoundary]', error, info)
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) {
      const Fallback = this.props.fallback
      if (Fallback) return <Fallback error={this.state.error} reset={this.reset} />
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#7A8699' }}>
          <h2 style={{ color: '#0F1B2D' }}>Something went wrong</h2>
          <p style={{ marginTop: 8 }}>{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            style={{
              marginTop: 16, padding: '8px 16px',
              background: '#1b3b5f', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}