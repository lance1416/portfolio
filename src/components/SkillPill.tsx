import type { CSSProperties } from 'react';

interface SkillPillProps {
  skill: string;
  activeColor?: string;
}

// Not interactive: hover only tints the border, with no lift or press motion.
export function SkillPill({ skill, activeColor }: SkillPillProps) {
  return (
    <span
      style={{ '--hover-color': activeColor ?? '#71717a' } as CSSProperties}
      className="inline-flex cursor-default items-center rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-500 transition-colors hover:border-(--hover-color) hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      {skill}
    </span>
  );
}
