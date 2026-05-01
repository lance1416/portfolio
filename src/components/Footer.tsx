import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200/60 bg-transparent py-10 dark:border-zinc-800/60">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        {/* Dynamic Copyright */}
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Sinan Li. All rights reserved.
        </p>

        {/* Minimal Social Links */}
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/lance1416"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            <span className="sr-only">GitHub</span>
            <FaGithub className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com/in/sinanli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            <span className="sr-only">LinkedIn</span>
            <FaLinkedin className="h-5 w-5" />
          </a>
          <a
            href="mailto:lanceli1416@gmail.com"
            className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
          >
            <span className="sr-only">Email</span>
            <FaEnvelope className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
