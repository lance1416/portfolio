import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { CommandPalette } from '@/components/CommandPalette.tsx';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { TerminalView } from '@/components/TerminalView.tsx';
import { useTerminal } from '@/context/TerminalContext.tsx';

export default function MainLayout() {
  const location = useLocation();
  const { isTerminal } = useTerminal(); // <-- Get the state

  // IF TERMINAL MODE IS ACTIVE, RENDER ONLY THE SHELL
  if (isTerminal) {
    return <TerminalView />;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-white">
      <CommandPalette />

      {/* Extracted Navbar Component */}
      <Navbar />

      {/* The Animated Cinematic Page Wrapper */}
      <div className="relative z-10 flex-1 pb-24 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, y: -15, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'transform, filter, opacity' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
      <ScrollRestoration />
    </div>
  );
}
