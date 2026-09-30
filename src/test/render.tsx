import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  useLocation,
} from 'react-router-dom';
import { CommandPaletteProvider } from '@/context/CommandPaletteContext';
import { TerminalProvider } from '@/context/TerminalContext';
import { ThemeProvider } from '@/context/ThemeContext';

/** Renders the current pathname so tests can assert navigation. */
function LocationProbe() {
  return <output data-testid="location">{useLocation().pathname}</output>;
}

/**
 * Renders `ui` inside the app's providers and an in-memory router at `route`.
 * Every path renders `ui`, so navigating keeps it mounted.
 */
export function renderWithProviders(ui: ReactNode, { route = '/' } = {}) {
  const router = createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <>
            {ui}
            <LocationProbe />
          </>
        ),
      },
    ],
    { initialEntries: [route] },
  );

  return {
    router,
    ...render(
      <ThemeProvider>
        <TerminalProvider>
          <CommandPaletteProvider>
            <RouterProvider router={router} />
          </CommandPaletteProvider>
        </TerminalProvider>
      </ThemeProvider>,
    ),
  };
}
