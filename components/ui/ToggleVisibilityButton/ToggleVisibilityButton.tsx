import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ComponentProps } from 'react';

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
        <EyeSlashIcon
          className="pointer-events-none aspect-square w-full"
          data-testid="eye-slash-icon"
        />
      ) : (
        <EyeIcon
          className="pointer-events-none aspect-square w-full"
          data-testid="eye-icon"
        />
      )}
    </button>
  );
}
