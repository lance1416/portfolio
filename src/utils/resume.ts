import { profile } from '@/data/profile';

/** Opens the résumé PDF in a new tab (matching the `<a target="_blank">` links). */
export function openResume() {
  window.open(profile.resumeUrl, '_blank', 'noopener,noreferrer');
}
