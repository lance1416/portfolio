import type { ComponentType } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CommandPaletteProvider } from '@/context/CommandPaletteContext';
import { TerminalProvider } from '@/context/TerminalContext';
import MainLayout from '@/layouts/MainLayout';
import ErrorPage from '@/pages/ErrorPage';
// Home is where most visits land, so it ships in the main bundle rather than
// costing a second round trip before the first paint.
import Home from '@/pages/Home';

/** Each other page is its own chunk; calling a loader again reuses the cached module. */
const PAGES = {
  experience: () => import('./pages/Experience'),
  projects: () => import('./pages/Projects'),
  research: () => import('./pages/Research'),
  notFound: () => import('./pages/NotFound'),
};

// Route-level lazy: the router loads a page's code *before* committing the
// navigation, so a page transition never captures a loading state.
const lazyPage =
  (load: () => Promise<{ default: ComponentType }>) => async () => ({
    Component: (await load()).default,
  });

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    // Blank until the first page's chunk arrives on initial load. A component,
    // not `hydrateFallbackElement: null`, which the router treats as missing.
    HydrateFallback: () => null,
    children: [
      { index: true, Component: Home },
      { path: 'experience', lazy: lazyPage(PAGES.experience) },
      { path: 'projects', lazy: lazyPage(PAGES.projects) },
      { path: 'research', lazy: lazyPage(PAGES.research) },
      { path: '*', lazy: lazyPage(PAGES.notFound) },
    ],
  },
]);

// Warm every page chunk once the first screen is up, so later navigations
// start instantly. Safari has no requestIdleCallback.
const whenIdle =
  window.requestIdleCallback ?? ((run: () => void) => setTimeout(run, 1500));
whenIdle(() => {
  for (const load of Object.values(PAGES)) load();
});

function App() {
  return (
    <TerminalProvider>
      <CommandPaletteProvider>
        <RouterProvider router={router} />
      </CommandPaletteProvider>
    </TerminalProvider>
  );
}

export default App;
