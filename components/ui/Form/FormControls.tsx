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
        'flex flex-col gap-4 md:flex-row md:justify-end',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
