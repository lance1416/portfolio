import { AnimatePresence, motion } from 'framer-motion';
import { Download, Menu, TerminalSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTerminal } from '@/context/TerminalContext.tsx';
import { cn } from '../utils/cn';
import { ThemeToggle } from './ThemeToggle';

// Define the routes outside the component for cleaner mapping
const NAV_LINKS = [
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
  { name: 'Research', path: '/research' },
];

export function Navbar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Automatically close the mobile menu whenever the route changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const { toggleTerminal } = useTerminal();

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="fixed inset-x-4 top-4 z-50 mx-auto max-w-3xl"
    >
      {/*
        Refined Glass Chassis
        Added explicit border, backdrop-blur, and shadow for a tactile hardware feel.
      */}
      <nav className="relative flex items-center justify-between rounded-full border border-zinc-200/50 bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/60 sm:px-6">
        {/* Logo */}
        <Link
          to="/"
          className="z-10 font-semibold tracking-tight text-zinc-900 transition-transform active:scale-95 dark:text-zinc-50"
        >
          Sinan Li
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* Desktop Links with Sliding Pill */}
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'relative px-4 py-1.5 text-sm font-medium transition-colors duration-300',
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50',
                  )}
                >
                  {/* The Sliding Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 z-0 rounded-full bg-zinc-100 dark:bg-zinc-800/50"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                  {/* Text sits above the pill */}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:border-l sm:border-zinc-200/60 sm:pl-6 sm:dark:border-zinc-800/60">
            <button
              type="button"
              onClick={() =>
                document.dispatchEvent(
                  new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
                )
              }
              className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-200/50 bg-white/50 px-3 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              Search
              <kbd className="flex items-center gap-1 font-sans text-[10px]">
                <span className="text-sm">⌘</span>K
              </kbd>
            </button>

            <button
              type="button"
              onClick={toggleTerminal}
              aria-label="Toggle Terminal Mode"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/50 bg-white/50 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <TerminalSquare className="h-4 w-4" />
            </button>

            <ThemeToggle />

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group hidden h-9 items-center justify-center gap-2 rounded-full bg-zinc-900 px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md active:scale-95 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 sm:flex"
            >
              <span>Resume</span>
              <Download className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            </a>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/50 bg-white/50 text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:hidden"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="absolute left-0 right-0 top-[115%] flex origin-top flex-col gap-4 rounded-3xl border border-zinc-200/60 bg-white/80 p-6 shadow-apple-lg backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-900/80 sm:hidden"
          >
            <div className="flex flex-col gap-2 text-base">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'flex items-center rounded-2xl px-4 py-3 font-medium transition-all active:scale-[0.98]',
                      isActive
                        ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-50'
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/30 dark:hover:text-zinc-50',
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-2 border-t border-zinc-200/60 pt-4 dark:border-zinc-700/50">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-all active:scale-95 dark:bg-zinc-100 dark:text-zinc-950"
              >
                <Download className="h-4 w-4" />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
