import { useLayoutEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { CommandPalette } from '@/components/CommandPalette';
import { FloatingDock } from '@/components/FloatingDock';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { TerminalView } from '@/components/TerminalView';
import { useTerminal } from '@/context/TerminalContext';
import {
  directionBetween,
  type PageContext,
  supportsViewTransitions,
  type TurnDirection,
} from '@/utils/pageTransition';

export default function MainLayout() {
  const { isTerminal } = useTerminal();
  const { pathname } = useLocation();

  // Pathname the page transition is coming from.
  const previous = useRef(pathname);
  // Once the user has navigated, view transitions animate pages in, so pages
  // skip their own entrance (where the browser supports view transitions).
  const hasNavigated = useRef(false);
  const direction = useRef<TurnDirection>('forward');
  if (pathname !== previous.current) {
    hasNavigated.current = true;
    direction.current = directionBetween(previous.current, pathname);
  }

  // Runs inside the view transition's update, before the browser builds the
  // animation, so the CSS can pick the direction.
  useLayoutEffect(() => {
    if (pathname === previous.current) return;
    document.documentElement.dataset.navDirection = direction.current;
    previous.current = pathname;
  }, [pathname]);

  const pageContext: PageContext = {
    entrance:
      hasNavigated.current && supportsViewTransitions() ? false : 'hidden',
    direction: direction.current,
  };

  if (isTerminal) {
    return <TerminalView />;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-white">
      {/* A button rather than a #hash link: ScrollRestoration swallows those. */}
      <button
        type="button"
        onClick={() => {
          const main = document.querySelector('main');
          main?.setAttribute('tabindex', '-1');
          main?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-zinc-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white dark:focus:bg-zinc-100 dark:focus:text-zinc-900"
      >
        Skip to content
      </button>
      <CommandPalette />
      <Navbar />

      <div className="relative z-10 flex-1 pb-32 pt-32">
        <Outlet context={pageContext} />
      </div>

      <Footer />
      <FloatingDock />
      <ScrollRestoration />
      <ScrollProgress />
    </div>
  );
}
