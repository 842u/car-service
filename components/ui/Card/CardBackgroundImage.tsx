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
        'absolute -z-10 flex h-full w-full select-none flex-col items-center justify-center',
        className,
      )}
    >
      {children}
    </div>
  );
}
