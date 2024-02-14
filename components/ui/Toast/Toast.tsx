import { XCircleIcon } from '@heroicons/react/24/outline';
import { m } from 'framer-motion';
import { ForwardedRef, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

import { useToasts } from '@/hooks/useToasts';
import { Toast as ToastObject } from '@/types';
import { getToastAssets } from '@/utils/toasts';

type ToastProps = ToastObject & {
  className?: string;
};

export const Toast = forwardRef(
  (
    { message, id, type, className }: ToastProps,
    ref: ForwardedRef<HTMLLIElement>,
  ) => {
    const { removeToast } = useToasts();

    const { style, icon } = getToastAssets(type)!;

    const closeButtonClickHandler = () => {
      removeToast(id);
    };

    return (
      <m.li
        ref={ref}
        layout
        animate={{ scale: 1, opacity: 1 }}
        className={twMerge(
          'my-2 flex w-full items-center justify-between rounded-lg border border-alpha-grey-400 bg-light-600 p-3 dark:bg-dark-600',
          style,
          className,
        )}
        exit={{ scale: 0.3, opacity: 0 }}
        id={id}
        initial={{ opacity: 0, scale: 0.3 }}
        transition={{ type: 'spring' }}
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
