import { createContext, type ReactNode, useContext, useState } from 'react';

interface TerminalContextType {
  isTerminal: boolean;
  toggleTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isTerminal, setIsTerminal] = useState(false);

  return (
    <TerminalContext.Provider
      value={{ isTerminal, toggleTerminal: () => setIsTerminal(!isTerminal) }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
