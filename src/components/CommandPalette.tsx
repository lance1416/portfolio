import {
  Check,
  Copy,
  FileText,
  Home,
  type LucideIcon,
  Search,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import { useTheme } from '@/context/ThemeContext';
import { ACTION_LABELS, themeAction } from '@/data/actions';
import { NAV_LINKS } from '@/data/navigation';
import { profile } from '@/data/profile';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/utils/cn';
import { openResume } from '@/utils/resume';
import { DURATION, SPRING, timed } from '@/utils/variants';
import { IconSwap } from './IconSwap';

interface Action {
  id: string;
  name: string;
  icon: LucideIcon;
  onSelect: () => void;
  keepOpen?: boolean;
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const { toggleTheme, isDark } = useTheme();
  const theme = themeAction(isDark);
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Track the currently highlighted index for keyboard navigation.
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const copyTimerRef = useRef<number>(undefined);
  const navigate = useNavigate();

  useScrollLock(isOpen);

  // Focus the input when opening; reset state (and any pending auto-close) when closing.
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      clearTimeout(copyTimerRef.current);
      setCopied(false);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => () => clearTimeout(copyTimerRef.current), []);

  const runAction = (action: Action) => {
    action.onSelect();
    if (!action.keepOpen) close();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard unavailable (permissions, insecure context): open the mail client instead.
      window.location.href = `mailto:${profile.email}`;
      close();
      return;
    }
    setCopied(true);
    clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(close, 1500);
  };

  const actions: Action[] = [
    {
      id: 'home',
      name: 'Go to Home',
      icon: Home,
      onSelect: () => navigate('/', { viewTransition: true }),
    },
    ...NAV_LINKS.map((link) => ({
      id: link.path,
      name: `Go to ${link.name}`,
      icon: link.icon,
      onSelect: () => navigate(link.path, { viewTransition: true }),
    })),
    {
      id: 'theme',
      name: theme.label,
      icon: theme.icon,
      onSelect: toggleTheme,
    },
    {
      id: 'resume',
      name: ACTION_LABELS.resume,
      icon: FileText,
      onSelect: openResume,
    },
    {
      id: 'email',
      name: copied ? ACTION_LABELS.emailCopied : ACTION_LABELS.copyEmail,
      icon: copied ? Check : Copy,
      onSelect: copyEmail,
      // Stays open to show the "copied" confirmation, then closes itself.
      keepOpen: true,
    },
  ];

  const filteredActions =
    query === ''
      ? actions
      : actions.filter((action) =>
          action.name.toLowerCase().includes(query.toLowerCase()),
        );

  // Keep the highlighted item visible in the scrollable list.
  useEffect(() => {
    if (!isOpen) return;
    const activeElement = document.getElementById(
      `command-item-${selectedIndex}`,
    );
    if (activeElement && listRef.current) {
      // 'nearest' ensures smooth scrolling without jarring jumps
      activeElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredActions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredActions.length) % filteredActions.length,
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAction(filteredActions[selectedIndex]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: timed(DURATION.exit),
            }}
            onClick={close}
            className="fixed inset-0 z-[100] bg-zinc-900/20 backdrop-blur-sm dark:bg-black/40"
          />

          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -8,
                transition: timed(DURATION.exit),
              }}
              transition={SPRING.ui}
              className="w-full max-w-xl overflow-hidden rounded-2xl bg-white/80 shadow-overlay backdrop-blur-xl dark:bg-zinc-900/80 pointer-events-auto"
            >
              <div className="flex items-center border-b border-zinc-200/60 px-4 dark:border-zinc-800/60">
                <Search className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command or search…"
                  className="h-14 w-full bg-transparent px-4 font-mono text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-500"
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 font-mono text-[10px] text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                  ESC
                </kbd>
              </div>

              <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
                {filteredActions.length === 0 ? (
                  <p className="p-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    No results found.
                  </p>
                ) : (
                  filteredActions.map((action, index) => {
                    const Icon = action.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        type="button"
                        key={action.id}
                        id={`command-item-${index}`}
                        onClick={() => runAction(action)}
                        // Sync mouse hover with keyboard selection
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          'group flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                          isSelected
                            ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800/50 dark:text-zinc-50'
                            : 'text-zinc-600 dark:text-zinc-400',
                        )}
                      >
                        {/* Keyed by name so state changes (Copy → Copied) cross-fade the icon. */}
                        <IconSwap swapKey={action.name}>
                          <Icon
                            className={cn(
                              'h-4 w-4 transition-colors',
                              isSelected
                                ? 'text-zinc-900 dark:text-zinc-50'
                                : 'text-zinc-400',
                            )}
                          />
                        </IconSwap>
                        {action.name}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="border-t border-zinc-200/60 bg-zinc-50/50 px-4 py-3 dark:border-zinc-800/60 dark:bg-zinc-950/50">
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                  Use{' '}
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↑
                  </kbd>{' '}
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↓
                  </kbd>{' '}
                  to navigate,{' '}
                  <kbd className="rounded border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-700 dark:bg-zinc-800">
                    ↵
                  </kbd>{' '}
                  to select
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
