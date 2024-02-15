import { XCircleIcon } from '@heroicons/react/24/outline';
import { m } from 'framer-motion';
import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/hooks/useToasts';
import { Toast as ToastObject } from '@/types';
import { getToastAssets } from '@/utils/toasts';

type ToastProps = ToastObject &
  ComponentPropsWithoutRef<typeof m.li> & {
    className?: string;
  };

export const Toast = forwardRef(
  (
    { message, id, type, className, ...props }: ToastProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => {
    const { removeToast } = useToasts();

    const { style, icon } = getToastAssets(type)!;

    const closeButtonClickHandler = () => {
      removeToast(id);
    };

    return (
      <m.li
        {...props}
        ref={ref}
        className={twMerge(
          'my-2 flex w-full items-center justify-between rounded-lg border border-alpha-grey-400 bg-light-600 px-3 py-2 text-sm dark:bg-dark-600',
          style,
          className,
        )}
        id={id}
      >
        {icon}
        <span>{message}</span>
        <button
          aria-label="close notification"
          type="button"
          onClick={closeButtonClickHandler}
        >
          <XCircleIcon className="aspect-square w-6 flex-shrink-0" />
        </button>
      </m.li>
    );
  },
);
