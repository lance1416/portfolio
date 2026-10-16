import { motion, useReducedMotion } from 'motion/react';
import { useRef, useState } from 'react';
import type { ProjectItem } from '@/data/projects';
import { fadeUp } from '@/utils/variants';
import { ProjectCard, ProjectCounter } from './ProjectCard';

/**
 * Fallback for small or short screens and reduced motion: a native
 * horizontal swipe carousel that snaps card by card. Each card's text plays
 * as it swipes into view. The counter under it follows the swipe, and its
 * bars scroll to their card.
 */
export function ProjectStrip({ projects }: { projects: ProjectItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  /** The card whose centre is nearest the strip's centre. */
  const onScroll = () => {
    const strip = scroller.current;
    if (!strip) return;
    const centre = strip.scrollLeft + strip.clientWidth / 2;
    let nearest = 0;
    [...strip.children].forEach((card, i) => {
      const el = card as HTMLElement;
      const best = strip.children[nearest] as HTMLElement;
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - centre);
      if (d < Math.abs(best.offsetLeft + best.offsetWidth / 2 - centre)) {
        nearest = i;
      }
    });
    setActive(nearest);
  };

  const show = (index: number) => {
    const strip = scroller.current;
    const card = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !card) return;
    strip.scrollTo({
      left: card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2,
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return (
    <motion.div variants={fadeUp}>
      <div
        ref={scroller}
        onScroll={onScroll}
        // Bleeds into the page gutters so cards swipe in from the screen edge.
        className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 sm:-mx-8 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="w-[85%] shrink-0 snap-center sm:w-[70%]"
          >
            <ProjectCard project={project} index={i} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center">
        <ProjectCounter projects={projects} active={active} onSelect={show} />
      </div>
    </motion.div>
  );
}
