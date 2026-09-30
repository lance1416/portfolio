import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  /** The user's chosen preference — may be 'system'. */
  theme: Theme;
  /** The resolved appearance currently applied to the document. */
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  /** Flip between light and dark, persisting the choice. */
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

/** Resolve a preference to the concrete dark/light appearance. */
function resolveIsDark(theme: Theme): boolean {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return theme === 'dark';
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  // Resolve the initial appearance synchronously to avoid a first-paint flash.
  const [isDark, setIsDark] = useState(() => resolveIsDark(theme));

  useEffect(() => {
    const root = window.document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const dark = resolveIsDark(theme);
      root.classList.toggle('dark', dark);
      root.classList.toggle('light', !dark);
      setIsDark(dark);
    };

    apply();

    // Follow the OS preference live, but only while in 'system' mode.
    if (theme === 'system') {
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
  }, [theme]);

  const setTheme = (next: Theme) => {
    localStorage.setItem(storageKey, next);
    setThemeState(next);
  };

  const value: ThemeProviderState = {
    theme,
    isDark,
    setTheme,
    toggleTheme: () => setTheme(isDark ? 'light' : 'dark'),
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
