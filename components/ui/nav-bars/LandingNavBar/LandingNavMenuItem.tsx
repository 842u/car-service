import { ReactNode } from 'react';

type LandingNavMenuItemProps = {
  children?: ReactNode;
};

export function LandingNavMenuItem({ children }: LandingNavMenuItemProps) {
  return (
    <li className="before:bg-alpha-grey-500 after:bg-alpha-grey-500 w-full before:absolute before:h-[1px] before:w-full after:absolute after:h-[1px] after:w-full lg:before:hidden lg:after:hidden">
      {children}
    </li>
  );
}
