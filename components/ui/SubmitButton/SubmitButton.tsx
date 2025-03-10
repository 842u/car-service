import { twMerge } from 'tailwind-merge';

import { Button } from '../Button/Button';
import { Spinner } from '../Spinner/Spinner';

type SubmitButtonProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  className?: string;
  children: string;
};

export function SubmitButton({
  disabled = false,
  isSubmitting = false,
  className = '',
  children,
}: SubmitButtonProps) {
  return (
    <Button
      aria-label={children}
      className={twMerge(
        'border-accent-500 bg-accent-800 text-light-500 disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800 transition-colors',
        className,
      )}
      disabled={disabled}
      type="submit"
    >
      {isSubmitting ? (
        <Spinner className="stroke-alpha-grey-900 fill-alpha-grey-900 m-auto h-full" />
      ) : (
        children
      )}
    </Button>
  );
}
