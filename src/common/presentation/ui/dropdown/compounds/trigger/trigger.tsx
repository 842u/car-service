import type { MouseEventHandler, Ref } from 'react';

import { useDropdown } from '../../dropdown';

type TriggerRenderProps = {
  ref: Ref<HTMLButtonElement>;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

type DropdownTriggerProps = {
  children: (props: TriggerRenderProps) => React.ReactNode;
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
