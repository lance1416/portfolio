import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 absolute transition-transform scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
      <Moon className="h-4 w-4 absolute transition-transform scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
    </button>
  );
}
