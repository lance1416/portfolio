import { AnimatePresence, motion } from 'framer-motion';
import {
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom';
import { Footer } from '../components/Footer';
import { ThemeToggle } from '../components/ThemeToggle';
import { cn } from '../utils/cn';

export default function MainLayout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-white">
      {/* Bouncy Glassmorphic Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed inset-x-0 top-4 z-40 mx-auto flex max-w-3xl items-center justify-between rounded-full glass px-6 py-3"
      >
        <NavLink to="/" className="font-semibold tracking-tight">
          Sinan Li
        </NavLink>
        <div className="flex items-center gap-6">
          <div className="hidden gap-6 text-sm font-medium sm:flex">
            <NavLink
              to="/experience"
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-400',
                )
              }
            >
              Experience
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-400',
                )
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/research"
              className={({ isActive }) =>
                cn(
                  'transition-colors hover:text-zinc-900 dark:hover:text-zinc-50',
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-50'
                    : 'text-zinc-500 dark:text-zinc-400',
                )
              }
            >
              Research
            </NavLink>
          </div>
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* The Animated Cinematic Page Wrapper */}
      <div className="relative z-10 flex-1 pb-24 pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            // Reduced blur to 8px for a cleaner, sharper lens-focus effect
            initial={{ opacity: 0, y: 15, filter: 'blur(8px)', scale: 0.98 }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, y: -15, filter: 'blur(8px)', scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            // Hardware acceleration is mandatory for smooth blur animations
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
