'use client';

import { HTMLMotionProps, motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

import {
  useMouseTiltAnimation,
  UseMouseTiltAnimationOptions,
} from '@/hooks/useMouseTiltAnimation';

type CardProps = HTMLMotionProps<'div'> & UseMouseTiltAnimationOptions;

export function Card({
  rotationDirection,
  rotationFactor,
  transformPerspectivePixels,
  className,
  children,
  ...props
}: CardProps) {
  const { elementRef, handleMouseLeave, handleMouseMove, style } =
    useMouseTiltAnimation<HTMLDivElement>({
      rotationDirection,
      rotationFactor,
      transformPerspectivePixels,
    });

  return (
    <motion.div
      ref={elementRef}
      className={twMerge(
        'border-alpha-grey-300 hover:border-accent-300 rounded-md border p-4 shadow-lg drop-shadow-lg transition-colors duration-700',
        className,
      )}
      style={style}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {children}
    </motion.div>
  );
}
