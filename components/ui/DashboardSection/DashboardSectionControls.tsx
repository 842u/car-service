import { ComponentProps } from 'react';

type DashboardSectionControlsProps = ComponentProps<'div'>;

export function DashboardSectionControls({
  children,
  ...props
}: DashboardSectionControlsProps) {
  return (
    <div className="flex justify-end gap-5" {...props}>
      {children}
    </div>
  );
}
