import { Briefcase, Code, GraduationCap, type LucideIcon } from 'lucide-react';

export interface NavLink {
  name: string;
  path: string;
  icon: LucideIcon;
}

/** Top-level sections, in display order. Home ('/') is linked separately. */
export const NAV_LINKS: NavLink[] = [
  { name: 'Experience', path: '/experience', icon: Briefcase },
  { name: 'Projects', path: '/projects', icon: Code },
  { name: 'Research', path: '/research', icon: GraduationCap },
];
