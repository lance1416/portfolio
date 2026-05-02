import { motion, type Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type * as React from 'react';
import { FaGithub, FaItchIo } from 'react-icons/fa6';
import type { LinkType, ProjectItem } from '@/data/projects';
import { cn } from '@/utils/cn';
import { SkillPill } from './SkillPill';

const renderLinkIcon = (type: LinkType) => {
  switch (type) {
    case 'github':
      return <FaGithub className="h-5 w-5" />;
    case 'itch':
      return <FaItchIo className="h-5 w-5" />;
    case 'live':
      return <ExternalLink className="h-5 w-5" />;
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export function ProjectCard({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const accentColor = project.color || '#71717a';

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col gap-8 md:gap-16 md:flex-row items-center py-16"
    >
      {/*
        The Visual Display Case (The Light Source)
      */}
      <div
        className={cn(
          'relative w-full md:w-1/2 aspect-video rounded-4xl border border-zinc-200/60 bg-zinc-100/50 p-2 shadow-sm transition-all duration-700 dark:border-zinc-800/50 dark:bg-zinc-900/50',
          isEven ? 'md:order-1' : 'md:order-2',
        )}
      >
        {/* The Backlight Aura - blooms out from behind the screen on hover */}
        <div
          className="absolute -inset-8 -z-10 rounded-full blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-30 dark:group-hover:opacity-20"
          style={{ backgroundColor: accentColor }}
        />

        {/* Inner Glass Screen */}
        <div className="h-full w-full rounded-2xl glass flex items-center justify-center overflow-hidden relative border border-white/40 dark:border-zinc-700/50 z-10 transition-transform duration-700 group-hover:scale-[1.02]">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={`Preview of ${project.title}`}
              className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <>
              {/* Colored grid lines on hover for the fallback */}
              <div
                className="absolute inset-0 bg-size-[16px_16px] transition-opacity duration-700 opacity-20 group-hover:opacity-40"
                style={{
                  backgroundImage: `linear-gradient(to right, ${accentColor}22 1px, transparent 1px), linear-gradient(to bottom, ${accentColor}22 1px, transparent 1px)`,
                }}
              />
              <span className="text-zinc-400 dark:text-zinc-600 font-mono text-sm tracking-widest uppercase z-10 transition-colors duration-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-300">
                Visual Asset Pending
              </span>
            </>
          )}
        </div>
      </div>

      {/* The Academic Details */}
      <div
        className={cn(
          'w-full md:w-1/2 flex flex-col z-10',
          isEven ? 'md:order-2' : 'md:order-1',
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold tracking-widest text-zinc-400 dark:text-zinc-500 uppercase">
            {project.year}
          </p>
          <div className="flex items-center gap-4">
            {project.links?.map((link, i) => (
              <a
                // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Links subtly take on the project's accent color on hover
                style={{ '--hover-color': accentColor } as React.CSSProperties}
                className="text-zinc-400 dark:text-zinc-500 transition-all hover:scale-110 active:scale-95 hover:text-(--hover-color) dark:hover:text-(--hover-color)"
                aria-label={`Link to ${link.type}`}
              >
                {renderLinkIcon(link.type)}
              </a>
            ))}
          </div>
        </div>

        <h3 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 transition-colors duration-500">
          {project.title}
        </h3>
        <p className="mt-2 text-lg font-medium text-zinc-600 dark:text-zinc-400">
          {project.subtitle}
        </p>

        <ul className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
          {project.description.map((point, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
            <li key={i} className="flex items-start gap-4">
              {/* Colored bullet point transitions in on hover */}
              <svg
                className="mt-2.5 h-1.5 w-1.5 shrink-0 transition-colors duration-500"
                viewBox="0 0 6 6"
                style={{ fill: '#d4d4d8' }} // Default zinc-300
                // Use a little inline hack to handle the hover color, or just rely on the parent group
                onMouseEnter={(e) => (e.currentTarget.style.fill = accentColor)}
                onMouseLeave={(e) => (e.currentTarget.style.fill = '#d4d4d8')}
              >
                <title>{`Bullet point ${i + 1} for ${project.title}`}</title>
                {/* For CSS-only hover targeting without React state, we use group-hover */}
                <circle
                  cx="3"
                  cy="3"
                  r="3"
                  className="fill-zinc-300 dark:fill-zinc-700 transition-colors duration-500 group-hover:fill-(--accent)!"
                  style={{ '--accent': accentColor } as React.CSSProperties}
                ></circle>
              </svg>
              <span className="leading-relaxed transition-colors duration-300 group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                {point}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-2">
          {/* Re-using your newly updated SkillPill component! */}
          {project.skills.map((skill) => (
            <SkillPill key={skill} skill={skill} activeColor={accentColor} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
