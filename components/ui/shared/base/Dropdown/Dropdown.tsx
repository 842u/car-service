import {
  createContext,
  ReactNode,
  RefObject,
  use,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';

import { DropdownContent } from './DropdownContent/DropdownContent';
import { DropdownTrigger } from './DropdownTrigger/DropdownTrigger';

type DropdownContextValue = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
} | null;

const DropdownContext = createContext<DropdownContextValue>(null);

export function useDropdown() {
  const context = use(DropdownContext);

  if (!context)
    throw new Error('Dropdown components must be used inside <Dropdown>');

  return context;
}

export function Dropdown({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <DropdownContext.Provider value={{ isOpen, toggle, close, triggerRef }}>
      <div className={twMerge('relative', className)}>{children}</div>
    </DropdownContext.Provider>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
