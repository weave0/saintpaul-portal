import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Optionally integrate Sentry here if enabled
    if (import.meta.env.VITE_ENABLE_SENTRY) {
      // placeholder for Sentry capture
      // Sentry.captureException(error);
    }
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught error', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={this.handleReload} style={{ padding: '0.5rem 1rem' }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;