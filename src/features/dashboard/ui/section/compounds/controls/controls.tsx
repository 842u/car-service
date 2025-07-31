import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type SectionControlsProps = ComponentProps<'div'>;

export function SectionControls({
  children,
  className,
  ...props
}: SectionControlsProps) {
  return (
    <div
      className={twMerge('flex justify-end gap-5 px-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}
