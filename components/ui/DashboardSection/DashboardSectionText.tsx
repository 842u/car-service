import { ComponentProps } from 'react';

type DashboardSectionTextProps = ComponentProps<'p'>;

export function DashboardSectionText({
  children,
  ...props
}: DashboardSectionTextProps) {
  return <p {...props}>{children}</p>;
}
