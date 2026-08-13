import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { EyeCloseIcon } from '@/ui/decorative/icons/eye-close';
import { EyeOpenIcon } from '@/ui/decorative/icons/eye-open';
import { IconButton } from '@/ui/icon-button/icon-button';

type VisibilityButtonProps = ComponentProps<'button'> & {
  isVisible?: boolean;
};

export function VisibilityButton({
  isVisible = true,
  className,
  ...props
}: VisibilityButtonProps) {
  return (
    <IconButton
      className={twMerge('p-0', className)}
      size="icon"
      title="toggle visibility"
      {...props}
    >
      {isVisible ? (
        <EyeCloseIcon
          className="stroke-dark-500 dark:stroke-light-500 pointer-events-none h-full w-full stroke-2"
          data-testid="eye-slash-icon"
        />
      ) : (
        <EyeOpenIcon
          className="stroke-dark-500 dark:stroke-light-500 pointer-events-none h-full w-full stroke-2"
          data-testid="eye-icon"
        />
      )}
    </IconButton>
  );
}
