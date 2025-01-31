import { ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  className?: string;
};

export function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={twMerge(
        'border-alpha-grey-500 bg-dark-400 text-light-500 disabled:border-alpha-grey-300 disabled:bg-alpha-grey-200 disabled:text-alpha-grey-600 flex h-10 cursor-pointer items-center justify-center rounded-md border px-4 py-2 transition-colors disabled:cursor-not-allowed',
        className,
      )}
    >
      {children}
    </button>
  );
}
