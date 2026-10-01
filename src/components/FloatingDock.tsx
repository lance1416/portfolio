import {
  FileText,
  type LucideIcon,
  Moon,
  Search,
  TerminalSquare,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { useTerminal } from '@/context/TerminalContext';
import { useTheme } from '@/context/ThemeContext';
import { openResume } from '@/utils/resume';
import { PALETTE_SHORTCUT } from '@/utils/shortcut';

/** Icon button with a tooltip shown on hover and on keyboard focus. */
function DockItem({
  icon: Icon,
  label,
  onClick,
  shortcut,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  shortcut?: { label: string; aria: string };
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center justify-center">
      <AnimatePresence>
        {(isHovered || isFocused) && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -top-12 flex items-center gap-2 whitespace-nowrap rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-border backdrop-blur-md dark:bg-zinc-800/90 dark:text-zinc-300"
          >
            {label}
            {shortcut && (
              <kbd className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500">
                {shortcut.label}
              </kbd>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label={label}
        aria-keyshortcuts={shortcut?.aria}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // Mouse clicks also focus the button; only keyboard focus shows the tooltip.
        onFocus={(e) => setIsFocused(e.currentTarget.matches(':focus-visible'))}
        onBlur={() => setIsFocused(false)}
        className="group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-[scale,background-color] duration-150 ease-out hover:bg-zinc-100 active:scale-[0.96] dark:hover:bg-zinc-800"
      >
        <Icon className="h-5 w-5 text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-50" />
      </button>
    </div>
  );
}

export function FloatingDock() {
  const { toggleTerminal } = useTerminal();
  const { open: openCommandPalette } = useCommandPalette();
  const { toggleTheme } = useTheme();

  return (
    // Hidden on short screens (a phone on its side), where it would cover a
    // third of the page; the navbar's Menu opens the same actions.
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
      className="fixed bottom-6 left-1/2 z-50 hidden [view-transition-name:dock] -translate-x-1/2 items-center gap-2 rounded-3xl bg-white/60 p-2 shadow-floating backdrop-blur-xl dark:bg-zinc-900/60 sm:flex [@media(max-height:480px)]:hidden"
    >
      <DockItem
        icon={Search}
        label="Command Palette"
        shortcut={PALETTE_SHORTCUT}
        onClick={openCommandPalette}
      />

      {/* Separator */}
      <div className="h-8 w-px bg-zinc-200/60 dark:bg-zinc-700/50" />

      <DockItem icon={FileText} label="Download Resume" onClick={openResume} />
      <DockItem
        icon={TerminalSquare}
        label="Terminal Mode"
        onClick={toggleTerminal}
      />
      <DockItem icon={Moon} label="Toggle Theme" onClick={toggleTheme} />
    </motion.div>
  );
}
