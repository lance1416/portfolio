import { render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '@/context/ThemeContext';

function Crash(): never {
  throw new Error('boom');
}

/** A route that throws, so the router shows the error page. */
async function renderCrash() {
  const { default: ErrorPage } = await import('./ErrorPage');
  const router = createMemoryRouter([
    { path: '/', Component: Crash, errorElement: <ErrorPage /> },
  ]);
  render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>,
  );
}

describe('ErrorPage', () => {
  afterEach(() => {
    vi.doUnmock('@/scene/island');
    vi.resetModules();
  });

  it('shows the error and the broken island', async () => {
    // React reports the caught render error; that's the point here.
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await renderCrash();

    expect(screen.getByText('boom')).toBeInTheDocument();
    expect(
      await screen.findByRole('img', { name: /cracked in two/ }),
    ).toBeInTheDocument();
  });

  it('still renders when the scene chunk fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.doMock('@/scene/island', () => {
      throw new Error('Failed to fetch dynamically imported module');
    });
    await renderCrash();

    expect(
      await screen.findByRole('heading', { name: 'Something broke' }),
    ).toBeInTheDocument();
    // An escaped import error would tear the page down a moment later.
    await expect(
      waitFor(
        () => expect(screen.queryByText('boom')).not.toBeInTheDocument(),
        {
          timeout: 500,
        },
      ),
    ).rejects.toThrow();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
