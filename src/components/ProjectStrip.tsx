import type { ProjectItem } from '@/data/projects';
import { ProjectCard } from './ProjectCard';

/**
 * Fallback for small or short screens and reduced motion: a native
 * horizontal swipe carousel that snaps card by card. Each card's text plays
 * as it swipes into view.
 */
export function ProjectStrip({ projects }: { projects: ProjectItem[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {projects.map((project, i) => (
        <div
          key={project.id}
          className="w-[85%] shrink-0 snap-center sm:w-[70%]"
        >
          <ProjectCard project={project} index={i} />
        </div>
      ))}
    </div>
  );
}
