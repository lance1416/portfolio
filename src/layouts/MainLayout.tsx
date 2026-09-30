import { Outlet, ScrollRestoration } from 'react-router-dom';
import { CommandPalette } from '@/components/CommandPalette';
import { FloatingDock } from '@/components/FloatingDock';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { TerminalView } from '@/components/TerminalView';
import { useTerminal } from '@/context/TerminalContext';

export default function MainLayout() {
  const { isTerminal } = useTerminal();

  if (isTerminal) {
    return <TerminalView />;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-white">
      <CommandPalette />
      <Navbar />

      <div className="relative z-10 flex-1 pb-32 pt-32">
        <Outlet />
      </div>

      <Footer />
      <FloatingDock />
      <ScrollRestoration />
      <ScrollProgress />
    </div>
  );
}
