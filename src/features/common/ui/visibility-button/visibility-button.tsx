import { ComponentProps } from 'react';

import { EyeCloseIcon } from '@/icons/eye-close';
import { EyeOpenIcon } from '@/icons/eye-open';
import { IconButton } from '@/ui/icon-button/icon-button';

type VisibilityButtonProps = ComponentProps<'button'> & {
  isVisible?: boolean;
};

export function VisibilityButton({
  isVisible = true,
  ...props
}: VisibilityButtonProps) {
  return (
    <IconButton className="p-0" title="toggle visibility" {...props}>
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
