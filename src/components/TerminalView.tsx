import { XSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTerminal } from '@/context/TerminalContext';
import { experienceData } from '@/data/experience';
import { projectsData } from '@/data/projects';
import { educationData } from '@/data/research';

export function TerminalView() {
  const location = useLocation();
  const { toggleTerminal } = useTerminal();
  const [output, setOutput] = useState('');

  // Map the current URL to your raw data
  useEffect(() => {
    // biome-ignore lint/suspicious/noImplicitAnyLet: Type not determined until later.
    let data;
    let filename = '';

    switch (location.pathname) {
      case '/experience':
        data = experienceData;
        filename = 'experience.json';
        break;
      case '/projects':
        data = projectsData;
        filename = 'projects.json';
        break;
      case '/research':
        data = educationData;
        filename = 'research.json';
        break;
      default:
        data = {
          name: 'Sinan Li',
          role: 'Systems Engineer & Researcher',
          location: 'Oxford, UK',
          status: 'Building KidneyOS / Researching ZX-Calculus',
          email: 'lanceli1416@gmail.com',
        };
        filename = 'whoami.json';
    }

    // Simulate terminal execution
    const command = `sinan@macbook-pro:~$ cat ${filename}\n`;
    setOutput(command + JSON.stringify(data, null, 2));
  }, [location.pathname]);

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
