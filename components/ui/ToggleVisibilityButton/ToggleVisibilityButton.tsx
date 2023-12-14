import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ToggleVisibilityButtonProps = ComponentProps<'button'> & {
  isVisible: boolean;
};

export function ToggleVisibilityButton({
  isVisible,
  ...props
}: ToggleVisibilityButtonProps) {
  const { className } = props;

  return (
    <button type="button" {...props} className={twMerge('w-6', className)}>
      {isVisible ? (
        <EyeSlashIcon className="aspect-square w-full" />
      ) : (
        <EyeIcon className="aspect-square w-full" />
      )}
    </button>
  );
}
