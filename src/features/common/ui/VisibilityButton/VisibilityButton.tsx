import { ComponentProps } from 'react';

import { EyeCloseIcon } from '@/features/common/ui/decorative/icons/eye-close';
import { EyeOpenIcon } from '@/features/common/ui/decorative/icons/eye-open';

import { IconButton } from '../icon-button/icon-button';

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
