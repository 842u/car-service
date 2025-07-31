'use client';

import type { HTMLMotionProps } from 'motion/react';
import { LazyMotion, motion } from 'motion/react';
import { twMerge } from 'tailwind-merge';

import type { UseMouseTiltAnimationOptions } from '@/common/hooks/use-mouse-tilt-animation';
import { useMouseTiltAnimation } from '@/common/hooks/use-mouse-tilt-animation';

const motionFeatures = () =>
  import('@/utils/motion/motion').then((module) => module.default);

export type CardProps = HTMLMotionProps<'div'> & UseMouseTiltAnimationOptions;

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
    <LazyMotion features={motionFeatures}>
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
    </LazyMotion>
  );
}
