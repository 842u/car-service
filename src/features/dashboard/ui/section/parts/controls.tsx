import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type ControlsProps = ComponentProps<'div'>;

export function Controls({ children, className, ...props }: ControlsProps) {
  return (
    <div
      className={twMerge('flex justify-end gap-5 px-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
