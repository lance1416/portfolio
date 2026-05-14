import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import type * as React from 'react';
import { FaGithub, FaItchIo } from 'react-icons/fa6';
import type { LinkType, ProjectItem } from '@/data/projects';
import { fadeUp } from '@/utils/variants';
import { NumberedList } from './NumberedList';
import { SkillPill } from './SkillPill';

const renderLinkIcon = (type: LinkType) => {
  switch (type) {
    case 'github':
      return <FaGithub className="h-4 w-4" />;
    case 'itch':
      return <FaItchIo className="h-4 w-4" />;
    case 'live':
      return <ExternalLink className="h-4 w-4" />;
  }
};

export function ProjectCard({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  const accentColor = project.color ?? '#71717a';
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.article
      variants={fadeUp}
      className="group border-b border-zinc-200 py-12 first:border-t dark:border-zinc-800"
    >
      {/* Meta row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="label-overline">Project {num}</span>
        <div className="flex items-center gap-4">
          <span className="mono-meta">{project.year}</span>
          {project.links?.map((link, i) => (
            <a
              // biome-ignore lint/suspicious/noArrayIndexKey: static ordered data
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ '--hover-color': accentColor } as React.CSSProperties}
              className="text-zinc-400 transition-all hover:scale-110 hover:text-(--hover-color) active:scale-95 dark:text-zinc-500"
              aria-label={`Link to ${link.type}`}
            >
              {renderLinkIcon(link.type)}
            </a>
          ))}
        </div>
      </div>

      {/* Title + subtitle */}
      <h3 className="font-display text-4xl font-normal tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
        {project.title}
      </h3>
      <p className="mt-1 font-mono text-sm text-zinc-500 dark:text-zinc-400">
        {project.subtitle}
      </p>

      {/* Image */}
      {project.imageUrl ? (
        <div className="my-8 aspect-[16/7] overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
          <img
            src={project.imageUrl}
            alt={`Preview of ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="my-8 h-px opacity-30"
          style={{ backgroundColor: accentColor }}
        />
      )}

      <NumberedList items={project.description} className="mb-8 max-w-2xl" />

      <div className="flex flex-wrap gap-2">
        {project.skills.map((skill) => (
          <SkillPill key={skill} skill={skill} activeColor={accentColor} />
        ))}
      </div>
    </motion.article>
  );
}
