import { createContext, ReactNode, RefObject, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/common/hooks/use-context-guard';

import { Content } from './compounds/content/content';
import { Trigger } from './compounds/trigger/trigger';

type DropdownContextValue = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  collisionDetectionRoot: HTMLElement | null;
} | null;

const DropdownContext = createContext<DropdownContextValue>(null);

export function useDropdown() {
  return useContextGuard({
    context: DropdownContext,
    componentName: 'Dropdown',
  });
}

type DropdownProps = {
  children: ReactNode;
  className?: string;
  collisionDetectionRoot?: HTMLElement | null;
};

export function Dropdown({
  children,
  className,
  collisionDetectionRoot = null,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <DropdownContext
      value={{ isOpen, toggle, close, triggerRef, collisionDetectionRoot }}
    >
      <div className={twMerge('relative', className)}>{children}</div>
    </DropdownContext>
  );
}

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
