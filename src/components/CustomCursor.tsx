import { motion, useMotionValue } from 'motion/react';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement | null)?.closest('a, button, [role="button"]')
      ) {
        setHovered(true);
      }
    };

    const onOut = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement | null)?.closest('a, button, [role="button"]')
      ) {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[99999] rounded-full"
      style={{
        x,
        y,
        translateX: '-50%',
        translateY: '-50%',
        width: 10,
        height: 10,
        backgroundColor: 'white',
        mixBlendMode: 'difference',
      }}
      animate={{ scale: hovered ? 2.5 : 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    />
  );
}
