import { type ClassValue, clsx } from 'clsx';

/**
 * Joins class names. No tailwind-merge: no call site passes classes that
 * conflict, so it would only cost bundle size. If one ever needs a later class
 * to override an earlier one, merge at that call site instead.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
