import { ReactNode } from 'react';

type DashboardNavMenuBottomItemProps = {
  children?: ReactNode;
};

export function DashboardNavMenuBottomItem({
  children,
}: DashboardNavMenuBottomItemProps) {
  return (
    <li className="m-2 py-2">
      {/* <li className="group hover:bg-alpha-grey-100 m-2 rounded-md py-2 md:@container md:overflow-hidden md:transition-colors"> */}
      {children}
    </li>
  );
}
