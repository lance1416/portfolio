import { ArrowUpRight } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import type { CSSProperties } from 'react';
import { FaGithub, FaItchIo } from 'react-icons/fa6';
import type { LinkType, ProjectItem } from '@/data/projects';
import { cn } from '@/utils/cn';
import { DashList } from './DashList';
import { PaperCrane } from './PaperCrane';
import { SkillPill } from './SkillPill';
import { SplitText } from './SplitText';

const renderLinkIcon = (type: LinkType) => {
  switch (type) {
    case 'github':
      return <FaGithub className="h-4 w-4" />;
    case 'itch':
      return <FaItchIo className="h-4 w-4" />;
    case 'live':
      return <ArrowUpRight className="h-4 w-4" />;
  }
};

/** Title, then subtitle, each entering character by character. */
export const TITLE_SEQUENCE: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

export const projectAccent = (project: ProjectItem) =>
  project.color ?? '#71717a';

export const projectNumber = (index: number) =>
  String(index + 1).padStart(2, '0');

/**
 * Spread onto an element to colour its project's details: `role-scope` turns
 * the project colour into `--role`, lightened in dark mode, as on Experience.
 */
export const projectScope = (project: ProjectItem) => ({
  className: 'role-scope',
  style: { '--role-base': projectAccent(project) } as CSSProperties,
});

const LINK_NAMES: Record<LinkType, string> = {
  github: 'GitHub',
  itch: 'itch.io',
  live: 'the web',
};

/** Icon links (GitHub, itch.io, …) with 40px hit areas. */
export function ProjectLinks({ project }: { project: ProjectItem }) {
  if (!project.links?.length) return null;
  return (
    // -mr-3 pulls the 40px hit areas back so icons align to the edge
    <div className="-mr-3 flex items-center">
      {project.links.map((link) => (
        <a
          key={link.url}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center text-zinc-500 transition-[color,scale] duration-150 ease-out hover:text-(--role) active:scale-[0.96] dark:text-zinc-400"
          aria-label={`${project.title} on ${LINK_NAMES[link.type]}`}
        >
          {renderLinkIcon(link.type)}
        </a>
      ))}
    </div>
  );
}

/** Screenshot, or a numbered gradient placeholder when there is none. */
export function ProjectImage({
  project,
  index,
  className,
}: {
  project: ProjectItem;
  index: number;
  className?: string;
}) {
  const accentColor = projectAccent(project);
  const frame = cn(
    'overflow-hidden rounded-2xl border border-black/10 dark:border-white/10',
    className,
  );

  const { image } = project;
  const url = (width: number) => `/projects/${image?.name}-${width}.webp`;

  return image ? (
    <div className={frame}>
      <img
        src={url(image.widths[image.widths.length - 1])}
        srcSet={image.widths.map((w) => `${url(w)} ${w}w`).join(', ')}
        // Ring card at 560/440px on wide screens; strip cards span most of the viewport.
        sizes="(min-width: 1280px) 560px, (min-width: 1024px) 440px, (min-width: 640px) 70vw, 85vw"
        alt={`Preview of ${project.title}`}
        className="h-full w-full object-cover"
        loading="lazy"
        // A native image drag would hijack the ring's swipe gesture.
        draggable={false}
      />
    </div>
  ) : (
    <div
      className={cn(frame, 'flex items-center justify-center')}
      style={{
        backgroundImage: `linear-gradient(135deg, ${accentColor}1f, transparent 70%)`,
      }}
    >
      <span
        aria-hidden="true"
        className="select-none font-display text-[6rem] font-bold leading-none tracking-tighter"
        style={{ color: `${accentColor}33` }}
      >
        {projectNumber(index)}
      </span>
    </div>
  );
}

/** Bullet points and skills. */
export function ProjectDetails({ project }: { project: ProjectItem }) {
  return (
    <>
      <DashList items={project.description} />
      <div className="mt-6 flex flex-wrap gap-2">
        {project.skills.map((skill) => (
          <SkillPill key={skill} skill={skill} activeColor="var(--role)" />
        ))}
        {/* An origami game gets the cat's paper crane. */}
        {project.id === 'evogami' && <PaperCrane />}
      </div>
    </>
  );
}

/**
 * A full project card for the swipe strip. Its title and subtitle play as it
 * comes into view. Visibility is measured against the page viewport, which
 * still respects the strip's horizontal clipping. It triggers on any overlap
 * past the bottom fifth of the screen rather than a fraction of the card,
 * which can be several screens tall on a phone.
 */
export function ProjectCard({
  project,
  index,
}: {
  project: ProjectItem;
  index: number;
}) {
  const scope = projectScope(project);
  return (
    // A content surface (hairline, not a floating shadow) so swipes have edges.
    <motion.article
      variants={TITLE_SEQUENCE}
      initial="hidden"
      whileInView="show"
      viewport={{ margin: '0px 0px -20% 0px' }}
      style={scope.style}
      className={cn(
        scope.className,
        'h-full rounded-3xl bg-white/60 p-5 shadow-border sm:p-6 dark:bg-zinc-900/60',
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="label-overline">Project {projectNumber(index)}</span>
        <div className="flex items-center gap-2">
          <span className="mono-meta">{project.year}</span>
          <ProjectLinks project={project} />
        </div>
      </div>

      <h3 className="heading-feature">
        <SplitText text={project.title} stagger={0.04} />
      </h3>
      <p className="mt-2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
        <SplitText text={project.subtitle} stagger={0.012} />
      </p>

      <ProjectImage
        project={project}
        index={index}
        className="mt-5 aspect-video"
      />

      <div className="mt-6">
        <ProjectDetails project={project} />
      </div>
    </motion.article>
  );
}

/**
 * "01 / 02" and a bar per project, the current one in its colour. The bars
 * are the keyboard and screen-reader control: each shows its project. Under
 * the ring on wide screens, under the swipe strip on small ones.
 */
export function ProjectCounter({
  projects,
  active,
  onSelect,
}: {
  projects: ProjectItem[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="mono-meta">
        <span className="text-zinc-900 dark:text-zinc-100">
          {projectNumber(active)}
        </span>{' '}
        / {projectNumber(projects.length - 1)}
      </p>
      <div className="flex gap-1.5">
        {projects.map((p, i) => {
          const scope = projectScope(p);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Show ${p.title}`}
              aria-current={i === active}
              style={scope.style}
              // after: extends the 32×4 bar to a 38×40 hit area, meeting its neighbours
              className={cn(
                scope.className,
                'relative h-1 w-8 rounded-full transition-colors after:absolute after:-inset-x-[3px] after:-inset-y-[18px]',
                i === active ? 'bg-(--role)' : 'bg-zinc-200 dark:bg-zinc-800',
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
