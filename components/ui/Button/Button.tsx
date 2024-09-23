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
        'flex h-10 items-center justify-center rounded-md border border-alpha-grey-500 bg-dark-400 px-4 py-2 text-light-500 transition-[background-color] disabled:border-alpha-grey-300 disabled:bg-alpha-grey-200 disabled:text-alpha-grey-600 ',
        className,
      )}
    >
      {children}
    </button>
  );
}
