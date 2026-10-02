import {
  FileText,
  type LucideIcon,
  Menu,
  Moon,
  Search,
  TerminalSquare,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { useTerminal } from '@/context/TerminalContext';
import { useTheme } from '@/context/ThemeContext';
import { NAV_LINKS } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/utils/cn';
import { PALETTE_SHORTCUT } from '@/utils/shortcut';
import { DURATION, SPRING, timed } from '@/utils/variants';
import { IconSwap } from './IconSwap';

const MOBILE_ACTION_CLASS =
  'flex flex-col items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-4 text-sm font-semibold text-zinc-900 transition-transform active:scale-[0.96] dark:bg-zinc-900 dark:text-zinc-50';

/** Tile in the mobile menu's action grid: a button, or a new-tab link when `href` is set. */
function MobileAction({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <>
      <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      {label}
    </>
  );

  return href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={MOBILE_ACTION_CLASS}
    >
      {content}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={MOBILE_ACTION_CLASS}>
      {content}
    </button>
  );
}

export function Navbar() {
  const { pathname } = useLocation();
  // The menu is open only on the path it was opened from, so any navigation
  // (links, palette, browser back) closes it without an effect.
  const [menuOpenedAt, setMenuOpenedAt] = useState<string | null>(null);
  const isMobileMenuOpen = menuOpenedAt === pathname;
  const closeMobileMenu = () => setMenuOpenedAt(null);
  const { toggleTerminal } = useTerminal();
  const { open } = useCommandPalette();
  const { toggleTheme } = useTheme();

  useScrollLock(isMobileMenuOpen);

  const openCommandPalette = () => {
    open();
    closeMobileMenu();
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
        transition={SPRING.ui}
        className="fixed inset-x-4 top-4 z-[60] mx-auto max-w-3xl [view-transition-name:navbar]"
      >
        <nav className="relative flex items-center justify-between rounded-full bg-white/60 px-4 py-2.5 shadow-border backdrop-blur-md dark:bg-zinc-950/60 sm:px-6">
          <div className="flex w-32 items-center">
            <Link
              to="/"
              viewTransition
              onClick={closeMobileMenu}
              className="z-10 -my-2 py-2 font-display font-normal text-zinc-900 transition-transform active:scale-[0.96] dark:text-zinc-50"
            >
              {profile.name}
            </Link>
          </div>

          <div className="hidden flex-1 items-center justify-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  viewTransition
                  // after: extends the 32px pill to a 40px hit area
                  className={cn(
                    'relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-1',
                    isActive
                      ? 'text-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50',
                  )}
                >
                  {isActive && (
                    // Animated by Motion in the live DOM: during a page turn
                    // the navbar is a live snapshot, so the glide still shows,
                    // and the label stays above the pill.
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 z-0 rounded-full bg-zinc-100 dark:bg-zinc-800/50"
                      transition={SPRING.ui}
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
              aria-keyshortcuts={PALETTE_SHORTCUT.aria}
              // after: extends the 33px button to a 41px hit area
              className="group relative hidden sm:flex after:absolute after:inset-x-0 after:-inset-y-1 items-center gap-2 rounded-full bg-white/50 pl-3 pr-2 py-2 text-xs font-medium text-zinc-500 shadow-border transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <Search className="h-3.5 w-3.5" />
              <span>Menu</span>
              {/* Touch-first devices (an iPad without a keyboard) have no shortcut to show. */}
              <kbd className="rounded bg-zinc-200/50 px-1.5 py-0.5 font-sans text-[10px] text-zinc-600 transition-colors group-hover:text-zinc-700 pointer-coarse:hidden dark:text-zinc-400 dark:bg-zinc-700/50 dark:group-hover:text-zinc-300">
                {PALETTE_SHORTCUT.label}
              </kbd>
            </button>

            <button
              type="button"
              onClick={() =>
                setMenuOpenedAt(isMobileMenuOpen ? null : pathname)
              }
              // after: extends the 36px button to a 44px touch target
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-zinc-600 shadow-border transition-colors after:absolute after:-inset-1 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:bg-zinc-800 sm:hidden"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <IconSwap swapKey={isMobileMenuOpen ? 'close' : 'menu'}>
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </IconSwap>
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
            exit={{
              opacity: 0,
              y: -8,
              transition: timed(DURATION.exit),
            }}
            transition={timed(DURATION.base)}
            className="fixed inset-0 z-[50] flex flex-col bg-white/95 px-6 pb-8 pt-32 backdrop-blur-md dark:bg-zinc-950/95 sm:hidden"
          >
            {/* Section links, in the display face like every page title */}
            <div className="flex flex-1 flex-col justify-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...SPRING.content, delay: 0.05 + i * 0.1 }}
                >
                  <Link
                    to={link.path}
                    // No view transition from inside the menu: WebKit crashes
                    // when the tapped link unmounts mid-transition. The menu's
                    // own fade is the transition here.
                    className="font-display text-4xl font-normal tracking-tight text-zinc-900 transition-colors active:text-zinc-500 dark:text-zinc-50 dark:active:text-zinc-400"
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
              transition={{ ...SPRING.content, delay: 0.35 }}
              className="grid grid-cols-2 gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800"
            >
              <MobileAction
                icon={Search}
                label="Search"
                onClick={openCommandPalette}
              />
              <MobileAction
                icon={FileText}
                label="Resume"
                href={profile.resumeUrl}
              />
              <MobileAction icon={Moon} label="Theme" onClick={toggleTheme} />
              <MobileAction
                icon={TerminalSquare}
                label="Terminal"
                onClick={toggleTerminal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
