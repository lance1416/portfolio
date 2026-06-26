import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200/60 py-10 dark:border-zinc-800/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-8">
        <p className="font-mono text-xs text-zinc-400 dark:text-zinc-500">
          © {new Date().getFullYear()} Sinan Li
        </p>

        {/* 40x40 hit areas: -m-3 cancels the box padding so the visible row keeps its bounds; gap-0 keeps centers 40px apart (adjacent, never overlapping) */}
        <div className="-m-3 flex items-center">
          <a
            href="https://github.com/lance1416"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
            aria-label="GitHub"
          >
            <FaGithub className="h-4 w-4" />
          </a>
          <a
            href="https://linkedin.com/in/sinanli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:lanceli1416@gmail.com"
            className="flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
            aria-label="Email"
          >
            <FaEnvelope className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
