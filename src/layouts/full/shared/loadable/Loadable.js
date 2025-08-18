import React, { Suspense, Component } from 'react';
import Spinner from '../../../../views/spinner/Spinner';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in Loadable component:', error, errorInfo);
    console.error('Error stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h3>Something went wrong loading this component.</h3>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Add a loading delay to prevent flash of loading state
const DelayedSpinner = () => {
  const [show, setShow] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return show ? <Spinner /> : null;
};

const Loadable = (Component) => (props) => {
  const LazyComponent = React.useMemo(
    () =>
      React.lazy(() =>
        Component()
          .then((mod) => {
            // Ensure a default export for React.lazy
            if (!('default' in mod)) {
              const firstKey = Object.keys(mod)[0];
              if (firstKey) {
                return { default: mod[firstKey] };
              }
            }
            return mod;
          })
          .catch((error) => {
            console.error('Failed to load component:', error);
            console.error('Import path or component error:', Component.toString());
            throw error;
          })
      ),
    [Component]
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={<DelayedSpinner />}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

export default Loadable;
