import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

interface TerminalContextType {
  isTerminal: boolean;
  toggleTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(
  undefined,
);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isTerminal, setIsTerminal] = useState(false);
  const toggleTerminal = useCallback(() => setIsTerminal((prev) => !prev), []);

  return (
    <TerminalContext.Provider value={{ isTerminal, toggleTerminal }}>
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
