'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

const ROTATION_FACTOR = 5;
const TRANSFORM_PERSPECTIVE_PIXELS = 1000;

type CardProps = { className?: string; children?: ReactNode };

export function Card({ className, children }: CardProps) {
  const [canAnimate, setCanAnimate] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    [ROTATION_FACTOR, -ROTATION_FACTOR],
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    [-ROTATION_FACTOR, ROTATION_FACTOR],
  );

  const transform = useMotionTemplate`perspective(${TRANSFORM_PERSPECTIVE_PIXELS}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  useEffect(() => setCanAnimate(true), []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const mouseXCoordinate = event.clientX - rect.left;
    const mouseYCoordinate = event.clientY - rect.top;

    const mouseXNormalized = mouseXCoordinate / rect.width - 0.5;
    const mouseYNormalized = mouseYCoordinate / rect.height - 0.5;

    x.set(mouseXNormalized);
    y.set(mouseYNormalized);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={twMerge(
        'border-alpha-grey-300 hover:border-accent-300 rounded-md border p-4 shadow-lg drop-shadow-lg transition-colors duration-700',
        className,
      )}
      style={
        canAnimate
          ? {
              transformStyle: 'preserve-3d',
              transform,
            }
          : undefined
      }
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
    </motion.div>
  );
}
