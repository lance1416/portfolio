import { ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
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
      className="group relative border-b border-zinc-200 py-12 pl-3 first:border-t dark:border-zinc-800"
    >
      {/* Accent left-border reveal on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100"
        style={{ backgroundColor: accentColor }}
      />

      {/* Meta row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="label-overline">Project {num}</span>
        <div className="flex items-center gap-2">
          <span className="mono-meta">{project.year}</span>
          {project.links?.length ? (
            // -mr-3 pulls the 40px hit areas back so icons align to the card edge
            <div className="-mr-3 flex items-center">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={
                    { '--hover-color': accentColor } as React.CSSProperties
                  }
                  className="flex h-10 w-10 items-center justify-center text-zinc-400 transition-[color,transform] hover:scale-110 hover:text-(--hover-color) active:scale-[0.96] dark:text-zinc-500"
                  aria-label={`Link to ${link.type}`}
                >
                  {renderLinkIcon(link.type)}
                </a>
              ))}
            </div>
          ) : null}
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
        <div className="my-8 aspect-[16/7] overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
          <img
            src={project.imageUrl}
            alt={`Preview of ${project.title}`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="my-8 flex aspect-[16/7] items-center justify-center overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
          style={{
            backgroundImage: `linear-gradient(135deg, ${accentColor}1f, transparent 70%)`,
          }}
        >
          <span
            aria-hidden="true"
            className="select-none font-display text-[8rem] font-bold leading-none tracking-tighter"
            style={{ color: `${accentColor}33` }}
          >
            {num}
          </span>
        </div>
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
