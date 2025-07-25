import { ComponentProps } from 'react';

export type DashboardSectionTextProps = ComponentProps<'p'>;

export function DashboardSectionText({
  children,
  ...props
}: DashboardSectionTextProps) {
  return <p {...props}>{children}</p>;
}
