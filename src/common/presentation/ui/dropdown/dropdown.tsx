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
  contentRef: RefObject<HTMLDivElement | null>;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const contentId = useId();

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => {
    // A pointer open leaves focus on <body> in Safari, which does not focus a
    // button on click. Without this the panel is unreachable by Tab.
    if (!isOpen) triggerRef.current?.focus();
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Both refs are read at event time rather than captured here, so the
    // effect does not need to re-run when the panel mounts.
    const isOutside = (node: Node | null) =>
      !rootRef.current?.contains(node) && !contentRef.current?.contains(node);

    const handleFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      // null when focus leaves the document entirely (window switch,
      // devtools), which must not close the panel.
      if (next && isOutside(next)) close();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      close();
      triggerRef.current?.focus();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (isOutside(event.target as Node)) close();
    };

    // All three bind to document rather than to the root, so they keep firing
    // for a panel that is not a descendant of the root.
    document.addEventListener('focusout', handleFocusOut);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('focusout', handleFocusOut);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, close]);

  return (
    <DropdownContext
      value={{
        isOpen,
        toggle,
        close,
        triggerRef,
        contentRef,
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
