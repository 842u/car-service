import { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { useForm } from '../../form';

type ControlsProps = ComponentProps<'div'> & {
  children: ReactNode;
  className?: string;
};

export function Controls({ children, className, ...props }: ControlsProps) {
  useForm();

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
