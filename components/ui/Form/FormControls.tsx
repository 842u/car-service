import { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

type FormControlsProps = ComponentProps<'div'> & {
  children: ReactNode;
  className?: string;
};

export function FormControls({
  children,
  className,
  ...props
}: FormControlsProps) {
  return (
    <div
      className={twMerge(
        'flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
