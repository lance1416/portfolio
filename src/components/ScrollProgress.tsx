import { motion, useScroll, useSpring, useTransform } from 'motion/react';

/** Whether the page is long enough to scroll at all. */
const canScroll = () =>
  document.documentElement.scrollHeight > window.innerHeight + 1;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // Motion reports a page with nothing to scroll (the 404) as fully read;
  // show no progress there instead of a full bar.
  const progress = useTransform(scrollYProgress, (p) => (canScroll() ? p : 0));
  const scaleX = useSpring(progress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[99998] h-[2px] w-full origin-left bg-accent [view-transition-name:scroll-progress]"
      style={{ scaleX }}
    />
  );
}
