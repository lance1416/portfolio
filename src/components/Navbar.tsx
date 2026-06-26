import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Menu, Moon, Search, TerminalSquare, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTerminal } from '../context/TerminalContext'; // If using Terminal Mode
import { cn } from '../utils/cn';

const NAV_LINKS = [
  { name: 'Experience', path: '/experience' },
  { name: 'Projects', path: '/projects' },
  { name: 'Research', path: '/research' },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleTerminal } = useTerminal(); // If using Terminal Mode

  // Lock body scroll when full-screen menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Intentional
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const openCommandPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
    );
    setIsMobileMenuOpen(false); // Close menu if opening search on mobile
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/*
        The Main Navigation Pill
        z-[60] ensures it always sits ABOVE the full-screen mobile menu
      */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed inset-x-4 top-4 z-[60] mx-auto max-w-3xl"
      >
        <nav className="relative flex items-center justify-between rounded-full border border-zinc-200/50 bg-white/60 px-4 py-2.5 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/60 sm:px-6">
          <div className="flex w-32 items-center">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="z-10 font-display font-normal text-zinc-900 transition-transform active:scale-[0.96] dark:text-zinc-50"
            >
              Sinan Li
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-1 sm:flex">
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
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex w-32 justify-end gap-3">
            <button
              type="button"
              onClick={openCommandPalette}
              className="group hidden sm:flex items-center gap-2 rounded-full border border-zinc-200/50 bg-white/50 pl-3 pr-2 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700/50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Menu</span>
              <kbd className="flex items-center gap-1 rounded bg-zinc-200/50 px-1.5 py-0.5 font-sans text-[10px] text-zinc-400 transition-colors group-hover:text-zinc-500 dark:bg-zinc-700/50 dark:group-hover:text-zinc-300">
                <span className="text-sm">⌘</span>K
              </kbd>
            </button>

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
        </nav>
      </motion.div>

      {/*
        The Apple-Style Full-Screen Mobile Takeover
        z-[50] places it perfectly beneath the floating Navbar pill
      */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[50] flex flex-col bg-white/95 px-6 pb-8 pt-32 backdrop-blur-3xl dark:bg-zinc-950/95 sm:hidden"
          >
            {/* Massive Typography Links */}
            <div className="flex flex-1 flex-col justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <Link
                    to={link.path}
                    className="text-4xl font-bold tracking-tight text-zinc-900 transition-colors active:text-zinc-500 dark:text-zinc-50 dark:active:text-zinc-400"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Actions Grid (Replaces the Dock) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="grid grid-cols-2 gap-3 border-t border-zinc-200/60 pt-6 dark:border-zinc-800/60"
            >
              <button
                type="button"
                onClick={openCommandPalette}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.96] dark:bg-zinc-900 dark:text-zinc-50"
              >
                <Search className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                Search
              </button>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.96] dark:bg-zinc-900 dark:text-zinc-50"
              >
                <FileText className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                Resume
              </a>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.96] dark:bg-zinc-900 dark:text-zinc-50"
              >
                <Moon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                Theme
              </button>

              <button
                type="button"
                onClick={toggleTerminal}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.96] dark:bg-zinc-900 dark:text-zinc-50"
              >
                <TerminalSquare className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
                Terminal
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
