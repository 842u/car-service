import { ComponentProps } from 'react';

import { EyeClosedIcon } from '@/components/decorative/icons/EyeClosed';
import { EyeOpenIcon } from '@/components/decorative/icons/EyeOpen';

type ToggleVisibilityButtonProps = ComponentProps<'button'> & {
  isVisible?: boolean;
};

export function ToggleVisibilityButton({
  isVisible = true,
  ...props
}: ToggleVisibilityButtonProps) {
  return (
    <button
      aria-label="toggle visibility"
      type="button"
      {...props}
      className="border-alpha-grey-500 bg-alpha-grey-500 w-6 cursor-pointer rounded-md border p-0.5"
    >
      {isVisible ? (
        <EyeClosedIcon
          className="stroke-dark-500 dark:stroke-light-500 pointer-events-none stroke-10"
          data-testid="eye-slash-icon"
        />
      ) : (
        <EyeOpenIcon
          className="stroke-dark-500 dark:stroke-light-500 pointer-events-none stroke-10"
          data-testid="eye-icon"
        />
      )}
    </button>
  );
}
