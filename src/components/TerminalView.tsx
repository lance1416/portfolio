import { X } from 'lucide-react';
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CatStatus } from '@/components/CatStatus';
import { useTerminal } from '@/context/TerminalContext';
import { useTheme } from '@/context/ThemeContext';
import { display, pathForRoute } from '@/terminal/fs';
import {
  complete,
  type Effect,
  greeting,
  type Output,
  run,
} from '@/terminal/shell';

interface Entry {
  id: number;
  /** Where the command ran, for its prompt. */
  cwd: string;
  input: string;
  output: Output[];
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="shrink-0 select-none">
      <span className="text-emerald-400">guest@lance1416</span>
      <span className="text-zinc-500">:</span>
      <span className="text-sky-400">{cwd}</span>
      {/* Margin, not a trailing space: flex items drop trailing whitespace. */}
      <span className="mr-[1ch] text-zinc-500">$</span>
    </span>
  );
}

const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g;

/** Pretty-printed JSON with keys, strings and literals coloured. */
function Json({ value }: { value: unknown }) {
  const source = JSON.stringify(value, null, 2);
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of source.matchAll(JSON_TOKEN)) {
    parts.push(source.slice(last, match.index));
    const [token, string, colon, literal] = match;
    const className = colon
      ? 'text-sky-300'
      : string
        ? 'text-emerald-300'
        : literal
          ? 'text-violet-300'
          : 'text-amber-300';
    parts.push(
      <span key={match.index} className={className}>
        {string ?? token}
      </span>,
      colon ?? '',
    );
    last = match.index + token.length;
  }
  parts.push(source.slice(last));
  return <>{parts}</>;
}

