import { cn } from '@/utils/cn';

interface NumberedListProps {
  items: string[];
  className?: string;
}

export function NumberedList({ items, className }: NumberedListProps) {
  return (
    <ul className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <li
          key={item}
          className="flex items-start gap-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
        >
          <span className="mono-meta mt-0.5 shrink-0 tabular-nums">
            {String(i + 1).padStart(2, '0')}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
