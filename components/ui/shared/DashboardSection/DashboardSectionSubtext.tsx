import { twMerge } from 'tailwind-merge';

import { DashboardSectionTextProps } from './DashboardSectionText';

export function DashboardSectionSubtext({
  children,
  className,
  ...props
}: DashboardSectionTextProps) {
  return (
    <p className={twMerge('text-alpha-grey-900', className)} {...props}>
      {children}
    </p>
  );
}
