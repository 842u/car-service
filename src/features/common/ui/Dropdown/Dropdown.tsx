import { createContext, ReactNode, RefObject, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useContextGuard } from '@/features/common/hooks/use-context-guard';

import { DropdownContent } from './content/content';
import { DropdownTrigger } from './trigger/trigger';

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

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
