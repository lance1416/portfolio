import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PAGE_COLUMN } from '@/components/Page';
import { useCommandPalette } from '@/context/CommandPaletteContext';
import type { ProjectItem } from '@/data/projects';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useScrollLock } from '@/hooks/useScrollLock';
import { cn } from '@/utils/cn';
import { claimOneScreen } from '@/utils/oneScreen';
import { usePageEntrance } from '@/utils/pageTransition';
import { DURATION, fadeUp, stagger, timed } from '@/utils/variants';
import { PageHeader } from './PageHeader';
import {
  ProjectCounter,
  ProjectDetails,
  ProjectEgg,
  ProjectImage,
  ProjectLinks,
  projectScope,
  TITLE_SEQUENCE,
} from './ProjectCard';
import { SplitText } from './SplitText';

/** Degrees between neighbouring cards on the ring. */
const STEP = 40;

/** Wheel travel (px) that counts as one step. */
const WHEEL_THRESHOLD = 30;
/**
 * After a step, the next one waits for the gesture to end: a pause in wheel
 * events (trackpad inertia keeps them coming) and a minimum settle time.
 */
const GESTURE_GAP_MS = 150;
const MIN_STEP_INTERVAL_MS = 350;

/** Horizontal drag (px) that counts as one step. */
const SWIPE_THRESHOLD = 60;

/**
 * The text panel for the front project. `show` restores opacity explicitly: if
 * the ring turns back before the old panel finishes leaving, AnimatePresence
 * revives that same element mid-exit, and it would otherwise stay invisible.
 */
const PANEL: Variants = {
  hidden: TITLE_SEQUENCE.hidden,
  show: { ...TITLE_SEQUENCE.show, opacity: 1 },
  exit: { opacity: 0, transition: timed(DURATION.exit) },
};

function RingFace({
  project,
  index,
  radius,
  rotation,
  active,
  onSelect,
}: {
  project: ProjectItem;
  index: number;
  radius: number;
  rotation: MotionValue<number>;
  active: boolean;
  onSelect: () => void;
}) {
  // Signed steps from the front. Passed cards (negative) turn left behind the
  // text column, so they fade out completely by two-thirds of a step; upcoming
  // cards (positive) wait on the right as a half-lit preview.
  const opacity = useTransform(rotation, (r) => {
    const offset = (index * STEP + r) / STEP;
    return offset < 0
      ? Math.max(0, 1 + offset * 1.5)
      : 1 - Math.min(offset, 1) * 0.5;
  });

  return (
    // A pointer shortcut only: the progress bars are the keyboard and
    // screen-reader way to switch, so the faces stay out of both.
    <motion.button
      type="button"
      tabIndex={-1}
      aria-hidden
      data-front={active || undefined}
      onClick={active ? undefined : onSelect}
      className={cn(
        'absolute inset-0 [backface-visibility:hidden]',
        active ? 'cursor-default' : 'cursor-pointer',
      )}
      style={{
        transform: `rotateY(${index * STEP}deg) translateZ(${radius}px)`,
        opacity,
      }}
    >
      <ProjectImage
        project={project}
        index={index}
        className="h-full w-full shadow-floating"
      />
    </motion.button>
  );
}

/**
 * Projects as a single, non-scrolling screen: the front project's text on the
 * left, a horizontal 3D ring of screenshots on the right. The mouse wheel
 * (either axis), arrow keys, dragging, the progress bars and the peeking card
 * all turn the ring one project at a time.
 */