function Block({
  output,
  onOpen,
}: {
  output: Output;
  onOpen: (command: string) => void;
}) {
  switch (output.type) {
    case 'text':
      return <div>{output.text}</div>;
    case 'table':
      return (
        // Two columns from sm; stacked on phones, where the summaries would squeeze.
        <dl className="grid gap-x-[2ch] sm:grid-cols-[auto_1fr]">
          {output.rows.map(([term, detail]) => (
            <div key={term} className="contents">
              <dt className="text-zinc-100">{term}</dt>
              <dd className="mb-1 pl-[2ch] text-zinc-400 sm:mb-0 sm:pl-0 sm:text-inherit">
                {detail}
              </dd>
            </div>
          ))}
        </dl>
      );
    case 'cat':
      return <CatStatus />;
    case 'error':
      return <div className="text-rose-400">{output.text}</div>;
    case 'json':
      return (
        <div>
          <Json value={output.value} />
        </div>
      );
    case 'ls':
      // Entries are buttons too, so the shell works without a keyboard.
      return (
        <ul className="flex flex-wrap gap-x-6 gap-y-1">
          {output.entries.map(({ name, path, dir }) => (
            <li key={name}>
              <button
                type="button"
                onClick={() =>
                  onOpen(
                    `${dir ? 'cd' : name.endsWith('.pdf') ? 'open' : 'cat'} ${path}`,
                  )
                }
                className={
                  dir
                    ? 'text-sky-400 hover:underline'
                    : 'text-zinc-200 hover:underline'
                }
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      );
  }
}

/**
 * Terminal mode: the site as a small shell. Pages are directories (`cd`
 * navigates, so the URL and Back button keep working) and entries are JSON
 * files built from `src/data`.
 */
export function TerminalView() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toggleTerminal } = useTerminal();
  const { setTheme } = useTheme();

  // Follows the URL (so Back works), but `cd` sets it at once: the router
  // commits navigations asynchronously, and the next prompt can't wait.
  const [cwd, setCwd] = useState(() => pathForRoute(pathname));
  useEffect(() => {
    setCwd(pathForRoute(pathname));
  }, [pathname]);

  const [entries, setEntries] = useState<Entry[]>(() => {
    const input = greeting(cwd);
    return [
      { id: 0, cwd: display(cwd), input, output: run(input, cwd).output },
    ];
  });
  const [input, setInput] = useState('');
  const history = useRef<string[]>([]);
  // Position while walking history with ↑ ↓; history.length means "new line".
  const cursor = useRef(0);
  const nextId = useRef(1);

  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Dark page behind the terminal, so overscroll never flashes the light theme.
  useEffect(() => {
    const { style } = document.documentElement;
    style.backgroundColor = '#09090b';
    return () => {
      style.backgroundColor = '';
    };
  }, []);

  // Keep the prompt in view as output grows.
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs per new entry
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [entries]);

  const apply = (effect: Effect) => {
    switch (effect.type) {
      case 'cd':
        setCwd(effect.path);
        navigate(effect.route);
        break;
      case 'open':
        window.open(effect.url, '_blank', 'noopener,noreferrer');
        break;
      case 'theme':
        setTheme(effect.theme);
        break;
      case 'clear':
        setEntries([]);
        break;
      case 'exit':
        toggleTerminal();
        break;
    }
  };

  const submit = (line: string) => {
    const result = run(line, cwd);
    if (line.trim()) history.current.push(line);
    cursor.current = history.current.length;
    setInput('');
    setEntries((prev) => [
      ...prev,
      {
        id: nextId.current++,
        cwd: display(cwd),
        input: line,
        output: result.output,
      },
    ]);
    if (result.effect) apply(result.effect);
    inputRef.current?.focus();
  };

  const recall = (step: number) => {
    const next = cursor.current + step;
    if (next < 0 || next > history.current.length) return;
    cursor.current = next;
    setInput(history.current[next] ?? '');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(input);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput(complete(input, cwd));
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      recall(e.key === 'ArrowUp' ? -1 : 1);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setEntries([]);
    } else if (e.ctrlKey && e.key === 'c' && !getSelection()?.toString()) {
      e.preventDefault();
      setEntries((prev) => [
        ...prev,
        {
          id: nextId.current++,
          cwd: display(cwd),
          input: `${input}^C`,
          output: [],
        },
      ]);
      setInput('');
    }
  };

  // Clicking the screen focuses the prompt, unless the visitor is selecting text.
  const focusPrompt = () => {
    if (!getSelection()?.toString()) inputRef.current?.focus();
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 font-mono text-sm leading-relaxed text-zinc-300">
      <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-zinc-800 bg-zinc-950/90 px-4 py-2 backdrop-blur sm:px-6">
        <div className="flex gap-2" aria-hidden="true">
          {/* Mouse-only: the Exit button is the accessible way out. */}
          <button
            type="button"
            tabIndex={-1}
            onClick={toggleTerminal}
            className="h-3 w-3 rounded-full bg-[#ff5f57] hover:brightness-110"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <h1 className="truncate text-xs text-zinc-400">
          guest@lance1416: {display(cwd)}
        </h1>
        <button
          type="button"
          onClick={toggleTerminal}
          className="-my-3 flex items-center gap-1.5 py-3 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Exit
        </button>
      </header>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: a mouse convenience; the input is reachable by Tab */}
      <main className="flex-1 px-4 py-4 sm:px-6" onClick={focusPrompt}>
        <div
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
          className="space-y-3"
        >
          {entries.map((entry) => (
            <div key={entry.id}>
              <div className="flex flex-wrap">
                <Prompt cwd={entry.cwd} />
                <span className="whitespace-pre-wrap break-all text-zinc-100">
                  {entry.input}
                </span>
              </div>
              <div className="whitespace-pre-wrap break-words">
                {entry.output.map((output, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: output never reorders
                  <Block key={i} output={output} onOpen={submit} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div ref={endRef} className="mt-3 flex items-center">
          <Prompt cwd={display(cwd)} />
          <input
            ref={inputRef}
            aria-label="Command"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              cursor.current = history.current.length;
            }}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            // 16px on phones so iOS doesn't zoom into the field.
            className="min-w-0 flex-1 bg-transparent text-base text-zinc-100 caret-emerald-400 outline-none sm:text-sm"
          />
        </div>
      </main>
    </div>
  );
}
