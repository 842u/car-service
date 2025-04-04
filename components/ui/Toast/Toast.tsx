import * as m from 'motion/react-m';
import { Ref } from 'react';
import { twMerge } from 'tailwind-merge';

import { XCircleIcon } from '@/components/decorative/icons/XCircleIcon';
import { useToasts } from '@/hooks/useToasts';
import { Toast as ToastObject } from '@/types';
import { getToastAssets } from '@/utils/toasts';

type ToastProps = ToastObject & {
  ref?: Ref<HTMLLIElement>;
  className?: string;
};

export function Toast({
  message,
  id,
  type,
  className,
  ref,
  ...props
}: ToastProps) {
  const { removeToast } = useToasts();

  const { style, icon } = getToastAssets(type)!;

  const closeButtonClickHandler = () => {
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
      {icon}
      <span>{message}</span>
      <button
        aria-label="close notification"
        className="cursor-pointer"
        type="button"
        onClick={closeButtonClickHandler}
      >
        <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 aspect-square w-6 shrink-0 stroke-10" />
      </button>
    </m.li>
  );
}
