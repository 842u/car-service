import { ReactNode } from 'react';

type BottomItemProps = {
  children?: ReactNode;
};

export function BottomItem({ children }: BottomItemProps) {
  return <li className="m-2 py-2">{children}</li>;
}
