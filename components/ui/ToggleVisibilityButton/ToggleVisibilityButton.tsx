import { ComponentProps } from 'react';

import { EyeClosedIcon } from '@/components/decorative/icons/EyeClosed';
import { EyeOpenIcon } from '@/components/decorative/icons/EyeOpen';

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
        <EyeClosedIcon
          className="stroke-dark-500 dark:stroke-light-500 pointer-events-none h-full w-full stroke-10"
          data-testid="eye-slash-icon"
        />
      ) : (
        <EyeOpenIcon
          className="stroke-dark-500 dark:stroke-light-500 pointer-events-none h-full w-full stroke-10"
          data-testid="eye-icon"
        />
      )}
    </IconButton>
  );
}
