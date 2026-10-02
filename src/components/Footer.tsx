import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';
import { PAGE_COLUMN } from '@/components/Page';
import { profile } from '@/data/profile';
import { cn } from '@/utils/cn';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: profile.links.github, icon: FaGithub, ext: true },
  {
    label: 'LinkedIn',
    href: profile.links.linkedin,
    icon: FaLinkedin,
    ext: true,
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    icon: FaEnvelope,
    ext: false,
  },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 py-10 dark:border-zinc-800">
      <div
        className={cn(
          PAGE_COLUMN,
          'flex flex-col items-center justify-between gap-6 sm:flex-row',
        )}
      >
        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} {profile.name}
        </p>

        {/* 40x40 hit areas: -m-3 cancels the box padding so the visible row keeps its bounds; gap-0 keeps centers 40px apart (adjacent, never overlapping) */}
        <div className="-m-3 flex items-center">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon, ext }) => (
            <a
              key={label}
              href={href}
              {...(ext && { target: '_blank', rel: 'noopener noreferrer' })}
              className="flex h-10 w-10 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
