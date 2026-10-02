import { cn } from '@/utils/cn';

/**
 * The site's one bullet list: body copy behind an en dash. The dash takes the
 * surrounding item's colour from `--role` (set by `role-scope`: a role, a
 * project, a degree) and falls back to a neutral grey.
 */
export function DashList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={cn('max-w-[62ch] space-y-2.5', className)}>
      {items.map((item) => (
        <li
          key={item}
          className="text-body relative pl-4 before:absolute before:left-0 before:text-[var(--role,var(--color-zinc-400))] before:content-['–']"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
