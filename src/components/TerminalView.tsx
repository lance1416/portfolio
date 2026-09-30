import { XSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useTerminal } from '@/context/TerminalContext';
import { experienceData } from '@/data/experience';
import { profile } from '@/data/profile';
import { projectsData } from '@/data/projects';
import { educationData } from '@/data/research';

interface TerminalFile {
  filename: string;
  data: unknown;
}

// Each route "cats" its underlying data as JSON.
const FILES_BY_PATH: Record<string, TerminalFile> = {
  '/experience': { filename: 'experience.json', data: experienceData },
  '/projects': { filename: 'projects.json', data: projectsData },
  '/research': { filename: 'research.json', data: educationData },
};

const WHOAMI: TerminalFile = {
  filename: 'whoami.json',
  data: {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    status: profile.status,
    email: profile.email,
  },
};

export function TerminalView() {
  const { pathname } = useLocation();
  const { toggleTerminal } = useTerminal();

  // React Router also matches '/projects/', so ignore trailing slashes.
  const route = pathname.replace(/\/+$/, '') || '/';
  const { filename, data } = FILES_BY_PATH[route] ?? WHOAMI;
  const output = `sinan@macbook-pro:~$ cat ${filename}\n${JSON.stringify(data, null, 2)}`;

  return (
    <div className="min-h-screen w-full bg-black p-4 font-mono sm:p-8">
      {/* Fake Terminal Window Controls */}
      <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTerminal}
            className="h-3 w-3 rounded-full bg-red-500 hover:bg-red-400"
            aria-label="Close Terminal"
          />
          <div className="h-3 w-3 rounded-full bg-yellow-500" />
          <div className="h-3 w-3 rounded-full bg-green-500" />
        </div>
        <button
          type="button"
          onClick={toggleTerminal}
          className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <XSquare className="h-4 w-4" />
          Exit Terminal Mode
        </button>
      </div>

      {/* The Raw Output */}
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-400 sm:text-base">
        {output}
        <span className="animate-pulse">_</span>
      </pre>
    </div>
  );
}
