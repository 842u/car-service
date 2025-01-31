import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type CardBackgroundImageProps = {
  className?: string;
  children?: ReactNode;
};

export function CardBackgroundImage({
  className,
  children,
}: CardBackgroundImageProps) {
  return (
    <div
      aria-hidden
      className={twMerge(
        'absolute -z-10 flex h-full w-full flex-col items-center justify-center select-none',
        className,
      )}
    >
      {children}
    </div>
  );
}
