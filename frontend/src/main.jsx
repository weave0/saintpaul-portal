import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useThemeMode } from './store/themeMode';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from './components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Self-hosted Roboto font - Latin subset only (smallest, covers English)
// Other subsets (cyrillic, greek, vietnamese) load on-demand if needed
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/latin-700.css';

import './index.css';

const buildTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: '#1a4d7d', light: '#4a7ba7', dark: '#003057' },
    secondary: { main: '#c8102e', light: '#e63946', dark: '#8b0000' },
    background: mode === 'dark' ? { default: '#121212', paper: '#1e1e1e' } : { default: '#f5f5f5', paper: '#ffffff' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700 },
    h2: { fontSize: '2rem', fontWeight: 600 },
    h3: { fontSize: '1.75rem', fontWeight: 600 },
    // Map smaller heading variants to paragraph tags to avoid improper heading order
    variantMapping: {
      h4: 'p',
      h5: 'p',
      h6: 'p',
      subtitle1: 'p',
      subtitle2: 'p',
      overline: 'span'
    }
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 2
    }
  }
});

const RootApp = () => {
  const { mode } = useThemeMode();
  const theme = buildTheme(mode);
  return (
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ErrorBoundary>
                <App />
              </ErrorBoundary>
            </ThemeProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<RootApp />);

// Register service worker (optional) if supported
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(err => {
      // eslint-disable-next-line no-console
      console.warn('SW registration failed', err);
    });
  });
}
