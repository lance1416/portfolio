import { motion, type Variants } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
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

  return (
    <motion.article
      variants={cardVariants}
      className="group relative flex flex-col gap-8 md:gap-16 md:flex-row items-center py-12"
    >
      {/*
        The Visual Display Case
        Now handles both images and the glass fallback.
      */}
      <div
        className={cn(
          'w-full md:w-1/2 aspect-video rounded-4xl border border-zinc-200/60 bg-zinc-100/50 p-2 shadow-sm transition-all duration-500 group-hover:shadow-apple-lg dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:group-hover:shadow-none dark:group-hover:border-zinc-700',
          isEven ? 'md:order-1' : 'md:order-2',
        )}
      >
        <div className="h-full w-full rounded-2xl glass flex items-center justify-center overflow-hidden relative">
          {/* If an image URL exists, render the image with a slow zoom hover effect */}
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={`Preview of ${project.title}`}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            /* Otherwise, render the fallback glass grid */
            <>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]" />
              <span className="text-zinc-400 dark:text-zinc-600 font-mono text-sm tracking-widest uppercase z-10">
                Visual Asset Pending
              </span>
            </>
          )}
        </div>
      </div>

      {/* The Academic Details (Unchanged) */}
      <div
        className={cn(
          'w-full md:w-1/2 flex flex-col',
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
                className="text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 transition-colors hover:scale-110 active:scale-95"
                aria-label={`Link to ${link.type}`}
              >
                {renderLinkIcon(link.type)}
              </a>
            ))}
          </div>
        </div>

        <h3 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {project.title}
        </h3>
        <p className="mt-2 text-lg font-medium text-zinc-600 dark:text-zinc-400">
          {project.subtitle}
        </p>

        <ul className="mt-8 space-y-4 text-zinc-600 dark:text-zinc-400">
          {project.description.map((point, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: pre-defined, does not change dynamically
            <li key={i} className="flex items-start gap-4">
              <svg
                className="mt-2.5 h-1.5 w-1.5 shrink-0 fill-zinc-300 dark:fill-zinc-700"
                viewBox="0 0 6 6"
                aria-hidden="true"
              >
                <circle cx="3" cy="3" r="3"></circle>
              </svg>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap gap-2">
          {project.skills.map((skill) => (
            <SkillPill key={skill} skill={skill} />
          ))}
        </div>
      </div>
    </motion.article>
  );
}
