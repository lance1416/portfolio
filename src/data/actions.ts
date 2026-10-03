import { type LucideIcon, Moon, Sun } from 'lucide-react';

/**
 * Names of the site-wide actions, shared by the command palette, the floating
 * dock and the mobile menu so each action is called the same thing
 * everywhere. Sentence case, like the rest of the site's controls.
 */
export const ACTION_LABELS = {
  search: 'Search',
  resume: 'Download résumé',
  terminal: 'Terminal mode',
  copyEmail: 'Copy email address',
  emailCopied: 'Email copied',
} as const;

/** The theme switch names the theme it switches to, with its icon. */
export function themeAction(isDark: boolean): {
  label: string;
  icon: LucideIcon;
} {
  return isDark
    ? { label: 'Switch to light mode', icon: Sun }
    : { label: 'Switch to dark mode', icon: Moon };
}
