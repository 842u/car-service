import * as m from 'motion/react-m';
import type { Ref } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/features/common/hooks/use-toasts';
import { XCircleIcon } from '@/icons/x-circle';
import type { Toast as ToastObject } from '@/types';
import { IconButton } from '@/ui/icon-button/icon-button';
import { getToastAssets } from '@/utils/toasts';

type ToasterToastProps = ToastObject & {
  ref?: Ref<HTMLLIElement>;
  className?: string;
};

export function ToasterToast({
  message,
  id,
  type,
  className,
  ref,
  ...props
}: ToasterToastProps) {
  const { removeToast } = useToasts();

  const { style, icon } = getToastAssets(type)!;

  const handleCloseButtonClick = () => {
    removeToast(id);
  };

  return (
    <m.li
      ref={ref}
      aria-label={`${type} notification: ${message}`}
      className={twMerge(
        'border-alpha-grey-300 bg-light-600 dark:bg-dark-600 my-2 flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm',
        style,
        className,
      )}
      id={id}
      {...props}
    >
      <div className="h-10 shrink-0 p-2">{icon}</div>
      <span className="max-h-20 overflow-auto">{message}</span>
      <IconButton
        aria-label="close notification"
        className="aspect-square h-10 shrink-0 p-2"
        title="close toast"
        onClick={handleCloseButtonClick}
      >
        <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
      </IconButton>
    </m.li>
  );
}
