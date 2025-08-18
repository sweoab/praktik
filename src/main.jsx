import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Spinner from './views/spinner/Spinner';
import './i18n';
import { CustomizerContextProvider } from './context/CustomizerContext';
import { AuthProvider } from './context/AuthContext';

// Only enable MSW in development when needed
const ENABLE_MSW = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true';

console.log('MSW Configuration:', {
  isDev: import.meta.env.DEV,
  viteEnableMSW: import.meta.env.VITE_ENABLE_MSW,
  enableMSW: ENABLE_MSW
});

async function deferRender() {
  if (ENABLE_MSW) {
    const { worker } = await import("./api/mocks/browser");
    return worker.start({
      onUnhandledRequest: 'bypass',
      quiet: false, // Enable console logs for debugging
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    });
  }
  return Promise.resolve();
}

// Fast render without waiting for MSW
function renderApp() {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <CustomizerContextProvider>
        <Suspense fallback={<Spinner />}>
          <App />
        </Suspense>
      </CustomizerContextProvider>
    </AuthProvider>,
  );
}

if (ENABLE_MSW) {
  deferRender()
    .then(() => {
      console.log('MSW started successfully');
      renderApp();
    })
    .catch((error) => {
      console.error('MSW failed to start:', error);
      renderApp(); // Render anyway
    });
} else {
  // Clean up any existing MSW service worker when not using MSW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        if (registration.scope.includes('mockServiceWorker')) {
          registration.unregister();
        }
      }
    });
  }
  console.log('MSW disabled, rendering without mocking');
  renderApp();
}
