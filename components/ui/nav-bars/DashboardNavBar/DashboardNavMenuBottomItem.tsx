import { ReactNode } from 'react';

type DashboardNavMenuBottomItemProps = {
  children?: ReactNode;
};

export function DashboardNavMenuBottomItem({
  children,
}: DashboardNavMenuBottomItemProps) {
  return <li className="m-2 py-2">{children}</li>;
}
