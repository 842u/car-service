import NextImage from 'next/image';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type ImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  fallback: ReactNode;
  className?: string;
};

/**
 * Fills its container with `src`, or renders `fallback` when there is none.
 * The container is the positioning context for the `fill` image, so it only
 * carries `relative`; sizing is the caller's to state.
 */
export function ImageWithFallback({
  src,
  alt,
  fallback,
  className,
}: ImageWithFallbackProps) {
  return (
    <div className={twMerge('relative', className)}>
      {src ? (
        <NextImage fill alt={alt} className="object-cover" src={src} />
      ) : (
        fallback
      )}
    </div>
  );
}