export function ProjectRing({ projects }: { projects: ProjectItem[] }) {
  const last = projects.length - 1;
  const [active, setActive] = useState(0);
  const project = projects[active];
  const { isOpen: paletteOpen } = useCommandPalette();

  // The ring angle springs to the active card with a little overshoot.
  const target = useMotionValue(0);
  const rotation = useSpring(target, { stiffness: 140, damping: 18 });
  useEffect(() => {
    target.set(-active * STEP);
  }, [active, target]);

  const go = useCallback(
    (delta: number) => setActive((i) => Math.min(Math.max(i + delta, 0), last)),
    [last],
  );

  // The page is exactly one screen; nothing to scroll. The footer moves up
  // beside the dock meanwhile, where it can be reached.
  useScrollLock(true);
  useEffect(() => {
    const release = claimOneScreen();
    return release;
  }, []);
  // Braces matter: an effect must return nothing or a cleanup function, and
  // scrollTo can return a Promise where browser extensions wrap it.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Latest palette state for the window listeners below.
  const paletteOpenRef = useRef(paletteOpen);
  paletteOpenRef.current = paletteOpen;

  useEffect(() => {
    let travel = 0;
    let lastEvent = 0;
    let lastStep = Number.NEGATIVE_INFINITY;
    let waitingForGap = false;

    const onWheel = (e: WheelEvent) => {
      if (paletteOpenRef.current) return;
      e.preventDefault();

      const now = performance.now();
      const gap = now - lastEvent;
      lastEvent = now;
      if (gap > GESTURE_GAP_MS) travel = 0;

      if (waitingForGap) {
        if (gap < GESTURE_GAP_MS || now - lastStep < MIN_STEP_INTERVAL_MS) {
          return;
        }
        waitingForGap = false;
      }

      // Whichever axis dominates; line-mode deltas are ~16px per line.
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      travel += e.deltaMode === 1 ? delta * 16 : delta;

      if (Math.abs(travel) >= WHEEL_THRESHOLD) {
        go(Math.sign(travel));
        travel = 0;
        lastStep = now;
        waitingForGap = true;
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (paletteOpenRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [go]);

  // Ring radius just large enough that neighbouring cards don't overlap.
  const isWide = useMediaQuery('(min-width: 1280px)');
  const cardWidth = isWide ? 560 : 440;
  const radius =
    Math.round(cardWidth / 2 / Math.tan((STEP * Math.PI) / 360)) + 40;

  const entrance = usePageEntrance();

  // Position in the carousel; each bar jumps to its project.
  const counter = (
    <ProjectCounter projects={projects} active={active} onSelect={setActive} />
  );

  return (
    // Cancels MainLayout's vertical padding so the page is exactly one
    // screen; the stage sits between the navbar and the dock.
    <motion.main
      variants={stagger}
      initial={entrance}
      animate="show"
      className="-mt-32 -mb-32 h-svh touch-pan-y overflow-x-clip pt-[88px] pb-28"
      onPanEnd={(_, info) => {
        if (Math.abs(info.offset.x) > SWIPE_THRESHOLD) {
          go(info.offset.x < 0 ? 1 : -1);
        }
      }}
    >
      <div className={cn(PAGE_COLUMN, 'flex h-full flex-col')}>
        <PageHeader chapter="§ 02" title="Projects" compact />

        <motion.div
          variants={fadeUp}
          className="grid min-h-0 flex-1 grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-10 lg:gap-16"
        >
          {/* Text column; sits above the ring so passed cards fade behind it */}
          <div className="relative z-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={project.id}
                variants={PANEL}
                initial="hidden"
                animate="show"
                exit="exit"
                {...projectScope(project)}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="heading-feature">
                    <SplitText text={project.title} stagger={0.04} />
                  </h2>
                  <div className="flex items-center gap-2">
                    <ProjectEgg project={project} />
                    <span className="mono-meta">{project.year}</span>
                    <ProjectLinks project={project} />
                  </div>
                </div>
                <p className="mt-2 font-mono text-sm text-zinc-500 dark:text-zinc-400">
                  <SplitText text={project.subtitle} stagger={0.012} />
                </p>

                <motion.div className="mt-5" variants={fadeUp}>
                  <ProjectDetails project={project} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The ring, with its position underneath like any carousel */}
          <div className="flex flex-col items-center gap-10">
            <div className="flex justify-center perspective-[1600px]">
              <motion.div
                className="relative transform-3d"
                style={{
                  width: cardWidth,
                  aspectRatio: '16 / 10',
                  z: -radius,
                  rotateY: rotation,
                }}
              >
                {projects.map((p, i) => (
                  <RingFace
                    key={p.id}
                    project={p}
                    index={i}
                    radius={radius}
                    rotation={rotation}
                    active={i === active}
                    onSelect={() => setActive(i)}
                  />
                ))}
              </motion.div>
            </div>
            {counter}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
