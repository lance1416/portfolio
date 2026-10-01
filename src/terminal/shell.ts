import { profile } from '@/data/profile';
import { type DirNode, display, type Path, resolve } from './fs';

export type Output =
  | { type: 'text'; text: string }
  | { type: 'error'; text: string }
  | { type: 'json'; value: unknown }
  | { type: 'table'; rows: [string, string][] }
  /** Directory listing; `path` is each entry's absolute path, for click-to-open. */
  | { type: 'ls'; entries: { name: string; path: string; dir: boolean }[] };

/** Side effects the view carries out after printing. */
export type Effect =
  /** `path` updates the prompt at once; the router commits `route` later. */
  | { type: 'cd'; path: Path; route: string }
  | { type: 'open'; url: string }
  | { type: 'theme'; theme: 'light' | 'dark' | 'system' }
  | { type: 'clear' }
  | { type: 'exit' };

export interface Result {
  output: Output[];
  effect?: Effect;
}

const text = (t: string): Output => ({ type: 'text', text: t });
const error = (t: string): Result => ({ output: [{ type: 'error', text: t }] });

const LINKS: Record<string, string> = {
  github: profile.links.github,
  linkedin: profile.links.linkedin,
  email: `mailto:${profile.email}`,
};

const THEMES = ['light', 'dark', 'system'] as const;

interface Command {
  usage: string;
  summary: string;
  run: (args: string[], cwd: Path) => Result;
}

const go = (path: Path, node: DirNode): Result => ({
  output: [],
  effect: { type: 'cd', path, route: node.route },
});

function list(node: DirNode, path: Path): Output {
  return {
    type: 'ls',
    entries: Object.entries(node.children).map(([name, child]) => ({
      name,
      path: display([...path, name.replace(/\/$/, '')]),
      dir: child.kind === 'dir',
    })),
  };
}

export const COMMANDS: Record<string, Command> = {
  help: {
    usage: 'help',
    summary: 'list commands',
    run: () => ({
      output: [
        {
          type: 'table',
          rows: Object.values(COMMANDS).map((c) => [c.usage, c.summary]),
        },
        text('Tab completes, ↑ ↓ walk history, Ctrl+L clears.'),
      ],
    }),
  },
  ls: {
    usage: 'ls [dir]',
    summary: 'list a directory',
    run: ([arg], cwd) => {
      const target = resolve(cwd, arg ?? '.');
      if (!target) return error(`ls: ${arg}: no such file or directory`);
      if (target.node.kind === 'file') return { output: [text(arg)] };
      return { output: [list(target.node, target.path)] };
    },
  },
  cd: {
    usage: 'cd [dir]',
    summary: 'go to a page (~ is home)',
    run: ([arg], cwd) => {
      const target = resolve(cwd, arg);
      if (!target) return error(`cd: ${arg}: no such file or directory`);
      if (target.node.kind !== 'dir')
        return error(`cd: ${arg}: not a directory`);
      return go(target.path, target.node);
    },
  },
  cat: {
    usage: 'cat <file>',
    summary: 'print a file',
    run: (args, cwd) => {
      if (!args.length) return error('cat: missing file operand');
      const output: Output[] = [];
      for (const arg of args) {
        const target = resolve(cwd, arg);
        if (!target)
          output.push({
            type: 'error',
            text: `cat: ${arg}: no such file or directory`,
          });
        else if (target.node.kind === 'dir')
          output.push({ type: 'error', text: `cat: ${arg}: is a directory` });
        else if (target.node.url)
          output.push({
            type: 'error',
            text: `cat: ${arg}: binary file, try open ${arg}`,
          });
        else output.push({ type: 'json', value: target.node.data });
      }
      return { output };
    },
  },
  open: {
    usage: 'open <file|link>',
    summary: 'open resume.pdf, github, linkedin or email',
    run: ([arg], cwd) => {
      if (!arg) return error('open: missing operand');
      const link = LINKS[arg];
      if (link) return { output: [], effect: { type: 'open', url: link } };
      const target = resolve(cwd, arg);
      if (target?.node.kind === 'file' && target.node.url)
        return { output: [], effect: { type: 'open', url: target.node.url } };
      if (target?.node.kind === 'dir') return go(target.path, target.node);
      return error(`open: ${arg}: nothing to open`);
    },
  },
  whoami: {
    usage: 'whoami',
    summary: 'who this is',
    run: () => COMMANDS.cat.run(['~/whoami.json'], []),
  },
  pwd: {
    usage: 'pwd',
    summary: 'print the current directory',
    run: (_, cwd) => ({ output: [text(display(cwd))] }),
  },
  theme: {
    usage: 'theme <light|dark|system>',
    summary: 'set the site theme',
    run: ([arg]) =>
      THEMES.includes(arg as (typeof THEMES)[number])
        ? {
            output: [],
            effect: { type: 'theme', theme: arg as (typeof THEMES)[number] },
          }
        : error(`usage: theme <${THEMES.join('|')}>`),
  },
  clear: {
    usage: 'clear',
    summary: 'clear the screen',
    run: () => ({ output: [], effect: { type: 'clear' } }),
  },
  exit: {
    usage: 'exit',
    summary: 'back to the normal site',
    run: () => ({ output: [], effect: { type: 'exit' } }),
  },
};

/** Runs one input line in `cwd`. */
export function run(line: string, cwd: Path): Result {
  const [name, ...args] = line.trim().split(/\s+/);
  if (!name) return { output: [] };
  const command = Object.hasOwn(COMMANDS, name) ? COMMANDS[name] : undefined;
  if (command) return command.run(args, cwd);
  if (name === 'sudo') return error('guest is not in the sudoers file.');
  return error(`${name}: command not found (try help)`);
}

/**
 * Tab completion: the first word completes to a command, later words to a
 * path. Returns the completed line, or the line unchanged when the prefix is
 * ambiguous or matches nothing (a shell would beep).
 */
export function complete(line: string, cwd: Path): string {
  const words = line.split(' ');
  const last = words.at(-1) ?? '';

  let candidates: string[];
  let base = '';
  if (words.length === 1) {
    candidates = Object.keys(COMMANDS).map((c) => `${c} `);
  } else {
    const slash = last.lastIndexOf('/');
    base = last.slice(0, slash + 1);
    const parent = resolve(cwd, base || '.');
    if (parent?.node.kind !== 'dir') return line;
    candidates = Object.keys(parent.node.children);
    if (words[0] === 'cd')
      candidates = candidates.filter((c) => c.endsWith('/'));
  }

  const prefix = last.slice(base.length);
  const matches = candidates.filter((c) => c.startsWith(prefix));
  if (!matches.length) return line;

  // Extend to the longest prefix every match shares.
  let common = matches[0];
  for (const m of matches)
    while (!m.startsWith(common)) common = common.slice(0, -1);
  words[words.length - 1] = base + common;
  return words.join(' ');
}

/** The first command run on entry: a listing, or `whoami` at home. */
export const greeting = (cwd: Path) => (cwd.length ? 'ls' : 'whoami');
