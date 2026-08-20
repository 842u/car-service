import type { RefObject } from 'react';
import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

type DropdownContextValue = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  collisionDetectionRoot: HTMLElement | null;
  contentId: string;
} | null;

export const DropdownContext = createContext<DropdownContextValue>(null);

export function useDropdown() {
  return useContextGuard({
    context: DropdownContext,
    componentName: 'Dropdown',
  });
}
