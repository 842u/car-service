import type { MouseEventHandler, Ref } from 'react';

import { useDropdown } from '../../use-dropdown';

type TriggerRenderProps = {
  ref: Ref<HTMLButtonElement>;
  'aria-expanded': boolean;
  'aria-haspopup': true;
  'aria-controls': string | undefined;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type DropdownTriggerProps = {
  children: (props: TriggerRenderProps) => React.ReactNode;
};

export function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { isOpen, toggle, triggerRef, contentId } = useDropdown();

  return (
    <>
      {children({
        ref: triggerRef,
        'aria-expanded': isOpen,
        'aria-haspopup': true,
        'aria-controls': isOpen ? contentId : undefined,
        onClick: (e) => {
          e.stopPropagation();
          toggle();
        },
      })}
    </>
  );
}
