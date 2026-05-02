import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Moon, Search, TerminalSquare } from 'lucide-react';
import { useState } from 'react';
import { useTerminal } from '../context/TerminalContext'; // If you built Terminal Mode

// A reusable Dock Button component with a built-in tooltip
function DockItem({
  icon: Icon,
  label,
  onClick,
  shortcut,
}: {
  icon: any;
  label: string;
  onClick: () => void;
  shortcut?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Set hovering state
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 2, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute -top-12 flex items-center gap-2 whitespace-nowrap rounded-lg border border-zinc-200/50 bg-white/90 px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-md dark:border-zinc-700/50 dark:bg-zinc-800/90 dark:text-zinc-300"
          >
            {label}
            {shortcut && (
              <kbd className="font-sans text-[10px] text-zinc-400 dark:text-zinc-500">
                {shortcut}
              </kbd>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onClick}
        className="group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 hover:bg-zinc-100 hover:scale-110 active:scale-95 dark:hover:bg-zinc-800"
      >
        <Icon className="h-5 w-5 text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-50" />
      </button>
    </div>
  );
}

export function FloatingDock() {
  const { toggleTerminal } = useTerminal(); // Assuming this exists from earlier

  const triggerCmdK = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
    );
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const downloadResume = () => {
    window.open('/resume.pdf', '_blank');
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.2 }}
      className="fixed bottom-6 left-1/2 z-50 hidden -translate-x-1/2 items-center gap-2 rounded-3xl border border-zinc-200/50 bg-white/60 p-2 shadow-apple-lg backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-900/60 sm:flex"
    >
      <DockItem
        icon={Search}
        label="Command Palette"
        shortcut="⌘K"
        onClick={triggerCmdK}
      />

      {/* Separator */}
      <div className="h-8 w-px bg-zinc-200/60 dark:bg-zinc-700/50" />

      <DockItem
        icon={FileText}
        label="Download Resume"
        onClick={downloadResume}
      />
      <DockItem
        icon={TerminalSquare}
        label="Terminal Mode"
        onClick={toggleTerminal}
      />
      <DockItem icon={Moon} label="Toggle Theme" onClick={toggleTheme} />
    </motion.div>
  );
}
