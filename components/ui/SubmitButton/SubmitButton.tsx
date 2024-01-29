import { ReactNode } from 'react';

import { Spinner } from '../Spinner/Spinner';

type SubmitButtonProps = {
  disabled?: boolean;
  isSubmitting?: boolean;
  children?: ReactNode;
};

export function SubmitButton({
  disabled = false,
  isSubmitting = false,
  children,
}: SubmitButtonProps) {
  return (
    <button
      aria-label="submit"
      className="h-10 rounded-md border border-accent-500 bg-accent-800 px-4 py-2 text-light-500 transition-colors disabled:border-accent-700 disabled:bg-accent-900 disabled:text-light-800"
      disabled={disabled}
      type="submit"
    >
      {isSubmitting ? (
        <Spinner className="m-auto h-full" color="#88868c" />
      ) : (
        children
      )}
    </button>
  );
}
