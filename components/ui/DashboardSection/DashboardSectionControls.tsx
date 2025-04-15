import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type DashboardSectionControlsProps = ComponentProps<'div'>;

export function DashboardSectionControls({
  children,
  className,
  ...props
}: DashboardSectionControlsProps) {
  return (
    <div className={twMerge('flex justify-end gap-5', className)} {...props}>
      {children}
    </div>
  );
}
