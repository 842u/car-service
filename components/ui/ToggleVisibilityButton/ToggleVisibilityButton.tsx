import { ComponentProps } from 'react';

import { EyeCloseIcon } from '@/components/decorative/icons/EyeCloseIcon';
import { EyeOpenIcon } from '@/components/decorative/icons/EyeOpenIcon';

import { IconButton } from '../IconButton/IconButton';

type ToggleVisibilityButtonProps = ComponentProps<'button'> & {
  isVisible?: boolean;
};

export function ToggleVisibilityButton({
  isVisible = true,
  ...props
}: ToggleVisibilityButtonProps) {
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
