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
      className="w-6 rounded-md border border-alpha-grey-500 bg-alpha-grey-500 p-0.5"
    >
      {isVisible ? (
        <EyeClosedIcon
          className="pointer-events-none stroke-dark-500 stroke-[10] dark:stroke-light-500"
          data-testid="eye-slash-icon"
        />
      ) : (
        <EyeOpenIcon
          className="pointer-events-none stroke-dark-500 stroke-[10] dark:stroke-light-500"
          data-testid="eye-icon"
        />
      )}
    </button>
  );
}
