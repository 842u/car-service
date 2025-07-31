import { ReactNode } from 'react';

type NavBottomItemProps = {
  children?: ReactNode;
};

export function NavBottomItem({ children }: NavBottomItemProps) {
  return <li className="m-2 py-2">{children}</li>;
}
