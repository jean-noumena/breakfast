import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAuthService, PasswordAuthProvider } from '@npl/frontend';
import './index.css';
import App from './App.tsx';
import '@npl/frontend/styles.css';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const authService = createAuthService({
  authority: import.meta.env.VITE_OIDC_AUTHORITY || 'http://localhost:11000',
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'my-app',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PasswordAuthProvider authService={authService}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </PasswordAuthProvider>
  </StrictMode>,
);
