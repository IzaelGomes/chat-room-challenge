import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { Provider } from './components/ui/provider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query.ts';
import { WebSocketProvider } from './contexts/WebSocketProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <WebSocketProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </WebSocketProvider>
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
