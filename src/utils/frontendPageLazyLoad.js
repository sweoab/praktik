import React from 'react';
import Loadable from '@/layouts/full/shared/loadable/Loadable';

// Enhanced lazy loading specifically for frontend pages with better error handling
const frontendPageLazyLoad = (importFunc, fallbackComponent = null) => {
  const EnhancedLoadable = Loadable(() => 
    importFunc().catch((error) => {
      console.error('Frontend page loading error:', error);
      
      // Return a fallback component if provided, otherwise rethrow
      if (fallbackComponent) {
        return { default: fallbackComponent };
      }
      
      // Return a basic error fallback component
      return {
        default: () => (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            background: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '8px',
            margin: '20px' 
          }}>
            <h3>Frontend Page Loading Error</h3>
            <p>This page couldn't load properly. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                padding: '8px 16px', 
                background: '#1976d2', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Page
            </button>
          </div>
        )
      };
    })
  );
  
  return EnhancedLoadable;
};

export default frontendPageLazyLoad;
