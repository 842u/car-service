import { MouseEventHandler, Ref } from 'react';

import { useDropdown } from '../dropdown';

type DropdownTriggerProps = {
  children: ({
    ref,
    onClick,
  }: {
    ref: Ref<HTMLButtonElement>;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) => React.ReactNode;
};

export function DropdownTrigger({ children }: DropdownTriggerProps) {
  const { toggle, triggerRef } = useDropdown();

  return (
    <>
      {children({
        ref: triggerRef,
        onClick: (e) => {
          e.stopPropagation();
          toggle();
        },
      })}
    </>
  );
}
