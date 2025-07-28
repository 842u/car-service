import { MouseEventHandler, Ref } from 'react';

import { useDropdown } from '../dropdown';

type TriggerProps = {
  children: ({
    ref,
    onClick,
  }: {
    ref: Ref<HTMLButtonElement>;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) => React.ReactNode;
};

export function Trigger({ children }: TriggerProps) {
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
