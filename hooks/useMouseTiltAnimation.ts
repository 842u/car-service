import {
  MotionStyle,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export type UseMouseTiltAnimationOptions = {
  rotationDirection?: 'push' | 'pull';
  rotationFactor?: number;
  transformPerspectivePixels?: number;
};

export function useMouseTiltAnimation<T extends HTMLElement>({
  rotationDirection = 'push',
  rotationFactor = 5,
  transformPerspectivePixels = 1000,
}: UseMouseTiltAnimationOptions) {
  const [canAnimate, setCanAnimate] = useState(false);

  const elementRef = useRef<T>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const rotateX = useTransform(
    ySpring,
    [-0.5, 0.5],
    rotationDirection === 'push'
      ? [rotationFactor, -rotationFactor]
      : [-rotationFactor, rotationFactor],
  );
  const rotateY = useTransform(
    xSpring,
    [-0.5, 0.5],
    rotationDirection === 'push'
      ? [-rotationFactor, rotationFactor]
      : [rotationFactor, -rotationFactor],
  );

  const transform = useMotionTemplate`perspective(${transformPerspectivePixels}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  useEffect(() => setCanAnimate(true), []);

  const handleMouseMove = (event: React.MouseEvent<T>) => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();

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

  const style: MotionStyle = canAnimate
    ? {
        transformStyle: 'preserve-3d',
        transform,
      }
    : {};

  return { handleMouseMove, handleMouseLeave, style, elementRef };
}
