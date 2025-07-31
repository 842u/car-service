import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type IconProps = ComponentProps<'div'>;

export function Icon({ className, children, ...props }: IconProps) {
  return (
    <div
      className={twMerge(
        'bg-alpha-grey-50 border-alpha-grey-300 w-16 overflow-hidden rounded-md border p-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
