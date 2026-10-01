import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { ThemeProvider } from '@/context/ThemeContext.tsx';

// Self-hosted variable fonts (latin and other subsets load on demand via
// unicode-range). Inter with its optical-size axis, as on Google Fonts.
import '@fontsource-variable/inter/opsz.css';
import '@fontsource-variable/playfair-display/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@/index.css';

// biome-ignore lint/style/noNonNullAssertion: 'root' must exist
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Honour the OS "reduce motion" setting for every Motion animation. */}
    <MotionConfig reducedMotion="user">
      <ThemeProvider defaultTheme="system">
        <App />
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>,
);
