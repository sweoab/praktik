
import { ThemeSettings } from './theme/Theme';
import RTL from './layouts/full/shared/customizer/RTL';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { RouterProvider } from 'react-router-dom';
import router from './routes/Router'
import { CustomizerContext } from './context/CustomizerContext';
import { useContext, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

function App() {
  const theme = ThemeSettings();
  const { activeDir } = useContext(CustomizerContext);
  const { isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated when app starts
  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      // Check if we're not already on an auth page
      const currentPath = window.location.pathname;
      const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/404'];
      
      if (!authPaths.some(path => currentPath.startsWith(path))) {
        window.location.href = '/auth/login';
      }
    }
  }, [loading, isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <RTL direction={activeDir}>
        <CssBaseline />
        <RouterProvider router={router} />
      </RTL>
    </ThemeProvider>
  );
}

export default App
