import { act, render, screen } from '@testing-library/react';
import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '@/App';
import { ThemeProvider } from '@/context/ThemeContext';

function navigate(path: string) {
  act(() => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
}

function renderApp() {
  return render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MotionConfig>
    </StrictMode>,
  );
}

/** Makes the Projects page choose the one-screen 3D ring. */
function simulateRoomyScreen() {
  vi.mocked(window.matchMedia).mockImplementation(
    (query: string) =>
      ({
        matches: query.includes('min-width: 1024px'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

const ROUTES = [
  ['/', { level: 1, name: 'Sinan Li' }],
  ['/experience', { level: 1, name: 'Experience' }],
  ['/projects', { level: 1, name: 'Projects' }],
  ['/research', { level: 1, name: 'Research' }],
  ['/no-such-page', { level: 1, name: '404' }],
] as const;

describe('App', () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, 'error');
    window.history.replaceState({}, '', '/');
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ['swipe strip', false],
    ['3D ring', true],
  ])(
    'visits every route and back without errors (Projects as %s)',
    async (_, ring) => {
      if (ring) simulateRoomyScreen();
      renderApp();

      for (const [path, heading] of [...ROUTES, ROUTES[0]]) {
        navigate(path);
        expect(
          await screen.findByRole('heading', heading),
          `heading on ${path}`,
        ).toBeInTheDocument();

        if (path === '/projects') {
          // Only the ring has per-project "Show …" controls.
          const ringControls = screen.queryAllByRole('button', {
            name: /^Show /,
          });
          expect(ringControls.length > 0).toBe(ring);
        }
      }

      expect(screen.queryByText('Something broke')).not.toBeInTheDocument();
      expect(consoleError).not.toHaveBeenCalled();
    },
  );
});
