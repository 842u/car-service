import { ComponentProps } from 'react';
import { twJoin, twMerge } from 'tailwind-merge';

import { Button } from '../../shared/base/Button/Button';

type HamburgerButtonProps = ComponentProps<'button'> & {
  className?: string;
  isActive: boolean;
};

export function HamburgerButton({
  isActive,
  className,
  ...props
}: HamburgerButtonProps) {
  const outerBarClass =
    'h-0.5 w-full bg-dark-500 dark:bg-light-500 transition-all';

  const middleBarClass = `absolute top-0 ${outerBarClass}`;

  return (
    <Button
      className={twMerge(
        'flex aspect-square h-full flex-col justify-between px-3 py-4',
        className,
      )}
      variant="transparent"
      {...props}
    >
      <span className="sr-only">toggle navigation menu</span>
      <div
        className={twJoin(
          outerBarClass,
          isActive ? 'opacity-0' : 'opacity-100',
        )}
      />
      <div className="relative h-0.5 w-full">
        <div
          className={twJoin(
            middleBarClass,
            isActive ? 'rotate-45' : 'rotate-0',
          )}
        />
        <div
          className={twJoin(
            middleBarClass,
            isActive ? '-rotate-45' : 'rotate-0',
          )}
        />
      </div>
      <div
        className={twJoin(
          outerBarClass,
          isActive ? 'opacity-0' : 'opacity-100',
        )}
      />
    </Button>
  );
}
