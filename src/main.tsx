import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { ThemeProvider } from '@/components/ThemeProvider.tsx';

import '@/index.css';

// biome-ignore lint/style/noNonNullAssertion: 'root' must exist
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  </StrictMode>,
);
