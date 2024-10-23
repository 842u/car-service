import { ReactNode } from 'react';

type DashboardNavMenuBottomItemProps = {
  children?: ReactNode;
};

export function DashboardNavMenuBottomItem({
  children,
}: DashboardNavMenuBottomItemProps) {
  return (
    <li className="group m-2 rounded-md py-2 hover:bg-alpha-grey-100 md:overflow-hidden md:transition-colors md:@container">
      {children}
    </li>
  );
}
