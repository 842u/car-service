import type { ReactNode, RefObject } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

import { DropdownContent } from './compounds/content/content';
import { DropdownTrigger } from './compounds/trigger/trigger';

type DropdownContextValue = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  collisionDetectionRoot: HTMLElement | null;
  contentId: string;
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
  const rootRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    // A pointer open leaves focus on <body> in Safari, which does not focus a
    // button on click. Without this the panel is unreachable by Tab and the
    // root-scoped Escape handler never fires.
    if (!isOpen) triggerRef.current?.focus();
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  useEffect(() => {
    const root = rootRef.current;
    if (!isOpen || !root) return;

    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      // null when focus leaves the document entirely (window switch,
      // devtools), which must not close the panel.
      if (next && !root.contains(next)) close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      triggerRef.current?.focus();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (!root.contains(event.target as Node)) close();
    };

    root.addEventListener('focusout', handleFocusOut);
    root.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      root.removeEventListener('focusout', handleFocusOut);
      root.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, close, triggerRef]);

  return (
    <DropdownContext
      value={{
        isOpen,
        toggle,
        close,
        triggerRef,
        collisionDetectionRoot,
        contentId,
      }}
    >
      <div ref={rootRef} className={className}>
        {children}
      </div>
    </DropdownContext>
  );
}

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
