import { ReactNode } from 'react';

type NavItemProps = {
  children?: ReactNode;
};

export function NavItem({ children }: NavItemProps) {
  return (
    <li className="before:bg-alpha-grey-500 after:bg-alpha-grey-500 w-full before:absolute before:h-[1px] before:w-full after:absolute after:h-[1px] after:w-full lg:before:hidden lg:after:hidden">
      {children}
    </li>
  );
}
