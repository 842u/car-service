import { ReactNode } from 'react';

type LandingNavMenuItemProps = {
  children?: ReactNode;
};

export function LandingNavMenuItem({ children }: LandingNavMenuItemProps) {
  return (
    <li className="w-full before:absolute before:h-[1px] before:w-full before:bg-alpha-grey-500 after:absolute after:h-[1px] after:w-full after:bg-alpha-grey-500 lg:before:hidden lg:after:hidden">
      {children}
    </li>
  );
}
